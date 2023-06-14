import { v4 as uuidv4 } from 'uuid'

export type PartialByKeys<T, K extends keyof T> = {
  [P in K]?: T[P]
} & Omit<T, K>

const OpenAIRoleEnum = {
  System: 'system',
  User: 'user'
} as const

type OpenAIRoleEnumType = (typeof OpenAIRoleEnum)[keyof typeof OpenAIRoleEnum]

interface OpenAIMessage {
  role: OpenAIRoleEnumType
  content: string
}

export type Message = OpenAIMessage & {
  id?: string
  model?: string
}

export interface DialogueType {
  id: string
  name: string
  messages: Message[]
}

export type DialoguesType = Map<string, DialogueType>

export const createMessage = (
  role: OpenAIRoleEnumType,
  content: string,
  id?: string
): Message => {
  return {
    id: id || uuidv4(),
    role,
    content
  }
}

const msgTemplate: Message = {
  id: uuidv4(),
  role: 'system',
  content:
    'You are a helpful assistant. You can help me by answering my questions. You can also ask me questions.'
}

export const messageTemplate = (id: string) => {
  return {
    id: id || uuidv4(),
    name: 'Untitled',
    messages: [msgTemplate]
  }
}
