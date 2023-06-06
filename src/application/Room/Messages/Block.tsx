import { FC, useMemo } from "react"

import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from "markdown-it-link-attributes"

import { getI18n } from 'react-i18next';
import hljs from 'highlight.js'

import type { Message } from '../../../types'

const md = new MarkdownIt({
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
                dangerouslySetInnerHTML={{ __html: md.render("```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, world!\")\n}\n```\n该示例是一个最简单的 Hello World 程序，使用 Go 语言编写。") }}
            />
        </div>
    )
}

export default function Block(props: BlockProps) {
    return useMemo(() => {
        return <_Block {...props} />
    }, [props])
}