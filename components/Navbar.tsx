"use client";
import { useState } from "react";
import SmoothScrollLink from "./SmoothScrollLink";

export default function Navbar() {
  const [openTab, setOpenTab] = useState<string | null>(null);

  const tabs = [
    {
      name: "Home",
      options: [
        { label: "Overview", href: "#hero" },
        { label: "Highlights", href: "#features" },
      ],
    },
    {
      name: "Visuals",
      options: [
        { label: "Storylines", href: "#visuals" },
        { label: "Demo Section", href: "#demo" },
      ],
    },
    {
      name: "About",
      options: [
        { label: "Purpose", href: "#about" },
        { label: "Team", href: "#team" },
      ],
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="relative flex items-center justify-between max-w-7xl mx-auto px-8 py-4">
        {/* Left: Logo */}
        <SmoothScrollLink
          href="#hero"
          className="text-2xl font-bold tracking-tight whitespace-nowrap"
        >
          <span className="text-gray-900">Virulence</span>{" "}
          <span className="text-blue-600">Insights</span>
        </SmoothScrollLink>

        {/* Center: Absolutely centered navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-10 text-gray-700 font-medium">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className="relative group"
              onMouseEnter={() => setOpenTab(tab.name)}
              onMouseLeave={() => setOpenTab(null)}
            >
              <button className="hover:text-blue-600 transition">
                {tab.name}
              </button>

              {/* Dropdown menu */}
              {openTab === tab.name && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                  {tab.options.map((opt) => (
                    <SmoothScrollLink
                      key={opt.label}
                      href={opt.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                    >
                      {opt.label}
                    </SmoothScrollLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Explore button */}
        <SmoothScrollLink
          href="#visuals"
          className="hidden md:inline-flex px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap"
        >
          Explore
        </SmoothScrollLink>
      </div>
    </nav>
  );
}
