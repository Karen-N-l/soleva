"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../lib/firestore";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["All", "Men", "Women", "Kids"];

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category?.trim().toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-white px-5 pb-12 pt-14 sm:px-7 lg:px-10 lg:pb-14 lg:pt-16">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
            Our Collection
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
            Shop Sneakers
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
            Explore our collection of sneakers designed for everyday
            comfort, movement, and style.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-7 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-gray-100 pb-5">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "border border-gray-200 text-gray-600 hover:border-black hover:text-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading && (
            <p className="py-10 text-sm text-gray-500">
              Loading sneakers...
            </p>
          )}

          {error && (
            <p className="py-10 text-sm text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="mb-8">
                <p className="text-sm text-gray-500">
                  {filteredProducts.length} sneakers
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}