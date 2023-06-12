import { FC, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid'

import Header from "./Header";
import Prompt from "./Prompt";
import Messages from "./Messages";
import ChatBoxContext from "../../context";
import type { DialogueType, Message } from "../../types";
import { createMessage } from '../../types';
import { OnTextCallbackResult, replay } from "../../services/http";

const Room: FC = () => {
    const { state } = useContext(ChatBoxContext)
    const { currentDialogue } = state

    const [ Dialogue, setDialogue ] = useState<DialogueType>()
    const DialogueRef = useRef(currentDialogue)

    useEffect(() => {
        DialogueRef.current = currentDialogue
        setDialogue(currentDialogue)
    }, [currentDialogue])

    // ================= user 提交 prompt =========================
    const onsubmit = async (newUserMsg: Message) => {
        let { messages } = Dialogue!

        const id = uuidv4()
        const newSystemMsg = createMessage("system", ".....", id)
        setDialogue({
            ...Dialogue!, 
            messages: [ ...messages, newUserMsg, newSystemMsg ]
        })
        DialogueRef.current!.messages = [ ...messages, newUserMsg, newSystemMsg ]

        // ============= openAI 返回结果 =========================
        const onText = (option: OnTextCallbackResult) => {
            let { text } = option
            text = text.replace(/['"“”]/g, '')

            let { messages } = DialogueRef.current!
            for(let i = messages.length - 1; i >= 0; i--) {
                if(messages[i].id === id) {
                    messages[i] = {...messages[i], content: text}
                    break;
                }
            }

            setDialogue({
                ...Dialogue!, 
                messages: [ ...messages ]
            })
        }

        // ============= openAI 请求错误处理 ======================
        const onError = (error: Error) => {
            console.log(error)
        }

        // ============= 发起请求 ==================================
        await replay(
            state.Settings.OpenAIKey!,
            "",
            state.Settings.maxContextSize,
            state.Settings.maxTokens,
            state.Settings.model!,
            state.Settings.temperature,
            DialogueRef.current!.messages,
            onText,
            onError
        )
    }

    return (
        <div className="room">
            <Header />
            <Messages messages={Dialogue?.messages} />
            <Prompt onSubmit={onsubmit} />
        </div>
    )
}

export default Room