import React from "react";
import {Link, useNavigate} from "react-router";
import {useAuthContext} from "../context/AuthContext";

function Header() {
    const {user, logoutUser} = useAuthContext();
    useNavigate();
    const displayName = user?.username || "Guest";
    const initial = displayName?.charAt(0)?.toUpperCase() || "G";
    return (
        <header className="fixed top-0 inset-x-0 z-40 bg-black/70 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    {/* Brand */}
                    <Link to={"/"} className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white grid place-items-center ring-1 ring-indigo-400/50 shadow-sm">
                            ₹
                        </div>
                        <div className="min-w-0 leading-tight">
                            <div className="text-base sm:text-lg font-semibold text-white">Expense Mate</div>
                            <div className="hidden sm:block text-[11px] text-gray-300">Track smarter, spend better</div>
                        </div>
                    </Link>

                    {/* Menu Links */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link
                            to={"/dashboard"}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-900 hover:bg-gray-100 transition"
                        >
                            Dashboard
                        </Link>
                        <a
                            href="#"
                            className="px-3 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-900 hover:bg-gray-100 transition"
                        >
                            Reports
                        </a>
                        <a
                            href="#"
                            className="px-3 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-900 hover:bg-gray-100 transition"
                        >
                            Categories
                        </a>
                        <a
                            href="#"
                            className="px-3 py-2 rounded-lg text-sm font-medium text-white hover:text-gray-900 hover:bg-gray-100 transition"
                        >
                            Settings
                        </a>
                    </nav>

                    {/* Auth */}
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-800 transition">
                                <Link to={"/login"}>Login</Link>
                            </button>
                            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition">
                                <Link to={"/signup"}>Signup</Link>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 ring-1 ring-gray-200">
                                <div className="h-7 w-7 rounded-full bg-indigo-600 text-white grid place-items-center text-xs font-bold">
                                    {initial}
                                </div>
                                <span className="text-sm font-medium text-gray-800 max-w-[10rem] truncate">
                                    {displayName}
                                </span>
                            </div>
                            <button className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition">
                                <Link
                                    onClick={(e) => {
                                        logoutUser();
                                    }}
                                    to={"#"}
                                >
                                    Logout
                                </Link>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
