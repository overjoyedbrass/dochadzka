import { createTheme } from '@mui/material/styles'



export const mainTheme = createTheme({
    palette: {
        primary: {
            light: "#84b7ff",
            main: "#1976d2",
            dark: "#004ba0",
            contrastText: "#000",
        },
        secondary: {
            light: "#ff5c8d",
            main: "#d81b60",
            dark: "#a00037",
            contrastText: "#000",
        }
    }
})

export const guiColors = {
    primary: "#ffffff",
    border: "lightgray",
    picked: "#faff9c",
    weekend: "#efefef",
}