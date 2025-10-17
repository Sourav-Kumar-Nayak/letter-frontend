// lib/api/getAllUsers.ts
const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACK_END_API_URL || "http://localhost:8081/api";

export interface UserResponse {
    id: string;
    username: string;
    email?: string; // optional in case backend includes it
}


export async function getAllUsers(): Promise<UserResponse[]> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Token not found");
    const res = await fetch(`${API_BASE_URL}/user/all`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    if (!res.ok) {
        console.error("Error fetching users:", data);
        throw new Error(data.message || "Failed to fetch users");
    }

    console.log("Fetched users:");
    return data.data;
}

