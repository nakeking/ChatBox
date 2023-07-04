import { useContext, useEffect, useState } from 'react'
import { theme } from 'antd'
import type { ThemeConfig } from 'antd'

import { getStore } from '../utils'
import ChatBoxContext from '../context'

export interface themeInterface {
  themeType?: themeType
  antdTheme?: ThemeConfig | undefined
}

export type themeType = 'light' | 'dark'

// 暗黑风格Theme
const darkTheme: themeInterface = {
  themeType: 'dark',
  antdTheme: {
    token: {
      colorPrimary: '#2e2e2e',
      colorBgLayout: '#2e2e2e',

      colorBgElevated: '#2e2e2e',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',

      colorText: 'rgba(255, 255, 255, 0.85)', // 一级文本色
      colorTextQuaternary: 'rgba(255, 255, 255, 0.25)' // 四级文本色
    },
    components: {
      Radio: {
        colorPrimary: '#1d1d1d',
        colorPrimaryBorder: '#1d1d1d',
        colorPrimaryHover: '#3c3c3c',
        controlOutline: 'rgba(0, 0, 0, 0.15)',
        colorTextLightSolid: '#fff',
        colorText: '#333'
      },
      Button: {
        colorBgTextHover: 'rgba(255, 255, 255, 0.12)',
        controlOutline: 'rgba(0, 0, 0, 0.15)',
        colorBgContainer: '#141414',
        colorPrimaryHover: '#3c3c3c'
      },
      Collapse: {
        colorBorder: '#333',
        colorBgContainer: '#1d1d1d'
      }
    }
  }
}

// 默认Theme
const lightTheme: themeInterface = {
  themeType: 'light',
  antdTheme: {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorBgLayout: '#ffffff'
    }
  }
}

export const themeConfigs: Record<themeType, themeInterface> = {
  light: lightTheme,
  dark: darkTheme
}

const useThemeHook = () => {
  const [_theme, setTheme] = useState<themeInterface>()
  const { state, _saveSettings } = useContext(ChatBoxContext)
  let { Settings } = state

  const handleToggleTheme = (type: themeType) => {
    setTheme(themeConfigs[type])

    Settings.theme = type
    _saveSettings(Settings)
  }

  return {
    _theme,
    handleToggleTheme
  }
}

export default useThemeHook
