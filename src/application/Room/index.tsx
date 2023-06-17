import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { v4 as uuidv4 } from 'uuid'

import Header from './Header'
import Prompt from './Prompt'
import Messages from './Messages'
import ChatBoxContext from '../../context'
import type { DialogueType, Message } from '../../types'
import { createMessage } from '../../types'
import { OnTextCallbackResult, replay } from '../../services/http'
import { useTranslation } from 'react-i18next'
import { App } from 'antd'

const { ipcRenderer } = window.require('electron/renderer')

const _Room = () => {
  const { message } = App.useApp()
  const { t } = useTranslation()
  const { state, _updateDialogueMsg } = useContext(ChatBoxContext)
  const { currentDialogue } = state

  const [dialogue, setDialogue] = useState<DialogueType>()
  const dialogueRef = useRef(currentDialogue)

  // ======= 关闭窗口前，保存当前dialogue对话信息 ==============
  const [closeWinStatus, setCloseWinStatus] = useState(false)
  useEffect(() => {
    if (closeWinStatus) {
      ipcRenderer.send('chatbox-close')
    }
  }, [closeWinStatus])

  const handleBeforeUnload = async (event: Event) => {
    if (!event.defaultPrevented) {
      event.preventDefault()
      await _updateDialogueMsg(dialogueRef.current!)

      setCloseWinStatus(true)
    }
  }
  useEffect(() => {
    // 窗口关闭事件监听
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // ========= 初始化dialogue对话信息 ============================
  useEffect(() => {
    dialogueRef.current = currentDialogue
    setDialogue(currentDialogue)
  }, [currentDialogue])

  // ================= 提交 prompt =========================
  const updateSession = (session: DialogueType) => {
    setDialogue(session)
    dialogueRef.current!.messages = [...session.messages]
  }
  const onsubmit = async (newUserMsg: Message) => {
    let { messages } = dialogue!

    const id = uuidv4()
    const newSystemMsg = createMessage('system', '.....', id, true)
    updateSession({
      ...dialogue!,
      messages: [...messages, newUserMsg, newSystemMsg]
    })

    // openAI 请求结果处理
    const onText = (option: OnTextCallbackResult) => {
      let { text, cancel } = option
      text = text.replace(/['"“”]/g, '')

      let { messages } = dialogueRef.current!
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].id === id) {
          messages[i] = {
            ...messages[i],
            content: text,
            cancel,
            model: state.Settings.model,
            generating: true
          }
          break
        }
      }

      updateSession({
        ...dialogue!,
        messages: [...messages]
      })
    }

    // openAI 请求错误处理
    const onError = (error: Error) => {
      let { messages } = dialogueRef.current!
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].id === id) {
          messages[i] = {
            ...messages[i],
            content: t('common.ApiError') + '\n```\n' + error.message + '\n```',
            model: state.Settings.model,
            generating: false
          }
          break
        }
      }

      updateSession({
        ...dialogue!,
        messages: [...messages]
      })
    }

    // 发起 openAI 请求
    await replay(
      state.Settings.OpenAIKey!,
      '',
      state.Settings.maxContextSize,
      state.Settings.maxTokens,
      state.Settings.model!,
      state.Settings.temperature,
      dialogueRef.current!.messages,
      onText,
      onError
    )

    // openAI请求结束处理
    const newMessages = dialogueRef.current!.messages.map((d) => {
      if (d.id === id) {
        d = {
          ...d,
          generating: false
        }
      }

      return d
    })
    updateSession({ ...dialogue!, messages: newMessages })
  }

  // ================= 中断请求方法 ============================
  const onStopRequest = (msg: Message) => {
    msg?.cancel?.()
  }

  // ================= copy ===================================
  const onCopyContext = (context: string) => {
    navigator.clipboard.writeText(context)
    message.success(t('common.Copied to clipboard'))
  }

  // ================= 删除单条消息 ===========================
  const onDeleteMsg = (id: string) => {
    const newMessage = dialogueRef.current!.messages.filter((m) => m.id !== id)
    updateSession({ ...dialogue!, messages: newMessage })
  }

  return (
    <div className="room">
      <Header Dialogue={currentDialogue} />
      <Messages
        messages={dialogue?.messages}
        onStopRequest={onStopRequest}
        onCopyContext={onCopyContext}
        onDeleteMsg={onDeleteMsg}
      />
      <Prompt onSubmit={onsubmit} />
    </div>
  )
}

export default function Room() {
  const { state } = useContext(ChatBoxContext)
  const { currentDialogue } = state

  return useMemo(() => {
    return <_Room />
  }, [currentDialogue?.id])
}
