import { FC, useEffect, useRef } from 'react'

import Block from './Block'
import type { DialogueType, Message } from '../../../types'
import { App } from 'antd'
import { useTranslation } from 'react-i18next'

interface MessagesProps {
  messages?: Message[]

  onStopRequest: (msg: Message) => void
  onCopyContext: (context: string) => void
  onDeleteMsg: (id: string) => void
}

const Messages: FC<MessagesProps> = (props) => {
  const { t } = useTranslation()
  let { messages, onStopRequest, onCopyContext, onDeleteMsg } = props
  const { message } = App.useApp()

  // ============= message中代码片段复制功能 ===================================
  const codeBlockCopyEvent = useRef((e: Event) => {
    const target: HTMLElement = e.target as HTMLElement

    const isCopyActionClassName = target.className === 'copy-action'
    const isCodeBlockParent =
      target.parentElement?.parentElement?.className === 'code-block-wrapper'

    if (!(isCopyActionClassName && isCodeBlockParent)) {
      return
    }

    const content =
      target.parentNode?.parentNode?.querySelector('code')?.innerText ?? ''

    navigator.clipboard.writeText(content)
    message.success(t('common.Copied to clipboard'))
  })

  useEffect(() => {
    document.addEventListener('click', codeBlockCopyEvent.current)

    return () => {
      document.removeEventListener('click', codeBlockCopyEvent.current)
    }
  }, [])

  return (
    <div className="message webkitScrollbarBase">
      {messages?.map((m) => {
        return (
          <Block
            key={m.id}
            msg={m}
            onStopRequest={onStopRequest}
            onCopyContext={onCopyContext}
            onDeleteMsg={onDeleteMsg}
          />
        )
      })}
    </div>
  )
}

export default Messages
