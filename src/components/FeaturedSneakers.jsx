
import Image from "next/image";

const sneakers = [
  {
    name: "Aero Runner",
    category: "Men's Sneakers",
    price: "ksh 3500",
    image: "/images/images-2.jpg",
  },
  {
    name: "Nova Street",
    category: "Women's Sneakers",
    price: "ksh 3000",
    image: "/images/images-7.jpg",
  },
  {
    name: "Urban Flex",
    category: "Men's Sneakers",
    price: "ksh 4500",
    image: "/images/images-4.jpg",
  },
  {
    name: "Cloud Step",
    category: "Women's Sneakers",
    price: "ksh 4000",
    image: "/images/images-3.jpg",
  },
];

export default function FeaturedSneakers() {
  return (
    <section className="bg-white px-5 py-20 sm:px-7 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1400px]">

        {/* Section Heading */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
              Our Picks
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              Featured Sneakers
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              Explore some of our most popular styles, selected for everyday
              comfort and effortless wear.
            </p>
          </div>

          <a
            href="/shop"
            className="w-fit text-sm font-medium text-black underline underline-offset-4 transition hover:text-[#d71920]"
          >
            View all sneakers
          </a>
        </div>

        {/* Sneaker Grid */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {sneakers.map((sneaker) => (
            <article key={sneaker.name} className="group">

              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-[#f5f5f3]">
                <Image
                  src={sneaker.image}
                  alt={sneaker.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* Product Details */}
              <div className="pt-4">
                <p className="text-xs text-gray-500">
                  {sneaker.category}
                </p>

                <div className="mt-1 flex items-start justify-between gap-4">
                  <h3 className="text-sm font-medium text-black">
                    {sneaker.name}
                  </h3>

                  <p className="shrink-0 text-sm font-medium text-black">
                    {sneaker.price}
                  </p>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}