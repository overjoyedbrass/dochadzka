import { Dialog, DialogTitle, DialogContent, FormControl, TextField, Button, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import React from 'react'
import { clamp } from '../../helpers/helpers.js'


export const AddHolidayDialog = ({onClose, year, open}) => {
    const [day, setDay] = React.useState(1)
    const [month, setMonth] = React.useState(1)
    const [name, setName] = React.useState("")

    function submit(e){
        e.preventDefault()
        console.log("submit")
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <span style={{paddingRight:"1em"}}>Pridať voľný deň do roku {year}{"\t\t"}</span>
                <IconButton 
                    onClick={onClose}
                    sx={{position:'absolute', top:"4px", right:"4px"}}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
            <FormControl 
                style={{maxWidth: "20em", width:"100%", display: 'flex', alignItems: 'flex-end'}}
            >
                <div className="labelWithInput">
                <label htmlFor="day">Deň: </label>
                <TextField 
                    id="day"
                    size="small"
                    value={day}
                    type="number"
                    style={{width: "4em"}}
                    onChange={(e) => setDay(clamp(1, parseInt(e.target.value), 31))}
                />
                </div>

                <div className="labelWithInput">
                <label htmlFor="month">Mesiac: </label>
                <TextField
                    id="month"
                    size="small"
                    value={month}
                    type="number"
                    style={{width: "4em"}}
                    onChange={(e) => setMonth(clamp(1, parseInt(e.target.value), 12))}
                />
                </div>

                <TextField
                    id="name"
                    size="small"
                    value={name}
                    label="Názov voľného dňa"
                    multiline
                    sx={{width: "100%"}}
                    onChange={(e) => setName(e.target.value)}
                />

                <Button 
                    onClick={submit} 
                    type="submit" 
                    variant="contained" 
                    color="success" 
                    style={{width: "fit-content", marginTop: "1em"}}
                    sx={{float:"right"}}
                >
                    Pridať
                </Button>
            </FormControl>
            </DialogContent>
        </Dialog>
    )
}