import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f5f5f3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {product.isNew && (
          <span className="absolute left-3 top-3 bg-black px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-white">
            New
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="pt-4">
        <p className="text-xs text-gray-500">
          {product.category}'s Sneakers
        </p>

        <div className="mt-1 flex items-start justify-between gap-4">
          <h3 className="text-sm font-medium text-black">
            {product.name}
          </h3>

          <p className="shrink-0 text-sm font-medium text-black">
            KSh {product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}