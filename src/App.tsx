import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import './App.less';
import ChatBoxContext, { useReducerContext } from "./context";

import "./utils/i18n"
import { useTranslation, Trans } from 'react-i18next';

import Logo from './application/Logo/inex';
import Dialogues from './application/Dialogues';
import Options from './application/Options';
import Room from './application/Room';

import { 
  ConfigProvider, 
  Layout,
} from "antd"
const { Content } = Layout

const App: FC = () => {
  const { 
    state, 
    
    _setTheme, 
    _setOpenAIKey, 
    _setLanguage,

    _addDialogue,
    _delDialogue,
    _renameDialogue
  } = useReducerContext()
  const { i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(state.language?.locale)
  }, [])

  const { themeConfiguration } = state
  useLayoutEffect(() => {
    const themeType = themeConfiguration?.themeType || 'light'
    document.querySelector("html")?.setAttribute("data-theme", themeType)
  }, [themeConfiguration?.themeType])

  return (
    <ChatBoxContext.Provider value={{
      state,

      _setTheme,
      _setOpenAIKey,
      _setLanguage,
      
      _addDialogue,
      _delDialogue,
      _renameDialogue
    }}>
      <div id='App' className="App">
        <ConfigProvider 
          locale={state.language}
          theme={state.themeConfiguration?.antdTheme} >
          <Layout className='Layout'>
            <div className='Sider'>
              <Logo />
              <Dialogues />
              <Options />
            </div>
            <Content className='Content'>
              <Room />
            </Content>
          </Layout>
        </ConfigProvider>
      </div>
    </ChatBoxContext.Provider>
  );
}

export default App;
