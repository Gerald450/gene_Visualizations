"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-blue-700">Virulence Insights</h1>
      <div className="space-x-6">
        <Link href="/">Home</Link>
        <Link href="/visuals">Visualizations</Link>
        <Link href="/about">About</Link>
      </div>
    </nav>
  );
}
