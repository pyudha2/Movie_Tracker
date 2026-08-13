"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await signIn("credentials", {
            name,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            toast.error("Invalid name or password");
            return;
        }

        toast.success("Login successful");
        router.push("/");
    };

    return (
        <div className="bg-gray-300 min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white flex flex-col items-center justify-center border-2 border-black rounded-xl shadow-lg w-64 p-8">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4 text-black text-center">Login to TrackerList</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="text-black border-2 border-black p-2 mb-4 rounded-xl"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="text-black border-2 border-black p-2 mb-4 rounded-xl"
                    />
                    <div className="flex flex-col items-center justify-center">
                        <button className="text-white bg-blue-600 hover:bg-blue-700 text-lg font-bold py-2 px-4 rounded-xl" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <Link href="/forgot-password" className="text-blue-600 hover:underline text-sm mt-3">
                            Forgot Password?
                        </Link>

                        <Link href="/register" className="text-black hover:underline text-sm mt-3">
                            Don&apos;t have an account? <span className="font-bold">Sign Up</span>
                        </Link>
                    </div>
                </form >
            </div>
        </div>
    );
}