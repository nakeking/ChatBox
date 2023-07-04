// import hljs from 'highlight.js'
// const { hljs } = require('highlight.js')

self.onmessage = (event) => {
  importScripts(
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js'
  )

  let { content, lang } = event.data

  const result = hljs.highlight(content, {
    language: lang,
    ignoreIllegals: true
  })

  postMessage(result.value)
}
