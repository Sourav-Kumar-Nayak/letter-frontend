import { Client, IMessage, IStompSocket } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { ChatMessage } from "@/lib/api/chat";

const SOCKET_URL =
    process.env.NEXT_PUBLIC_BACK_END_WS_URL || "http://localhost:8081/ws-chat";

let stompClient: Client | null = null;

// Define a more robust arguments object for the connect function, with optional callbacks
interface ConnectWebSocketParams {
    onMessage: (msg: ChatMessage) => void;
    onConnectCallback?: () => void; // Made optional
    onError?: (err: string) => void;      // Made optional
}

export function connectWebSocket({ onMessage, onConnectCallback, onError }: ConnectWebSocketParams) {
    const token = localStorage.getItem("token");

    if (!token) {
        // Check if onError exists before calling it
        onError?.("Authentication token not found. Cannot connect to WebSocket.");
        return;
    }

    stompClient = new Client({
        // Use the SockJS factory to create the WebSocket connection
        webSocketFactory: () => new SockJS(SOCKET_URL) as IStompSocket,

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
            console.log("✅ WebSocket Connected and Authenticated");
            stompClient?.subscribe("/user/queue/messages", (frame: IMessage) => {
                try {
                    const msg = JSON.parse(frame.body) as ChatMessage;
                    // Check if onMessage exists before calling it
                    onMessage?.(msg);
                } catch (err) {
                    // Log the error if message parsing fails
                    console.error("Failed to parse incoming message:", frame.body, err);
                }
            });
            // Check if onConnectCallback exists before calling it
            onConnectCallback?.();
        },

        onWebSocketError: (err) => {
            console.error("WebSocket connection error:", err);
            onError?.("Connection failed. Please refresh the page.");
        },

        onStompError: (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
            onError?.("An error occurred with the chat service.");
        }
    });

    stompClient.activate();
}

export function sendChatMessage(message: ChatMessage) {
    if (stompClient && stompClient.active) {
        stompClient.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(message),
        });
    } else {
        console.error("❌ WebSocket not connected or active. Cannot send message.");
    }
}

export function disconnectWebSocket() {
    stompClient?.deactivate();
    console.log("WebSocket disconnected.");
}

