import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { MessageBox } from './MessageBox'

const NoPathMatch = () => {
    const navigate = useNavigate()
    return (
        <main style={{
            display: "flex",
            flexFlow: "column",
            justifyContent: "center"
        }}>
            <MessageBox 
                message="Cesta neexistuje"
            />
            <Button onClick={() => navigate("/")}>Späť na hlavnú stránku</Button>
        </main>
    )
}

export default NoPathMatch