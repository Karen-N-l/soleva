"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    ["Home", "/"],
    ["Shop", "/shop"],
    ["Men", "/men"],
    ["Women", "/women"],
    ["Kids", "/kids"],
    ["New Drops", "/new-drops"],
  ];

  const icons = [
    {
      label: "Search",
      href: "/search",
      icon: (
        <>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16L21 21" />
        </>
      ),
    },
    {
      label: "Cart",
      href: "/cart",
      icon: (
        <>
          <path d="M4 5H6L8 17H19L21 8H7" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </>
      ),
    },
    {
      label: "Account",
      href: "/account",
      icon: (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20C6 16.5 8.2 14.5 12 14.5C15.8 14.5 18 16.5 19 20" />
        </>
      ),
    },
  ];

  return (
    <nav className="bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-[16px] font-bold tracking-tight text-black"
        >
          SOLEVA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 md:flex lg:gap-7">
          {links.map(([name, href]) => (
            <Link
              key={name}
              href={href}
              className="whitespace-nowrap text-[14px] font-medium text-black transition-colors hover:text-[#d71920]"
            >
              {name}
            </Link>
          ))}
        </div>

        {/* Desktop Icons */}
        <div className="hidden items-center gap-4 md:flex lg:gap-5">
          {icons.map(({ label, href, icon }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              title={label}
              className="flex h-9 w-9 items-center justify-center text-black transition-colors hover:text-[#d71920]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {icon}
              </svg>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center text-black md:hidden"
        >
          <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <>
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 8H20" />
                <path d="M4 16H20" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto max-w-[1400px] px-5 py-3 sm:px-7">
            {links.map(([name, href]) => (
              <Link
                key={name}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-gray-100 py-4 text-[15px] font-medium text-black transition-colors hover:text-[#d71920]"
              >
                {name}
              </Link>
            ))}

            <div className="flex items-center gap-3 py-5">
              {icons.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-black transition-colors hover:border-[#d71920] hover:text-[#d71920]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {icon}
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}