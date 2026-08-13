import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-6xl mx-auto px-6 py-10 flex justify-center gap-3">
                <span className="text-gray-400 self-center">This Page Only For Fun</span>
            </div>

            <div className="border-t border-gray-700">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                    <Link href="/" className="hover:text-white transition-colors">
                        Home
                    </Link>
                    <span className="text-gray-600">|</span>
                    <Link href="/login" className="hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link href="/register" className="hover:text-white transition-colors">
                        Sign Up
                    </Link>
                </div>
            </div>

            <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-800">
                <p>TrackerList &copy; {new Date().getFullYear()} — Built for learning purposes.</p>
                <p className="mt-1">
                    Movie data powered by TMDB. Anime data powered by Jikan (MyAnimeList unofficial API).
                </p>
            </div>
        </footer>
    );
}