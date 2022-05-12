import { createTheme } from '@mui/material/styles'
import { red, yellow, orange, green, blue, purple, pink } from '@mui/material/colors'


export const appTheme = createTheme({
    palette: {
        primary: {
            main: "#2c6ad4",
            highlight: "#c7dcff"
        },
        secondary: {
            light: "#ff5c8d",
            main: "#d81b60",
            dark: "#a00037",
            contrastText: "#000",
        },
        holiday: {
            main: "",
            color: red[700]
        }
    },
    gui: {
        primary: "#ffffff",
        border: "lightgray",
        picked: "#faff9c",
        weekend: "#efefef",      
        absence: {
            1: red[200],
            2: yellow[400],
            3: orange[400],
            4: green[400],
            5: blue[400],
            6: purple[400],
            7: pink[400]
        }
    },
    text: {
        absence: {
            1: "black",
            2: "black",
            3: "black",
            4: "white",
            5: "white",
            6: "white",
            7: "white",
        }
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: "1em"
                }
            }
        },
    },
})


