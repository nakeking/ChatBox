import React, { FC, useEffect } from 'react';
import './App.less';
import ChatBoxContext, { useReducerContext } from "./context";

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
  const { state, _setTheme, _setOpenAIKey, _setLanguage } = useReducerContext()

  return (
    <ChatBoxContext.Provider value={{
      state,

      _setTheme,
      _setOpenAIKey,
      _setLanguage
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
