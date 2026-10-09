import * as React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Backdrop,
    Checkbox,
    Box,
    Typography,
    Menu,
    MenuItem,
    Chip,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import SettingsIcon from '@mui/icons-material/Settings'
import TerminalIcon from '@mui/icons-material/Terminal'
import InventoryIcon from '@mui/icons-material/Inventory'
import LanguageIcon from '@mui/icons-material/Language'
import DiscordIcon from '@mui/icons-material/SportsEsports'
import CloseIcon from '@mui/icons-material/Close'

import { ErrorType, ActionType, LogLevel } from "../types.js"
import UserSettings from './userSettings'
import settings from '../settings.json'

function LogModal({ ws, __, open, onClose, targetUser }) {
    const [currentLogs, setCurrentLogs] = React.useState([])
    const logEndRef = React.useRef(null)

    React.useEffect(() => {
        if (!open) return
        const logGrabber = msg => {
            let [err, action, obj] = JSON.parse(msg.data.toString())
            if (Number(action) !== ActionType.GetLogs) return
            if (Number(err) !== ErrorType.Success) return

            setCurrentLogs(
                obj[0]
                    .splice(obj[1], obj[0].length - 1)
                    .concat(obj[0])
                    .map((item, index) => {
                        let text = item[1].map(__).join("")
                        let color = '#38bdf8'
                        if (item[0] === LogLevel.Error) color = '#f43f5e'
                        else if (item[0] === LogLevel.Warn) color = '#fbbf24'
                        return { text, color, key: index }
                    })
                    .reverse()
            )
        }
        ws.addEventListener("message", logGrabber)
        return () => ws.removeEventListener("message", logGrabber)
    }, [ws, __, open])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                className: 'glass-panel',
                sx: { bgcolor: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TerminalIcon sx={{ color: '#38bdf8' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                        Live Terminal {targetUser ? `- ${targetUser.name}` : ''}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 2, height: '60vh', overflowY: 'auto' }}>
                <Box className="console-log-box" sx={{ p: 2, minHeight: '100%' }}>
                    {currentLogs.length === 0 ? (
                        <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                            Waiting for output messages...
                        </Typography>
                    ) : (
                        currentLogs.map(l => (
                            <Box key={l.key} sx={{ color: l.color, py: 0.3, wordBreak: 'break-all' }}>
                                &gt; {l.text}
                            </Box>
                        ))
                    )}
                    <div ref={logEndRef} />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Button onClick={onClose} sx={{ color: '#94a3b8', textTransform: 'none' }}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

function LanguageSelector({ languageCode, setLanguage }) {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    return (
        <>
            <Button
                variant="outlined"
                size="small"
                startIcon={<LanguageIcon sx={{ fontSize: '1rem !important' }} />}
                onClick={e => setAnchorEl(e.currentTarget)}
                sx={{
                    height: 34,
                    color: '#cbd5e1',
                    borderColor: 'rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    '&:hover': { borderColor: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.04)' }
                }}
            >
                {languageCode}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                slotProps={{
                    paper: {
                        sx: { bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', mt: 0.5 }
                    }
                }}
            >
                {['en', 'pl', 'de', 'tr', 'ar', 'cs'].map(lang => (
                    <MenuItem key={lang} onClick={() => { setLanguage(lang); setAnchorEl(null) }} sx={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        {lang}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

let assetsCache = null

function ResourcesModal({ __, open, onClose, resources, languageCode }) {
    if (!resources || typeof resources !== 'object') return null

    const nameOverrides = {
        screws: "component1",
        blackPowder: "component2",
        saws: "component3",
        drills: "component4",
        crowbars: "component5",
        leatherStrips: "component6",
        chains: "component7",
        metalPlates: "component8",
    }
    const cleanRes = { ...resources }
    delete cleanRes["coins"]
    delete cleanRes["rubies"]
    delete cleanRes["id"]
    delete cleanRes["hasError"]
    delete cleanRes["resources"]

    for (const key in nameOverrides) {
        if (cleanRes[key] !== undefined) {
            cleanRes[nameOverrides[key]] = cleanRes[key]
            delete cleanRes[key]
        }
    }

    const capitalizeFirstLetter = o => String(o).charAt(0).toLocaleUpperCase() + String(o).slice(1)

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                className: 'glass-panel',
                sx: { bgcolor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px' }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon sx={{ color: '#38bdf8' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                        Kingdom Resources & Inventory
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    {Object.entries(cleanRes).map(([key, value], i) => {
                        if (value === undefined || value === null || value === 0 || typeof value === 'object') return null
                        const jsonKey = capitalizeFirstLetter(key)
                        let formattedVal = String(value)
                        if (typeof value === 'number' && !isNaN(value)) {
                            formattedVal = new Intl.NumberFormat(languageCode, { notation: 'compact' }).format(value)
                        } else if (!isNaN(Number(value))) {
                            formattedVal = new Intl.NumberFormat(languageCode, { notation: 'compact' }).format(Number(value))
                        }
                        return (
                            <Grid item xs={4} sm={3} md={2.4} key={i}>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        borderRadius: '10px',
                                        bgcolor: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img
                                            alt={key}
                                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                                            src={`//${window.location.hostname}:${settings.port ?? window.location.port}/ggeProxyEmpire5/default/assets/${assetsCache?.[`Collectable_Currency_${jsonKey}`]}.webp`}
                                            onError={e => {
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, textAlign: 'center', fontSize: '0.72rem' }}>
                                        {__(key)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc', mt: 0.2 }}>
                                        {formattedVal}
                                    </Typography>
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Button onClick={onClose} sx={{ color: '#94a3b8', textTransform: 'none' }}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function GGEUserTable({
    setLanguage,
    __,
    languageCode,
    rows,
    usersStatus,
    ws,
    channelInfo,
    plugins
}) {
    const [selected, setSelected] = React.useState([])
    const [openSettings, setOpenSettings] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState({})
    const [logOpen, setLogOpen] = React.useState(false)
    const [logTargetUser, setLogTargetUser] = React.useState(null)
    const [resOpen, setResOpen] = React.useState(false)
    const [resData, setResData] = React.useState(null)

    React.useEffect(() => {
        async function loadAssets() {
            try {
                assetsCache = JSON.parse(await (await fetch(`//${window.location.hostname}:${settings.port ?? window.location.port}/assets.json`)).text())
            } catch (e) {
                console.warn(e)
            }
        }
        if (!assetsCache) loadAssets()
    }, [])

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            setSelected(rows.map(n => n.id))
            return
        }
        setSelected([])
    }

    const logout = () => {
        document.cookie = "uuid="
        window.location.reload()
    }

    return (
        <Box sx={{ p: { xs: 1.5, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
            {/* Top Navigation & Stats Bar */}
            <Paper
                className="glass-panel"
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                        }}
                    >
                        <Typography sx={{ fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>G</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#f8fafc' }}>
                            GGE BOT OPS
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                            System Active • {rows.length} Accounts Connected
                        </Typography>
                    </Box>
                </Box>

                {/* Global Controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DiscordIcon sx={{ color: '#5865F2' }} />}
                        onClick={() =>
                            window.open(`https://discord.com/oauth2/authorize?client_id=${channelInfo[0]}&permissions=8&response_type=code&redirect_uri=${window.location.protocol === 'https:' ? "https" : "http"}%3A%2F%2F${window.location.hostname}%3A${(settings.port ?? window.location.port) !== '' ? (settings.port ?? window.location.port) : window.location.protocol === 'https:' ? "443" : "80"}%2FdiscordAuth&integration_type=0&scope=identify+guilds.join+bot`, "_blank")}
                        sx={{
                            height: 34,
                            color: '#cbd5e1',
                            borderColor: 'rgba(88, 101, 242, 0.3)',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            '&:hover': { borderColor: '#5865F2', bgcolor: 'rgba(88, 101, 242, 0.08)' }
                        }}
                    >
                        {__("linkDiscord") || "Discord"}
                    </Button>

                    <LanguageSelector setLanguage={setLanguage} languageCode={languageCode} />

                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedUser({})
                            setOpenSettings(true)
                        }}
                        sx={{
                            height: 34,
                            bgcolor: '#0284c7',
                            color: '#fff',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                            '&:hover': { bgcolor: '#0369a1' }
                        }}
                    >
                        Add Account
                    </Button>

                    <Tooltip title="Log out">
                        <IconButton
                            size="small"
                            onClick={logout}
                            sx={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', p: 0.8 }}
                        >
                            <LogoutIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Paper>

            {/* Accounts Table Card */}
            <TableContainer
                component={Paper}
                className="glass-panel"
                elevation={0}
                sx={{ border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', overflow: 'hidden' }}
            >
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.3)' }}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    size="small"
                                    checked={rows.length > 0 && rows.length === selected.length}
                                    indeterminate={selected.length > 0 && selected.length < rows.length}
                                    onChange={handleSelectAllClick}
                                    sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#38bdf8' } }}
                                />
                            </TableCell>
                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                                Account
                            </TableCell>
                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                                Active Automation
                            </TableCell>
                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                                Status & Metrics
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#64748b' }}>
                                    No Goodgame Empire accounts configured. Click "+ Add Account" to start.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => {
                                const isItemSelected = selected.includes(row.id)
                                const isRunning = Boolean(row.state)
                                const status = usersStatus[row.id] ?? {}

                                const enabledPluginsList = Object.entries(row.plugins || {})
                                    .filter(([_, v]) => Boolean(v?.state) && !v?.forced)
                                    .map(([k]) => k)

                                return (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        sx={{
                                            bgcolor: isItemSelected ? 'rgba(56, 189, 248, 0.04)' : 'transparent',
                                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02) !important' }
                                        }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                size="small"
                                                checked={isItemSelected}
                                                onChange={() => {
                                                    if (isItemSelected) setSelected(selected.filter(id => id !== row.id))
                                                    else setSelected([...selected, row.id])
                                                }}
                                                sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#38bdf8' } }}
                                            />
                                        </TableCell>

                                        {/* Name & Status Indicator */}
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: isRunning ? '#10b981' : '#64748b',
                                                        boxShadow: isRunning ? '0 0 8px #10b981' : 'none'
                                                    }}
                                                />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.92rem' }}>
                                                        {row.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                        ID #{row.id}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        {/* Enabled Plugins Chips */}
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, maxWidth: 360 }}>
                                                {enabledPluginsList.length === 0 ? (
                                                    <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                                                        No plugins enabled
                                                    </Typography>
                                                ) : (
                                                    enabledPluginsList.map((pKey) => (
                                                        <Chip
                                                            key={pKey}
                                                            label={__(pKey)}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.72rem',
                                                                bgcolor: 'rgba(56, 189, 248, 0.1)',
                                                                color: '#38bdf8',
                                                                border: '1px solid rgba(56, 189, 248, 0.2)'
                                                            }}
                                                        />
                                                    ))
                                                )}
                                            </Box>
                                        </TableCell>

                                        {/* Metrics & Daily Counts */}
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                {Object.entries(status).map(([key, val], idx) => {
                                                    if (['id', 'hasError', 'resources'].includes(key) || typeof val === 'object' || !val || val <= 0) return null
                                                    const formatted = key === 'attackDailyCount' ? String(val) : (typeof val === 'number' ? new Intl.NumberFormat(languageCode, { notation: 'compact' }).format(val) : String(val))
                                                    return (
                                                        <Box key={idx} sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                                                {__(key)}
                                                            </Typography>
                                                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>
                                                                {formatted}
                                                            </Typography>
                                                        </Box>
                                                    )
                                                })}
                                            </Box>
                                        </TableCell>

                                        {/* Action Buttons */}
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.8 }}>
                                                <Tooltip title="View Resources">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setResData(status?.resources || status)
                                                            setResOpen(true)
                                                        }}
                                                        sx={{ color: '#94a3b8', '&:hover': { color: '#38bdf8', bgcolor: 'rgba(56,189,248,0.1)' } }}
                                                    >
                                                        <InventoryIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Live Terminal Logs">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            ws.send(JSON.stringify([ErrorType.Success, ActionType.GetLogs, row]))
                                                            setLogTargetUser(row)
                                                            setLogOpen(true)
                                                        }}
                                                        sx={{ color: '#94a3b8', '&:hover': { color: '#38bdf8', bgcolor: 'rgba(56,189,248,0.1)' } }}
                                                    >
                                                        <TerminalIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Account Settings & Plugins">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedUser(row)
                                                            setOpenSettings(true)
                                                        }}
                                                        sx={{ color: '#94a3b8', '&:hover': { color: '#38bdf8', bgcolor: 'rgba(56,189,248,0.1)' } }}
                                                    >
                                                        <SettingsIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Button
                                                    variant={isRunning ? "contained" : "outlined"}
                                                    color={isRunning ? "error" : "success"}
                                                    size="small"
                                                    startIcon={isRunning ? <StopIcon sx={{ fontSize: '0.9rem !important' }} /> : <PlayArrowIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                    onClick={() => {
                                                        row.state = !row.state
                                                        ws.send(JSON.stringify([ErrorType.Success, ActionType.SetUser, row]))
                                                    }}
                                                    sx={{
                                                        height: 28,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        borderRadius: '6px',
                                                        textTransform: 'none',
                                                        minWidth: 78
                                                    }}
                                                >
                                                    {isRunning ? "Stop" : "Start"}
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}

                        {/* Batch Action Footer */}
                        {selected.length > 0 && (
                            <TableRow sx={{ bgcolor: 'rgba(244, 63, 94, 0.05)' }}>
                                <TableCell colSpan={4}>
                                    <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                                        {selected.length} account(s) selected
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={<DeleteOutlineIcon />}
                                        onClick={() => {
                                            ws.send(JSON.stringify([ErrorType.Success, ActionType.RemoveUser, rows.filter(e => selected.includes(e.id))]))
                                            setSelected([])
                                        }}
                                        sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: '6px' }}
                                    >
                                        {__("remove") || "Remove Selected"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modals */}
            <LogModal
                ws={ws}
                __={__}
                open={logOpen}
                onClose={() => setLogOpen(false)}
                targetUser={logTargetUser}
            />

            <ResourcesModal
                __={__}
                open={resOpen}
                onClose={() => setResOpen(false)}
                resources={resData}
                languageCode={languageCode}
            />

            {openSettings && (
                <UserSettings
                    __={__}
                    selectedUser={selectedUser}
                    channels={channelInfo[1] ?? []}
                    plugins={plugins}
                    ws={ws}
                    closeBackdrop={() => setOpenSettings(false)}
                />
            )}
        </Box>
    )
}