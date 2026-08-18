"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

const forgotPasswordSchema = z.object({
    email: z.string().email("Format email gak valid"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            await axios.post("/api/auth/forgot-password", data);
            setIsSent(true);
        } catch (error) {
            setErrorMessage("Terjadi kesalahan, coba lagi nanti");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <h1 className="text-2xl font-bold">Cek Email Lo</h1>
                    <p className="text-gray-400">
                        Kalo email lo terdaftar, link buat reset password udah dikirim. Cek inbox (atau folder spam) lo.
                    </p>
                    <Link href="/login" className="text-indigo-500 hover:underline inline-block mt-4">
                        Balik ke Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Lupa Password</h1>
                    <p className="text-gray-400 mt-2">
                        Masukin email lo, nanti kita kirimin link buat reset password.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500"
                            placeholder="email@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 font-medium"
                    >
                        {isLoading ? "Mengirim..." : "Kirim Link Reset"}
                    </button>
                </form>

                <Link href="/login" className="text-indigo-500 hover:underline text-sm block text-center">
                    Balik ke Login
                </Link>
            </div>
        </div>
    );
}