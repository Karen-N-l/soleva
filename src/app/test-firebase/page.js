"use client";

import { useEffect, useState } from "react";
import { getProducts } from "../../lib/firestore";

export default function TestFirebasePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        console.log("Firebase products:", data);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white p-10">
      <h1 className="text-3xl font-semibold text-black">
        Firebase Test
      </h1>

      {error && (
        <p className="mt-5 text-red-600">
          Error: {error}
        </p>
      )}

      <p className="mt-5 text-gray-600">
        Products found: {products.length}
      </p>

      <pre className="mt-6 overflow-auto bg-gray-100 p-5 text-sm">
        {JSON.stringify(products, null, 2)}
      </pre>
    </main>
  );
}