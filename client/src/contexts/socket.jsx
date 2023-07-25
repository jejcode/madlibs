// Taken from
// https://dev.to/bravemaster619/how-to-use-socket-io-client-correctly-in-react-app-o65
import { createContext } from "react";
import io from 'socket.io-client'



export const socket = io.connect('http://localhost:8000')
export const SocketContext = createContext();
socket.on("connect", () => {
    console.log(`Connected to the server with id: ${socket.id}`);
});

socket.on("connect_error", (err) => {
    console.log(`Connection failed due to error: ${err.message}`);
});