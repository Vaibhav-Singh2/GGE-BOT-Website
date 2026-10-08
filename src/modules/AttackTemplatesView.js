import * as React from 'react'
import {
    Box,
    Typography,
    Button,
    Card,
    TextField,
    Tabs,
    Tab,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Autocomplete
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import unitsCatalog from '../data/unitsCatalog.json'

// Separate troops and tools for autocompletes
const TROOP_OPTIONS = unitsCatalog.filter(u => !u.isTool)
const TOOL_OPTIONS = unitsCatalog.filter(u => u.isTool)

const DEFAULT_CRA_PAYLOAD = {
    SX: 0,
    SY: 0,
    TX: 0,
    TY: 0,
    KID: 0,
    LID: 0,
    WT: 0,
    HBW: -1,
    BPC: 0,
    ATT: 0,
    AV: 0,
    LP: 0,
    FC: 0,
    PTT: 0,
    SD: 0,
    ICA: 0,
    CD: 99,
    A: [
        {
            L: { T: [[-1, 0], [-1, 0]], U: [[277, 54], [-1, 0]] },
            M: { T: [[-1, 0], [-1, 0], [-1, 0]], U: [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]] },
            R: { T: [[-1, 0], [-1, 0]], U: [[277, 54], [-1, 0]] }
        }
    ],
    BKS: [],
    AST: [-1, -1, -1],
    RW: [[-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]],
    ASCT: 0,
    GGEBOT: {
        version: 1,
        waveSources: [{ type: "preset", presetNumber: 12 }]
    }
}

// Convert JSON object into EmpireEx42 CRA packet string
export function serializeCraPacket(data) {
    return `%xt%EmpireEx42%cra%1%${JSON.stringify(data)}%`
}

// Parse EmpireEx42 CRA packet string or plain JSON into object
export function parseCraPacket(rawString) {
    if (!rawString || typeof rawString !== 'string') {
        throw new Error("Input string is empty.")
    }
    const trimmed = rawString.trim()

    // 1. Try matching %xt%...%cra%...%{JSON}%
    const match = trimmed.match(/%xt%[^%]*%cra%[^%]*%(\{.*\})%/i)
    if (match && match[1]) {
        return JSON.parse(match[1])
    }

    // 2. Try parsing directly as JSON
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        return JSON.parse(trimmed)
    }

    throw new Error("Invalid format. Paste a valid %xt%...%cra%...% string or JSON attack object.")
}

export default function AttackTemplatesView({ bot, onSaveTemplate }) {
    const [currentPayload, setCurrentPayload] = React.useState(() => {
        try {
            const saved = localStorage.getItem(`gge_attack_template_${bot?.name}`)
            if (saved) return JSON.parse(saved)
        } catch (e) {
            console.error(e)
        }
        return JSON.parse(JSON.stringify(DEFAULT_CRA_PAYLOAD))
    })

    const [activeWaveIndex, setActiveWaveIndex] = React.useState(0)
    const [importDialogOpen, setImportDialogOpen] = React.useState(false)
    const [importText, setImportText] = React.useState('')
    const [importError, setImportError] = React.useState('')
    const [feedbackMsg, setFeedbackMsg] = React.useState('')
    const [savedPresets, setSavedPresets] = React.useState(() => {
        try {
            const raw = localStorage.getItem('gge_saved_attack_presets')
            if (raw) return JSON.parse(raw)
        } catch (e) {
            console.error(e)
        }
        return [
            {
                name: "Nomad / Barron Rush (Wolves)",
                date: "Default",
                payload: DEFAULT_CRA_PAYLOAD
            }
        ]
    })
    const [presetNameInput, setPresetNameInput] = React.useState('')

    // Save current template to bot storage
    const handleSaveToBot = () => {
        try {
            localStorage.setItem(`gge_attack_template_${bot?.name}`, JSON.stringify(currentPayload))
            if (onSaveTemplate) onSaveTemplate(currentPayload)
            setFeedbackMsg(`Attack template successfully applied to bot ${bot?.name}!`)
        } catch (e) {
            console.error(e)
            setFeedbackMsg("Failed to persist template.")
        }
    }

    // Handle copying current serialized string
    const handleCopyPacket = () => {
        try {
            const packetStr = serializeCraPacket(currentPayload)
            navigator.clipboard.writeText(packetStr)
            setFeedbackMsg("Attack template packet copied to clipboard!")
        } catch (e) {
            console.error(e)
            setFeedbackMsg("Could not copy to clipboard.")
        }
    }

    // Process Import
    const handleProcessImport = () => {
        setImportError('')
        try {
            const parsed = parseCraPacket(importText)
            if (!parsed.A || !Array.isArray(parsed.A) || parsed.A.length === 0) {
                throw new Error("Template must contain at least one wave in array 'A'.")
            }
            setCurrentPayload(parsed)
            setActiveWaveIndex(0)
            setImportDialogOpen(false)
            setImportText('')
            setFeedbackMsg(`Successfully loaded attack template with ${parsed.A.length} wave(s)!`)
        } catch (err) {
            setImportError(err.message || "Failed to parse template string.")
        }
    }

    // Save as reusable preset
    const handleSaveAsPreset = () => {
        const name = presetNameInput.trim()
        if (!name) return
        const newPreset = {
            name,
            date: new Date().toLocaleDateString(),
            payload: JSON.parse(JSON.stringify(currentPayload))
        }
        const updated = [...savedPresets, newPreset]
        setSavedPresets(updated)
        localStorage.setItem('gge_saved_attack_presets', JSON.stringify(updated))
        setPresetNameInput('')
        setFeedbackMsg(`Preset "${name}" saved to library.`)
    }

    const handleApplyPreset = (preset) => {
        setCurrentPayload(JSON.parse(JSON.stringify(preset.payload)))
        setActiveWaveIndex(0)
        setFeedbackMsg(`Loaded preset: "${preset.name}"`)
    }

    const handleDeletePreset = (index) => {
        const updated = savedPresets.filter((_, i) => i !== index)
        setSavedPresets(updated)
        localStorage.setItem('gge_saved_attack_presets', JSON.stringify(updated))
    }

    // Waves Manipulation
    const waves = currentPayload.A || []
    const currentWave = waves[activeWaveIndex] || waves[0] || {
        L: { T: [[-1, 0]], U: [[-1, 0]] },
        M: { T: [[-1, 0]], U: [[-1, 0]] },
        R: { T: [[-1, 0]], U: [[-1, 0]] }
    }

    const handleAddWave = () => {
        const newWave = JSON.parse(JSON.stringify(currentWave))
        const newWaves = [...waves, newWave]
        const newSources = [...(currentPayload.GGEBOT?.waveSources || [])]
        if (newSources.length < newWaves.length) {
            newSources.push({ type: "preset", presetNumber: 12 })
        }
        setCurrentPayload({
            ...currentPayload,
            A: newWaves,
            GGEBOT: { ...(currentPayload.GGEBOT || { version: 1 }), waveSources: newSources }
        })
        setActiveWaveIndex(newWaves.length - 1)
    }

    const handleDeleteWave = (index) => {
        if (waves.length <= 1) {
            setFeedbackMsg("Attack must contain at least 1 wave.")
            return
        }
        const newWaves = waves.filter((_, i) => i !== index)
        const newSources = (currentPayload.GGEBOT?.waveSources || []).filter((_, i) => i !== index)
        setCurrentPayload({
            ...currentPayload,
            A: newWaves,
            GGEBOT: { ...(currentPayload.GGEBOT || { version: 1 }), waveSources: newSources }
        })
        setActiveWaveIndex(Math.max(0, index - 1))
    }

    // Slot Editor Helpers
    const handleUpdateSlot = (flankKey, typeKey, slotIdx, field, val) => {
        const next = JSON.parse(JSON.stringify(currentPayload))
        const wave = next.A[activeWaveIndex]
        if (!wave || !wave[flankKey]) return

        if (!wave[flankKey][typeKey]) {
            wave[flankKey][typeKey] = []
        }

        while (wave[flankKey][typeKey].length <= slotIdx) {
            wave[flankKey][typeKey].push([-1, 0])
        }

        if (field === 'id') {
            wave[flankKey][typeKey][slotIdx][0] = Number(val)
        } else if (field === 'amount') {
            wave[flankKey][typeKey][slotIdx][1] = Math.max(0, Number(val) || 0)
        }

        setCurrentPayload(next)
    }

    const handleAddSlot = (flankKey, typeKey) => {
        const next = JSON.parse(JSON.stringify(currentPayload))
        const wave = next.A[activeWaveIndex]
        if (!wave || !wave[flankKey]) return
        wave[flankKey][typeKey] = wave[flankKey][typeKey] || []
        wave[flankKey][typeKey].push([-1, 0])
        setCurrentPayload(next)
    }

    const handleRemoveSlot = (flankKey, typeKey, slotIdx) => {
        const next = JSON.parse(JSON.stringify(currentPayload))
        const wave = next.A[activeWaveIndex]
        if (!wave || !wave[flankKey] || !wave[flankKey][typeKey]) return
        wave[flankKey][typeKey].splice(slotIdx, 1)
        setCurrentPayload(next)
    }

    const handleWavePresetChange = (presetNum) => {
        const next = JSON.parse(JSON.stringify(currentPayload))
        next.GGEBOT ??= { version: 1, waveSources: [] }
        next.GGEBOT.waveSources ??= []
        while (next.GGEBOT.waveSources.length <= activeWaveIndex) {
            next.GGEBOT.waveSources.push({ type: "preset", presetNumber: 12 })
        }
        next.GGEBOT.waveSources[activeWaveIndex] = {
            type: "preset",
            presetNumber: Number(presetNum) || 0
        }
        setCurrentPayload(next)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Header with Title and Import/Export Controls */}
            <Card className="ea-card" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MilitaryTechIcon sx={{ color: '#38bdf8' }} />
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.15rem' }}>
                                Attack Templates & Wave Builder
                            </Typography>
                            <Chip
                                label={`${waves.length} Wave(s)`}
                                size="small"
                                sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
                            />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.3, display: 'block' }}>
                            Visually configure flanks, tools, and troop waves or paste/export raw %xt%...%cra%...% attack strings.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<FileUploadIcon />}
                            onClick={() => {
                                setImportText('')
                                setImportError('')
                                setImportDialogOpen(true)
                            }}
                            sx={{ borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8', textTransform: 'none', fontWeight: 600 }}
                        >
                            Import Packet
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ContentCopyIcon />}
                            onClick={handleCopyPacket}
                            sx={{ borderColor: 'rgba(255, 255, 255, 0.15)', color: '#e2e8f0', textTransform: 'none', fontWeight: 600 }}
                        >
                            Copy String
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckCircleOutlineIcon />}
                            onClick={handleSaveToBot}
                            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, fontWeight: 700, textTransform: 'none', px: 2 }}
                        >
                            Apply to Bot
                        </Button>
                    </Box>
                </Box>
            </Card>

            {/* Wave Selector & Options */}
            <Card className="ea-card" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.05)', flexWrap: 'wrap', gap: 1 }}>
                    <Tabs
                        value={activeWaveIndex}
                        onChange={(_, idx) => setActiveWaveIndex(idx)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            minHeight: 36,
                            '& .MuiTab-root': {
                                minHeight: 36,
                                py: 0.5,
                                px: 2,
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#94a3b8',
                                textTransform: 'none',
                                '&.Mui-selected': { color: '#38bdf8' }
                            },
                            '& .MuiTabs-indicator': { backgroundColor: '#38bdf8' }
                        }}
                    >
                        {waves.map((_, idx) => (
                            <Tab key={idx} label={`Wave ${idx + 1}`} />
                        ))}
                    </Tabs>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddWave}
                            sx={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', textTransform: 'none', fontSize: '0.75rem', py: 0.4 }}
                        >
                            Add Wave
                        </Button>
                        {waves.length > 1 && (
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteOutlineIcon />}
                                onClick={() => handleDeleteWave(activeWaveIndex)}
                                sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.4 }}
                            >
                                Delete Wave {activeWaveIndex + 1}
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* In-Game Preset Binding for this wave */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', p: 1.5, borderRadius: '6px', mb: 2, border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600 }}>
                        In-Game Wave Preset Number:
                    </Typography>
                    <TextField
                        size="small"
                        type="number"
                        value={currentPayload.GGEBOT?.waveSources?.[activeWaveIndex]?.presetNumber ?? 12}
                        onChange={e => handleWavePresetChange(e.target.value)}
                        sx={{
                            width: 100,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#0f151e',
                                fontSize: '0.82rem',
                                height: 32,
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' }
                            }
                        }}
                    />
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                        (Binds this wave to Empire in-game attack preset if available)
                    </Typography>
                </Box>

                {/* Flanks Grid: Left Flank | Middle | Right Flank */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                    {['L', 'M', 'R'].map(flankKey => {
                        const flankLabel = flankKey === 'L' ? 'Left Flank' : flankKey === 'M' ? 'Middle (Front)' : 'Right Flank'
                        const flankData = currentWave[flankKey] || { T: [], U: [] }

                        return (
                            <Box
                                key={flankKey}
                                sx={{
                                    bgcolor: '#0f1723',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    p: 1.5
                                }}
                            >
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', mb: 1.5, pb: 0.5, borderBottom: '1px solid rgba(56, 189, 248, 0.15)' }}>
                                    {flankLabel}
                                </Typography>

                                {/* Tools Section */}
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
                                            Tools ({flankData.T?.length || 0} slots)
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleAddSlot(flankKey, 'T')}
                                            sx={{ color: '#f59e0b', p: 0.3 }}
                                            title="Add Tool Slot"
                                        >
                                            <AddIcon sx={{ fontSize: '1rem' }} />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {(flankData.T || []).map(([toolId, count], sIdx) => {
                                            const selectedTool = TOOL_OPTIONS.find(t => t.id === Number(toolId)) || null
                                            return (
                                                <Box key={sIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Autocomplete
                                                        size="small"
                                                        options={TOOL_OPTIONS}
                                                        getOptionLabel={opt => `${opt.name} (#${opt.id})`}
                                                        value={selectedTool}
                                                        isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                                        onChange={(_, val) => handleUpdateSlot(flankKey, 'T', sIdx, 'id', val ? val.id : -1)}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                placeholder="Select Tool..."
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: '#0a0f16',
                                                                        fontSize: '0.78rem',
                                                                        height: 32,
                                                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        sx={{ flex: 1 }}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        placeholder="Qty"
                                                        value={count || 0}
                                                        onChange={e => handleUpdateSlot(flankKey, 'T', sIdx, 'amount', e.target.value)}
                                                        sx={{
                                                            width: 65,
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#0a0f16',
                                                                fontSize: '0.78rem',
                                                                height: 32,
                                                                '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }
                                                            }
                                                        }}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveSlot(flankKey, 'T', sIdx)}
                                                        sx={{ color: '#64748b', '&:hover': { color: '#ef4444' }, p: 0.3 }}
                                                    >
                                                        <DeleteOutlineIcon sx={{ fontSize: '0.9rem' }} />
                                                    </IconButton>
                                                </Box>
                                            )
                                        })}
                                        {(!flankData.T || flankData.T.length === 0) && (
                                            <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                                                No tool slots in this flank.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                {/* Units / Troops Section */}
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                                            Units / Soldiers ({flankData.U?.length || 0} slots)
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleAddSlot(flankKey, 'U')}
                                            sx={{ color: '#10b981', p: 0.3 }}
                                            title="Add Troop Slot"
                                        >
                                            <AddIcon sx={{ fontSize: '1rem' }} />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {(flankData.U || []).map(([troopId, count], sIdx) => {
                                            const selectedTroop = TROOP_OPTIONS.find(t => t.id === Number(troopId)) || null
                                            return (
                                                <Box key={sIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Autocomplete
                                                        size="small"
                                                        options={TROOP_OPTIONS}
                                                        getOptionLabel={opt => `${opt.name} (#${opt.id})`}
                                                        value={selectedTroop}
                                                        isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                                        onChange={(_, val) => handleUpdateSlot(flankKey, 'U', sIdx, 'id', val ? val.id : -1)}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                placeholder="Select Troop..."
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: '#0a0f16',
                                                                        fontSize: '0.78rem',
                                                                        height: 32,
                                                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        sx={{ flex: 1 }}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        placeholder="Qty"
                                                        value={count || 0}
                                                        onChange={e => handleUpdateSlot(flankKey, 'U', sIdx, 'amount', e.target.value)}
                                                        sx={{
                                                            width: 65,
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#0a0f16',
                                                                fontSize: '0.78rem',
                                                                height: 32,
                                                                '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }
                                                            }
                                                        }}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveSlot(flankKey, 'U', sIdx)}
                                                        sx={{ color: '#64748b', '&:hover': { color: '#ef4444' }, p: 0.3 }}
                                                    >
                                                        <DeleteOutlineIcon sx={{ fontSize: '0.9rem' }} />
                                                    </IconButton>
                                                </Box>
                                            )
                                        })}
                                        {(!flankData.U || flankData.U.length === 0) && (
                                            <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                                                No unit slots in this flank.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
            </Card>

            {/* Saved Attack Presets Library */}
            <Card className="ea-card" sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>
                    Saved Attack Presets Library
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                    Save multiple setups (e.g. Nomad, Samurai, Berimond, Tower) to quickly switch and apply anytime.
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Preset Name (e.g. Nomad 5-Wave Rush)"
                        value={presetNameInput}
                        onChange={e => setPresetNameInput(e.target.value)}
                        sx={{
                            flex: 1,
                            maxWidth: 360,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#0f151e',
                                fontSize: '0.82rem',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                            }
                        }}
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<BookmarkBorderIcon />}
                        onClick={handleSaveAsPreset}
                        disabled={!presetNameInput.trim()}
                        sx={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)', textTransform: 'none', fontWeight: 600 }}
                    >
                        Save Current Setup
                    </Button>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1.5 }}>
                    {savedPresets.map((preset, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                p: 1.5,
                                bgcolor: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box sx={{ pr: 1, overflow: 'hidden' }}>
                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {preset.name}
                                </Typography>
                                <Typography sx={{ fontSize: '0.68rem', color: '#64748b' }}>
                                    {preset.payload?.A?.length || 0} Waves • {preset.date}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleApplyPreset(preset)}
                                    sx={{ minWidth: 50, py: 0.3, px: 1, fontSize: '0.7rem', bgcolor: '#2563eb', textTransform: 'none' }}
                                >
                                    Load
                                </Button>
                                {savedPresets.length > 1 && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeletePreset(idx)}
                                        sx={{ color: '#64748b', '&:hover': { color: '#ef4444' }, p: 0.5 }}
                                    >
                                        <DeleteIcon sx={{ fontSize: '0.9rem' }} />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Card>

            {/* Import Dialog */}
            <Dialog
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { bgcolor: '#0f1723', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#38bdf8' }}>
                    Import Attack Template
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1.5, fontSize: '0.8rem' }}>
                        Paste any %xt%EmpireEx42%cra%1%...% packet or raw attack JSON object below:
                    </Typography>
                    <TextField
                        multiline
                        rows={8}
                        fullWidth
                        placeholder="%xt%EmpireEx42%cra%1%{...}%"
                        value={importText}
                        onChange={e => setImportText(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#0a0f16',
                                color: '#e2e8f0',
                                fontFamily: 'monospace',
                                fontSize: '0.78rem',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' }
                            }
                        }}
                    />
                    {importError && (
                        <Alert severity="error" sx={{ mt: 1.5, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
                            {importError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setImportDialogOpen(false)} sx={{ color: '#94a3b8' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleProcessImport}
                        disabled={!importText.trim()}
                        sx={{ bgcolor: '#38bdf8', color: '#0f1723', fontWeight: 700, '&:hover': { bgcolor: '#0284c7' } }}
                    >
                        Load Template
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Toast */}
            <Snackbar
                open={Boolean(feedbackMsg)}
                autoHideDuration={3500}
                onClose={() => setFeedbackMsg('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setFeedbackMsg('')} severity="success" sx={{ width: '100%', bgcolor: '#0284c7', color: '#fff' }}>
                    {feedbackMsg}
                </Alert>
            </Snackbar>
        </Box>
    )
}
