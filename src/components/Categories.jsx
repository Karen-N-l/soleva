
import Image from "next/image";

const categories = [
  {
    name: "Men",
    image: "/images/images-4.jpg",
    href: "/men",
  },
  {
    name: "Women",
    image: "/images/images-3.jpg",
    href: "/women",
  },
  {
    name: "Kids",
    image: "/images/images-5.jpg",
    href: "/kids",
  },
];

export default function Categories() {
  return (
    <section className="bg-white px-5 py-20 sm:px-7 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1400px]">

        {/* Section Heading */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
            Shop By Category
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            Find your style
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
            Explore sneakers selected for every style and every step.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden bg-[#f5f5f3]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={category.image}
                  alt={`${category.name} sneakers`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-center justify-between bg-white px-5 py-4">
                  <h3 className="text-base font-medium text-black">
                    {category.name}
                  </h3>

                  <span className="text-sm text-gray-500 transition group-hover:text-[#d71920]">
                    Shop →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}