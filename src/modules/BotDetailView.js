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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import DiamondIcon from '@mui/icons-material/Diamond'
import ConstructionIcon from '@mui/icons-material/Construction'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import EmailIcon from '@mui/icons-material/Email'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import HandymanIcon from '@mui/icons-material/Handyman'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import { ErrorType, ActionType, LogLevel } from "../types.js"

// Exact Categories and Sections matching EmpireAutomation
const SIDEBAR_STRUCTURE = [
    {
        id: 'attacks',
        label: 'ATTACKS & FARMING',
        items: [
            {
                id: 'barrons',
                label: 'Robber Baron Castles',
                icon: <CastleIcon fontSize="small" />,
                match: ['barron']
            },
            {
                id: 'storm_bot',
                label: 'Storm Bot',
                icon: <FlashOnIcon fontSize="small" />,
                match: ['stormfort', 'stormri']
            },
            {
                id: 'fortress_bot',
                label: 'Fortress Bot',
                icon: <AccountBalanceIcon fontSize="small" />,
                match: ['fortress']
            },
            {
                id: 'events_bot',
                label: 'Invasions & LTPE',
                icon: <MilitaryTechIcon fontSize="small" />,
                match: ['nomad', 'samurai', 'khan', 'berimondinvasion']
            }
        ]
    },
    {
        id: 'production',
        label: 'PRODUCTION & BUILDING',
        items: [
            {
                id: 'recruiting',
                label: 'Recruiting',
                icon: <GroupAddIcon fontSize="small" />,
                match: ['recruit']
            },
            {
                id: 'tool_production',
                label: 'Tool Production',
                icon: <HandymanIcon fontSize="small" />,
                match: ['toolbuild']
            },
            {
                id: 'components',
                label: 'Components',
                icon: <ConstructionIcon fontSize="small" />,
                match: ['producecomponents', 'component']
            }
        ]
    },
    {
        id: 'resources',
        label: 'RESOURCES & TROOPS',
        items: [
            {
                id: 'resource_logistics',
                label: 'Resource Logistics',
                icon: <SyncAltIcon fontSize="small" />,
                match: ['foodsendstorm', 'resourcesendstorm', 'meadreplacestorm', 'resourcetransfer']
            },
            {
                id: 'feast',
                label: 'Feast',
                icon: <RestaurantIcon fontSize="small" />,
                match: ['feast']
            },
            {
                id: 'hospital',
                label: 'Military Hospital',
                icon: <LocalHospitalIcon fontSize="small" />,
                match: ['hospital']
            },
            {
                id: 'events_donate',
                label: 'Events & Kingdom Donate',
                icon: <Inventory2Icon fontSize="small" />,
                match: ['colossus', 'berimondkingdom']
            }
        ]
    },
    {
        id: 'shops',
        label: 'SHOPS, CURRENCY & EQ...',
        items: [
            {
                id: 'coin_spender',
                label: 'Coin Spender',
                icon: <MonetizationOnIcon fontSize="small" />,
                match: ['coinspender']
            },
            {
                id: 'equipment',
                label: 'Equipment',
                icon: <DiamondIcon fontSize="small" />,
                match: ['sellstoredequipment', 'equipment']
            }
        ]
    },
    {
        id: 'defense',
        label: 'DEFENSE & MESSAGES',
        items: [
            {
                id: 'castle_defense',
                label: 'Castle Defense',
                icon: <ShieldIcon fontSize="small" />,
                match: ['dodge', 'castledefense']
            },
            {
                id: 'alerts',
                label: 'Alerts',
                icon: <NotificationsActiveIcon fontSize="small" />,
                match: ['incoming', 'alert']
            },
            {
                id: 'messages',
                label: 'Messages',
                icon: <EmailIcon fontSize="small" />,
                match: ['message', 'chat', 'slash']
            }
        ]
    },
    {
        id: 'system',
        label: 'SYSTEM & UTILITIES',
        items: [
            {
                id: 'skips',
                label: 'Time Skips',
                icon: <BuildIcon fontSize="small" />,
                match: ['skip']
            },
            {
                id: 'timers',
                label: 'Timers & Maintenance',
                icon: <BuildIcon fontSize="small" />,
                match: ['shutoff', 'interval', 'misc', 'commander', 'help']
            }
        ]
    }
]

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
    const [selectedItemId, setSelectedItemId] = React.useState('barrons')
    const [collapsedSections, setCollapsedSections] = React.useState({})
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

    const toggleSection = (sectionId) => {
        setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))
    }

    // Find the currently active menu item
    let activeItemObj = null
    let activeSectionObj = null
    for (const section of SIDEBAR_STRUCTURE) {
        for (const item of section.items) {
            if (item.id === selectedItemId) {
                activeItemObj = item
                activeSectionObj = section
                break
            }
        }
    }

    // Filter plugins corresponding to the selected sidebar item
    const matchingPlugins = plugins.filter(p => {
        if (!activeItemObj || !activeItemObj.match) return false
        const k = p.key.toLowerCase()
        return activeItemObj.match.some(m => k.includes(m))
    })

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
                            {activeSectionObj?.label} &gt; {activeItemObj?.label}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Manage your bot's configuration, modules, templates, and settings.
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

            {/* Layout: Sidebar + Main Workspace (Matching Screenshot) */}
            <Box className="ea-bot-layout">
                {/* Left Modular Sidebar with Exactly Styled Sections */}
                <Box
                    className="ea-bot-sidebar"
                    sx={{
                        width: 250,
                        bgcolor: '#0f1723',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        p: 1
                    }}
                >
                    {SIDEBAR_STRUCTURE.map(section => {
                        const isCollapsed = Boolean(collapsedSections[section.id])
                        return (
                            <Box key={section.id} sx={{ mb: 1.5 }}>
                                {/* Category Header */}
                                <Box
                                    onClick={() => toggleSection(section.id)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        px: 1,
                                        py: 0.6,
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                        userSelect: 'none',
                                        '&:hover': { color: '#e2e8f0' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                        {isCollapsed ? (
                                            <ExpandMoreIcon sx={{ fontSize: '0.95rem', color: '#64748b' }} />
                                        ) : (
                                            <ExpandLessIcon sx={{ fontSize: '0.95rem', color: '#64748b' }} />
                                        )}
                                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                            {section.label}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={section.items.length}
                                        size="small"
                                        sx={{
                                            height: 16,
                                            fontSize: '0.6rem',
                                            fontWeight: 800,
                                            bgcolor: '#1e293b',
                                            color: '#60a5fa'
                                        }}
                                    />
                                </Box>

                                {/* Sub Items */}
                                {!isCollapsed && (
                                    <List disablePadding sx={{ mt: 0.4 }}>
                                        {section.items.map(item => {
                                            const isSelected = selectedItemId === item.id
                                            return (
                                                <ListItemButton
                                                    key={item.id}
                                                    onClick={() => setSelectedItemId(item.id)}
                                                    sx={{
                                                        py: 0.9,
                                                        px: 1.2,
                                                        mb: 0.3,
                                                        borderRadius: '8px',
                                                        bgcolor: isSelected ? 'rgba(37, 99, 235, 0.22)' : 'transparent',
                                                        border: isSelected ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                                                        '&:hover': {
                                                            bgcolor: isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ color: isSelected ? '#60a5fa' : '#64748b', minWidth: 28 }}>
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={item.label}
                                                        primaryTypographyProps={{
                                                            fontSize: '0.78rem',
                                                            fontWeight: isSelected ? 700 : 500,
                                                            color: isSelected ? '#f8fafc' : '#cbd5e1'
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

                    <Box sx={{ pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <Button
                            fullWidth
                            size="small"
                            startIcon={<AddIcon sx={{ fontSize: '0.9rem !important' }} />}
                            onClick={() => alert("All available modules are actively listed.")}
                            sx={{
                                color: '#94a3b8',
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                justifyContent: 'flex-start',
                                px: 1.5,
                                '&:hover': { color: '#f8fafc', bgcolor: 'rgba(255,255,255,0.04)' }
                            }}
                        >
                            Manage functions
                        </Button>
                    </Box>
                </Box>

                {/* Main Content Area */}
                <Box className="ea-bot-content">
                    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.15rem' }}>
                                {activeItemObj?.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                Section: {activeSectionObj?.label} • {matchingPlugins.length} active module(s)
                            </Typography>
                        </Box>
                    </Box>

                    {matchingPlugins.length === 0 ? (
                        <Card className="ea-card" sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="subtitle2" sx={{ color: '#f8fafc', mb: 0.5 }}>
                                {activeItemObj?.label} module is planned
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                This function belongs to the next release phase and will be populated with routine controls.
                            </Typography>
                        </Card>
                    ) : (
                        matchingPlugins.map(plugin => {
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

                    {/* Docked Bot Monitoring & Terminal at the Bottom */}
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
