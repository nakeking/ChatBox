import React, { useCallback, useReducer } from "react";

import type { themeInterface } from './hooks/useThemeHook'
import { getStore, setStore } from "./utils";
import type { Locale } from "antd/es/locale"

import zhCN from "antd/locale/zh_CN"
import enUS from 'antd/locale/en_US'

const TOGGLETHEME = "TOGGLETHEME"
const SETOPENAIKEY = "SETOPENAIKEY"
const SETLANGUAGE = "SETLANGUAGE"

const languages: Record<string, Locale> = {
    "en": enUS,
    "zh-cn": zhCN
}

interface State {
    themeConfiguration?: themeInterface,

    OpenAIKey?: string,
    language?: Locale
}

type Action<T> = {
    payload: T
    type: typeof TOGGLETHEME | typeof SETOPENAIKEY | typeof SETLANGUAGE
}

export const contextReducer = <T>(state: State, action: Action<T>): State => {
    const { type, payload } = action

    switch(type) {
        case SETOPENAIKEY:
            setStore('OpenAIKey', payload)
            return {
                ...state,
                OpenAIKey: payload as string
            }
        case TOGGLETHEME:
            setStore("theme", payload)
            return {
                ...state,
                themeConfiguration: payload as themeInterface
            }
        case SETLANGUAGE:
            setStore("language", payload)
            return {
                ...state,
                language: languages[payload as string]
            }
        default:
            break;
    }

    return state
}

export const useReducerContext = () => {
    const storedTheme = getStore('theme');
    const stroedOpenAIKey = getStore('OpenAIKey')
    const storeLanguage = getStore('language') || "en"
    
    const [state, dispatch] = useReducer(contextReducer, {
        themeConfiguration: storedTheme,
        OpenAIKey: stroedOpenAIKey,
        language: languages[storeLanguage]
    } as State)

    const _setTheme = useCallback((payload: themeInterface) => {
        dispatch({type: TOGGLETHEME, payload})
    }, [])

    const _setOpenAIKey = useCallback((payload: string) => {
        dispatch({type: SETOPENAIKEY, payload})
    }, [])

    const _setLanguage = useCallback((payload: string) => {
        dispatch({type: SETLANGUAGE, payload})
    }, [])

    return {
        state,
        _setTheme,
        _setOpenAIKey,
        _setLanguage
    }
}

interface IState {
    state?: State
    _setTheme: (payload: themeInterface) => void
    _setOpenAIKey: (payload: string) => void
    _setLanguage: (payload: string) => void
}

const ChatBoxContext = React.createContext<IState>({
    _setTheme: () => {},
    _setOpenAIKey: () => {},
    _setLanguage: () => {}
});

export default ChatBoxContext;