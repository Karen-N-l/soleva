export default function Footer() {
  const shopLinks = [
    ["Men", "/men"],
    ["Women", "/women"],
    ["Kids", "/kids"],
    ["New Drops", "/new-drops"],
  ];

  const customerLinks = [
    ["Account", "/account"],
    ["Cart", "/cart"],
    ["Checkout", "/checkout"],
  ];

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-7 lg:px-10 lg:py-16">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a
              href="/"
              className="text-[18px] font-bold tracking-tight"
            >
              SOLEVA
            </a>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
              Everyday sneakers designed for comfort, movement,
              and effortless style.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-medium">
              Shop
            </h3>

            <div className="mt-5 space-y-3">
              {shopLinks.map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  className="block w-fit text-sm text-gray-400 transition hover:text-white"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-sm font-medium">
              Customer
            </h3>

            <div className="mt-5 space-y-3">
              {customerLinks.map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  className="block w-fit text-sm text-gray-400 transition hover:text-white"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-gray-500">
            © 2026 SOLEVA. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">

            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition hover:border-white hover:text-white"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="0.8"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="#"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition hover:border-white hover:text-white"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 4V15.5A4.5 4.5 0 1 1 10 11" />
                <path d="M14 4C15 6.5 17 8 20 8" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition hover:border-white hover:text-white"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 21V13H17L17.5 10H14V8.5C14 7.5 14.5 7 15.8 7H17.5V4.2C17 4.1 15.8 4 14.5 4C11.8 4 10 5.7 10 8.4V10H7V13H10V21" />
              </svg>
            </a>

          </div>
        </div>

      </div>
    </footer>
  );
}