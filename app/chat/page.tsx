"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, UserResponse } from "@/lib/api/user";
import { logoutUser } from "@/lib/api/auth";
import Spinner from "@/components/Spinner";
import { getChatMessages, ChatMessage } from "@/lib/api/chat";
import { connectWebSocket, disconnectWebSocket, sendChatMessage } from "@/lib/socket/chatSocket";

// Helper and Component definitions...
const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatHeader = ({ user, isConnected }: { user: UserResponse; isConnected: boolean; }) => {
    return (
        <div className="flex items-center justify-between border-b p-3 bg-gray-50">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-semibold text-blue-700">
                    {user.username?.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-800">{user.username}</span>
            </div>
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'}></div>
        </div>
    );
};

export default function ChatDesktopPage() {
    // State hooks...
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    // ✅ FIXED: Removed the unused 'error' state variable
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const router = useRouter();
    const [isConnected, setIsConnected] = useState(false);
    const [socketError, setSocketError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const selectedUserRef = useRef(selectedUser);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if (!token || !username) {
            router.push("/login");
            return;
        }
        setCurrentUser(username);

        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsers();
                setUsers(usersData);
                setFilteredUsers(usersData);
                // ✅ FIXED: Replaced 'any' with proper error handling
            } catch (err) {
                if (err instanceof Error) {
                    setSocketError(err.message || "Failed to fetch users");
                } else {
                    setSocketError("An unknown error occurred while fetching users.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

        // Connect to WebSocket with all necessary callbacks
        connectWebSocket({
            onMessage: (msg: ChatMessage) => {
                const activeUser = selectedUserRef.current;
                if (
                    activeUser &&
                    ((msg.sender === username && msg.receiver === activeUser.username) ||
                        (msg.sender === activeUser.username && msg.receiver === username))
                ) {
                    setMessages((prev) => [...prev, msg]);
                }
            },
            onConnectCallback: () => {
                setIsConnected(true);
                setSocketError(null);
            },
            onError: (err) => {
                setIsConnected(false);
                setSocketError(err);
            }
        });

        // Cleanup on component unmount
        return () => disconnectWebSocket();
    }, [router]);



    // Handler functions
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value.toLowerCase();
        setSearch(q);
        setFilteredUsers(users.filter((u) => (u.username || "").toLowerCase().includes(q)));
    };

    const handleUserSelect = async (u: UserResponse) => {
        setSelectedUser(u);
        setMessages([]); // Clear previous messages before fetching new ones
        try {
            const data = await getChatMessages(u.username);
            setMessages(data);
        } catch (err) {
            console.error("Failed to fetch messages for user:", u.username, err);
            setMessages([]);
        }
    };

    const handleSend = () => {
        if (!selectedUser || !input.trim() || !isConnected) return;
        const newMsg: ChatMessage = {
            receiver: selectedUser.username,
            content: input.trim(),
        };
        sendChatMessage(newMsg);
        setInput("");
    };

    const handleLogout = async () => {
        await logoutUser();
        disconnectWebSocket();
        router.push("/login");
    };

    // Loading state UI
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    // Main component render
    return (
        <div className="h-screen grid grid-cols-1 md:grid-cols-[320px_1fr] bg-gray-50">
            {/* Sidebar */}
            <aside className="border-r bg-white p-4 flex flex-col text-gray-600">
                {/* Fixed Sidebar Header */}
                <div className="flex-shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Chats</h2>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                            Logout
                        </button>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search"
                        className="w-full border px-3 py-2 rounded-lg"
                    />
                </div>

                {/* Scrollable User List */}
                <div className="flex-1 overflow-y-auto mt-4">
                    {filteredUsers
                        .filter(u => u.username !== currentUser)
                        .map((u) => (
                            <div
                                key={u.id}
                                onClick={() => handleUserSelect(u)}
                                className={`p-3 cursor-pointer rounded-lg transition-colors mb-1 ${
                                    selectedUser?.id === u.id
                                        ? "bg-blue-500 text-white font-semibold"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                {u.username}
                            </div>
                        ))}
                </div>
            </aside>

            {/* Chat Window */}
            <main className="flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        {/* ✅ MODIFIED: This is the fixed chat header */}
                        <div className="flex-shrink-0">
                            <ChatHeader user={selectedUser} isConnected={isConnected} />
                        </div>

                        {/* ✅ MODIFIED: This is the scrollable message area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex flex-col ${m.sender === currentUser ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`px-4 py-2 rounded-lg max-w-md break-words ${
                                            m.sender === currentUser
                                                ? "bg-blue-600 text-white rounded-br-none"
                                                : "bg-gray-200 text-gray-800 rounded-bl-none"
                                        }`}
                                    >
                                        {m.content}
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1 px-1">
                                        {formatTimestamp(m.timestamp)}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ✅ MODIFIED: This is the fixed chat footer/input area */}
                        <div className="flex-shrink-0 p-4 border-t bg-gray-50 flex flex-col">
                            {socketError && <div className="text-red-500 text-sm mb-2 text-center">{socketError}</div>}
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-600 disabled:bg-gray-200"
                                    placeholder={isConnected ? "Type a message" : "Connecting..."}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={!isConnected}
                                />
                                <button
                                    onClick={handleSend}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={!isConnected || !input.trim()}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <h2 className="text-xl font-medium mt-2">Welcome to the Chat</h2>
                        <p>Select a user from the sidebar to start a conversation.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

