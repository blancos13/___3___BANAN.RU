import openSocket from "socket.io-client"

let socket = openSocket("http://185.233.80.116/", {
    transports: ["websocket"],
    reconnectionDelay: 50,
    perMessageDeflate: false,
})
export default socket
