const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACK_END_API_URL || "http://localhost:8081/api";

export interface ChatMessage {
    id?: string;
    sender?: string;
    receiver: string;
    content: string;
    timestamp?: string;
}

// ✅ Fetch messages between current user and another user
export async function getChatMessages(withUser: string): Promise<ChatMessage[]> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Token not found");

    const res = await fetch(`${API_BASE_URL}/chat/messages?withUser=${withUser}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("Error fetching chat messages:", data);
        throw new Error(data.message || "Failed to fetch chat messages");
    }

    // ✅ Backend wraps result as { data: [ ... ], timestamp: ... }
    return Array.isArray(data.data) ? data.data : [];
}

// ✅ Send message through REST (optional, for fallback/testing)
export async function sendMessage(receiver: string, content: string): Promise<ChatMessage> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Token not found");

    const res = await fetch(`${API_BASE_URL}/chat/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver, content }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send message");
    return data.data;
}
