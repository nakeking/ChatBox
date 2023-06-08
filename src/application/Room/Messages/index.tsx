import { FC, useEffect, useRef } from "react";

import Block from './Block'
import type { Message } from '../../../types'
import { App } from 'antd'


interface MessagesProps {
    messages?: Message[]
}

const Messages: FC<MessagesProps> = (props) => {
    let { messages } = props
    const { message } = App.useApp();
    
    // ============= message中代码片段复制功能 ===================================
    const codeBlockCopyEvent = useRef((e: Event) => {
        const target: HTMLElement = e.target as HTMLElement

        const isCopyActionClassName = target.className === "copy-action"
        const isCodeBlockParent = target.parentElement?.parentElement?.className === 'code-block-wrapper'
        
        if(!(isCopyActionClassName && isCodeBlockParent)) {
            return
        }

        const content = target.parentNode?.parentNode?.querySelector('code')?.innerText ?? ''

        navigator.clipboard.writeText(content)
        message.success("复制成昆")
    })

    useEffect(() => {
        document.addEventListener('click', codeBlockCopyEvent.current)

        return () => {
            document.removeEventListener('click', codeBlockCopyEvent.current)
        }
    }, [])

    return (
        <div className="message webkitScrollbarBase">
            {messages?.map(m => {
                return <Block key={m.id} msg={m} />
            })}
        </div>
    )
}

export default Messages