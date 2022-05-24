import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import React from 'react'
import { clamp, lastDayOfMonth } from '../../helpers/helpers.js'
import { useInsertHolidayMutation } from '../api/holidaySlice.js'
import { toast } from 'react-toastify'
import format from 'date-fns/esm/format'
import { Spinner } from '../../components/Spinner'
export const AddHolidayDialog = ({onClose, year, open}) => {
    const [date, setDate] = React.useState({
        day: 1,
        month: 1
    })
    const [description, setDescription] = React.useState("")

    const [insertHoliday , { isLoading }] = useInsertHolidayMutation()

    function setNewDate(e){
        const isDay = e.target.name === "day"
        if(!e.target.value){
            setDate({
                day: isDay ? e.target.value : date.day,
                month: isDay ? date.month : e.target.value
            })
            return
        }
        setDate({
            day: clamp(1, isDay ? e.target.value ?? 1 : date.day, lastDayOfMonth(isDay ? date.month : e.target.value ?? 1, year)),
            month: clamp(1, isDay ? date.month : e.target.value ?? 1, 12)
        })
    }

    async function submit(e){
        e.preventDefault()
        try {
            await insertHoliday({
                date_time: format(new Date(year, date.month-1, date.day), "yyyy-MM-dd"),
                description: description
            }).unwrap()
            toast("Voľný deň úspešné pridaný", {type: "success", id: 33, position: toast.POSITION.TOP})
            onClose()
        }
        catch(err){
            console.log(err)
            toast("Voľný deň sa nepodarilo pridať", {type: "error", id: 33, position: toast.POSITION.TOP})
        }
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
            <form onSubmit={submit}
                style={{maxWidth: "20em", width:"100%", display: 'flex', alignItems: 'flex-end'}}
                className="form-general"
            >
                <div className="labelWithInput">
                <label htmlFor="day">Deň: </label>
                <TextField 
                    required={true}
                    id="day"
                    name="day"
                    size="small"
                    value={date.day}
                    type="number"
                    style={{width: "5em"}} 
                    onChange={setNewDate}
                />
                </div>

                <div className="labelWithInput">
                <label htmlFor="month">Mesiac: </label>
                <TextField
                    required={true}
                    id="month"
                    name="month"
                    size="small"
                    value={date.month}
                    type="number"
                    style={{width: "5em"}}
                    onChange={setNewDate}
                />
                </div>

                <TextField
                    id="name"
                    size="small"
                    value={description}
                    label="Názov voľného dňa"
                    required={true}
                    sx={{width: "100%"}}
                    onChange={(e) => setDescription(e.target.value)}
                />
                { isLoading ? <Spinner /> :
                <Button
                    type="submit" 
                    variant="contained" 
                    color="success" 
                    style={{width: "fit-content", marginTop: "1em"}}
                    sx={{float:"right"}}
                >
                    Pridať
                </Button>}
            </form>
            </DialogContent>
        </Dialog>
    )
}