"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session, status } = useSession();

    return (
        <div className="bg-white flex justify-between w-full px-6 py-4 border-b border-gray-400">
            <Link href="/" className="text-xl font-bold text-black self-center">
                TrackerList
            </Link>

            <div className="flex justify-end self-center">
                {status === "loading" ? null : session ? (
                    <>
                        <Link
                            href="/watchlist"
                            className="ml-4 self-center text-black font-medium hover:underline"
                        >
                            Watchlist
                        </Link>
                        <Link
                            href="/dashboard"
                            className="ml-4 self-center text-black font-medium hover:underline"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/profile"
                            className="ml-4 self-center text-black font-medium hover:underline"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/reviews"
                            className="ml-4 self-center text-black font-medium hover:underline"
                        >
                            My Reviews
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="ml-4 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors border border-gray-500"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="ml-4 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors border border-gray-500"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors border border-gray-500"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}