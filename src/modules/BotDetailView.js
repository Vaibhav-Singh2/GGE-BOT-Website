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
    Link,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert
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
import ExtensionIcon from '@mui/icons-material/Extension'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { ErrorType, ActionType, LogLevel } from "../types.js"

// Sidebar Structure with Master "PLUGINS & MODULES" category at the top
const SIDEBAR_STRUCTURE = [
    {
        id: 'plugins_manager',
        label: 'PLUGINS & MANAGER',
        items: [
            {
                id: 'plugins_manager_item',
                label: 'Plugins Manager',
                icon: <ExtensionIcon fontSize="small" />,
                isMasterManager: true
            }
        ]
    },
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
                match: ['incoming', 'alert', 'discord']
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

function PluginOptionField({ option, userPlugins, pluginKey, channels, __, onOptionChange }) {
    userPlugins[pluginKey] ??= {}
    const [val, setVal] = React.useState(userPlugins[pluginKey][option.key] ?? option.default)

    React.useEffect(() => {
        setVal(userPlugins[pluginKey][option.key] ?? option.default)
    }, [userPlugins, pluginKey, option.key, option.default])

    const handleChange = newVal => {
        userPlugins[pluginKey][option.key] = newVal
        setVal(newVal)
        if (onOptionChange) onOptionChange(pluginKey, option.key, newVal)
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
        case "Number":
            return (
                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                        {__(option.key)}
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={val ?? ""}
                        onChange={e => handleChange(Number(e.target.value))}
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
    const [selectedItemId, setSelectedItemId] = React.useState('plugins_manager_item')
    const [collapsedSections, setCollapsedSections] = React.useState({})
    const [isRunning, setIsRunning] = React.useState(Boolean(bot.state))
    const [logs, setLogs] = React.useState([])
    const [isStreaming, setIsStreaming] = React.useState(true)
    const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false)
    const [savedTemplates, setSavedTemplates] = React.useState([])
    const [newTemplateName, setNewTemplateName] = React.useState('')
    const [feedbackMsg, setFeedbackMsg] = React.useState('')
    const fileInputRef = React.useRef(null)
    const logContainerRef = React.useRef(null)

    // Client-side staged draft configuration
    const [draftPlugins, setDraftPlugins] = React.useState(() => JSON.parse(JSON.stringify(bot.plugins || {})))
    const [savedBaseline, setSavedBaseline] = React.useState(() => JSON.stringify(bot.plugins || {}))

    // Compare draft against baseline
    const hasUnsavedChanges = React.useMemo(() => {
        return JSON.stringify(draftPlugins) !== savedBaseline
    }, [draftPlugins, savedBaseline])

    // Load saved templates from localStorage on mount
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem('gge_saved_templates')
            if (raw) setSavedTemplates(JSON.parse(raw))
        } catch (e) {
            console.error(e)
        }
    }, [])

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

    // Commit staged draft changes to backend
    const handleSave = () => {
        bot.plugins = JSON.parse(JSON.stringify(draftPlugins))
        ws.send(JSON.stringify([ErrorType.Success, ActionType.SetUser, bot]))
        setSavedBaseline(JSON.stringify(draftPlugins))
        setFeedbackMsg("Bot configuration saved successfully to server!")
    }

    // Discard draft changes and reset back to last saved configuration
    const handleReset = () => {
        const reverted = JSON.parse(savedBaseline)
        setDraftPlugins(reverted)
        setFeedbackMsg("Changes reverted to last saved state.")
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

    // Helper to update a plugin option in draft
    const handleOptionChange = (pluginKey, optionKey, newVal) => {
        setDraftPlugins(prev => {
            const next = JSON.parse(JSON.stringify(prev))
            next[pluginKey] ??= {}
            next[pluginKey][optionKey] = newVal
            return next
        })
    }

    // Helper to toggle a plugin state in draft
    const handlePluginToggle = (pluginKey, checked) => {
        setDraftPlugins(prev => {
            const next = JSON.parse(JSON.stringify(prev))
            next[pluginKey] ??= {}
            next[pluginKey].state = checked
            return next
        })
    }

    /**
     * Maps an EmpireAutomation template (e.g. ThorOP_template.json) to draftPlugins client-side WITHOUT saving to backend
     */
    const applyEmpireAutomationTemplate = (templateData, templateName = "Template") => {
        const bf = templateData.BotFunctions || {}
        const fsKeys = bf.FunctionSelection || {}

        setDraftPlugins(prev => {
            const next = JSON.parse(JSON.stringify(prev))

            // 1. Direct plugin state mapping
            const pluginMap = {
                'TowerBot': 'attackBarron',
                'StormBot': 'attackStormRI',
                'FortressBot': 'attackFortress',
                'CampBot': 'attackNomads',
                'KahnBot': 'attackKhan',
                'BerriGreen': 'attackBerimondInvasion',
                'ToolBuild': 'toolBuild',
                'ProduceComponents': 'produceComponents',
                'CoinSpender': 'coinSpender',
                'AutomaticFeast': 'feast',
                'HospitalHealer': 'hospitalHealer',
                'CastleDefense': 'troopDodge',
                'MessageManagement': 'messageManagement',
                'EquipmentManager': 'sellStoredEquipment',
                'RecruitBot': 'recruit',
                'AlertBot': 'discord'
            }

            Object.entries(pluginMap).forEach(([tplKey, botKey]) => {
                next[botKey] ??= {}
                if (fsKeys[tplKey] !== undefined) {
                    next[botKey].state = Boolean(fsKeys[tplKey])
                }
            })

            if (templateData.plugins) {
                Object.entries(templateData.plugins).forEach(([k, v]) => {
                    next[k] = { ...next[k], ...v }
                })
            }

            // 2. Castle Defense / troopDodge detailed params
            if (bf.CastleDefense?.FunctionParameters) {
                const p = bf.CastleDefense.FunctionParameters
                next.troopDodge = {
                    ...next.troopDodge,
                    state: fsKeys.CastleDefense !== undefined ? Boolean(fsKeys.CastleDefense) : true,
                    attackThresholdMinutes: p.AttackThresholdMinutes ?? 20,
                    pullBackDelayMinutes: p.PullBackDelayMinutes ?? 20,
                    autoPullBackTroops: p.AutoPullBackTroops ?? true,
                    autoSafeCastleFromAllianceList: p.AutoSafeCastleFromAllianceList ?? true,
                    troopAttackThreshold: p.TroopAttackThreshold ?? 300,
                    minimumSendAmount: p.MinimumSendAmount ?? 100,
                    openGateDurationHours: p.OpenGateDurationHours ?? 6,
                    confirmRubySpendForOpenGate: p.ConfirmRubySpendForOpenGate ?? true,
                    openGateWhenSendTroopsFails: p.OpenGateWhenSendTroopsFails ?? true,
                    sendTroopsWhenOpenGateFails: p.SendTroopsWhenOpenGateFails ?? true,
                    skipSendTroopsDuringPeaceProtection: p.SkipSendTroopsDuringPeaceProtection ?? true,
                    outpostX: p.Main?.SendTroops?.SendToCastle?.x ? String(p.Main.SendTroops.SendToCastle.x) : '',
                    outpostY: p.Main?.SendTroops?.SendToCastle?.y ? String(p.Main.SendTroops.SendToCastle.y) : ''
                }
            }

            // 3. Coin Spender params
            if (bf.CoinSpender?.FunctionParameters) {
                const p = bf.CoinSpender.FunctionParameters
                next.coinSpender = {
                    ...next.coinSpender,
                    state: fsKeys.CoinSpender !== undefined ? Boolean(fsKeys.CoinSpender) : true,
                    coinThreshold: p.CoinThreshold ?? 2000000000,
                    buyLadders: p.BuyLadders ?? true,
                    buyMantlets: p.BuyMantlets ?? true
                }
            }

            // 4. Hospital Healer params
            if (bf.HospitalHealer?.FunctionParameters) {
                const p = bf.HospitalHealer.FunctionParameters
                next.hospitalHealer = {
                    ...next.hospitalHealer,
                    state: fsKeys.HospitalHealer !== undefined ? Boolean(fsKeys.HospitalHealer) : true,
                    checkIntervalMinutes: p.CheckIntervalMinutes ?? 5,
                    healCoinTroops: p.HealCoinTroops ?? true,
                    discardRubyTroops: p.DiscardRubyTroops ?? true,
                    requestAllianceHelp: p.RequestAllianceHelp ?? true
                }
            }

            // 5. Equipment Manager / sellStoredEquipment params
            if (bf.EquipmentManager?.FunctionParameters) {
                const p = bf.EquipmentManager.FunctionParameters
                next.sellStoredEquipment = {
                    ...next.sellStoredEquipment,
                    state: fsKeys.EquipmentManager !== undefined ? Boolean(fsKeys.EquipmentManager) : true,
                    excludeTechnicusUpgrades: p.ExcludeTechnicusUpgrades ?? true,
                    excludeGemSocketedEquipment: p.ExcludeGemSocketedEquipment ?? true,
                    sellCommonEquipment: p.SellCommonEquipment ?? true,
                    sellRareEquipment: p.SellRareEquipment ?? true,
                    sellEpicEquipment: p.SellEpicEquipment ?? true,
                    sellLegendaryEquipment: p.SellLegendaryEquipment ?? true
                }
            }

            // 6. Discord webhooks
            if (templateData.discord?.webhookUrl) {
                next.discord = {
                    ...next.discord,
                    state: Boolean(templateData.discord.webhookEnabled),
                    webhook: templateData.discord.webhookUrl
                }
            }

            return next
        })

        setFeedbackMsg(`Template "${templateName}" applied to draft. Click Save to persist changes!`)
    }

    // Export current draft settings as downloadable JSON template
    const handleDownloadTemplate = () => {
        const payload = {
            name: `${bot.name}_export`,
            createdAt: new Date().toISOString(),
            BotFunctions: {
                FunctionSelection: {
                    TowerBot: Boolean(draftPlugins.attackBarron?.state),
                    StormBot: Boolean(draftPlugins.attackStormRI?.state),
                    FortressBot: Boolean(draftPlugins.attackFortress?.state),
                    CampBot: Boolean(draftPlugins.attackNomads?.state),
                    KahnBot: Boolean(draftPlugins.attackKhan?.state),
                    BerriGreen: Boolean(draftPlugins.attackBerimondInvasion?.state),
                    ToolBuild: Boolean(draftPlugins.toolBuild?.state),
                    ProduceComponents: Boolean(draftPlugins.produceComponents?.state),
                    CoinSpender: Boolean(draftPlugins.coinSpender?.state),
                    AutomaticFeast: Boolean(draftPlugins.feast?.state),
                    HospitalHealer: Boolean(draftPlugins.hospitalHealer?.state),
                    CastleDefense: Boolean(draftPlugins.troopDodge?.state),
                    MessageManagement: Boolean(draftPlugins.messageManagement?.state),
                    EquipmentManager: Boolean(draftPlugins.sellStoredEquipment?.state),
                    RecruitBot: Boolean(draftPlugins.recruit?.state),
                    AlertBot: Boolean(draftPlugins.discord?.state)
                },
                CastleDefense: { FunctionParameters: draftPlugins.troopDodge || {} },
                CoinSpender: { FunctionParameters: draftPlugins.coinSpender || {} },
                HospitalHealer: { FunctionParameters: draftPlugins.hospitalHealer || {} },
                EquipmentManager: { FunctionParameters: draftPlugins.sellStoredEquipment || {} },
                MessageManagement: { FunctionParameters: draftPlugins.messageManagement || {} }
            },
            plugins: draftPlugins
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2))
        const dlAnchor = document.createElement('a')
        dlAnchor.setAttribute("href", dataStr)
        dlAnchor.setAttribute("download", `${bot.name}_template.json`)
        document.body.appendChild(dlAnchor)
        dlAnchor.click()
        dlAnchor.remove()
        setFeedbackMsg("Template exported & downloaded!")
    }

    // Handle template file upload
    const handleUploadTemplate = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result)
                applyEmpireAutomationTemplate(parsed, file.name.replace('.json', ''))
            } catch (err) {
                alert("Failed to parse JSON template file: " + err.message)
            }
        }
        reader.readAsText(file)
        e.target.value = ''
    }

    // Save current draft to local templates presets
    const handleSaveTemplatePreset = () => {
        const name = newTemplateName.trim() || `Profile_${Date.now()}`
        const newPreset = {
            name,
            date: new Date().toLocaleDateString(),
            data: {
                plugins: JSON.parse(JSON.stringify(draftPlugins))
            }
        }
        const updated = [...savedTemplates, newPreset]
        setSavedTemplates(updated)
        localStorage.setItem('gge_saved_templates', JSON.stringify(updated))
        setNewTemplateName('')
        setFeedbackMsg(`Saved template preset: ${name}`)
    }

    const handleDeletePreset = (index) => {
        const updated = savedTemplates.filter((_, i) => i !== index)
        setSavedTemplates(updated)
        localStorage.setItem('gge_saved_templates', JSON.stringify(updated))
    }

    // Filter which sidebar categories/items should display:
    // 1. "PLUGINS & MANAGER" is ALWAYS visible.
    // 2. An item is visible ONLY if at least one matching plugin is ENABLED in draftPlugins.
    const visibleSidebarStructure = SIDEBAR_STRUCTURE.map(section => {
        if (section.id === 'plugins_manager') return section

        const visibleItems = section.items.filter(item => {
            if (!item.match) return false
            // Check if any matching plugin is enabled
            return plugins.some(p => {
                const k = p.key.toLowerCase()
                const matches = item.match.some(m => k.includes(m))
                return matches && Boolean(draftPlugins[p.key]?.state)
            })
        })

        return { ...section, items: visibleItems }
    }).filter(section => section.items.length > 0)

    // Ensure selected item is valid; if selected item is no longer visible, default to plugins manager
    let activeItemObj = null
    let activeSectionObj = null
    for (const section of visibleSidebarStructure) {
        for (const item of section.items) {
            if (item.id === selectedItemId) {
                activeItemObj = item
                activeSectionObj = section
                break
            }
        }
    }

    if (!activeItemObj) {
        activeItemObj = SIDEBAR_STRUCTURE[0].items[0]
        activeSectionObj = SIDEBAR_STRUCTURE[0]
    }

    // Matching plugins for active item
    const matchingPlugins = activeItemObj.isMasterManager
        ? []
        : plugins.filter(p => {
            if (!activeItemObj || !activeItemObj.match) return false
            const k = p.key.toLowerCase()
            return activeItemObj.match.some(m => k.includes(m))
        })

    return (
        <Box className="ea-container">
            {/* Hidden File Input for Template Upload */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleUploadTemplate}
            />

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
                        Manage your bot's modular plugins, templates, import/export, and defense settings.
                    </Typography>
                </Box>
            </Box>

            {/* Action Top Bar matching SaaS specs */}
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

                {/* Template Action Controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FileUploadIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)', textTransform: 'none', borderRadius: '6px', fontSize: '0.78rem' }}
                    >
                        Upload Template
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleDownloadTemplate}
                        sx={{ color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.3)', textTransform: 'none', borderRadius: '6px', fontSize: '0.78rem' }}
                    >
                        Download Template
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<BookmarkBorderIcon />}
                        onClick={() => setTemplateDialogOpen(true)}
                        sx={{ color: '#e2e8f0', borderColor: 'rgba(255, 255, 255, 0.15)', textTransform: 'none', borderRadius: '6px', fontSize: '0.78rem' }}
                    >
                        Templates Library
                    </Button>

                    <Button
                        variant="contained"
                        size="small"
                        color={isRunning ? "error" : "success"}
                        startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
                        onClick={handleToggleState}
                        sx={{ fontWeight: 600, textTransform: 'none', borderRadius: '6px', px: 2 }}
                    >
                        {isRunning ? "Stop Bot" : "Start Bot"}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        disabled={!hasUnsavedChanges}
                        startIcon={<RestartAltIcon />}
                        onClick={handleReset}
                        sx={{
                            color: hasUnsavedChanges ? '#f87171' : '#64748b',
                            borderColor: hasUnsavedChanges ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                            textTransform: 'none',
                            borderRadius: '6px',
                            px: 1.8,
                            '&:hover': {
                                borderColor: '#ef4444',
                                bgcolor: 'rgba(239, 68, 68, 0.08)'
                            }
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{
                            bgcolor: hasUnsavedChanges ? '#f59e0b' : '#3b82f6',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: '6px',
                            px: 2.5,
                            boxShadow: hasUnsavedChanges ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none',
                            '&:hover': { bgcolor: hasUnsavedChanges ? '#d97706' : '#2563eb' }
                        }}
                    >
                        {hasUnsavedChanges ? "Save Changes *" : "Save"}
                    </Button>
                </Box>
            </Card>

            {/* Layout: Sidebar + Main Workspace */}
            <Box className="ea-bot-layout">
                {/* Left Modular Dynamic Sidebar */}
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
                    {visibleSidebarStructure.map(section => {
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
                                        color: section.id === 'plugins_manager' ? '#38bdf8' : '#94a3b8',
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
                                            bgcolor: section.id === 'plugins_manager' ? 'rgba(56, 189, 248, 0.2)' : '#1e293b',
                                            color: section.id === 'plugins_manager' ? '#38bdf8' : '#60a5fa'
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
                            startIcon={<ExtensionIcon sx={{ fontSize: '0.9rem !important' }} />}
                            onClick={() => setSelectedItemId('plugins_manager_item')}
                            sx={{
                                color: '#38bdf8',
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                justifyContent: 'flex-start',
                                px: 1.5,
                                '&:hover': { color: '#f8fafc', bgcolor: 'rgba(56, 189, 248, 0.1)' }
                            }}
                        >
                            Toggle Plugins
                        </Button>
                    </Box>
                </Box>

                {/* Main Content Area */}
                <Box className="ea-bot-content">
                    {/* If Master Plugins Manager is selected */}
                    {activeItemObj.isMasterManager ? (
                        <Box>
                            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ExtensionIcon sx={{ color: '#38bdf8' }} /> Plugins & Modules Hub
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                        Turn plugins ON/OFF below. Only modules enabled here will appear in your sidebar for configuration.
                                    </Typography>
                                </Box>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<FileUploadIcon />}
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)', textTransform: 'none' }}
                                >
                                    Upload Template
                                </Button>
                            </Box>

                            {/* Grouped hierarchically by Section and Sub-Categories */}
                            {SIDEBAR_STRUCTURE.filter(sec => sec.id !== 'plugins_manager').map(section => {
                                // Collect all items that have matching plugins
                                const subCategories = section.items.map(item => {
                                    const itemPlugins = plugins.filter(plugin => {
                                        const k = plugin.key.toLowerCase()
                                        return item.match && item.match.some(m => k.includes(m))
                                    })
                                    return {
                                        ...item,
                                        plugins: itemPlugins
                                    }
                                }).filter(item => item.plugins.length > 0)

                                if (subCategories.length === 0) return null

                                const totalPlugins = subCategories.reduce((acc, sub) => acc + sub.plugins.length, 0)
                                const activeCount = subCategories.reduce((acc, sub) => acc + sub.plugins.filter(p => Boolean(draftPlugins[p.key]?.state)).length, 0)

                                return (
                                    <Box key={section.id} sx={{ mb: 3.5 }}>
                                        {/* Main Section Header */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, mb: 1.5, borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                                {section.label}
                                            </Typography>
                                            <Chip
                                                label={`${activeCount} / ${totalPlugins} Active`}
                                                size="small"
                                                sx={{
                                                    height: 20,
                                                    fontSize: '0.68rem',
                                                    fontWeight: 700,
                                                    bgcolor: activeCount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                                                    color: activeCount > 0 ? '#10b981' : '#64748b'
                                                }}
                                            />
                                        </Box>

                                        {/* Sub-Categories */}
                                        <Box sx={{ pl: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {subCategories.map(sub => {
                                                const subActiveCount = sub.plugins.filter(p => Boolean(draftPlugins[p.key]?.state)).length
                                                return (
                                                    <Box key={sub.id} sx={{ bgcolor: 'rgba(255, 255, 255, 0.015)', p: 1.5, borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                                        {/* Sub-Category Subheader */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, pb: 0.8, borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Box sx={{ color: '#60a5fa', display: 'flex', alignItems: 'center' }}>
                                                                    {sub.icon}
                                                                </Box>
                                                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
                                                                    {sub.label}
                                                                </Typography>
                                                            </Box>
                                                            <Chip
                                                                label={`${subActiveCount} / ${sub.plugins.length}`}
                                                                size="small"
                                                                sx={{
                                                                    height: 18,
                                                                    fontSize: '0.62rem',
                                                                    fontWeight: 700,
                                                                    bgcolor: subActiveCount > 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                                                    color: subActiveCount > 0 ? '#38bdf8' : '#64748b'
                                                                }}
                                                            />
                                                        </Box>

                                                        {/* Plugin Rows inside Sub-Category */}
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            {sub.plugins.map(plugin => {
                                                                const isPluginActive = Boolean(draftPlugins[plugin.key]?.state)
                                                                return (
                                                                    <Box
                                                                        key={plugin.key}
                                                                        sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                            py: 0.9,
                                                                            px: 1,
                                                                            borderRadius: '4px',
                                                                            transition: 'background-color 0.15s',
                                                                            '&:hover': {
                                                                                bgcolor: 'rgba(255, 255, 255, 0.025)'
                                                                            },
                                                                            borderBottom: '1px solid rgba(255, 255, 255, 0.02)'
                                                                        }}
                                                                    >
                                                                        <Box sx={{ pr: 2 }}>
                                                                            <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: isPluginActive ? '#f8fafc' : '#94a3b8' }}>
                                                                                {__(plugin.key)}
                                                                            </Typography>
                                                                            <Typography sx={{ fontSize: '0.72rem', color: '#64748b', display: 'block', mt: 0.1 }}>
                                                                                {plugin.description || `Background routine for ${__(plugin.key)}.`}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                                                                            <Chip
                                                                                label={isPluginActive ? "Sidebar ON" : "Hidden"}
                                                                                size="small"
                                                                                sx={{
                                                                                    height: 18,
                                                                                    fontSize: '0.62rem',
                                                                                    fontWeight: 600,
                                                                                    bgcolor: isPluginActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                                                                                    color: isPluginActive ? '#10b981' : '#64748b',
                                                                                    border: '1px solid',
                                                                                    borderColor: isPluginActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)'
                                                                                }}
                                                                            />
                                                                            <Switch
                                                                                size="small"
                                                                                checked={isPluginActive}
                                                                                onChange={(_, checked) => handlePluginToggle(plugin.key, checked)}
                                                                                sx={{
                                                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                                                        color: '#38bdf8',
                                                                                        '& + .MuiSwitch-track': { backgroundColor: '#0284c7' }
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                    </Box>
                                                                )
                                                            })}
                                                        </Box>
                                                    </Box>
                                                )
                                            })}
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Box>
                    ) : (
                        /* Module Details and Configuration Form */
                        <Box>
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
                                        No active plugin for {activeItemObj?.label}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                                        Enable this plugin in the Plugins Manager to configure parameters.
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => setSelectedItemId('plugins_manager_item')}
                                        sx={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)', textTransform: 'none' }}
                                    >
                                        Open Plugins Manager
                                    </Button>
                                </Card>
                            ) : (
                                matchingPlugins.map(plugin => {
                                    const isEnabled = Boolean(draftPlugins[plugin.key]?.state)

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
                                                    onChange={(_, checked) => handlePluginToggle(plugin.key, checked)}
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
                                                            userPlugins={draftPlugins}
                                                            pluginKey={plugin.key}
                                                            channels={channels}
                                                            __={__}
                                                            onOptionChange={handleOptionChange}
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
                        </Box>
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

            {/* Template Library Dialog */}
            <Dialog
                open={templateDialogOpen}
                onClose={() => setTemplateDialogOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#131922',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        minWidth: 420
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, pb: 1, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    Saved Templates & Presets
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
                            Save Current Settings as New Template:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Template Name (e.g. ThorOP_Main)"
                                value={newTemplateName}
                                onChange={e => setNewTemplateName(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: '#0f151e',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem'
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleSaveTemplatePreset}
                                sx={{ bgcolor: '#3b82f6', textTransform: 'none', px: 2 }}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>

                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1, fontWeight: 700, textTransform: 'uppercase' }}>
                        Your Saved Presets:
                    </Typography>

                    {savedTemplates.length === 0 ? (
                        <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic', display: 'block', py: 1 }}>
                            No saved templates yet. Upload a JSON template or save current settings above.
                        </Typography>
                    ) : (
                        <List disablePadding>
                            {savedTemplates.map((preset, idx) => (
                                <Card
                                    key={idx}
                                    sx={{
                                        mb: 1,
                                        p: 1.2,
                                        bgcolor: '#0f151e',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.85rem' }}>
                                            {preset.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                                            Saved on {preset.date}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                                applyEmpireAutomationTemplate(preset.data, preset.name)
                                                setTemplateDialogOpen(false)
                                            }}
                                            sx={{ color: '#38bdf8', borderColor: 'rgba(56,189,248,0.3)', textTransform: 'none', fontSize: '0.75rem', py: 0.2 }}
                                        >
                                            Apply
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDeletePreset(idx)}
                                            sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.2, minWidth: 32 }}
                                        >
                                            ✕
                                        </Button>
                                    </Box>
                                </Card>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Button
                        onClick={() => setTemplateDialogOpen(false)}
                        sx={{ color: '#94a3b8', textTransform: 'none' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Toast */}
            <Snackbar
                open={Boolean(feedbackMsg)}
                autoHideDuration={4000}
                onClose={() => setFeedbackMsg('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setFeedbackMsg('')} severity="success" sx={{ width: '100%', bgcolor: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8' }}>
                    {feedbackMsg}
                </Alert>
            </Snackbar>
        </Box>
    )
}
