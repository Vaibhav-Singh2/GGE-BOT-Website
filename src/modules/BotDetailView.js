import * as React from 'react'
import {
    Box,
    Typography,
    Button,
    Card,
    Switch,
    TextField,
    Checkbox,
    FormControlLabel,
    Chip,
    IconButton,
    Tabs,
    Tab,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Tooltip,
    Divider,
    Breadcrumbs,
    Link,
    Paper
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import SaveIcon from '@mui/icons-material/Save'
import ShieldIcon from '@mui/icons-material/Shield'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import CastleIcon from '@mui/icons-material/Castle'
import BuildIcon from '@mui/icons-material/Build'
import TerminalIcon from '@mui/icons-material/Terminal'
import PauseIcon from '@mui/icons-material/Pause'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TuneIcon from '@mui/icons-material/Tune'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { ErrorType, ActionType, LogLevel } from "../types.js"

// Modular Navigation Categories from PDF
const CATEGORIES = [
    {
        id: 'attacks',
        label: 'ATTACKS & FARMING',
        icon: <MilitaryTechIcon fontSize="small" />,
        match: ['attack', 'barron', 'fortress', 'khan', 'nomad', 'samurai', 'stormfort', 'stormri']
    },
    {
        id: 'production',
        label: 'PRODUCTION & BUILDING',
        icon: <CastleIcon fontSize="small" />,
        match: ['recruit', 'tool', 'cargo']
    },
    {
        id: 'resources',
        label: 'RESOURCES & TROOPS',
        icon: <Inventory2Icon fontSize="small" />,
        match: ['feast', 'food', 'resource', 'colossus', 'hospital']
    },
    {
        id: 'defense',
        label: 'DEFENSE & MESSAGES',
        icon: <ShieldIcon fontSize="small" />,
        match: ['dodge', 'incoming', 'defense', 'shield']
    },
    {
        id: 'utils',
        label: 'UTILITIES & SYSTEM',
        icon: <BuildIcon fontSize="small" />,
        match: ['skip', 'shutoff', 'timer', 'sell', 'misc', 'commander']
    }
]

function getCategoryForPlugin(key) {
    const k = key.toLowerCase()
    for (const cat of CATEGORIES) {
        if (cat.match.some(m => k.includes(m))) return cat.id
    }
    return 'utils'
}

function PluginOptionField({ option, userPlugins, pluginKey, channels, __ }) {
    userPlugins[pluginKey] ??= {}
    const [val, setVal] = React.useState(userPlugins[pluginKey][option.key] ?? option.default)

    const handleChange = newVal => {
        userPlugins[pluginKey][option.key] = newVal
        setVal(newVal)
    }

    switch (option.type) {
        case "Label":
            return (
                <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', mt: 1, mb: 0.5, display: 'block' }}>
                    {__(option.key)}
                </Typography>
            )
        case "Text":
            return (
                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                        {__(option.key)}
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={val ?? ""}
                        onChange={e => handleChange(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#0f151e',
                                borderRadius: '6px',
                                fontSize: '0.82rem',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                            }
                        }}
                    />
                </Box>
            )
        case "Checkbox":
            return (
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={Boolean(val)}
                            onChange={(_, checked) => handleChange(checked)}
                            sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#38bdf8' } }}
                        />
                    }
                    label={<Typography variant="body2" sx={{ color: '#e2e8f0', fontSize: '0.8rem' }}>{option.hideText ? "" : __(option.key)}</Typography>}
                    sx={{ my: 0.4 }}
                />
            )
        default:
            return null
    }
}

function SectionCard({ title, subtitle, children }) {
    return (
        <Card className="ea-card" sx={{ mb: 2.5 }}>
            <Box sx={{ pb: 1.5, mb: 2, borderBottom: '1px solid var(--border-subtle)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.98rem' }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {children}
        </Card>
    )
}

export default function BotDetailView({ bot, plugins, usersStatus, ws, onBack, __, languageCode, channels }) {
    const [selectedCategory, setSelectedCategory] = React.useState('attacks')
    const [isRunning, setIsRunning] = React.useState(Boolean(bot.state))
    const [logs, setLogs] = React.useState([])
    const [autoScroll, setAutoScroll] = React.useState(true)
    const [isStreaming, setIsStreaming] = React.useState(true)
    const logContainerRef = React.useRef(null)

    // Listen for live bot logs
    React.useEffect(() => {
        ws.send(JSON.stringify([ErrorType.Success, ActionType.GetLogs, bot]))

        const logGrabber = msg => {
            if (!isStreaming) return
            let [err, action, obj] = JSON.parse(msg.data.toString())
            if (Number(action) !== ActionType.GetLogs) return
            if (Number(err) !== ErrorType.Success) return

            setLogs(
                obj[0]
                    .splice(obj[1], obj[0].length - 1)
                    .concat(obj[0])
                    .map((item, index) => {
                        let text = item[1].map(__).join("")
                        let color = '#38bdf8'
                        if (item[0] === LogLevel.Error) color = '#ef4444'
                        else if (item[0] === LogLevel.Warn) color = '#f59e0b'
                        return { text, color, key: index }
                    })
                    .reverse()
            )
        }
        ws.addEventListener("message", logGrabber)
        return () => ws.removeEventListener("message", logGrabber)
    }, [ws, bot, __, isStreaming])

    React.useEffect(() => {
        if (autoScroll && logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
        }
    }, [logs, autoScroll])

    const handleSave = () => {
        ws.send(JSON.stringify([ErrorType.Success, ActionType.SetUser, bot]))
        alert("Bot configuration saved successfully!")
    }

    const handleToggleState = () => {
        const next = !isRunning
        setIsRunning(next)
        bot.state = next ? 1 : 0
        ws.send(JSON.stringify([ErrorType.Success, ActionType.SetUser, bot]))
    }

    // Filter plugins for active sidebar category
    const activePlugins = plugins.filter(p => getCategoryForPlugin(p.key) === selectedCategory)

    // Count badges per category
    const categoryCounts = React.useMemo(() => {
        const counts = {}
        CATEGORIES.forEach(c => {
            counts[c.id] = plugins.filter(p => getCategoryForPlugin(p.key) === c.id).length
        })
        return counts
    }, [plugins])

    return (
        <Box className="ea-container">
            {/* Breadcrumb Header */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Breadcrumbs sx={{ color: '#94a3b8', fontSize: '0.82rem', mb: 0.5 }}>
                        <Link onClick={onBack} sx={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                            Bots
                        </Link>
                        <Typography sx={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600 }}>
                            {bot.name}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Manage your bot's configuration, templates, and active routines.
                    </Typography>
                </Box>
            </Box>

            {/* Action Top Bar matching PDF */}
            <Card className="ea-card" sx={{ mb: 3, p: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                        sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.15)', textTransform: 'none', borderRadius: '6px' }}
                    >
                        Back
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>Status:</Typography>
                        <Chip
                            label={isRunning ? "Running" : "Stopped"}
                            size="small"
                            sx={{
                                bgcolor: isRunning ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: isRunning ? '#10b981' : '#ef4444',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                border: '1px solid',
                                borderColor: isRunning ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button
                        variant="contained"
                        size="small"
                        color={isRunning ? "error" : "success"}
                        startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
                        onClick={handleToggleState}
                        sx={{ fontWeight: 600, textTransform: 'none', borderRadius: '6px', px: 2.5 }}
                    >
                        {isRunning ? "Stop Bot" : "Start Bot"}
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{ bgcolor: '#3b82f6', fontWeight: 600, textTransform: 'none', borderRadius: '6px', px: 2.5, '&:hover': { bgcolor: '#2563eb' } }}
                    >
                        Save
                    </Button>
                </Box>
            </Card>

            {/* Layout: Sidebar + Main Workspace */}
            <Box className="ea-bot-layout">
                {/* Left Modular Sidebar */}
                <Box className="ea-bot-sidebar">
                    <List disablePadding>
                        {CATEGORIES.map(cat => {
                            const isSelected = selectedCategory === cat.id
                            return (
                                <ListItemButton
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    sx={{
                                        py: 1.4,
                                        px: 2,
                                        borderLeft: `3px solid ${isSelected ? '#3b82f6' : 'transparent'}`,
                                        bgcolor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)' }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: isSelected ? '#3b82f6' : '#64748b', minWidth: 32 }}>
                                        {cat.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={cat.label}
                                        primaryTypographyProps={{
                                            fontSize: '0.78rem',
                                            fontWeight: isSelected ? 700 : 600,
                                            color: isSelected ? '#f8fafc' : '#94a3b8',
                                            letterSpacing: '0.03em'
                                        }}
                                    />
                                    <Chip
                                        label={categoryCounts[cat.id] || 0}
                                        size="small"
                                        sx={{
                                            height: 18,
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            bgcolor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.06)',
                                            color: isSelected ? '#38bdf8' : '#64748b'
                                        }}
                                    />
                                </ListItemButton>
                            )
                        })}
                    </List>
                </Box>

                {/* Main Content Area */}
                <Box className="ea-bot-content">
                    {activePlugins.length === 0 ? (
                        <Card className="ea-card">
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                No plugins registered in this category.
                            </Typography>
                        </Card>
                    ) : (
                        activePlugins.map(plugin => {
                            bot.plugins[plugin.key] ??= {}
                            const isEnabled = Boolean(bot.plugins[plugin.key]?.state)

                            return (
                                <SectionCard
                                    key={plugin.key}
                                    title={__(plugin.key)}
                                    subtitle={plugin.description}
                                >
                                    {/* Enable Switch Header */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                                            Enable {__(plugin.key)} Routine
                                        </Typography>
                                        <Switch
                                            checked={isEnabled}
                                            onChange={(_, checked) => {
                                                bot.plugins[plugin.key].state = checked
                                                ws.send(JSON.stringify([ErrorType.Success, ActionType.SetUser, bot]))
                                            }}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#3b82f6',
                                                    '& + .MuiSwitch-track': { backgroundColor: '#2563eb' }
                                                }
                                            }}
                                        />
                                    </Box>

                                    {/* Plugin Options Fields */}
                                    {plugin.pluginOptions && plugin.pluginOptions.length > 0 ? (
                                        <Box sx={{ bgcolor: '#0f151e', p: 2, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                            {plugin.pluginOptions.map((opt, idx) => (
                                                <PluginOptionField
                                                    key={`${plugin.key}-${idx}`}
                                                    option={opt}
                                                    userPlugins={bot.plugins}
                                                    pluginKey={plugin.key}
                                                    channels={channels}
                                                    __={__}
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            No extra parameters required for this module.
                                        </Typography>
                                    )}
                                </SectionCard>
                            )
                        })
                    )}

                    {/* Docked Bot Monitoring & Terminal at the Bottom (Matching PDF Page 3) */}
                    <Card className="ea-card" sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5, mb: 1.5, borderBottom: '1px solid var(--border-subtle)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TerminalIcon sx={{ color: '#3b82f6' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                                    Live Bot Monitoring & Logs
                                </Typography>
                                <Chip
                                    label={isStreaming ? "Streaming active" : "Stream paused"}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        bgcolor: isStreaming ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                        color: isStreaming ? '#10b981' : '#f59e0b',
                                        fontWeight: 700
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<PauseIcon />}
                                    onClick={() => setIsStreaming(!isStreaming)}
                                    sx={{ height: 26, fontSize: '0.72rem', color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.1)' }}
                                >
                                    {isStreaming ? "Pause" : "Resume"}
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteSweepIcon />}
                                    onClick={() => setLogs([])}
                                    sx={{ height: 26, fontSize: '0.72rem' }}
                                >
                                    Clear
                                </Button>
                            </Box>
                        </Box>

                        <Box
                            ref={logContainerRef}
                            className="ea-terminal"
                            sx={{
                                height: 260,
                                overflowY: 'auto',
                                p: 1.5
                            }}
                        >
                            {logs.length === 0 ? (
                                <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                                    No output recorded yet. Start the bot to begin streaming logs.
                                </Typography>
                            ) : (
                                logs.map(l => (
                                    <Box key={l.key} sx={{ color: l.color, py: 0.2 }}>
                                        &gt; {l.text}
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Card>
                </Box>
            </Box>
        </Box>
    )
}
