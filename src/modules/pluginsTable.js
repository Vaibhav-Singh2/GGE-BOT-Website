import * as React from 'react'
import {
    Box,
    Paper,
    Typography,
    Switch,
    TextField,
    Checkbox,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    InputAdornment,
    IconButton,
    Tabs,
    Tab,
    Collapse,
    Tooltip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import TuneIcon from '@mui/icons-material/Tune'
import ShieldIcon from '@mui/icons-material/Shield'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import CastleIcon from '@mui/icons-material/Castle'
import BuildIcon from '@mui/icons-material/Build'

// Helper to categorize plugins
function getPluginCategory(key) {
    const k = key.toLowerCase()
    if (k.includes('attack') || k.includes('barron') || k.includes('fortress') || k.includes('khan') || k.includes('nomad') || k.includes('samurai') || k.includes('stormri')) {
        return 'attacks'
    }
    if (k.includes('dodge') || k.includes('incoming') || k.includes('defense') || k.includes('shield')) {
        return 'defense'
    }
    if (k.includes('recruit') || k.includes('feast') || k.includes('berimond') || k.includes('send') || k.includes('colossus') || k.includes('food')) {
        return 'kingdom'
    }
    return 'utils'
}

function PluginOption({ pluginData, channels, userPlugins, plugin, __ }) {
    userPlugins[plugin.key] ??= {}
    const [value, setValue] = React.useState(userPlugins[plugin.key][pluginData.key] ?? pluginData.default)

    const onChange = val => {
        userPlugins[plugin.key][pluginData.key] = val
        setValue(val)
    }

    switch (pluginData.type) {
        case "":
            return null
        case "Label":
            return (
                <Typography variant="caption" sx={{ display: 'block', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 1.5, mb: 0.5 }}>
                    {__(pluginData.key)}
                </Typography>
            )
        case "Text":
            return (
                <TextField
                    fullWidth
                    label={__(pluginData.key)}
                    variant="outlined"
                    size="small"
                    value={value ?? ""}
                    onChange={e => onChange(e.target.value)}
                    sx={{
                        my: 0.8,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(0, 0, 0, 0.25)',
                            borderRadius: '8px',
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                            '&:hover fieldset': { borderColor: 'rgba(96, 165, 250, 0.5)' }
                        }
                    }}
                />
            )
        case "Checkbox":
            return (
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={Boolean(value)}
                            onChange={(_, checked) => onChange(checked)}
                            sx={{ color: 'rgba(255, 255, 255, 0.4)', '&.Mui-checked': { color: '#38bdf8' } }}
                        />
                    }
                    label={<Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#e2e8f0' }}>{pluginData.hideText ? "" : __(pluginData.key)}</Typography>}
                    sx={{ my: 0.4, mr: 2 }}
                />
            )
        case "Table":
            const array_chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size))
            return (
                <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', mt: 1 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}>
                                {pluginData.row.map((cRow, i) => (
                                    <TableCell key={i} sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', py: 0.8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        {cRow}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {array_chunks(pluginData.data, pluginData.row.length).map((e, i) => (
                                <TableRow key={i}>
                                    {e.map((pData, j) => (
                                        <TableCell key={j} sx={{ py: 0.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <PluginOption
                                                pluginData={pData}
                                                channels={channels}
                                                userPlugins={userPlugins}
                                                __={__}
                                                plugin={plugin}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        default:
            return null
    }
}

function PluginCard({ plugin, __, userPlugins, channels }) {
    userPlugins[plugin.key] ??= {}
    const [enabled, setEnabled] = React.useState(Boolean(userPlugins[plugin.key]?.state))
    const [expanded, setExpanded] = React.useState(false)

    const hasOptions = plugin.pluginOptions && plugin.pluginOptions.length > 0

    const toggleState = () => {
        const next = !enabled
        setEnabled(next)
        userPlugins[plugin.key].state = next
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1.5,
                borderRadius: '10px',
                border: '1px solid',
                borderColor: enabled ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                bgcolor: enabled ? 'rgba(14, 165, 233, 0.04)' : 'rgba(15, 23, 42, 0.5)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    borderColor: enabled ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.16)',
                    bgcolor: enabled ? 'rgba(14, 165, 233, 0.07)' : 'rgba(15, 23, 42, 0.7)'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0, flex: 1 }}>
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: enabled ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
                            boxShadow: enabled ? '0 0 8px #10b981' : 'none'
                        }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.88rem',
                                color: enabled ? '#f8fafc' : '#94a3b8',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {__(plugin.key)}
                        </Typography>
                        {plugin.description && (
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {plugin.description}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {hasOptions && (
                        <Tooltip title={expanded ? "Hide Configuration" : "Edit Configuration"}>
                            <IconButton
                                size="small"
                                onClick={() => setExpanded(!expanded)}
                                sx={{
                                    color: expanded ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)',
                                    bgcolor: expanded ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' }
                                }}
                            >
                                <TuneIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {!plugin.force ? (
                        <Switch
                            size="small"
                            checked={enabled}
                            onChange={toggleState}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#38bdf8',
                                    '& + .MuiSwitch-track': { backgroundColor: '#0284c7' }
                                }
                            }}
                        />
                    ) : (
                        <Chip label="Locked" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.08)', color: '#94a3b8' }} />
                    )}
                </Box>
            </Box>

            {hasOptions && (
                <Collapse in={expanded}>
                    <Box
                        sx={{
                            mt: 1.5,
                            pt: 1.5,
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                            p: 1.5,
                            borderRadius: '8px'
                        }}
                    >
                        {plugin.pluginOptions.map((opt, idx) => (
                            <PluginOption
                                key={`${plugin.key}-${idx}`}
                                pluginData={opt}
                                channels={channels}
                                userPlugins={userPlugins}
                                plugin={plugin}
                                __={__}
                            />
                        ))}
                    </Box>
                </Collapse>
            )}
        </Paper>
    )
}

export default function PluginsTable({ __, userPlugins, plugins, channels }) {
    const [search, setSearch] = React.useState('')
    const [currentTab, setCurrentTab] = React.useState('all')

    const filteredPlugins = React.useMemo(() => {
        return plugins.filter(plugin => {
            const matchesSearch = plugin.key.toLowerCase().includes(search.toLowerCase()) ||
                (plugin.description && plugin.description.toLowerCase().includes(search.toLowerCase()))
            if (!matchesSearch) return false

            if (currentTab === 'all') return true
            const cat = getPluginCategory(plugin.key)
            return cat === currentTab
        })
    }, [plugins, search, currentTab])

    const counts = React.useMemo(() => {
        const res = { all: plugins.length, attacks: 0, defense: 0, kingdom: 0, utils: 0 }
        plugins.forEach(p => {
            const cat = getPluginCategory(p.key)
            res[cat] = (res[cat] || 0) + 1
        })
        return res
    }, [plugins])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Filter and Search Bar */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
                <Tabs
                    value={currentTab}
                    onChange={(_, val) => setCurrentTab(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        minHeight: 36,
                        '& .MuiTab-root': {
                            minHeight: 36,
                            py: 0.5,
                            px: 1.5,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            color: '#94a3b8',
                            borderRadius: '8px',
                            mr: 0.5,
                            '&.Mui-selected': {
                                color: '#38bdf8',
                                bgcolor: 'rgba(56, 189, 248, 0.1)'
                            }
                        },
                        '& .MuiTabs-indicator': { display: 'none' }
                    }}
                >
                    <Tab value="all" label={`All (${counts.all})`} />
                    <Tab value="attacks" icon={<MilitaryTechIcon sx={{ fontSize: '1rem !important' }} />} iconPosition="start" label={`Attacks (${counts.attacks})`} />
                    <Tab value="defense" icon={<ShieldIcon sx={{ fontSize: '1rem !important' }} />} iconPosition="start" label={`Defense (${counts.defense})`} />
                    <Tab value="kingdom" icon={<CastleIcon sx={{ fontSize: '1rem !important' }} />} iconPosition="start" label={`Kingdom (${counts.kingdom})`} />
                    <Tab value="utils" icon={<BuildIcon sx={{ fontSize: '1rem !important' }} />} iconPosition="start" label={`Utilities (${counts.utils})`} />
                </Tabs>

                <TextField
                    size="small"
                    placeholder="Search plugins..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem' }} />
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        width: { xs: '100%', sm: 220 },
                        '& .MuiOutlinedInput-root': {
                            height: 36,
                            fontSize: '0.8rem',
                            bgcolor: 'rgba(0,0,0,0.25)',
                            borderRadius: '8px',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                        }
                    }}
                />
            </Box>

            {/* Plugin Cards Grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(280px, 1fr))' },
                    gap: 1.5,
                    maxHeight: '52vh',
                    overflowY: 'auto',
                    pr: 0.5
                }}
            >
                {filteredPlugins.map((plugin, index) => (
                    <PluginCard
                        key={plugin.key || index}
                        plugin={plugin}
                        __={__}
                        userPlugins={userPlugins}
                        channels={channels}
                    />
                ))}
            </Box>
        </Box>
    )
}