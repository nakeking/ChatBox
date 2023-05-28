import React, { useCallback, useReducer } from "react";

import type { themeInterface } from './hooks/useThemeHook'
import { getStore } from "./utils";

const TOGGLETHEME = "TOGGLETHEME"
const SETOPENAIKEY = "SETOPENAIKEY"

interface State {
    themeConfiguration?: themeInterface,
    OpenAIKey?: string
}

type Action<T> = {
    payload: T
    type: typeof TOGGLETHEME | typeof SETOPENAIKEY
}

export const contextReducer = <T>(state: State, action: Action<T>): State => {
    const { type, payload } = action

    switch(type) {
        case SETOPENAIKEY:
            return {
                ...state,
                OpenAIKey: payload as string
            }
        case TOGGLETHEME:
            return {
                ...state,
                themeConfiguration: payload as themeInterface
            }
        default:
            break;
    }

    return state
}

export const useReducerContext = () => {
    const storedTheme = getStore('theme');
    
    const [state, dispatch] = useReducer(contextReducer, {
        themeConfiguration: storedTheme,
        OpenAIKey: ""
    } as State)

    const _setTheme = useCallback((payload: themeInterface) => {
        dispatch({type: TOGGLETHEME, payload})
    }, [])

    const _setOpenAIKey = useCallback((payload: string) => {
        dispatch({type: SETOPENAIKEY, payload})
    }, [])

    return {
        state,
        _setTheme,
        _setOpenAIKey
    }
}

interface IState {
    state?: State,
    _setTheme: (payload: themeInterface) => void;
    _setOpenAIKey: (payload: string) => void;
}

const ChatBoxContext = React.createContext<IState>({
    _setTheme: () => {},
    _setOpenAIKey: () => {}
});

export default ChatBoxContext;