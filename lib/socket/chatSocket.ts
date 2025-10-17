import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { ChatMessage } from "@/lib/api/chat";

const SOCKET_URL =
    process.env.NEXT_PUBLIC_BACK_END_WS_URL || "http://localhost:8081/ws-chat";

let stompClient: Client | null = null;

// ✅ Define a more robust arguments object for the connect function
interface ConnectWebSocketParams {
    onMessage: (msg: ChatMessage) => void;
    onConnectCallback: () => void;
    onError: (err: string) => void;
}

export function connectWebSocket({ onMessage, onConnectCallback, onError }: ConnectWebSocketParams) {
    // ✅ Read the auth token from local storage
    const token = localStorage.getItem("token");

    if (!token) {
        onError("Authentication token not found. Cannot connect to WebSocket.");
        return;
    }

    const socket = new SockJS(SOCKET_URL);
    stompClient = new Client({
        webSocketFactory: () => socket as any,

        // ✅ ADDED: Send the JWT token for authentication
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        // debug: (str) => {
        //     // Only log in development
        //     if (process.env.NODE_ENV === 'development') {
        //         console.log(new Date(), str);
        //     }
        // },

        onConnect: () => {
            console.log("✅ WebSocket Connected and Authenticated");
            // Subscription to the user's private queue
            stompClient?.subscribe("/user/queue/messages", (frame: IMessage) => {
                try {
                    const msg = JSON.parse(frame.body) as ChatMessage;
                    onMessage(msg);
                } catch (error) {
                }
            });

            // ✅ ADDED: Notify the UI component that the connection is ready
            onConnectCallback();
        },

        // ✅ ADDED: Handle connection errors
        onError: (err) => {
            console.error("WebSocket connection error:", err);
            onError("Connection failed. Please refresh the page.");
        },

        onStompError: (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
            onError("An error occurred with the chat service.");
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
        // Optionally, you can add a callback here to notify the user
    }
}

export function disconnectWebSocket() {
    stompClient?.deactivate();
    console.log("WebSocket disconnected.");
}