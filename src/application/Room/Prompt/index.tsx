import { ChangeEvent, FC, useContext, useState } from "react";
import { SuiLabel } from "../../../components";

import { Input, message } from "antd";
import { useTranslation } from "react-i18next";
import { OnTextCallbackResult, replay } from "../../../services/http";
import ChatBoxContext from "../../../context";
const { TextArea } = Input;

interface PromptProps {

}

const Prompt: FC<PromptProps> = (props) => {
    const { t } = useTranslation()
    const { state } = useContext(ChatBoxContext)
    const { Dialogues, CurrentDialogueID } = state

    const [ prompt, setPrompt ] = useState<string>("")
    const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
        const value = evt.target.value || ''
        setPrompt(value)
    }

    const submitPrompt = async () => {
        if(prompt.trim() === "") {
            return
        }

        let messages = Dialogues.get(CurrentDialogueID)!.messages 
        messages.push({
            role: "user",
            content: prompt
        })

        const onText = (option: OnTextCallbackResult) => {
            console.log("fullText: ", option)
        }

        await replay(
            state.Settings.OpenAIKey!,
            "",
            "4000",
            "2048",
            state.Settings.model!,
            0.7,
            messages,
            onText
          )
    }

    return (
        <div className="prompt">
            <div className="promptForm">
                <SuiLabel placeholder="Prompt">
                    <TextArea 
                        value={prompt}
                        onChange={handleChange}
                        spellCheck={false}
                        className="webkitScrollbarBase" 
                        bordered={false} 
                        autoSize={{ maxRows: 5 }} 
                        onKeyDown={(evt) => {
                            if(evt.keyCode === 13 && !evt.shiftKey) {
                                evt.preventDefault()
                                
                                submitPrompt()
                            }
                        }}/>
                </SuiLabel>
                <button type="button" onClick={submitPrompt}>{t("common.Send")}</button>
            </div>
            <div className="tip">
                {t("Prompt.Tip")}
            </div>
        </div>
    )
}

export default Prompt