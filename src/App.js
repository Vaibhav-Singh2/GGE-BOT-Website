import ReconnectingWebSocket from "reconnecting-websocket"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CircularProgress, Box, Typography, Button, IconButton, Tooltip, Menu, MenuItem } from '@mui/material'
import { useCookies } from 'react-cookie'
import * as React from 'react'
import './App.css'
import { ErrorType, GetErrorTypeName, ActionType, User } from "./types.js"
import BotListingHome from './modules/BotListingHome'
import BotDetailView from './modules/BotDetailView'
import settings from './settings.json'
import LogoutIcon from '@mui/icons-material/Logout'
import LanguageIcon from '@mui/icons-material/Language'
import DiscordIcon from '@mui/icons-material/SportsEsports'

async function getGGELanguageFile(lang) {
  const languages = 
    (await(await fetch(`//${window.location.hostname}:${settings.port ?? window.location.port}/ggeProxyEmpire5/config/languages/version.json`)).json()).languages

  try {
    var langFile = await (await fetch(`//${window.location.hostname}:${settings.port ?? window.location.port}/ggeProxyEmpire5/config/languages/${languages[lang]}/${lang}.json`)).json()
  }
  catch (e) {
    console.warn(e)
    if(lang === "en")
      return

    langFile = await (await fetch(`//${window.location.hostname}:${settings.port ?? window.location.port}/ggeProxyEmpire5/config/languages/${languages.en}/en.json`)).json()
  }
  return langFile
}

async function getSiteLanguageFile(lang) {
  let langFile = {}
  try {
    langFile = await (await fetch(`//${window.location.hostname}:${window.location.port}/locales/en.json`)).json()
  }
  catch(e) {
    console.error(e)
  }
  try {
    Object.assign(langFile, await (await fetch(`//${window.location.hostname}:${window.location.port}/locales/${lang}.json`)).json())
  }
  catch (e) {
    console.warn(e)
  }
  return langFile
}

function GrabAssets() {
  const [cookies, setCookie] = useCookies([])
  const [lang, setLang] = React.useState(false)
  const setLanguage = async lang => {
    setCookie("lang", cookies.lang = lang, { maxAge: 31536000 })
    
    try {
      const langFiles = await Promise.all([
        getGGELanguageFile(lang),
        getSiteLanguageFile(lang)
      ])
      const langFile = {}
      for (let i = 0; i < langFiles.length; i++) {
        Object.assign(langFile, langFiles[i])
      }
      setLang(langFile)
    }
    catch (e) {
      throw new Error("Failed to load language.\n\n" + e)
    }
  }

  if (lang === false) {
    setLanguage(cookies.lang ?? "en")
    return <CircularProgress style={{
      margin: "0",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }} />
  }

  const __ = key => lang[key] || key
  return <App setLanguage={setLanguage} languageCode={cookies.lang} __={__} />
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d1117',
      paper: '#18202c'
    },
    primary: {
      main: '#3b82f6'
    }
  }
})

function TopNavbar({ onGoHome, setLanguage, languageCode, channelInfo, __ }) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const logout = () => {
    document.cookie = "uuid="
    window.location.reload()
  }

  return (
    <Box className="ea-topbar">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={onGoHome}>
        <Box sx={{
          width: 32,
          height: 32,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          color: '#fff',
          fontSize: '1.1rem',
          boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)'
        }}>
          E
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', color: '#f8fafc' }}>
          EMPIRE<span style={{ color: '#ef4444', marginLeft: '4px', fontSize: '0.75rem', fontWeight: 600 }}>BOT</span>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Button
          size="small"
          startIcon={<DiscordIcon sx={{ color: '#5865F2' }} />}
          onClick={() =>
            window.open(`https://discord.com/oauth2/authorize?client_id=${channelInfo[0]}&permissions=8&response_type=code&redirect_uri=${window.location.protocol === 'https:' ? "https" : "http"}%3A%2F%2F${window.location.hostname}%3A${(settings.port ?? window.location.port) !== '' ? (settings.port ?? window.location.port) : window.location.protocol === 'https:' ? "443" : "80"}%2FdiscordAuth&integration_type=0&scope=identify+guilds.join+bot`, "_blank")}
          sx={{ color: '#94a3b8', textTransform: 'none', fontSize: '0.78rem', '&:hover': { color: '#fff' } }}
        >
          {__("linkDiscord") || "Discord"}
        </Button>

        <Button
          size="small"
          startIcon={<LanguageIcon />}
          onClick={e => setAnchorEl(e.currentTarget)}
          sx={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.78rem', '&:hover': { color: '#fff' } }}
        >
          {languageCode}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          slotProps={{ paper: { sx: { bgcolor: '#18202c', border: '1px solid rgba(255,255,255,0.1)' } } }}
        >
          {['en', 'pl', 'de', 'tr', 'ar', 'cs'].map(lang => (
            <MenuItem key={lang} onClick={() => { setLanguage(lang); setAnchorEl(null) }} sx={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>
              {lang}
            </MenuItem>
          ))}
        </Menu>

        <Tooltip title="Log out">
          <IconButton size="small" onClick={logout} sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

function App({ setLanguage, languageCode, __ }) {
  const [users, setUsers] = React.useState([])
  const [usersStatus, setUsersStatus] = React.useState({})
  const [plugins, setPlugins] = React.useState([])
  const [channelInfo, setChannelInfo] = React.useState([])
  const [selectedBotId, setSelectedBotId] = React.useState(() => {
    // Check URL query or path for initial bot id
    const params = new URLSearchParams(window.location.search)
    return params.get('bot') || null
  })

  let ws = React.useMemo(() => {
    const usersStatus = {}
    const ws = new ReconnectingWebSocket(`${window.location.protocol === 'https:' ? "wss" : "ws"}://${window.location.hostname}:${settings.port ?? window.location.port}`, [], { WebSocket: WebSocket, minReconnectionDelay: 3000 })

    ws.addEventListener("message", (msg) => {
      let [err, action, obj] = JSON.parse(msg.data.toString())
      if (err)
        console.error(GetErrorTypeName(err))

      switch (Number(action)) {
        case ActionType.GetUUID:
          if(err === ErrorType.Unauthenticated)
            return window.location.href = "signin.html"
          break
        case ActionType.GetChannels:
          setChannelInfo(obj ?? [])
          break
        case ActionType.GetUsers:
          if (err !== ErrorType.Success)
            return

          setUsers(obj[0].map(e => new User(e)))
          setPlugins(obj[1])
          break
        case ActionType.StatusUser:
          usersStatus[obj.id] = obj
          setUsersStatus(structuredClone(usersStatus))
          break
        default:
          return
      }
    })
    return ws
  }, [])

  const selectedBot = users.find(u => String(u.id) === String(selectedBotId))

  const handleSelectBot = bot => {
    setSelectedBotId(bot.id)
    const url = new URL(window.location)
    url.searchParams.set('bot', bot.id)
    window.history.pushState({}, '', url)
  }

  const handleGoHome = () => {
    setSelectedBotId(null)
    const url = new URL(window.location)
    url.searchParams.delete('bot')
    window.history.pushState({}, '', url)
  }

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search)
      setSelectedBotId(params.get('bot') || null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0d1117' }}>
        <TopNavbar
          onGoHome={handleGoHome}
          setLanguage={setLanguage}
          languageCode={languageCode}
          channelInfo={channelInfo}
          __={__}
        />

        {selectedBot ? (
          <BotDetailView
            bot={selectedBot}
            plugins={plugins}
            usersStatus={usersStatus}
            ws={ws}
            onBack={handleGoHome}
            __={__}
            languageCode={languageCode}
            channels={channelInfo[1] ?? []}
          />
        ) : (
          <BotListingHome
            rows={users}
            usersStatus={usersStatus}
            ws={ws}
            onSelectBot={handleSelectBot}
            __={__}
            languageCode={languageCode}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}

export default GrabAssets
