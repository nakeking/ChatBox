import { FC, useEffect, useMemo } from 'react'
import type { Message } from '../../../types'

import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'

import { getI18n, useTranslation } from 'react-i18next'
import hljs from 'highlight.js'

import { SettingFilled, RocketFilled } from '@ant-design/icons'
import { Avatar, Tooltip } from 'antd'
import { ReloadOutlined, CopyOutlined, DeleteFilled } from '@ant-design/icons'

// const worker = new Worker(`${process.env.PUBLIC_URL}/hljs.worker.js`)

const md = new MarkdownIt({
  linkify: true,
  breaks: true,
  highlight: (str: string, lang: string, attrs: string): string => {
    let content = str
    if (lang && hljs.getLanguage(lang)) {
      // worker.postMessage({ content, lang })

      // worker.onmessage = function (event) {
      //   console.log(event.data)
      //   content = event.data
      // }

      content = hljs.highlight(content, {
        language: lang,
        ignoreIllegals: true
      }).value
    } else {
      content = md.utils.escapeHtml(str)
    }

    lang = (lang || 'txt').toUpperCase()
    return [
      '<div class="code-block-wrapper">',
      `<div class="code-header"><span class="code-lang">${lang}</span><div class="copy-action">${getI18n().t(
        'common.Copy'
      )}</div></div>`,
      '<pre class="hljs code-block webkitScrollbarBase">',
      `<code>${content}</code>`,
      '</pre>',
      '</div>'
    ].join('')
  }
})

md.use(mdKatex, {
  blockClass: 'katexmath-block rounded-md p-[10px]',
  errorColor: ' #cc0000'
})
md.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })

interface BlockProps {
  msg: Message

  onStopRequest: (msg: Message) => void
  onCopyContext: (context: string) => void
  onDeleteMsg: (id: string) => void
}

const _Block: FC<BlockProps> = (props) => {
  const { t } = useTranslation()
  let { msg, onStopRequest, onCopyContext, onDeleteMsg } = props

  const handleStopRequest = (evt: React.MouseEvent) => {
    onStopRequest(msg)
  }

  const handleCopyContext = () => {
    onCopyContext(msg.content)
  }

  const handleDeleteMsg = () => {
    onDeleteMsg(msg.id)
  }

  return (
    <div className={`msgItem ${msg.role}`} id={msg.id} key={msg.id}>
      <div className="role">
        <Avatar
          size={40}
          shape="square"
          icon={msg.role === 'system' ? <SettingFilled /> : <RocketFilled />}
        />
      </div>
      <div className="msg">
        <div
          className="msg-content"
          dangerouslySetInnerHTML={{ __html: md.render(msg.content) }}
        />
        <div className="actions">
          {msg.role === 'system' && msg.generating ? (
            <div className="stop anticon iconBase" onClick={handleStopRequest}>
              <Tooltip title={t('common.stop')}>
                <div className="stopIcon"></div>
              </Tooltip>
            </div>
          ) : (
            <div className="reset iconBase">
              <Tooltip title={t('common.Regenerate')}>
                <ReloadOutlined />
              </Tooltip>
            </div>
          )}
          <div className="copy iconBase" onClick={handleCopyContext}>
            <Tooltip title={t('common.Copy')}>
              <CopyOutlined />
            </Tooltip>
          </div>
          <div className="del iconBase" onClick={handleDeleteMsg}>
            <Tooltip title={t('common.Del')}>
              <DeleteFilled />
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="other"></div>
    </div>
  )
}

export default function Block(props: BlockProps) {
  return useMemo(() => {
    return <_Block {...props} />
  }, [props.msg])
}
