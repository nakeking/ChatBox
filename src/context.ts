import React, { useCallback, useReducer } from "react";
import { v4 as uuidv4 } from 'uuid'

import type { themeInterface, themeType } from './hooks/useThemeHook'
import { JSONToMap, MapToJSON, delStore, getStore, setStore } from "./utils";
import type { Locale } from "antd/es/locale"

import zhCN from "antd/locale/zh_CN"
import enUS from 'antd/locale/en_US'
import { useTranslation } from "react-i18next";

import type { DialogueType, DialoguesType, Message } from './types'

enum ActionType {
    SETTINGS = "SETTINGS",

    TOGGLE_THEME = "TOGGLE_THEME",
    SET_OPENAI_KEY = "SET_OPENAI_KEY",
    SET_LANGUAGE = "SET_LANGUAGE",

    ADD_DIALOGUE = "ADD_DIALOGUE",
    DEL_DIALOGUE = "DEL_DIALOGUE",
    RENAME_DIALOGUE = "RENAME_DIALOGUE",

    TOGGLE_DIALOGUE = "TOGGLE_DIALOGUE"
}

type LanguageType = "en" | "zh-cn"

interface SettingsType {
    theme: themeType
    OpenAIKey?: string,
    language: LanguageType,
    model?: string
}

interface State {
    Settings: SettingsType

    Dialogues?: DialoguesType,
    CurrentDialogueID?: string,

    FlattenDialogues?: Map<number, unknown>
}

type Action<T> = {
    payload?: T
    type: ActionType
}

export const languages: Record<string, Locale> = {
    "en": enUS,
    "zh-cn": zhCN
}

const msgTemplate: Message = {
    id: uuidv4(),
    role: "system",
    content: "You are a helpful assistant. You can help me by answering my questions. You can also ask me questions."
}

const baseSettings: SettingsType = {
    theme: "light",
    language: "en",
    OpenAIKey: "",
    model: "gpt-3.5-turbo"
}

export const contextReducer = <T>(state: State, action: Action<T>): State => {
    const { type, payload } = action

    switch(type) {
        case ActionType.SETTINGS:
            setStore('Settings', payload)
            return {
                ...state,
                Settings: payload as SettingsType
            }
        case ActionType.ADD_DIALOGUE:
        case ActionType.DEL_DIALOGUE:
        case ActionType.RENAME_DIALOGUE:
            setStore("Dialogues", MapToJSON(payload as Map<string, DialogueType>))
            return {
                ...state,

                Dialogues: payload as Map<string, DialogueType>
            }
        case ActionType.TOGGLE_DIALOGUE:
            return {
                ...state,

                CurrentDialogueID: payload as string
            }
        default:
            break;
    }

    return state
}

export const useReducerContext = () => {
    const storeSettings = getStore('Settings') || baseSettings;
    const storeDialogues = getStore('Dialogues') ? JSONToMap(getStore('Dialogues')!)  : new Map()
    
    const [state, dispatch] = useReducer(contextReducer, {
        Settings: storeSettings,

        Dialogues: storeDialogues,
        Dialogue: {}
    } as State)

    // =========== Settings =======================
    const { i18n } = useTranslation()
    const _saveSettings = useCallback((payload: SettingsType) => {
        i18n.changeLanguage(payload.language)
        dispatch({type: ActionType.SETTINGS, payload})
    }, [state.Settings])
    
    // =========== 新对话 ==========================
    const _addDialogue = useCallback(() => {
        const { Dialogues } = state
        const id = uuidv4()

        Dialogues?.set(id, {
            id,
            name: "Untitled",
            messages: [msgTemplate]
        })

        dispatch({type: ActionType.ADD_DIALOGUE, payload: Dialogues})
        
        // 新建对话时激活
        _toggledialogue(id)
    }, [state.Dialogues])

    // ========== 删除对话 =========================
    const _delDialogue = useCallback((payload: string) => {
        const { Dialogues } = state
        Dialogues?.delete(payload)

        dispatch({type: ActionType.DEL_DIALOGUE, payload: Dialogues})
    
        // 当前删除Dialogue === 当前激活dialogue
        // 需要切换当前激活的Dialogue
        // 待完成

    }, [state.Dialogues])

    // ========== 对话重命名 =======================
    const _renameDialogue = useCallback((payload: DialogueType) => {
        let { id } = payload
        const { Dialogues } = state

        Dialogues?.set(id, payload)
        dispatch({type: ActionType.RENAME_DIALOGUE, payload: Dialogues})
    }, [state.Dialogues])

    // 激活当前对话
    const _toggledialogue = useCallback((payload: string) => {
        dispatch({type: ActionType.TOGGLE_DIALOGUE, payload})
    }, [])

    return {
        state,
        _saveSettings,

        _addDialogue,
        _delDialogue,
        _renameDialogue,
        _toggledialogue
    }
}

interface ChatBoxContextType {
    state: State

    _saveSettings: (payload: SettingsType) => void

    _addDialogue: () => void
    _delDialogue: (payload: string) => void
    _renameDialogue: (payload: DialogueType) => void
    _toggledialogue: (payload: string) => void
}

const ChatBoxContext = React.createContext<ChatBoxContextType>({
    state: {
        Settings: baseSettings
    },
    _saveSettings: () => {},

    _addDialogue: () => {},
    _delDialogue: () => {},
    _renameDialogue: () => {},
    _toggledialogue: () => {}
});

export default ChatBoxContext;