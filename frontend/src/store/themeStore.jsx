import { useContext,useState } from "react";

import {createContext} from 'react'

const themeContext=createContext(null)

export const ThemeProvider=(props)=>{
    const [theme,setTheme]=useState("retro")

    const themeChange=()=>{
        const prevTheme= localStorage.getItem("chat-theme") || "coffee"
        setTheme(prevTheme)
    }
    const setThemeVal=(val)=>{
        setTheme(val)
        localStorage.setItem("chat-theme",val)

    }

    return (
        <themeContext.Provider value={{theme,setTheme,setThemeVal,themeChange}}>
            {props.children}
        </themeContext.Provider>
    )

}

export const useTheme=()=>{
    return useContext(themeContext)
}