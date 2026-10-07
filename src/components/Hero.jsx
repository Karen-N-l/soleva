import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1400px] items-center gap-10 px-5 py-12 sm:px-7 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-16">

        {/* Hero Text */}
        <div className="max-w-xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
            New Season
          </p>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-black sm:text-6xl lg:text-7xl">
            Find your next favorite pair.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
            Discover everyday sneakers designed for comfort, movement,
            and effortless style.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/shop"
              className="bg-black px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#d71920]"
            >
              Shop Now
            </a>

            <a
              href="/new-drops"
              className="border border-black px-7 py-3.5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
            >
              New Drops
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative flex min-h-[420px] items-center justify-center sm:min-h-[500px] lg:min-h-[600px]">
          <div className="relative h-[400px] w-full sm:h-[500px] lg:h-[600px]">
            <Image
              src="/images/images-1.jpg"
              alt="SOLEVA sneakers"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain mix-blend-multiply"
            />
          </div>
        </div>

      </div>
    </section>
  );
}