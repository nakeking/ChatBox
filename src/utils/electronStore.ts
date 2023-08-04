import { themeInterface } from '../hooks/useThemeHook'

// const Store = require('electron-store')
// const store = new Store()
// import Store from 'electron-store'
// const store = new Store()

export const setStore = (key: string, data?: unknown) => {
  window.localStorage.setItem(key, data as string)
}

function getStore(key: 'Settings'): string | null
function getStore(key: 'Dialogues'): string | null
function getStore(key: 'theme'): themeInterface | null
function getStore(key: 'language'): string | null
function getStore(key: 'OpenAIKey'): string | null
function getStore(key: string): unknown {
  return window.localStorage.getItem(key)
}

export const delStore = (key: string) => {
  window.localStorage.removeItem(key)
}

export { getStore }
