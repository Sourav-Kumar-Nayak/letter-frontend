import {router} from "next/client";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACK_END_API_URL || "http://localhost:8081/api";

interface LoginResponse {
    token: string;
    [key: string]: any;
}

interface RegisterResponse {
    message: string;
    [key: string]: any;
}

export async function loginUser(usernameOrEmail: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("username", data.data.username);
    return data;
}

export async function registerUser(name: string, email: string, password: string): Promise<RegisterResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Registration failed");

    return data;
}

export async function logoutUser() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Logout failed");
    }

    // Remove token from localStorage
    localStorage.removeItem("token");
    return true;
}
