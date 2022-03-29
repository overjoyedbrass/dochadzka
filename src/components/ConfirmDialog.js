import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogTitle,
    Button
} from '@mui/material'

export const ConfirmDialog = ({open, question, noAction, yesAction, noText, yesText}) => {
    return (
        <Dialog
            open={open}
        >
            <DialogTitle>
                {question}
            </DialogTitle>
            <DialogContent>
                <div style={{width:"100%", display: 'flex', justifyContent: 'space-between'}}>
                    <Button
                        onClick={noAction}
                        variant="outlined"
                    >
                        {noText}
                    </Button>
                    <Button
                        onClick={yesAction}
                        variant="contained"
                        color="error"
                    >
                        {yesText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}