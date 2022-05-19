import React from 'react'
import { format } from 'date-fns'
import { Button, Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material'
import { Close } from '@mui/icons-material'
import { getTickets } from '../../helpers/helpers'
import { useGetTicketsQuery, usePrintTicketMutation } from '../api/apiSlice'
import { toast } from 'react-toastify'
import { Spinner } from '../../components/Spinner'
import { parseISO } from 'date-fns'
import { selectImpersonatedUser } from '../auth/authSlice'
import { useSelector } from 'react-redux'
import { AbsenceAuthor } from './AbsenceAuthor'
export const HolidayTickets = ({absences, userId, viewDate}) => {
    const [open, setOpen] = React.useState(false)
    const close = () => setOpen(false)

    const impersonated = useSelector(selectImpersonatedUser)
    const tickets = getTickets(absences, impersonated ? impersonated : userId)


    const { data: printedTickets={} } = useGetTicketsQuery({month: viewDate.getMonth()+1, year: viewDate.getFullYear(), user_id: userId})

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
                {impersonated ? <>Lístky pre <AbsenceAuthor fullName={true} userId={impersonated}/></> :
                "Vaše lístky" }
                {tickets.length ? null :
                <p>Žiadne lístky na vytlačenie</p>
                }
                {tickets.map((t, i) => 
                    <Ticket 
                        key={i} 
                        ticket={t} 
                        lastPrinted={
                            printedTickets[`${userId}.${format(t.from_date, "yyyy-MM-dd")}`]
                        }
                />)}
            </DialogContent>
        </Dialog>
    </>
    )
}



const Ticket = ({ ticket, lastPrinted}) => {
    const [ printTicket, { isLoading }] = usePrintTicketMutation()
    async function print(e){
        e.preventDefault()
        try {
            const copy = {...ticket}
            copy.from_date = format(ticket.from_date, "yyyy-MM-dd")
            copy.to_date = format(ticket.to_date, "yyyy-MM-dd")
            await printTicket(copy).unwrap()
            toast("Lístok vytlačený", { type: "success" })
        } catch (err) {
            toast("Lístok sa nepodarilo vytlačiť", { type: "error" })
        }
    }

    return (<div className="ticket">
        <p> {format(ticket.from_date, "d.")}&nbsp;- {format(ticket.to_date, "d. M. yyyy")} </p>
        <div className="wrapper">
            <i>{lastPrinted ? `Vytlačený ${format(parseISO(lastPrinted.last_printed), "d.M.")}` : "Nevytlačený"}</i>
            { isLoading ? <Spinner /> :
            <Button 
                variant="outlined" 
                sx={{height: "2em"
                }}
                onClick={print}
            >
                {lastPrinted ? "Vytlačiť znovu" : "Vylačiť"}
            </Button> }
        </div>
    </div>)
}