import React from 'react'
import { format } from 'date-fns'
import { Button, Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material'
import { Close } from '@mui/icons-material'
import { getTickets } from '../../helpers/helpers'

export const HolidayTickets = ({absences, userId}) => {
    const [open, setOpen] = React.useState(false)
    const close = () => setOpen(false)
    const tickets = getTickets(absences, userId)
    return (<>
        <Button onClick={() => setOpen(true)} variant="outlined">Dovolenkové lístky</Button>

        <Dialog
            open={open}
            onClose={close}
        >
            <DialogTitle style={{marginRight: "2em"}}>
                Dovolenkové lístky na vytlačenie
            </DialogTitle>
            <IconButton
                onClick={close}
                sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                <Close />
            </IconButton>
            <DialogContent>
                {tickets.length ? null :
                <p>Žiadne lístky na vytlačenie</p>
                }
                {tickets.map((t, i) => <Ticket key={i} ticket={t}/>)}
            </DialogContent>
        </Dialog>
    </>
    )
}



const Ticket = ({ticket}) => {
    return (<div className="ticket">
        <p> {format(ticket.from_date, "d.")}&nbsp;- {format(ticket.to_date, "d. M. yyyy")} </p>
        <div className="wrapper">
            <i>{!ticket.printed ? "Nevytlačený" : "Už vytlačený"}</i>
            <Button variant="outlined" sx={{height: "2em"}}>{ticket.printed ? "Vytlačiť znovu" : "Vylačiť"}</Button>
        </div>
    </div>)
}