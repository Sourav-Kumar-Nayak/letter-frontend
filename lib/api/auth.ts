import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ErrorResponse } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACK_END_API_URL || "http://localhost:8081/api";

export async function loginUser(usernameOrEmail: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password } as LoginRequest),
    });

    const data: unknown = await res.json();

    if (!res.ok) {
        const error = data as ErrorResponse;
        throw new Error(error.message || "Login failed due to an unknown error.");
    }

    const responseData = data as LoginResponse;
    if (responseData.data?.token && responseData.data?.username) {
        localStorage.setItem("token", responseData.data.token);
        localStorage.setItem("username", responseData.data.username);
    } else {
        throw new Error("Login response from server was malformed.");
    }

    return responseData;
}

export async function registerUser(name: string, email: string, password: string): Promise<RegisterResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password } as RegisterRequest),
    });

    const data: unknown = await res.json();

    if (!res.ok) {
        const error = data as ErrorResponse;
        throw new Error(error.message || "Registration failed due to an unknown error.");
    }

    return data as RegisterResponse;
}


export async function logoutUser(): Promise<void> {
    const token = localStorage.getItem("token");

    // If there's no token, the user is already logged out locally.
    if (!token) {
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorData: unknown = await res.json();
            const error = errorData as ErrorResponse;
            // Still attempt to log out locally even if server call fails
            console.error("Server logout failed:", error.message || "Unknown server error");
        }
    } catch (err) {
        console.error("Network error during logout:", err);
    } finally {
        // Always remove local credentials after attempting to log out.
        localStorage.removeItem("token");
        localStorage.removeItem("username");
    }
}
