import * as React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PluginsTable from './pluginsTable'
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
        switch(obj2.nodeName) {
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

export default function UserSettings({ __, selectedUser, channels, plugins, ws, closeBackdrop }) {
    selectedUser.name ??= ""
    selectedUser.plugins ??= {}
    const isNewUser = selectedUser.name === ""
    const [name, setName] = React.useState(selectedUser.name)
    const [pass, setPass] = React.useState("")
    const [server, setServer] = React.useState(selectedUser.server ?? instances[0]?.id)
    const [externalEvent, setExternalEvent] = React.useState(selectedUser.externalEvent)

    const handleSave = () => {
        for (const key in selectedUser.plugins) {
            if (Object.keys(selectedUser.plugins[key]).length === 0)
                delete selectedUser.plugins[key]
        }
        let obj = {
            name: name,
            pass: pass,
            server: server,
            plugins: selectedUser.plugins,
            externalEvent: externalEvent,
            state: selectedUser.state
        }
        if (!isNewUser) {
            obj.id = selectedUser.id
            if (pass === "") obj.pass = selectedUser.pass
        }

        ws.send(JSON.stringify([
            ErrorType.Success,
            isNewUser ? ActionType.AddUser : ActionType.SetUser,
            obj
        ]))

        closeBackdrop()
    }

    return (
        <Dialog
            open={true}
            onClose={closeBackdrop}
            maxWidth="md"
            fullWidth
            PaperProps={{
                className: 'glass-panel',
                sx: {
                    bgcolor: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    backgroundImage: 'none',
                    maxHeight: '92vh',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1.5,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountCircleIcon sx={{ color: '#38bdf8' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc' }}>
                        {isNewUser ? __("Add Game Account") || "Add Game Account" : `${__("Account Settings") || "Settings"} - ${name}`}
                    </Typography>
                </Box>
                <IconButton onClick={closeBackdrop} size="small" sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#fff' } }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* Content */}
            <DialogContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5, overflowY: 'auto' }}>
                {/* Account Credentials Panel */}
                <Box
                    sx={{
                        p: 2,
                        borderRadius: '12px',
                        bgcolor: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <TextField
                        required
                        size="small"
                        label={__("username")}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={!isNewUser}
                        sx={{ flex: '1 1 180px', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                    <TextField
                        required
                        size="small"
                        label={__("password")}
                        type="password"
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        placeholder={!isNewUser ? "Leave empty to keep unchanged" : ""}
                        sx={{ flex: '1 1 180px', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                    <FormControl size="small" sx={{ flex: '1 1 180px' }}>
                        <InputLabel required id="server-select-label">{__("server")}</InputLabel>
                        <Select
                            labelId="server-select-label"
                            value={server}
                            onChange={e => setServer(e.target.value)}
                            label={__("server")}
                            sx={{ borderRadius: '8px' }}
                        >
                            {instances.map((srv, i) => (
                                <MenuItem value={srv.id} key={i}>
                                    {__(srv.instanceLocaId) + ' ' + srv.instanceName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={Boolean(externalEvent)}
                                onChange={e => setExternalEvent(e.target.checked)}
                                sx={{ color: 'rgba(255, 255, 255, 0.4)', '&.Mui-checked': { color: '#38bdf8' } }}
                            />
                        }
                        label={<Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>OR/BTH Proxy</Typography>}
                        sx={{ m: 0 }}
                    />
                </Box>

                {/* Automation & Plugins Section */}
                <Box>
                    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                            Automation & Plugin Strategy
                        </Typography>
                    </Box>
                    <PluginsTable plugins={plugins} userPlugins={selectedUser.plugins} channels={channels} __={__} />
                </Box>
            </DialogContent>

            {/* Footer Actions */}
            <DialogActions
                sx={{
                    p: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1.5
                }}
            >
                <Button onClick={closeBackdrop} sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 600 }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{
                        bgcolor: '#0284c7',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 3,
                        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                        '&:hover': { bgcolor: '#0369a1' }
                    }}
                >
                    {__("save")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}