import { useEffect, useState } from "react"
import { theme } from 'antd'
import type { ThemeConfig } from 'antd'

import { delStore, getStore, setStore } from "../utils"

export interface themeInterface {
    themeType?: themeType
    antdTheme?: ThemeConfig | undefined
}

export type themeType = "light" | "dark"

// 暗黑风格Theme
export const darkTheme: themeInterface = {
    themeType: "dark",
    antdTheme: {
        token: {
            colorPrimary: '#333333',
            colorBgLayout: "#2e2e2e",
    
            colorBgElevated: "#333333",
            colorBgMask: "rgba(0, 0, 0, 0.45)",
    
            colorText: "rgba(255, 255, 255, 0.85)",
        },
        components: {
            Radio: {
                colorPrimary: "#1d1d1d",
                colorPrimaryBorder: "#1d1d1d",
                colorPrimaryHover: "#3c3c3c",
                controlOutline: "rgba(0, 0, 0, 0.15)",
                colorTextLightSolid: "#fff",
                colorText: "#333"
            },
            Button: {
              colorBgTextHover: "rgba(255, 255, 255, 0.12)",
              controlOutline: "rgba(0, 0, 0, 0.15)",
              colorBgContainer: "#141414",
              colorPrimaryHover: "#3c3c3c"
            }
        }
    }
}

// 默认Theme
export const lightTheme: themeInterface = {
    themeType: "light",
    antdTheme: {
        algorithm: theme.defaultAlgorithm,
        token: {
            colorBgLayout: "#ffffff"
        }
    }
}

const useThemeHook = () => {
    const [_theme, setTheme] = useState<themeInterface>()

    useEffect(() => {
        const storedTheme = getStore('theme');

        if(storedTheme) {
            setTheme(storedTheme)
        }
    }, [])

    useEffect(() => {
        if(_theme) {
            setStore('theme', _theme)
        }
    }, [_theme])

    const handleToggleTheme = (type: themeType) => {
        const themes = {
            dark: darkTheme,
            light: lightTheme
        }

        setTheme(themes[type])
    }

    return {
        _theme,
        handleToggleTheme
    }
}

export default useThemeHook