import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'

import Block from './Block'
import type { DialogueType, Message } from '../../../types'
import { App } from 'antd'
import { UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

interface MessagesProps {
  id?: string
  messages?: Message[]

  onStopRequest: (msg: Message) => void
  onCopyContext: (context: string) => void
  onDeleteMsg: (id: string) => void
}

const Messages: FC<MessagesProps> = (props) => {
  const { t } = useTranslation()
  let { id, messages, onStopRequest, onCopyContext, onDeleteMsg } = props
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

  // ============ 滚动条事件 ==============
  const messagesScrollRef = useRef<HTMLDivElement>(null)
  const [isScroll, setIsScroll] = useState(false)

  const [scrollHeight, setScrollHeight] = useState(0)

  useEffect(() => {
    const scrollHeight = messagesScrollRef.current?.scrollHeight || 0
    const clientHeight = messagesScrollRef.current?.clientHeight || 0

    if (scrollHeight > clientHeight) {
      messagesScrollRef.current?.scrollTo(0, scrollHeight!)
      setIsScroll(true)
    } else {
      setIsScroll(false)
    }
  }, [id, messagesScrollRef.current?.scrollHeight])

  useEffect(() => {
    messagesScrollRef.current?.addEventListener('scroll', handleScroll)

    return () => {
      messagesScrollRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = () => {
    const newScrollHeight = messagesScrollRef.current?.scrollTop || 0

    setScrollHeight(newScrollHeight)
  }

  const onScrollToUp = () => {
    messagesScrollRef.current?.scrollTo(0, 0)
  }

  const onScrollToDown = () => {
    const scrollHeight = messagesScrollRef.current?.scrollHeight || 0
    messagesScrollRef.current?.scrollTo(0, scrollHeight)
  }

  return (
    <>
      <div ref={messagesScrollRef} className="message webkitScrollbarBase">
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
      {isScroll ? (
        <div className="scrollActions">
          <span
            className="iconBase"
            onClick={onScrollToUp}
            style={{
              opacity: scrollHeight === 0 ? '0' : '1',
              visibility: scrollHeight === 0 ? 'hidden' : 'visible'
            }}
          >
            <UpCircleOutlined />
          </span>
          <span className="iconBase" onClick={onScrollToDown}>
            <DownCircleOutlined />
          </span>
        </div>
      ) : null}
    </>
  )
}

export default Messages
