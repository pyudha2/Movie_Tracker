"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
    OAuthAccountNotLinked:
        "Email ini sudah terdaftar dengan metode login lain. Coba login pakai Name & Password.",
    OAuthCallback: "Gagal memproses callback dari Google. Coba lagi.",
    OAuthCreateAccount: "Gagal membuat akun dari Google. Coba lagi.",
    AccessDenied: "Akses ditolak. Coba lagi.",
    Configuration: "Konfigurasi server bermasalah. Hubungi admin.",
};

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            const message = GOOGLE_ERROR_MESSAGES[error] ?? `Login gagal: ${error}`;
            toast.error(message);
            router.replace("/login");
        }
    }, [searchParams, router]);

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

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        await signIn("google", { callbackUrl: "/" });
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
                        <button className="text-white bg-blue-600 hover:bg-blue-700 text-lg font-bold py-2 px-4 rounded-xl w-full" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <Link href="/forgot-password" className="text-blue-600 hover:underline text-sm mt-3">
                            Forgot Password?
                        </Link>

                        <Link href="/register" className="text-black hover:underline text-sm mt-3">
                            Don&apos;t have an account? <span className="font-bold">Sign Up</span>
                        </Link>
                    </div>
                </form>

                <div className="flex items-center w-full my-4">
                    <div className="flex-1 border-t-2 border-black" />
                    <span className="px-2 text-black text-sm">atau</span>
                    <div className="flex-1 border-t-2 border-black" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="flex items-center justify-center gap-2 w-full border-2 border-black rounded-xl py-2 px-4 text-black font-bold hover:bg-gray-100 disabled:opacity-50"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {googleLoading ? "Menghubungkan..." : "Login dengan Google"}
                </button>
            </div>
        </div>
    );
}