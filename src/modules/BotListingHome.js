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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import DnsIcon from '@mui/icons-material/Dns'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import DiamondIcon from '@mui/icons-material/Diamond'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
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

    // Live ticking timestamp for real-time uptime display and dynamic rates
    const [currentTime, setCurrentTime] = React.useState(() => Date.now())
    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Client-side fallback start timestamps and balances
    const localStartTimes = React.useRef({})
    const localStartBalances = React.useRef({})

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

    const formatGain = num => {
        if (num === undefined || num === null || isNaN(num)) return '+0'
        const n = Math.round(Number(num))
        const sign = n > 0 ? '+' : n < 0 ? '-' : '+'
        const abs = Math.abs(n)
        let formatted
        if (abs < 10000) {
            formatted = abs.toLocaleString()
        } else {
            formatted = new Intl.NumberFormat(languageCode || 'en', { notation: 'compact' }).format(abs)
        }
        return `${sign}${formatted}`
    }

    const formatUptimeClock = ms => {
        if (!ms || ms <= 0 || isNaN(ms)) return '00:00:00'
        const totalSecs = Math.floor(ms / 1000)
        const h = String(Math.floor(totalSecs / 3600)).padStart(2, '0')
        const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0')
        const s = String(totalSecs % 60).padStart(2, '0')
        return `${h}:${m}:${s}`
    }

    const formatUptimeHuman = ms => {
        if (!ms || ms <= 0 || isNaN(ms)) return '0s'
        const totalSecs = Math.floor(ms / 1000)
        const h = Math.floor(totalSecs / 3600)
        const m = Math.floor((totalSecs % 3600) / 60)
        const s = totalSecs % 60
        if (h > 0) return `${h}h ${m}m ${s}s`
        if (m > 0) return `${m}m ${s}s`
        return `${s}s`
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

                        const currentCoins = Number(status.cash ?? 0)
                        const currentRubies = Number(status.gold ?? 0)

                        // Manage local fallback session baseline
                        if (isRunning) {
                            if (!localStartTimes.current[bot.id]) {
                                localStartTimes.current[bot.id] = status.sessionStartedAt || currentTime
                            }
                            if (!localStartBalances.current[bot.id] && (currentCoins > 0 || currentRubies > 0)) {
                                localStartBalances.current[bot.id] = { coins: currentCoins, rubies: currentRubies }
                            }
                        } else {
                            delete localStartTimes.current[bot.id]
                            delete localStartBalances.current[bot.id]
                        }

                        const sessionStartedAt = status.sessionStartedAt || (isRunning ? localStartTimes.current[bot.id] : null)
                        const uptimeMs = (isRunning && sessionStartedAt) ? Math.max(0, currentTime - sessionStartedAt) : 0
                        const elapsedHours = uptimeMs / (1000 * 60 * 60)

                        // Calculate coins gain & hourly rate
                        const localStartCoins = localStartBalances.current[bot.id]?.coins ?? currentCoins
                        const coinsGained = isRunning
                            ? (status.coinsGained !== undefined ? Number(status.coinsGained) : (currentCoins - localStartCoins))
                            : 0
                        let coinsPerHour = 0
                        if (isRunning) {
                            if (status.coinsPerHour !== undefined && status.coinsPerHour !== 0) {
                                coinsPerHour = Number(status.coinsPerHour)
                            } else if (elapsedHours >= 0.004) {
                                coinsPerHour = Math.round(coinsGained / elapsedHours)
                            }
                        }

                        // Calculate rubies gain & hourly rate
                        const localStartRubies = localStartBalances.current[bot.id]?.rubies ?? currentRubies
                        const rubiesGained = isRunning
                            ? (status.rubiesGained !== undefined ? Number(status.rubiesGained) : (currentRubies - localStartRubies))
                            : 0
                        let rubiesPerHour = 0
                        if (isRunning) {
                            if (status.rubiesPerHour !== undefined && status.rubiesPerHour !== 0) {
                                rubiesPerHour = Number(status.rubiesPerHour)
                            } else if (elapsedHours >= 0.004) {
                                rubiesPerHour = Math.round(rubiesGained / elapsedHours)
                            }
                        }

                        // Time Skips breakdown
                        const skips = [
                            { label: '1m', resKey: '1MinSkip', count: resources['1MinSkip'] || 0 },
                            { label: '5m', resKey: '5MinSkip', count: resources['5MinSkip'] || 0 },
                            { label: '10m', resKey: '10MinSkip', count: resources['10MinSkip'] || 0 },
                            { label: '30m', resKey: '30MinSkip', count: resources['30MinSkip'] || 0 },
                            { label: '1h', resKey: '60MinSkip', count: resources['60MinSkip'] || 0 },
                            { label: '5h', resKey: '5HourSkip', count: resources['5HourSkip'] || 0 },
                            { label: '24h', resKey: '24HourSkip', count: resources['24HourSkip'] || 0 },
                        ]
                        const totalSkipsCount = skips.reduce((acc, s) => acc + (Number(s.count) || 0), 0)

                        const skipsUsed = isRunning ? Number(status.skipsUsed || 0) : 0
                        const skipsUsedByType = isRunning ? (status.skipsUsedByType || {}) : {}
                        let skipsUsedPerHour = 0
                        if (isRunning) {
                            if (status.skipsUsedPerHour !== undefined && status.skipsUsedPerHour !== 0) {
                                skipsUsedPerHour = Number(status.skipsUsedPerHour)
                            } else if (elapsedHours >= 0.004 && skipsUsed > 0) {
                                skipsUsedPerHour = Math.round(skipsUsed / elapsedHours)
                            }
                        }

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
                                {/* Left Section: Account Identity & Server Realm & Uptime */}
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
                                            {isRunning && (
                                                <Tooltip title={`Session Uptime: ${formatUptimeHuman(uptimeMs)}`}>
                                                    <Chip
                                                        icon={<AccessTimeIcon sx={{ fontSize: '0.72rem !important', color: '#10b981 !important' }} />}
                                                        label={formatUptimeClock(uptimeMs)}
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '0.68rem',
                                                            fontWeight: 700,
                                                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                                                            color: '#6ee7b7',
                                                            border: '1px solid rgba(16, 185, 129, 0.25)',
                                                            '& .MuiChip-icon': { ml: '4px' }
                                                        }}
                                                    />
                                                </Tooltip>
                                            )}
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.2 }}>
                                            <span>Realm: <strong>{serverName}</strong></span>
                                            <span>•</span>
                                            <span>ID: #{bot.id}</span>
                                            {isRunning && (
                                                <>
                                                    <span>•</span>
                                                    <span style={{ color: '#cbd5e1' }}>Uptime: <strong style={{ color: '#10b981' }}>{formatUptimeHuman(uptimeMs)}</strong></span>
                                                </>
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Middle Section 1: Coins & Rubies Economy (Current + /hr rate + session gain counter) */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                                    {/* Coins metric */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                        <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                                            <MonetizationOnIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                                                Coins
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                {formatNumber(currentCoins)}
                                                <Tooltip title={`Session Gain: ${coinsGained >= 0 ? '+' : ''}${Math.round(coinsGained).toLocaleString()} coins | Rate: ${coinsPerHour >= 0 ? '+' : ''}${Math.round(coinsPerHour).toLocaleString()}/h`}>
                                                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
                                                        <span style={{ fontSize: '0.72rem', color: coinsPerHour >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                                            {coinsPerHour >= 0 ? '+' : ''}{formatNumber(coinsPerHour)}/h
                                                        </span>
                                                        <span style={{
                                                            fontSize: '0.68rem',
                                                            color: coinsGained >= 0 ? '#38bdf8' : '#f87171',
                                                            fontWeight: 700,
                                                            bgcolor: 'rgba(56, 189, 248, 0.1)',
                                                            px: 0.6,
                                                            py: 0.1,
                                                            borderRadius: '4px',
                                                            border: '1px solid rgba(56, 189, 248, 0.2)'
                                                        }}>
                                                            {formatGain(coinsGained)}
                                                        </span>
                                                    </Box>
                                                </Tooltip>
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Rubies metric */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                        <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                            <DiamondIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                                                Rubies
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                {formatNumber(currentRubies)}
                                                <Tooltip title={`Session Gain: ${rubiesGained >= 0 ? '+' : ''}${Math.round(rubiesGained).toLocaleString()} rubies | Rate: ${rubiesPerHour >= 0 ? '+' : ''}${Math.round(rubiesPerHour).toLocaleString()}/h`}>
                                                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
                                                        <span style={{ fontSize: '0.72rem', color: rubiesPerHour >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                                            {rubiesPerHour >= 0 ? '+' : ''}{formatNumber(rubiesPerHour)}/h
                                                        </span>
                                                        <span style={{
                                                            fontSize: '0.68rem',
                                                            color: rubiesGained >= 0 ? '#f43f5e' : '#f87171',
                                                            fontWeight: 700,
                                                            bgcolor: 'rgba(244, 63, 94, 0.1)',
                                                            px: 0.6,
                                                            py: 0.1,
                                                            borderRadius: '4px',
                                                            border: '1px solid rgba(244, 63, 94, 0.2)'
                                                        }}>
                                                            {formatGain(rubiesGained)}
                                                        </span>
                                                    </Box>
                                                </Tooltip>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Middle Section 2: Time Skips Overview (1m, 5m, 10m, 30m, 1h, 5h, 24h) + Usage counters */}
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.2, bgcolor: 'rgba(0,0,0,0.25)', p: 1, px: 1.5, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Box sx={{ color: '#38bdf8', display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon fontSize="small" />
                                    </Box>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                                                Time Skips ({formatNumber(totalSkipsCount)})
                                            </Typography>
                                            <Tooltip title={`Session Skips Used: ${skipsUsed.toLocaleString()} skips | Usage Rate: ${skipsUsedPerHour.toLocaleString()}/h`}>
                                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
                                                    <span style={{ fontSize: '0.7rem', color: skipsUsed > 0 ? '#f59e0b' : '#64748b', fontWeight: 600 }}>
                                                        {skipsUsedPerHour}/h
                                                    </span>
                                                    <span style={{
                                                        fontSize: '0.65rem',
                                                        color: skipsUsed > 0 ? '#fbbf24' : '#64748b',
                                                        fontWeight: 700,
                                                        bgcolor: skipsUsed > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.04)',
                                                        px: 0.6,
                                                        py: 0.05,
                                                        borderRadius: '3px',
                                                        border: '1px solid',
                                                        borderColor: skipsUsed > 0 ? 'rgba(245, 158, 11, 0.3)' : 'transparent'
                                                    }}>
                                                        {skipsUsed} used
                                                    </span>
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 0.8, mt: 0.3 }}>
                                            {skips.map(sk => {
                                                const used = skipsUsedByType[sk.resKey] || 0
                                                return (
                                                    <Tooltip
                                                        key={sk.label}
                                                        title={`${sk.label} Skips: ${Number(sk.count).toLocaleString()}${used > 0 ? ` (${used} used this session)` : ''}`}
                                                    >
                                                        <Chip
                                                            label={used > 0 ? `${sk.label}: ${formatNumber(sk.count)} (-${used})` : `${sk.label}: ${formatNumber(sk.count)}`}
                                                            size="small"
                                                            sx={{
                                                                height: 19,
                                                                fontSize: '0.65rem',
                                                                bgcolor: Number(sk.count) > 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.04)',
                                                                color: Number(sk.count) > 0 ? '#38bdf8' : '#64748b',
                                                                borderColor: used > 0 ? 'rgba(245, 158, 11, 0.4)' : 'transparent',
                                                                borderWidth: used > 0 ? '1px' : '0px',
                                                                borderStyle: 'solid',
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    </Tooltip>
                                                )
                                            })}
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
