import { FC } from "react";
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from "markdown-it-link-attributes"

import { getI18n } from 'react-i18next';
import hljs from 'highlight.js'

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

const Messages: FC = () => {
    return (
        <div className="message">
            <div
                className='msg-content'
                dangerouslySetInnerHTML={{ __html: md.render("你好 \n```\n function() {} \n```\n 你好啊") }}
            />
        </div>
    )
}

export default Messages