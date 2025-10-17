"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const goToLogin = () => {
        router.push("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-200 space-y-6">
            <h1 className="text-4xl font-bold text-white">
                Hello, Next.js + Tailwind!
            </h1>

            <button
                onClick={goToLogin}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-100 transition"
            >
                Go to Login
            </button>
        </div>
    );
}
