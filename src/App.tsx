import React, { FC, useEffect, useLayoutEffect, useState } from 'react'
import './App.less'
import ChatBoxContext, { useReducerContext, languageMap } from './context'

import './utils/i18n'
import { useTranslation, Trans } from 'react-i18next'

import { themeConfigs } from './hooks/useThemeHook'

import Logo from './application/Logo/inex'
import Dialogues from './application/Dialogues'
import Options from './application/Options'
import Room from './application/Room'

import { ConfigProvider, Layout } from 'antd'
const { Content } = Layout

const App: FC = () => {
  const {
    state,

    _saveSettings,

    _addDialogue,
    _delDialogue,
    _renameDialogue,
    _toggleDialogue,
    _updateDialogueMsg
  } = useReducerContext()
  const { Settings } = state
  const { i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(Settings.language)
  }, [])

  const { theme } = Settings
  useLayoutEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ChatBoxContext.Provider
      value={{
        state,

        _saveSettings,

        _addDialogue,
        _delDialogue,
        _renameDialogue,
        _toggleDialogue,
        _updateDialogueMsg
      }}
    >
      <div id="App" className="App">
        <ConfigProvider
          locale={languageMap[Settings.language]}
          theme={themeConfigs[Settings.theme].antdTheme}
        >
          <Layout className="Layout">
            <div className="Sider">
              <Logo />
              <Dialogues />
              <Options />
            </div>
            <Content className="Content">
              <Room />
            </Content>
          </Layout>
        </ConfigProvider>
      </div>
    </ChatBoxContext.Provider>
  )
}

export default App
