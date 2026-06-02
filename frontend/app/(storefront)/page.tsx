import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import type { Product, Category } from "@/types/product";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ProductsCarousel from "@/components/home/ProductsCarousel";
import ScrollVideoFeatures from "@/components/home/ScrollVideoFeatures";
import CategoriesExplorer from "@/components/home/CategoriesExplorer";
import Acabados from "@/components/home/Acabados";
import FeatureBand from "@/components/home/FeatureBand";
import Newsletter from "@/components/home/Newsletter";

export default async function HomePage() {
  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    [products, categories] = await Promise.all([
      productService.getAll(),
      categoryService.getAll(),
    ]);
  } catch {
    products = [];
    categories = [];
  }

  return (
    <>
      <Marquee />
      <Hero products={products} />
      <ProductsCarousel products={products} />
      <ScrollVideoFeatures />
      <CategoriesExplorer categories={categories} products={products} />
      <Acabados />
      <FeatureBand />
      <Newsletter />
    </>
  );
}
