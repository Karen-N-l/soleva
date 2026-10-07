"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../lib/firestore";

export default function NewDropsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        const newProducts = data.filter(
          (product) => product.isNew === true
        );

        setProducts(newProducts);
      } catch (err) {
        setError("Unable to load new drops.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-white px-5 pb-12 pt-14 sm:px-7 lg:px-10 lg:pb-14 lg:pt-16">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
            Fresh Arrivals
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
            New Drops
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
            Discover the latest sneaker styles added to the
            SOLEVA collection.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-7 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-[1400px]">
          {loading && (
            <p className="py-10 text-sm text-gray-500">
              Loading new drops...
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
                  {products.length} new sneakers
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
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