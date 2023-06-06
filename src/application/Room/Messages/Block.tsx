import { FC, useMemo } from "react"

import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from "markdown-it-link-attributes"

import { getI18n } from 'react-i18next';
import hljs from 'highlight.js'

import type { Message } from '../../../types'

const md = MarkdownIt({
    linkify: true,
    breaks: true,
    highlight: (str: string, lang: string, attrs: string): string => {
        let content = str

        if (lang && hljs.getLanguage(lang)) {
            try {
                content = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
            } catch (e) {
                console.log(e)
                return str
            }
        } else {
            content = md.utils.escapeHtml(str)
        }

        lang = (lang || 'txt').toUpperCase()
        return [
            '<div class="code-block-wrapper">',
            `<div class="code-header"><span class="code-lang">${lang}</span><div class="copy-action">${getI18n().t('common.Copy')}</div></div>`,
            '<pre class="hljs code-block">',
            `<code>${content}</code>`,
            '</pre>',
            '</div>',
        ].join('')
    }
})

md.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })
md.use(mila, { attrs: { target: "_blank", rel: "noopener" } })

interface BlockProps {
    id: string,
    msg: Message
}

const _Block: FC<BlockProps> = (props) => {
    let { id, msg } = props

    return (
        <div 
            className="msgItem" 
            id={id} 
            key={msg.id}>
            <div
                className='msg-content'
                dangerouslySetInnerHTML={{ __html: md.render("用useReducer实现一个计数器：\n\n```\nimport React, { useReducer } from 'react';\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case 'increment':\n      return { count: state.count + 1 };\n    case 'decrement':\n      return { count: state.count - 1 };\n    default:\n      throw new Error();\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n\n  return (\n    <div>\n      <h1>Count: {state.count}</h1>\n      <button onClick={() => dispatch({ type: 'increment' })}>+</button>\n      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>\n    </div>\n  );\n}\n```\n\n在这个例子中，我们定义了一个reducer函数，它根据传入的action的type属性来更新state对象。使用useReducer来使用这个reducer函数，它返回一个state和dispatch函数。当用户点击+或-按钮时，我们可以通过dispatch函数向reducer函数传递一个相应的action对象来更新state对象，并且计数器的值会随之变化。") }}
            />
        </div>
    )
}

export default function Block(props: BlockProps) {
    return useMemo(() => {
        return <_Block {...props} />
    }, [props])
}