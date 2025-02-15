import { io } from "socket.io-client";

const SOCKET_URL = "https://social-media-85xj.onrender.com";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"],
});
