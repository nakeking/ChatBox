import { shell } from "electron"

export const openLink = (url: string) => {
    shell.openExternal(url)
}