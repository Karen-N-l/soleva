"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="px-5 py-12 sm:px-7 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1400px]">
          {/* Heading */}
          <div className="mb-10">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
              Your Selection
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              Shopping Cart
            </h1>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-semibold text-black">
                Your cart is empty
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                You haven't added any sneakers to your cart yet.
              </p>

              <Link
                href="/shop"
                className="mt-7 bg-black px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#d71920]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
              {/* Cart Items */}
              <div>
                <div className="border-t border-gray-200">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex flex-col gap-5 border-b border-gray-200 py-6 sm:flex-row"
                    >
                      {/* Image */}
                      <div className="relative h-32 w-full shrink-0 overflow-hidden bg-[#f5f5f3] sm:h-36 sm:w-36">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="144px"
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between gap-5">
                        <div className="flex items-start justify-between gap-5">
                          <div>
                            <p className="text-xs text-gray-500">
                              {item.category === "Kids"
                                ? "Kids' Sneakers"
                                : `${item.category}'s Sneakers`}
                            </p>

                            <h2 className="mt-1 text-base font-medium text-black">
                              {item.name}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                              Size: {item.size}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-medium text-black">
                            KSh {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-200">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  item.quantity - 1,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-lg text-black transition hover:bg-gray-50"
                            >
                              −
                            </button>

                            <span className="flex h-9 w-10 items-center justify-center border-x border-gray-200 text-sm">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  item.quantity + 1,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-lg text-black transition hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-xs text-gray-500 underline underline-offset-4 transition hover:text-[#d71920]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <aside className="h-fit bg-[#f5f5f3] p-6 sm:p-8">
                <h2 className="text-lg font-medium text-black">
                  Order Summary
                </h2>

                <div className="mt-6 flex items-center justify-between border-b border-gray-200 pb-5">
                  <span className="text-sm text-gray-500">Subtotal</span>

                  <span className="text-sm font-medium text-black">
                    KSh {cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-base font-medium text-black">
                    Total
                  </span>

                  <span className="text-base font-semibold text-black">
                    KSh {cartTotal.toLocaleString()}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-7 flex w-full items-center justify-center bg-black px-7 py-4 text-sm font-medium text-white transition hover:bg-[#d71920]"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="mt-4 flex w-full items-center justify-center text-sm text-gray-500 underline underline-offset-4 transition hover:text-black"
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
