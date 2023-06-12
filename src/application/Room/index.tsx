import { FC, useContext, useEffect, useState } from "react";

import Header from "./Header";
import Prompt from "./Prompt";
import Messages from "./Messages";
import ChatBoxContext from "../../context";
import { DialogueType, Message } from "../../types";
import { OnTextCallbackResult, replay } from "../../services/http";

const Room: FC = () => {
    const { state } = useContext(ChatBoxContext)
    const { Dialogues, currentDialogue } = state

    const [ Dialogue, setDialogue ] = useState<DialogueType>()

    useEffect(() => {
        setDialogue(currentDialogue)
    }, [])

    const onsubmit = async (msg: Message) => {
        let messages = currentDialogue!.messages
        messages.push(msg)
        
        const onText = (option: OnTextCallbackResult) => {
            console.log("fullText: ", option)
        }

        const onError = (error: Error) => {
            console.log(error)
        }

        await replay(
            state.Settings.OpenAIKey!,
            "",
            state.Settings.maxContextSize,
            state.Settings.maxTokens,
            state.Settings.model!,
            state.Settings.temperature,
            messages,
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