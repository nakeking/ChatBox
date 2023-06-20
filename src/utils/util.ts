import { shell } from 'electron'
import GPT3Tokenizer from 'gpt3-tokenizer'

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

let pattern =
  /[a-zA-Z0-9_\u0392-\u03c9\u00c0-\u00ff\u0600-\u06ff\u0400-\u04ff]+|[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g
export function countWord(data: string): number {
  let m = data.match(pattern)
  let count = 0
  if (!m) {
    return 0
  }

  m.map((c) => {
    if (c.charCodeAt(0) >= 0x4e00) {
      count += c.length
    } else {
      count += 1
    }
  })

  return count
}
const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
export function estimateTokens(str: string): number {
  const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(str)

  return encoded.bpe.length
}
