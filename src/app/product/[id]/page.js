"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import products from "../../../data/products";
import { useCart } from "../../../context/CartContext";

export default function ProductPage({ params }) {
  const { id } = use(params);

  const product = products.find((item) => item.id === Number(id));

  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const sizes = ["36", "37", "38", "39", "40", "41", "42", "43"];

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setMessage("Please select a size.");
      return;
    }

    addToCart(product, selectedSize, quantity);
    setMessage("Added to cart.");
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />

        <section className="flex min-h-[60vh] items-center justify-center px-5">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-black">
              Product not found
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              The product you are looking for does not exist.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-[#d71920]"
            >
              Back to Shop
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="px-5 py-12 sm:px-7 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden bg-[#f5f5f3]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            {product.isNew && (
              <span className="absolute left-4 top-4 bg-black px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-white">
                New
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
              {product.category === "Kids"
                ? "Kids' Sneakers"
                : `${product.category}'s Sneakers`}
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-xl font-medium text-black">
              KSh {product.price.toLocaleString()}
            </p>

            <p className="mt-6 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
              Designed for everyday movement, comfort, and effortless style.
              Discover a versatile sneaker made for every step.
            </p>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-black">Select Size</p>

                <button
                  type="button"
                  className="text-xs text-gray-500 underline underline-offset-4"
                >
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setMessage("");
                    }}
                    className={`border py-3 text-sm transition ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-200 text-black hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-sm font-medium text-black">Quantity</p>

              <div className="flex w-fit items-center border border-gray-200">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="flex h-11 w-11 items-center justify-center text-lg text-black transition hover:bg-gray-50"
                >
                  −
                </button>

                <span className="flex h-11 w-12 items-center justify-center border-x border-gray-200 text-sm">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="flex h-11 w-11 items-center justify-center text-lg text-black transition hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 w-full bg-black px-7 py-4 text-sm font-medium text-white transition hover:bg-[#d71920]"
            >
              Add to Cart
            </button>

            {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}

            <Link
              href="/shop"
              className="mt-4 text-center text-sm text-gray-500 underline underline-offset-4 transition hover:text-black"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
