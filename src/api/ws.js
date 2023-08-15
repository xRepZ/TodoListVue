// export const wsConnection = new WebSocket("ws://todo.my/api/ws");
// wsConnection.onopen = () => {
//     alert("Соединение установлено.");
// }

// wsConnection.onclose = (event) => {
//     if (event.wasClean) {
//         alert('Соединение закрыто чисто');
//     } else {
//         alert('Обрыв соединения'); // например, "убит" процесс сервера
//     }
//     alert('Код: ' + event.code + ' причина: ' + event.reason);
// }

// wsConnection.onerror = (error) => {
//     alert("Ошибка " + error.message);
// }

// export const wsSend = (data) => {
// // readyState - true, если есть подключение
//     if(!wsConnection.readyState){
//         setTimeout(function (){
//             wsSend(data);
//         },100);
//     } else {
//         wsConnection.send(data);
//     }
// }

export default {
    async connect() {
        const ws = await new Promise((resolve, reject) => {
            const ws = new WebSocket("ws://todo.my/api/ws")
            // const ws = new WebSocket("ws://localhost:5173/api/ws")
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
