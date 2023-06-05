interface MessageType {
    id: string,
    role: "user" | "system",
    content: string
}

export interface DialogueType {
    id: string
    name: string,
    messages?: MessageType[]
}