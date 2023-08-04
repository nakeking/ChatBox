import React, { useCallback, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'

import type { themeType } from './hooks/useThemeHook'
import { JSONToMap, MapToJSON, delStore, getStore, setStore } from './utils'
import type { Locale } from 'antd/es/locale'

import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { useTranslation } from 'react-i18next'

import {
  messageTemplate,
  type DialogueType,
  type DialoguesType,
  Message,
  type PartialByKeys
} from './types'

enum ActionType {
  SETTINGS = 'SETTINGS',

  TOGGLE_THEME = 'TOGGLE_THEME',
  SET_OPENAI_KEY = 'SET_OPENAI_KEY',
  SET_LANGUAGE = 'SET_LANGUAGE',

  ADD_DIALOGUE = 'ADD_DIALOGUE',
  DEL_DIALOGUE = 'DEL_DIALOGUE',
  RENAME_DIALOGUE = 'RENAME_DIALOGUE',
  UPDATE_DIALOGUES = 'UPDATE_DIALOGUES',

  UPDATE_DIALOGUE = 'UPDATE_DIALOGUE'
}

type LanguageType = 'en' | 'zh-cn'

interface SettingsType {
  theme: themeType
  OpenAIKey?: string
  language: LanguageType
  model?: string

  temperature: number
  maxContextSize: string
  maxTokens: string
}

interface State {
  Settings: SettingsType

  Dialogues: DialoguesType
  currentDialogue: DialogueType
}

type Action<T> = {
  payload?: T
  type: ActionType
}

export const languageMap: Record<string, Locale> = {
  en: enUS,
  'zh-cn': zhCN
}

// 默认设置
const baseSettings: SettingsType = {
  theme: 'light',
  language: 'en',
  OpenAIKey: '',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxContextSize: '4000',
  maxTokens: '2048'
}

// 默认Dialogue模板
const initDialogues = (): DialoguesType => {
  const id = uuidv4()

  let Dialogues: DialoguesType = new Map()
  Dialogues.set(id, messageTemplate(id))

  return Dialogues
}

export const contextReducer = <T>(state: State, action: Action<T>): State => {
  const { type, payload } = action

  switch (type) {
    case ActionType.SETTINGS:
      setStore('Settings', JSON.stringify(payload))
      return {
        ...state,
        Settings: payload as SettingsType
      }
    case ActionType.ADD_DIALOGUE:
    case ActionType.DEL_DIALOGUE:
    case ActionType.RENAME_DIALOGUE:
    case ActionType.UPDATE_DIALOGUES:
      setStore('Dialogues', MapToJSON(payload as Map<string, DialogueType>))
      return {
        ...state,

        Dialogues: payload as Map<string, DialogueType>
      }
    case ActionType.UPDATE_DIALOGUE:
      return {
        ...state,

        currentDialogue: payload as DialogueType
      }
    default:
      break
  }

  return state
}

export const useContextReducer = () => {
  // ========= 初始化 State ===================================
  // const storeSettings = getStore('Settings') || baseSettings
  const storeSettings = getStore('Settings')
    ? JSON.parse(getStore('Settings')!)
    : baseSettings

  const storeDialogues = getStore('Dialogues')
    ? JSONToMap(getStore('Dialogues')!)
    : initDialogues()

  let currentDialogue = undefined
  if (storeDialogues.size) {
    currentDialogue = [...storeDialogues.values()][0]
  }

  const [state, dispatch] = useReducer(contextReducer, {
    Settings: storeSettings,

    Dialogues: storeDialogues,
    currentDialogue
  } as State)

  // =========== Settings =======================
  const { i18n } = useTranslation()
  const _saveSettings = useCallback(
    (payload: SettingsType) => {
      i18n.changeLanguage(payload.language)
      dispatch({ type: ActionType.SETTINGS, payload })
    },
    [state.Settings]
  )

  // =========== 新对话 ==========================
  const _addDialogue = useCallback(() => {
    const { Dialogues } = state
    const id = uuidv4()

    Dialogues?.set(id, messageTemplate(id))
    dispatch({ type: ActionType.ADD_DIALOGUE, payload: Dialogues })

    // 新建对话时激活
    _toggleDialogue(messageTemplate(id))
  }, [state.Dialogues])

  // ========== 删除对话 =========================
  const _delDialogue = useCallback(
    (payload: string) => {
      const { Dialogues } = state
      Dialogues?.delete(payload)

      dispatch({ type: ActionType.DEL_DIALOGUE, payload: Dialogues })

      // 当前删除Dialogue === 当前激活dialogue
      // 需要切换当前激活的Dialogue
      _toggleDialogue([...Dialogues.values()][0])

      // 所有Dialogues被删除，重新初始化Dialogues
      if (!Dialogues?.size) {
        const baseDialogues = initDialogues()
        dispatch({ type: ActionType.ADD_DIALOGUE, payload: baseDialogues })

        _toggleDialogue([...baseDialogues.values()][0])
      }
    },
    [state.Dialogues]
  )

  // ========== 对话重命名 =======================
  const _renameDialogue = useCallback(
    (payload: DialogueType) => {
      let { id } = payload
      const { Dialogues } = state

      Dialogues?.set(id, payload)

      dispatch({ type: ActionType.UPDATE_DIALOGUE, payload })
      dispatch({ type: ActionType.RENAME_DIALOGUE, payload: Dialogues })
    },
    [state.Dialogues]
  )

  // 激活当前对话
  const _toggleDialogue = useCallback(
    (payload: DialogueType) => {
      dispatch({ type: ActionType.UPDATE_DIALOGUE, payload })
    },
    [state.currentDialogue]
  )

  // 更新当前对话信息
  const _setStoreDialogues = useCallback(
    (payload: DialogueType) => {
      const { Dialogues } = state
      Dialogues?.set(payload.id, payload)
      setStore('Dialogues', MapToJSON(Dialogues))
    },
    [state.currentDialogue]
  )

  return {
    state,
    _saveSettings,

    _addDialogue,
    _delDialogue,
    _renameDialogue,
    _toggleDialogue,
    _setStoreDialogues
  }
}

interface ChatBoxContextType {
  state: PartialByKeys<State, 'currentDialogue'>

  _saveSettings: (payload: SettingsType) => void

  _addDialogue: () => void
  _delDialogue: (payload: string) => void
  _renameDialogue: (payload: DialogueType) => void
  _toggleDialogue: (payload: DialogueType) => void
  _setStoreDialogues: (payload: DialogueType) => void
}

const ChatBoxContext = React.createContext<ChatBoxContextType>({
  state: {
    Dialogues: new Map(),
    Settings: baseSettings
  },
  _saveSettings: () => {},

  _addDialogue: () => {},
  _delDialogue: () => {},
  _renameDialogue: () => {},
  _toggleDialogue: () => {},
  _setStoreDialogues: () => {}
})

export default ChatBoxContext
