import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { productService } from "@/services/product.service";
import { formatCurrency } from "@/utils/formatCurrency";
import AddToCartButton from "./AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await productService.getById(id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag size={48} className="text-surface mb-4" />
        <p className="text-muted">Producto no encontrado</p>
        <Link
          href="/products"
          className="mt-4 rounded-full bg-dark px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-white hover:bg-ink transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Volver a la tienda
      </Link>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag size={60} className="text-surface" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center space-y-6">
          {product.category && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              {product.category.name}
            </span>
          )}

          <h1 className="font-heading text-4xl lg:text-5xl">{product.name}</h1>

          <p className="text-2xl font-semibold text-accent">
            {formatCurrency(Number(product.price))}
          </p>

          <p className="text-sm leading-relaxed text-muted max-w-md">
            {product.description ?? "Sin descripcion disponible."}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                product.stock > 0 ? "bg-green-500" : "bg-red-400"
              }`}
            />
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : "Agotado"}
          </div>

          <AddToCartButton productId={product.id} inStock={product.stock > 0} />
        </div>
      </div>
    </div>
  );
}
