import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import WelcomeOverlay from "@/components/auth/WelcomeOverlay";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types/product";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Category[] = [];
  try {
    categories = await categoryService.getAll();
  } catch {
    categories = [];
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <CartDrawer />
      <WelcomeOverlay />
    </>
  );
}
