import React, { FC } from 'react';
import './App.less';
import ChatBoxContext, { useReducerContext } from "./context";

import Logo from './application/Logo/inex';
import Dialogues from './application/Dialogues';
import Options from './application/Options';
import Room from './application/Room';

import zhCN from "antd/locale/zh_CN"
import { 
  ConfigProvider, 
  Layout,
} from "antd"
const { Content } = Layout

const App: FC = () => {
  const { state, _setTheme, _setOpenAIKey } = useReducerContext()

  return (
    <ChatBoxContext.Provider value={{
      state,

      _setTheme,
      _setOpenAIKey
    }}>
      <div className={`App ` + state.themeConfiguration?.themeType}>
        <ConfigProvider 
          locale={zhCN}
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
