"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

interface ProfileData {
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        provider: string;
        createdAt: string;
    };
    stats: {
        totalItems: number;
        totalMovies: number;
        totalAnime: number;
        averageRating: number;
        statusBreakdown: {
            PLAN_TO_WATCH: number;
            WATCHING: number;
            COMPLETED: number;
            DROPPED: number;
        };
    };
}

export default function ProfilePage() {
    const { update: updateSession } = useSession();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const { data, isLoading, isError } = useQuery<ProfileData>({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await axios.get("/api/profile");
            setName(res.data.user.name);
            return res.data;
        },
    });

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);

        try {
            const formData = new FormData();
            formData.append("avatar", file);

            await axios.post("/api/profile/upload-avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Foto profil berhasil diupdate");
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            await updateSession();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Gagal upload foto");
            }
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword && newPassword !== confirmPassword) {
            toast.error("Konfirmasi password gak sama");
            return;
        }

        setSavingProfile(true);

        try {
            await axios.patch("/api/profile", {
                name,
                currentPassword: currentPassword || undefined,
                newPassword: newPassword || undefined,
            });

            toast.success("Profil berhasil diupdate");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            await updateSession();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Gagal update profil");
            }
        } finally {
            setSavingProfile(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-red-500">Gagal memuat profil.</p>
            </div>
        );
    }

    const { user, stats } = data;
    const isGoogleUser = user.provider === "google";

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white border-2 border-black rounded-xl shadow-lg p-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-black bg-gray-200">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {!isGoogleUser && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingAvatar}
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full border border-black hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {uploadingAvatar ? "..." : "Edit"}
                                </button>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-black">{user.name}</h1>
                            <p className="text-gray-500">{user.email}</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Bergabung sejak {new Date(user.createdAt).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            {isGoogleUser && (
                                <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Login via Google
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white border-2 border-black rounded-xl shadow-lg p-8">
                    <h2 className="text-xl font-bold text-black mb-4">Statistik</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center border border-gray-300 rounded-xl p-4">
                            <p className="text-2xl font-bold text-black">{stats.totalItems}</p>
                            <p className="text-gray-500 text-sm">Total Item</p>
                        </div>
                        <div className="text-center border border-gray-300 rounded-xl p-4">
                            <p className="text-2xl font-bold text-black">{stats.totalMovies}</p>
                            <p className="text-gray-500 text-sm">Movies</p>
                        </div>
                        <div className="text-center border border-gray-300 rounded-xl p-4">
                            <p className="text-2xl font-bold text-black">{stats.totalAnime}</p>
                            <p className="text-gray-500 text-sm">Anime</p>
                        </div>
                        <div className="text-center border border-gray-300 rounded-xl p-4">
                            <p className="text-2xl font-bold text-black">{stats.averageRating || "-"}</p>
                            <p className="text-gray-500 text-sm">Avg Rating</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        <div className="text-center">
                            <p className="font-bold text-black">{stats.statusBreakdown.PLAN_TO_WATCH}</p>
                            <p className="text-gray-400 text-xs">Plan to Watch</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-black">{stats.statusBreakdown.WATCHING}</p>
                            <p className="text-gray-400 text-xs">Watching</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-black">{stats.statusBreakdown.COMPLETED}</p>
                            <p className="text-gray-400 text-xs">Completed</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-black">{stats.statusBreakdown.DROPPED}</p>
                            <p className="text-gray-400 text-xs">Dropped</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-2 border-black rounded-xl shadow-lg p-8">
                    <h2 className="text-xl font-bold text-black mb-4">Edit Profil</h2>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Nama</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full text-black border-2 border-black p-2 rounded-xl"
                            />
                        </div>

                        {!isGoogleUser && (
                            <>
                                <div className="border-t border-gray-300 pt-4">
                                    <p className="text-sm font-medium text-black mb-3">Ganti Password (opsional)</p>

                                    <div className="space-y-3">
                                        <input
                                            type="password"
                                            placeholder="Password lama"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full text-black border-2 border-black p-2 rounded-xl"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password baru"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full text-black border-2 border-black p-2 rounded-xl"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Konfirmasi password baru"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full text-black border-2 border-black p-2 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl disabled:opacity-50"
                        >
                            {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}