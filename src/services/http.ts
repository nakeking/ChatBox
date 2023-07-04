import type { Message } from '../types'
import { createParser } from 'eventsource-parser'
import { countWord, estimateTokens } from '../utils'

export interface OnTextCallbackResult {
  // response content
  text: string
  // cancel for fetch
  cancel: () => void
}

export async function replay(
  apiKey: string,
  host: string,
  maxContextSize: string,
  maxTokens: string,
  modelName: string,
  temperature: number,
  msgs: Message[],
  onText?: (option: OnTextCallbackResult) => void,
  onError?: (error: Error) => void
) {
  if (msgs.length === 0) {
    throw new Error('No message to replay')
  }
  const head = msgs[0].role === 'system' ? msgs[0] : undefined
  if (head) {
    msgs = msgs.slice(1)
  }

  const maxTokensNumber = Number(maxTokens)
  const maxLen = Number(maxContextSize)
  let totalLen = head ? estimateTokens(head.content) : 0

  let prompts: Message[] = []
  for (let i = msgs.length - 1; i >= 0; i--) {
    const msg = msgs[i]

    // 对msg中的content的字符长度是否大于 > maxLen
    const msgTokenSize: number = estimateTokens(msg.content) + 200
    if (msgTokenSize + totalLen > maxLen) {
      break
    }

    prompts = [msg, ...prompts]
    totalLen += msgTokenSize
  }

  if (head) {
    prompts = [head, ...prompts]
  }

  // fetch cancel
  let hasCancel = false
  const controller = new AbortController()
  const cancel = () => {
    hasCancel = true
    controller.abort()
  }

  let fullText = ''
  try {
    const messages = prompts.map((msg) => ({
      role: msg.role,
      content: msg.content
    }))
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        max_tokens: maxTokensNumber,
        messages,
        model: modelName,
        stream: true,
        temperature
      }),
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey
      }
    })

    // chatgpt stream数据流处理
    await handleSSE(response, (message) => {
      if (message === '[DONE]') {
        return
      }

      // 1：结果为json字符串，转换成对象
      const data = JSON.parse(message)
      if (data.error) {
        throw new Error(`Error from OpenAI: ${JSON.stringify(data)}`)
      }

      const text = data.choices[0]?.delta?.content
      if (text !== undefined) {
        fullText += text
        if (onText) {
          onText({ text: fullText, cancel })
        }
      }
    })
  } catch (error) {
    if (hasCancel) {
      return
    }

    if (onError) {
      onError(error as any)
    }

    throw error
  }

  return fullText
}

async function handleSSE(
  response: Response,
  onMessage: (message: string) => void
) {
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(
      error
        ? JSON.stringify(error)
        : `${response.status} ${response.statusText}`
    )
  }
  if (response.status !== 200) {
    throw new Error(
      `Error from OpenAI: ${response.status} ${response.statusText}`
    )
  }
  if (!response.body) {
    throw new Error('No response body')
  }

  // createParser: eventsource-parser库提供，处理streamParser
  // event.data: 返回结果json字符串
  const parser = createParser((event) => {
    if (event.type === 'event') {
      onMessage(event.data)
    }
  })

  // response.body: ReadableStream
  for await (const chunk of iterableStreamAsync(response.body)) {
    const str = new TextDecoder().decode(chunk)
    parser.feed(str)
  }
}

// Stream 是一系列异步事件的序列
// 解析 ReadableStream 数据
async function* iterableStreamAsync(
  stream: ReadableStream
): AsyncIterableIterator<Uint8Array> {
  const reader = stream.getReader()

  try {
    while (true) {
      const { value, done } = await reader.read()

      if (done) {
        return
      } else {
        yield value
      }
    }
  } finally {
    reader.releaseLock()
  }
}
