import Link from "next/link";
import type { Category } from "@/types/product";

interface FooterProps {
  categories: Category[];
}

export default function Footer({ categories }: FooterProps) {
  return (
    <footer className="bg-black text-muted text-[12px] leading-[1.5] px-[22px] pt-8 pb-6 border-t border-white/[0.06]">
      <div className="max-w-[1024px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-6 border-b border-white/[0.08]">
          <div>
            <h4 className="text-ink text-[12px] font-semibold m-0 mb-3">Explorar</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              <li><Link href="/#inicio" className="hover:underline">Inicio</Link></li>
              <li><Link href="/#productos" className="hover:underline">Productos</Link></li>
              <li><Link href="/#categorias" className="hover:underline">Categorías</Link></li>
              <li><Link href="/#estilos" className="hover:underline">Estilos</Link></li>
              <li><Link href="/#porque" className="hover:underline">Por qué TechZone</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-ink text-[12px] font-semibold m-0 mb-3">Categorías</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href="/#categorias" className="hover:underline">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-ink text-[12px] font-semibold m-0 mb-3">Servicios</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              <li><span>Envío y entrega</span></li>
              <li><span>Financiación</span></li>
              <li><Link href="/orders" className="hover:underline">Mis pedidos</Link></li>
              <li><span>Devoluciones</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-ink text-[12px] font-semibold m-0 mb-3">Cuenta</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              <li><Link href="/login" className="hover:underline">Iniciar sesión</Link></li>
              <li><Link href="/orders" className="hover:underline">Mis pedidos</Link></li>
              <li><Link href="/cart" className="hover:underline">Mi carrito</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-ink text-[12px] font-semibold m-0 mb-3">Soporte</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              <li><span>Contacto</span></li>
              <li><span>Centro de ayuda</span></li>
              <li><span>Garantías</span></li>
              <li><span>Reparaciones</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-[18px] flex flex-col sm:flex-row justify-between gap-2 text-[12px]">
          <span>© {new Date().getFullYear()} TechZone. Todos los derechos reservados.</span>
          <span className="flex gap-1.5">
            <span>Política de privacidad</span>
            <span>·</span>
            <span>Términos</span>
            <span>·</span>
            <span>Cookies</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
