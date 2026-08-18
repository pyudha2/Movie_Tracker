"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "Password minimal 6 karakter"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password gak sama",
        path: ["confirmPassword"],
    });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) {
            setErrorMessage("Token gak ditemukan di URL");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            await axios.post("/api/auth/reset-password", {
                token,
                password: data.password,
            });
            setIsSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Terjadi kesalahan, coba lagi nanti");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <h1 className="text-2xl font-bold">Link Gak Valid</h1>
                    <p className="text-gray-400">
                        Token reset password gak ditemukan. Pastiin lo klik link lengkap dari email.
                    </p>
                    <Link href="/forgot-password" className="text-indigo-500 hover:underline inline-block mt-4">
                        Minta Link Baru
                    </Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <h1 className="text-2xl font-bold">Password Berhasil Diubah</h1>
                    <p className="text-gray-400">Lo bakal diarahin ke halaman login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-gray-400 mt-2">Masukin password baru lo.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm mb-1">
                            Password Baru
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm mb-1">
                            Konfirmasi Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword")}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 font-medium"
                    >
                        {isLoading ? "Menyimpan..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}