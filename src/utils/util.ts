import { shell } from 'electron'

export const openLink = (url: string) => {
  shell.openExternal(url)
}

export const MapToJSON = (map: Map<unknown, unknown>): string => {
  return JSON.stringify(Object.fromEntries(map))
}

export const JSONToMap = (json: string): Map<unknown, unknown> => {
  let arr = Object.entries(JSON.parse(json))
  return new Map(arr)
}
