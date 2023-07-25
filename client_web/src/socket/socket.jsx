import { io } from "socket.io-client";
//const socket = io.connect(['http://localhost:3001','https://server-smart-home.onrender.com'], { reconnect: true });
const socket = io.connect('https://server-smart-home.onrender.com', { reconnect: true });

export default socket