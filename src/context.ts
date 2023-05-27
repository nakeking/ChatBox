import React from "react";

import { themeType, themeInterface } from './hooks/useThemeHook'
export interface ContextProps {
    themeConfiguration?: themeInterface | null,
    _ToggleTheme: (type: themeType) => void
}
  
const ChatBoxContext = React.createContext<ContextProps>({
    themeConfiguration: null,
    _ToggleTheme: () => {}
});

export default ChatBoxContext;