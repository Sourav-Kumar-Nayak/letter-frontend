"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function LoginPage() {
    const [usernameOrEmail, setusernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await loginUser(usernameOrEmail, password);
            console.log("✅ Login success:");
            router.push("/chat");
        } catch (err: any) {
            console.error("❌ Login failed:", err);
            setError(err.message || "An unknown error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // The full-page loader is removed for better UX, as the loading state is now handled in the button.

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>

                {error && (
                    <div className="mb-4 text-red-600 font-semibold text-center p-2 bg-red-100 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Email or Username</label>
                        <input
                            type="text"
                            value={usernameOrEmail}
                            onChange={(e) => setusernameOrEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center text-white font-bold py-2 px-4 rounded transition-colors duration-300 ${
                            loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? <Spinner /> : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}