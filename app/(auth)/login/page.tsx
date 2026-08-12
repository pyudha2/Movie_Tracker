"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            toast.error("Invalid email or password");
            return;
        }

        toast.success("Login successful");
        router.push("/");
    };

    return (
        <form className="bg-white min-h-screen" onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)
                }
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
            <button className="text-white bg-blue-600 hover:bg-blue-700 text-lg font-bold py-2 px-4 rounded-xl" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form >
    );
}