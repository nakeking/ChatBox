import React, { FC, useEffect, useState, useMemo, useContext } from 'react';
import './App.less';
import ChatBoxContext from "./context";

import Logo from './application/Logo/inex';
import Dialogues from './application/Dialogues';
import Options from './application/Options';

import zhCN from "antd/locale/zh_CN"
import { 
  ConfigProvider, 
  Layout,
} from "antd"
import useThemeHook from './hooks/useThemeHook';
import Room from './application/Room';
const { Sider, Content } = Layout

const App: FC = () => {
  const { _theme, handleToggleTheme } = useThemeHook()

  return (
    <ChatBoxContext.Provider value={{
      themeConfiguration: _theme,
      _ToggleTheme: handleToggleTheme
    }}>
      <div className={`App ` + _theme?.themeType}>
        <ConfigProvider 
          locale={zhCN}
          theme={_theme?.antdTheme}>
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
