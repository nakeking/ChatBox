import { Locale } from "antd/es/locale";
import { themeInterface } from "../hooks/useThemeHook";

const Store = require('electron-store');
const store = new Store()

export const setStore = (key: string, data?: unknown) => {
    store.set(key, data)
}

function getStore(key: "Dialogues"): string | null
function getStore(key: 'theme'): themeInterface | null
function getStore(key: 'language'): string | null
function getStore(key: 'OpenAIKey'): string | null
function getStore(key: string): unknown {
    return store.get(key)
}

export const delStore = (key: string) => {
    store.delete(key)
}

export {
    getStore
}