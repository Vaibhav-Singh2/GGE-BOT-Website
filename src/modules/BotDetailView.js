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
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Breadcrumbs,
    Link
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
import Inventory2Icon from '@mui/icons-material/Inventory2'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ErrorType, ActionType, LogLevel } from "../types.js"

// Hierarchical Category and Subcategory Taxonomy
const CATEGORIES = [
    {
        id: 'attacks',
        label: 'ATTACKS & FARMING',
        icon: <MilitaryTechIcon fontSize="small" />,
        subcategories: [
            { id: 'all_attacks', label: 'All Attacks' },
            { id: 'barrons', label: 'Robber Baron Castles', match: ['barron'] },
            { id: 'fortresses', label: 'Kingdom Fortresses', match: ['fortress'] },
            { id: 'storm', label: 'Storm Islands', match: ['stormfort', 'stormri'] },
            { id: 'events', label: 'Invasions & LTPE', match: ['nomad', 'samurai', 'khan', 'berimondinvasion'] }
        ]
    },
    {
        id: 'production',
        label: 'PRODUCTION & RECRUITING',
        icon: <CastleIcon fontSize="small" />,
        subcategories: [
            { id: 'all_prod', label: 'All Production' },
            { id: 'recruit', label: 'Troop Recruitment', match: ['recruit'] },
            { id: 'tools', label: 'Tool & Equipment Crafting', match: ['tool', 'sellstored'] }
        ]
    },
    {
        id: 'resources',
        label: 'RESOURCES & LOGISTICS',
        icon: <Inventory2Icon fontSize="small" />,
        subcategories: [
            { id: 'all_res', label: 'All Logistics' },
            { id: 'storm_supplies', label: 'Storm Logistics & Food', match: ['foodsendstorm', 'resourcesendstorm', 'meadreplacestorm'] },
            { id: 'kingdom_events', label: 'Kingdom & Events Donate', match: ['colossus', 'berimondkingdom'] },
            { id: 'hospital_feast', label: 'Feast & Maintenance', match: ['feast', 'hospital'] }
        ]
    },
    {
        id: 'defense',
        label: 'DEFENSE & MESSAGES',
        icon: <ShieldIcon fontSize="small" />,
        subcategories: [
            { id: 'all_def', label: 'All Defense' },
            { id: 'troop_dodge', label: 'Troop Dodge / Saving', match: ['dodge'] },
            { id: 'alerts', label: 'Incoming Alerts & Discord', match: ['incoming', 'defense', 'alert'] }
        ]
    },
    {
        id: 'utils',
        label: 'UTILITIES & SYSTEM',
        icon: <BuildIcon fontSize="small" />,
        subcategories: [
            { id: 'all_utils', label: 'All Utilities' },
            { id: 'skips', label: 'Time Skips Automation', match: ['skip'] },
            { id: 'automation', label: 'Timers & Shutoff', match: ['shutoff', 'interval', 'timer', 'misc', 'commander'] }
        ]
    }
]

// Identify the parent Category ID for a plugin
function getCategoryForPlugin(key) {
    const k = key.toLowerCase()
    if (k.includes('attack') || k.includes('barron') || k.includes('fortress') || k.includes('khan') || k.includes('nomad') || k.includes('samurai') || k.includes('storm')) {
        if (!k.includes('sendstorm') && !k.includes('replacestorm')) return 'attacks'
    }
    if (k.includes('recruit') || k.includes('tool') || k.includes('sellstored')) return 'production'
    if (k.includes('food') || k.includes('send') || k.includes('resource') || k.includes('colossus') || k.includes('feast') || k.includes('berimondkingdom')) return 'resources'
    if (k.includes('dodge') || k.includes('incoming') || k.includes('defense') || k.includes('shield')) return 'defense'
    return 'utils'
}

// Identify the Subcategory ID for a plugin
function getSubcategoryForPlugin(key, categoryId) {
    const k = key.toLowerCase()
    const cat = CATEGORIES.find(c => c.id === categoryId)
    if (!cat) return 'all'

    for (const sub of cat.subcategories) {
        if (sub.match && sub.match.some(m => k.includes(m))) {
            return sub.id
        }
    }
    return cat.subcategories[1]?.id || 'all'
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
    const [selectedSubcategory, setSelectedSubcategory] = React.useState('all_attacks')
    const [openCategories, setOpenCategories] = React.useState({ attacks: true })
    const [isRunning, setIsRunning] = React.useState(Boolean(bot.state))
    const [logs, setLogs] = React.useState([])
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
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
        }
    }, [logs])

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

    const toggleCategoryExpand = (catId) => {
        setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }))
        setSelectedCategory(catId)
        const cat = CATEGORIES.find(c => c.id === catId)
        if (cat?.subcategories?.[0]) {
            setSelectedSubcategory(cat.subcategories[0].id)
        }
    }

    // Filter plugins for active sidebar category and subcategory
    const activePlugins = plugins.filter(p => {
        const catId = getCategoryForPlugin(p.key)
        if (catId !== selectedCategory) return false

        const activeCatObj = CATEGORIES.find(c => c.id === selectedCategory)
        const activeSubObj = activeCatObj?.subcategories.find(s => s.id === selectedSubcategory)

        if (!activeSubObj || activeSubObj.id.startsWith('all_')) return true
        return activeSubObj.match.some(m => p.key.toLowerCase().includes(m))
    })

    // Count badges per category
    const categoryCounts = React.useMemo(() => {
        const counts = {}
        CATEGORIES.forEach(c => {
            counts[c.id] = plugins.filter(p => getCategoryForPlugin(p.key) === c.id).length
        })
        return counts
    }, [plugins])

    const currentCategoryObj = CATEGORIES.find(c => c.id === selectedCategory)
    const currentSubcategoryObj = currentCategoryObj?.subcategories.find(s => s.id === selectedSubcategory)

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
                        <Typography sx={{ color: '#64748b', fontSize: '0.82rem' }}>
                            {currentCategoryObj?.label} &gt; {currentSubcategoryObj?.label}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Manage your bot's configuration, grouped subcategories, and active routines.
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

            {/* Layout: Hierarchical Sidebar + Main Workspace */}
            <Box className="ea-bot-layout">
                {/* Left Modular Sidebar with Nested Subcategories */}
                <Box className="ea-bot-sidebar" sx={{ width: 280 }}>
                    <List disablePadding>
                        {CATEGORIES.map(cat => {
                            const isCatActive = selectedCategory === cat.id
                            const isExpanded = Boolean(openCategories[cat.id])

                            return (
                                <Box key={cat.id} sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {/* Main Category Header Button */}
                                    <ListItemButton
                                        onClick={() => toggleCategoryExpand(cat.id)}
                                        sx={{
                                            py: 1.2,
                                            px: 2,
                                            borderLeft: `3px solid ${isCatActive ? '#3b82f6' : 'transparent'}`,
                                            bgcolor: isCatActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)' }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: isCatActive ? '#3b82f6' : '#64748b', minWidth: 30 }}>
                                            {cat.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={cat.label}
                                            primaryTypographyProps={{
                                                fontSize: '0.76rem',
                                                fontWeight: 800,
                                                color: isCatActive ? '#f8fafc' : '#94a3b8',
                                                letterSpacing: '0.04em'
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                            <Chip
                                                label={categoryCounts[cat.id] || 0}
                                                size="small"
                                                sx={{
                                                    height: 18,
                                                    fontSize: '0.62rem',
                                                    fontWeight: 700,
                                                    bgcolor: isCatActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.06)',
                                                    color: isCatActive ? '#38bdf8' : '#64748b'
                                                }}
                                            />
                                            {isExpanded ? <ExpandLessIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} /> : <ExpandMoreIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} />}
                                        </Box>
                                    </ListItemButton>

                                    {/* Subcategory Items */}
                                    {isExpanded && (
                                        <List disablePadding sx={{ bgcolor: 'rgba(0, 0, 0, 0.25)', py: 0.5 }}>
                                            {cat.subcategories.map(sub => {
                                                const isSubSelected = isCatActive && selectedSubcategory === sub.id
                                                return (
                                                    <ListItemButton
                                                        key={sub.id}
                                                        onClick={() => {
                                                            setSelectedCategory(cat.id)
                                                            setSelectedSubcategory(sub.id)
                                                        }}
                                                        sx={{
                                                            py: 0.8,
                                                            pl: 5.5,
                                                            pr: 2,
                                                            bgcolor: isSubSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                                            borderLeft: `2px solid ${isSubSelected ? '#38bdf8' : 'transparent'}`,
                                                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={sub.label}
                                                            primaryTypographyProps={{
                                                                fontSize: '0.74rem',
                                                                fontWeight: isSubSelected ? 700 : 500,
                                                                color: isSubSelected ? '#38bdf8' : '#cbd5e1'
                                                            }}
                                                        />
                                                    </ListItemButton>
                                                )
                                            })}
                                        </List>
                                    )}
                                </Box>
                            )
                        })}
                    </List>
                </Box>

                {/* Main Content Area */}
                <Box className="ea-bot-content">
                    {/* Header of Active Subcategory */}
                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.1rem' }}>
                                {currentSubcategoryObj?.label || currentCategoryObj?.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                Showing {activePlugins.length} configured module(s)
                            </Typography>
                        </Box>
                    </Box>

                    {activePlugins.length === 0 ? (
                        <Card className="ea-card">
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                No plugins registered in this subcategory.
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
