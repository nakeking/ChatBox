import React, { FC, useEffect } from 'react';
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
    _delDialogue
  } = useReducerContext()

  const { i18n } = useTranslation()
  useEffect(() => {
    console.log("app 执行力")
    i18n.changeLanguage(state.language?.locale)
  }, [])

  return (
    <ChatBoxContext.Provider value={{
      state,

      _setTheme,
      _setOpenAIKey,
      _setLanguage,
      
      _addDialogue,
      _delDialogue
    }}>
      <div id='App' className={`App ` + state.themeConfiguration?.themeType}>
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
