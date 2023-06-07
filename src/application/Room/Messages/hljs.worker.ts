import hljs from 'highlight.js'

declare const self: any;
export default {} as typeof Worker & { new (): Worker }

self.onmessage = (event: { data: string; }) => {
    console.log(event);
    
    const result = hljs.highlight(event.data, {language: "", ignoreIllegals: true})

    postMessage(result.value)
}