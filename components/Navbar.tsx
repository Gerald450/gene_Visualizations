"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-gray-900">Virulence</span>{" "}
          <span className="text-blue-600">Insights</span>
        </Link>
        <div className="space-x-8 text-gray-700 font-medium hidden md:flex">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/visuals" className="hover:text-blue-600 transition">Visuals</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About</Link>
        </div>
        <Link
          href="/visuals"
          className="hidden md:inline-flex px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          Explore
        </Link>
      </div>
    </nav>
  );
}
