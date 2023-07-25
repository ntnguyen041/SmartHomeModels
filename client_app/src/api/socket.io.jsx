import io from "socket.io-client";

const socket = io("http://192.168.1.8:3001");
// const socket = io("https://server-smart-home.onrender.com");

export default socket ;
