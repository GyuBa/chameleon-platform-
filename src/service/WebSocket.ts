export function echo(ws, msg) {
    if(msg == 'hi'){
        ws.send('Hello');
    }
}