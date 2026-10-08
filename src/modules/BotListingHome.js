import * as React from 'react'
import {
    Box,
    Typography,
    Button,
    Card,
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import DnsIcon from '@mui/icons-material/Dns'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import DiamondIcon from '@mui/icons-material/Diamond'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { ErrorType, ActionType } from "../types.js"
import settings from '../settings.json'

let servers = new DOMParser()
    .parseFromString(await (await fetch(`${window.location.protocol === 'https:' ? "https" : "http"}://${window.location.hostname}:${settings.port ?? window.location.port}/1.xml`)).text(), "text/xml")
let instances = []
let _instances = servers.getElementsByTagName("instance")

for (var key in _instances) {
    let obj = _instances[key]
    let server, zone, instanceLocaId, instanceName
    for (var key2 in obj.childNodes) {
        let obj2 = obj.childNodes[key2]
        switch (obj2.nodeName) {
            case "server": server = obj2.childNodes[0].nodeValue; break
            case "zone": zone = obj2.childNodes[0].nodeValue; break
            case "instanceLocaId": instanceLocaId = obj2.childNodes[0].nodeValue; break
            case "instanceName": instanceName = obj2.childNodes[0].nodeValue; break
            default:
        }
    }
    if (instanceLocaId)
        instances.push({ id: obj.getAttribute("value"), server, zone, instanceLocaId, instanceName })
}
instances.push({
    id: 100 + 3,
    server: "ep-live-mz-nw2-game.goodgamestudios.com",
    zone: "EmpireExSP_3",
    instanceLocaId: "SP",
    instanceName: "3"
})

function AddBotDialog({ open, onClose, onSave, __ }) {
    const [name, setName] = React.useState("")
    const [pass, setPass] = React.useState("")
    const [server, setServer] = React.useState(instances[0]?.id)
    const [externalEvent, setExternalEvent] = React.useState(false)

    const handleCreate = () => {
        if (!name) return
        onSave({ name, pass, server, externalEvent, plugins: {}, state: 0 })
        setName("")
        setPass("")
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { bgcolor: '#18202c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' } }}>
            <DialogTitle sx={{ color: '#f8fafc', fontWeight: 700 }}>Add New Bot Account</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField label="Username" size="small" value={name} onChange={e => setName(e.target.value)} required sx={{ mt: 1 }} />
                <TextField label="Password" type="password" size="small" value={pass} onChange={e => setPass(e.target.value)} required />
                <FormControl size="small">
                    <InputLabel>Server</InputLabel>
                    <Select value={server} label="Server" onChange={e => setServer(e.target.value)}>
                        {instances.map((s, i) => (
                            <MenuItem key={i} value={s.id}>{__(s.instanceLocaId) + ' ' + s.instanceName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={<Checkbox size="small" checked={externalEvent} onChange={e => setExternalEvent(e.target.checked)} sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-checked': { color: '#38bdf8' } }} />}
                    label={<Typography variant="body2" sx={{ color: '#cbd5e1' }}>OR/BTH Proxy</Typography>}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ color: '#94a3b8' }}>Cancel</Button>
                <Button variant="contained" onClick={handleCreate} sx={{ bgcolor: '#3b82f6', fontWeight: 600 }}>Create Bot</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function BotListingHome({ rows, usersStatus, ws, onSelectBot, __, languageCode }) {
    const [addOpen, setAddOpen] = React.useState(false)

    // Rate of gain tracking per hour (coins/rubies)
    const rateHistory = React.useRef({})
    const [gainRates, setGainRates] = React.useState({})

    React.useEffect(() => {
        const now = Date.now()
        const newRates = { ...gainRates }

        rows.forEach(bot => {
            const st = usersStatus[bot.id] ?? {}
            const currentCoins = Number(st.cash ?? 0)
            const currentRubies = Number(st.gold ?? 0)

            if (!rateHistory.current[bot.id]) {
                rateHistory.current[bot.id] = {
                    startCoins: currentCoins,
                    startRubies: currentRubies,
                    startTime: now
                }
            } else {
                const hist = rateHistory.current[bot.id]
                const diffHours = (now - hist.startTime) / (1000 * 60 * 60)
                if (diffHours >= 0.005) { // update after ~18 seconds
                    const coinsPerHour = Math.max(0, Math.round((currentCoins - hist.startCoins) / diffHours))
                    const rubiesPerHour = Math.max(0, Math.round((currentRubies - hist.startRubies) / diffHours))
                    newRates[bot.id] = { coinsPerHour, rubiesPerHour }
                }
            }
        })
        setGainRates(newRates)
    }, [usersStatus, rows])

    const handleToggleState = (e, bot) => {
        e.stopPropagation()
        bot.state = !bot.state
        ws.send(JSON.stringify([ErrorType.Success, ActionType.SetUser, bot]))
    }

    const handleDeleteBot = (e, bot) => {
        e.stopPropagation()
        if (window.confirm(`Delete bot ${bot.name}?`)) {
            ws.send(JSON.stringify([ErrorType.Success, ActionType.RemoveUser, [bot]]))
        }
    }

    const formatNumber = num => {
        if (!num || isNaN(num)) return '0'
        return new Intl.NumberFormat(languageCode || 'en', { notation: 'compact' }).format(num)
    }

    const activeBotsCount = rows.filter(r => Boolean(r.state)).length

    return (
        <Box className="ea-container">
            {/* Header section matching EmpireAutomation */}
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <PrecisionManufacturingIcon sx={{ color: '#3b82f6', fontSize: '1.8rem' }} />
                        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                            Bot Manager
                        </Typography>
                        <Chip
                            label={`${activeBotsCount} / ${rows.length} Running`}
                            size="small"
                            sx={{
                                bgcolor: activeBotsCount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.08)',
                                color: activeBotsCount > 0 ? '#10b981' : '#94a3b8',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                border: '1px solid',
                                borderColor: activeBotsCount > 0 ? 'rgba(16, 185, 129, 0.3)' : 'transparent'
                            }}
                        />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Manage your connected game accounts, live economy, time skips, and routine status.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddOpen(true)}
                    sx={{
                        bgcolor: '#3b82f6',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        px: 2.5,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        '&:hover': { bgcolor: '#2563eb' }
                    }}
                >
                    Add Bot
                </Button>
            </Box>

            {/* Horizontal Bar List Layout (EmpireAutomation.de style) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {rows.length === 0 ? (
                    <Card className="ea-card" sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="subtitle1" sx={{ color: '#94a3b8', mb: 2 }}>
                            No bot accounts registered.
                        </Typography>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ textTransform: 'none' }}>
                            Add your first account
                        </Button>
                    </Card>
                ) : (
                    rows.map(bot => {
                        const isRunning = Boolean(bot.state)
                        const status = usersStatus[bot.id] ?? {}
                        const resources = status.resources ?? {}
                        const rates = gainRates[bot.id] ?? { coinsPerHour: 0, rubiesPerHour: 0 }

                        const currentCoins = Number(status.cash ?? 0)
                        const currentRubies = Number(status.gold ?? 0)

                        // Time Skips breakdown
                        const skips = [
                            { label: '1m', count: resources['1MinSkip'] || 0 },
                            { label: '5m', count: resources['5MinSkip'] || 0 },
                            { label: '10m', count: resources['10MinSkip'] || 0 },
                            { label: '30m', count: resources['30MinSkip'] || 0 },
                            { label: '1h', count: resources['60MinSkip'] || 0 },
                            { label: '5h', count: resources['5HourSkip'] || 0 },
                            { label: '24h', count: resources['24HourSkip'] || 0 },
                        ]
                        const totalSkipsCount = skips.reduce((acc, s) => acc + (Number(s.count) || 0), 0)

                        const srvObj = instances.find(i => Number(i.id) === bot.server)
                        const serverName = srvObj ? `${__(srvObj.instanceLocaId)} ${srvObj.instanceName}` : `Server ${bot.server || '1'}`

                        return (
                            <Card
                                key={bot.id}
                                className="ea-card ea-card-hover"
                                onClick={() => onSelectBot(bot)}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    borderLeft: `5px solid ${isRunning ? '#10b981' : '#ef4444'}`,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2.5
                                }}
                            >
                                {/* Left Section: Account Identity & Server Realm */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '10px',
                                            bgcolor: isRunning ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid',
                                            borderColor: isRunning ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: isRunning ? '#10b981' : '#94a3b8'
                                        }}
                                    >
                                        <DnsIcon />
                                    </Box>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.05rem' }}>
                                                {bot.name}
                                            </Typography>
                                            <Chip
                                                label={isRunning ? "RUNNING" : "STOPPED"}
                                                size="small"
                                                sx={{
                                                    height: 20,
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    bgcolor: isRunning ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                    color: isRunning ? '#10b981' : '#ef4444',
                                                    border: '1px solid',
                                                    borderColor: isRunning ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.2 }}>
                                            <span>Realm: <strong>{serverName}</strong></span>
                                            <span>•</span>
                                            <span>ID: #{bot.id}</span>
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Middle Section 1: Coins & Rubies Economy (Current + /hr rate) */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                                    {/* Coins metric */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                        <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                                            <MonetizationOnIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                                                Coins
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                {formatNumber(currentCoins)}
                                                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                                    +{formatNumber(rates.coinsPerHour)}/h
                                                </span>
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Rubies metric */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                        <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                            <DiamondIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                                                Rubies
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                {formatNumber(currentRubies)}
                                                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                                    +{formatNumber(rates.rubiesPerHour)}/h
                                                </span>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Middle Section 2: Time Skips Overview (1m, 5m, 10m, 30m, 1h, 5h, 24h) */}
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.2, bgcolor: 'rgba(0,0,0,0.25)', p: 1, px: 1.5, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Box sx={{ color: '#38bdf8', display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon fontSize="small" />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                                            Time Skips ({formatNumber(totalSkipsCount)})
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.8, mt: 0.2 }}>
                                            {skips.map(sk => (
                                                <Tooltip key={sk.label} title={`${sk.label} Skips: ${sk.count}`}>
                                                    <Chip
                                                        label={`${sk.label}: ${formatNumber(sk.count)}`}
                                                        size="small"
                                                        sx={{
                                                            height: 19,
                                                            fontSize: '0.65rem',
                                                            bgcolor: Number(sk.count) > 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.04)',
                                                            color: Number(sk.count) > 0 ? '#38bdf8' : '#64748b',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </Tooltip>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Right Section: Controls & Open Navigation */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Button
                                        size="small"
                                        variant={isRunning ? "contained" : "outlined"}
                                        color={isRunning ? "error" : "success"}
                                        startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
                                        onClick={(e) => handleToggleState(e, bot)}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            height: 32,
                                            px: 2,
                                            borderRadius: '6px',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {isRunning ? "Stop" : "Start"}
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="contained"
                                        endIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.75rem !important' }} />}
                                        onClick={() => onSelectBot(bot)}
                                        sx={{
                                            bgcolor: '#1e293b',
                                            color: '#f8fafc',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            height: 32,
                                            px: 2,
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            '&:hover': { bgcolor: '#334155' }
                                        }}
                                    >
                                        Configure
                                    </Button>

                                    <Tooltip title="Delete Account">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleDeleteBot(e, bot)}
                                            sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Card>
                        )
                    })
                )}
            </Box>

            <AddBotDialog
                open={addOpen}
                onClose={() => setAddOpen(false)}
                __={__}
                onSave={(newBot) => {
                    ws.send(JSON.stringify([ErrorType.Success, ActionType.AddUser, newBot]))
                }}
            />
        </Box>
    )
}
