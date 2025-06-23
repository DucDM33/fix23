// services/socket.ts
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;

export function connectWebSocket(
  groupId: number,
  token: string,
  onMessage: (msg: any) => void
) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://150.95.111.137:8080/ws"),
    connectHeaders: { Authorization: `Bearer ${token}` },
    debug: (str) => console.log("[STOMP]", str),
    onConnect: () => {
      stompClient!.subscribe(`/topic/group/${groupId}`, (frame: IMessage) => {
        onMessage(JSON.parse(frame.body));
      });
    },
  });
  stompClient.activate();
}

export function sendMessage(payload: {
  groupId: number;
  senderId: number;
  content: string;
}) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(payload),
    });
  }
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}
