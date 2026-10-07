export default function PromoSection() {
  return (
    <section className="bg-white px-5 py-20 sm:px-7 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative overflow-hidden bg-black px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          
          {/* Content */}
          <div className="relative z-10 max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#d71920]">
              New Collection
            </p>

            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Step into something new.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-gray-300 sm:text-base">
              Discover fresh styles made for everyday movement, comfort,
              and effortless streetwear.
            </p>

            <a
              href="/new-drops"
              className="mt-8 inline-flex bg-white px-7 py-3.5 text-sm font-medium text-black transition hover:bg-[#d71920] hover:text-white"
            >
              Explore New Drops
            </a>
          </div>

          {/* Decorative Shapes */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d71920] opacity-90 sm:h-80 sm:w-80" />

          <div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full border border-white/10 sm:h-64 sm:w-64" />
        </div>
      </div>
    </section>
  );
}