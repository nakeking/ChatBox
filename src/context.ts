import React, { useCallback, useReducer } from "react";

import type { themeInterface } from './hooks/useThemeHook'
import { getStore, setStore } from "./utils";
import type { Locale } from "antd/es/locale"

import zhCN from "antd/locale/zh_CN"
import enUS from 'antd/locale/en_US'
import { useTranslation } from "react-i18next";

enum ActionType {
    TOGGLE_THEME = "TOGGLE_THEME",
    SET_OPENAI_KEY = "SET_OPENAI_KEY",
    SET_LANGUAGE = "SET_LANGUAGE",
    ADD_DIALOGUE = "ADD_DIALOGUE",
    DEL_DIALOGUE = "DEL_DIALOGUE",
    RENAME_DIALOGUE = "RENAME_DIALOGUE"
}

const languages: Record<string, Locale> = {
    "en": enUS,
    "zh-cn": zhCN
}

interface DialogueType {
    id: number
    name: string
}

interface State {
    themeConfiguration?: themeInterface,

    OpenAIKey?: string,
    language?: Locale,

    Dialogues?: DialogueType[],
    Dialogue?: DialogueType
}

type Action<T> = {
    payload?: T
    type: ActionType
}

export const contextReducer = <T>(state: State, action: Action<T>): State => {
    const { type, payload } = action

    switch(type) {
        case ActionType.SET_OPENAI_KEY:
            setStore('OpenAIKey', payload)
            return {
                ...state,
                OpenAIKey: payload as string
            }
        case ActionType.TOGGLE_THEME:
            setStore("theme", payload)
            return {
                ...state,
                themeConfiguration: payload as themeInterface
            }
        case ActionType.SET_LANGUAGE:
            setStore("language", payload)
            return {
                ...state,
                language: languages[payload as string]
            }
        case ActionType.ADD_DIALOGUE:
        case ActionType.DEL_DIALOGUE:
        case ActionType.RENAME_DIALOGUE:
            return {
                ...state,

                Dialogues: payload as DialogueType[]
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
        language: languages[storeLanguage],

        Dialogues: []
    } as State)

    // ========== 设置 Theme =======================
    const _setTheme = useCallback((payload: themeInterface) => {
        dispatch({type: ActionType.TOGGLE_THEME, payload})
    }, [])

    // ========== 设置 OpenAIKey ====================
    const _setOpenAIKey = useCallback((payload: string) => {
        dispatch({type: ActionType.SET_OPENAI_KEY, payload})
    }, [])

    // =========== 设置 Language ===================
    const { i18n } = useTranslation()
    const _setLanguage = useCallback((payload: string) => {
        i18n.changeLanguage(payload)
        dispatch({type: ActionType.SET_LANGUAGE, payload})
    }, [])
    
    // =========== 新对话 ==========================
    const _addDialogue = useCallback(() => {
        const baseDialogue: DialogueType = {
            id: new Date().getTime(),
            name: "Untitled"
        }
        const dialogues = [baseDialogue, ...state.Dialogues!]

        dispatch({type: ActionType.ADD_DIALOGUE, payload: dialogues})
    }, [state.Dialogues])

    // ========== 删除对话 =========================
    const _delDialogue = useCallback((payload: number) => {
        const dialogues = state.Dialogues?.filter((d) => d.id !== payload);

        dispatch({type: ActionType.DEL_DIALOGUE, payload: dialogues})
    }, [state.Dialogues])

    // ========== 对话重命名 =======================
    const _renameDialogue = useCallback((payload: DialogueType) => {
        let { id, name } = payload;
        const dialogues = state.Dialogues?.map(item => {
            if (item.id === id) {
                item.name = name
            }
            return item
        })

        dispatch({type: ActionType.RENAME_DIALOGUE, payload: dialogues})
    }, [state.Dialogues])

    return {
        state,

        _setTheme,
        _setOpenAIKey,
        _setLanguage,
        _addDialogue,
        _delDialogue,
        _renameDialogue
    }
}

interface ChatBoxContextType {
    state: State

    _setTheme: (payload: themeInterface) => void
    _setOpenAIKey: (payload: string) => void
    _setLanguage: (payload: string) => void
    _addDialogue: () => void
    _delDialogue: (payload: number) => void
    _renameDialogue: (payload: DialogueType) => void
}

const ChatBoxContext = React.createContext<ChatBoxContextType>({
    state: {},

    _setTheme: () => {},
    _setOpenAIKey: () => {},
    _setLanguage: () => {},
    _addDialogue: () => {},
    _delDialogue: () => {},
    _renameDialogue: () => {}
});

export default ChatBoxContext;