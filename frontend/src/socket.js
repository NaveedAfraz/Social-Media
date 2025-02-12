import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3006";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"],
});
