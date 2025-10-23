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
        { label: "Interactive Demo", href: "#demo" },
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
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <SmoothScrollLink href="#hero" className="text-2xl font-bold tracking-tight">
          <span className="text-gray-900">Virulence</span>{" "}
          <span className="text-blue-600">Insights</span>
        </SmoothScrollLink>

        <div className="hidden md:flex space-x-8 text-gray-700 font-medium relative">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className="relative"
              onMouseEnter={() => setOpenTab(tab.name)}
              onMouseLeave={() => setOpenTab(null)}
            >
              <button className="hover:text-blue-600 transition">{tab.name}</button>

              {openTab === tab.name && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fadeIn">
                  {tab.options.map((opt) => (
                    <SmoothScrollLink
                      key={opt.label}
                      href={opt.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      {opt.label}
                    </SmoothScrollLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <SmoothScrollLink
          href="#visuals"
          className="hidden md:inline-flex px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          Explore
        </SmoothScrollLink>
      </div>
    </nav>
  );
}
