
export default {
    async connect() {
        const ws = await new Promise((resolve, reject) => {
            const ws = new WebSocket("wss://todolistwss.freemyip.com/api/ws")
            //const ws = new WebSocket("ws://todo.my/api/ws")
            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: 'init',
                    payload: localStorage.getItem('token')
                }))
                resolve(ws)
            }
            ws.onerror = reject
        })
        return {
            send: (type, payload) => {
                ws.send(JSON.stringify({
                    type,
                    payload
                }))
            },
            onmessage: (handler) => {
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data)
                    handler(data)
                }
            },
            onerror: (handler) => {
                ws.onerror = handler
            },
            onclose: (handler) => {
                ws.onclose = handler
            },
            close: () => {
                ws.close()
            }
        }
    }
}
