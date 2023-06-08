import { FC, useContext, useEffect, useState } from "react";

import Header from "./Header";
import Prompt from "./Prompt";
import Messages from "./Messages";
import ChatBoxContext from "../../context";
import { DialogueType } from "../../types";

const Room: FC = () => {
    const { state } = useContext(ChatBoxContext)
    const { Dialogues, CurrentDialogueID } = state

    const [ Dialogue, setDialogue ] = useState<DialogueType>()

    useEffect(() => {
        setDialogue(Dialogues?.get(CurrentDialogueID!))

        console.log(Dialogues?.get(CurrentDialogueID!))
    }, [CurrentDialogueID])

    return (
        <div className="room">
            <Header />
            <Messages messages={Dialogue?.messages} />
            <Prompt />
        </div>
    )
}

export default Room