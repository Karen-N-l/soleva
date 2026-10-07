"use client";

import Link from "next/link";
import { useState } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import products from "../../data/products";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const results = products.filter((product) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return false;

    return (
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    );
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="px-5 py-12 sm:px-7 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
              Find Your Pair
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              Search
            </h1>

            <div className="relative mt-8">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search sneakers..."
                autoFocus
                className="w-full border border-gray-200 px-5 py-4 pr-12 text-sm outline-none transition focus:border-black"
              />

              <svg
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16L21 21" />
              </svg>
            </div>
          </div>

          {!searchTerm.trim() ? (
            <div className="py-20 text-center">
              <p className="text-sm text-gray-500">
                Search for a sneaker or category.
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="mt-14">
              <div className="mb-8 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {results.length}{" "}
                  {results.length === 1 ? "result" : "results"} found
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <h2 className="text-xl font-medium text-black">
                No sneakers found
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Try searching for another sneaker or category.
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-flex bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-[#d71920]"
              >
                Browse All Sneakers
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}