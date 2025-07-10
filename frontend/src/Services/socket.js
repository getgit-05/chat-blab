import { io } from "socket.io-client";
const socket = io("https://chat-blab.onrender.com", { autoConnect: false });
export default socket;
