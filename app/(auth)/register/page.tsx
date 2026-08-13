"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Registration failed");
                setLoading(false);
                return;
            }

            const loginResult = await signIn("credentials", {
                name,
                password,
                redirect: false,
            });

            if (loginResult?.error) {
                toast.error("Registered, but auto-login failed. Please login manually.");
                router.push("/login");
                return;
            }

            toast.success("Account created successfully");
            router.push("/");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-300 min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white flex flex-col items-center justify-center border-2 border-black rounded-xl shadow-lg w-64 p-8">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4 text-black text-center">Sign Up to TrackerList</h1>
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
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-black border-2 border-black p-2 mb-4 rounded-xl"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="text-black border-2 border-black p-2 mb-4 rounded-xl"
                    />
                    <div className="flex flex-col items-center justify-center">
                        <button className="text-white bg-blue-600 hover:bg-blue-700 text-lg font-bold py-2 px-4 rounded-xl" type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                        <Link href="/login" className="text-black hover:underline text-sm mt-3">
                            Already have an account? <span className="font-bold">Login</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}