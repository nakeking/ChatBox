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

const { ipcRenderer } = window.require('electron/renderer')

const _Room = () => {
  const { t } = useTranslation()
  const { state, _updateDialogueMsg } = useContext(ChatBoxContext)
  const { currentDialogue } = state

  const [Dialogue, setDialogue] = useState<DialogueType>()
  const DialogueRef = useRef(currentDialogue)

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
      await _updateDialogueMsg(DialogueRef.current!)

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
    DialogueRef.current = currentDialogue
    setDialogue(currentDialogue)
  }, [currentDialogue])

  // ================= 提交 prompt =========================
  const onsubmit = async (newUserMsg: Message) => {
    let { messages } = Dialogue!

    const id = uuidv4()
    const newSystemMsg = createMessage('system', '.....', id)
    setDialogue({
      ...Dialogue!,
      messages: [...messages, newUserMsg, newSystemMsg]
    })
    DialogueRef.current!.messages = [...messages, newUserMsg, newSystemMsg]

    // ============= openAI 返回结果 =========================
    const onText = (option: OnTextCallbackResult) => {
      let { text } = option
      text = text.replace(/['"“”]/g, '')

      let { messages } = DialogueRef.current!
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].id === id) {
          messages[i] = {
            ...messages[i],
            content: text,
            model: state.Settings.model,
            generating: true
          }
          break
        }
      }

      DialogueRef.current!.messages = [...messages]
      setDialogue({
        ...Dialogue!,
        messages: [...messages]
      })
    }

    // ============= openAI 请求错误处理 ======================
    const onError = (error: Error) => {
      let { messages } = DialogueRef.current!
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

      setDialogue({
        ...Dialogue!,
        messages: [...messages]
      })
    }

    // ============= 发起请求 ==================================
    await replay(
      state.Settings.OpenAIKey!,
      '',
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
      <Header Dialogue={currentDialogue} />
      <Messages messages={Dialogue?.messages} />
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
