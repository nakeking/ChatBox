const OpenAIRoleEnum = {
    System: 'system',
    User: "user"
} as const

type OpenAIRoleEnumType = typeof OpenAIRoleEnum[keyof typeof OpenAIRoleEnum]

interface OpenAIMessage {
    role: OpenAIRoleEnumType,
    content: string
}

export type Message = OpenAIMessage & {
    id?: string,
    model?: string
}

export interface DialogueType {
    id: string
    name: string,
    messages: Message[]
}

export type DialoguesType = Map<string, DialogueType>