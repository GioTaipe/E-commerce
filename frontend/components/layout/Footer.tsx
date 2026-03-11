import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + about */}
          <div>
            <h3 className="font-logo text-2xl text-white mb-4">TechZone</h3>
            <p className="text-sm leading-relaxed">
              Tu tienda de tecnologia. Laptops, PC gaming, perifericos y
              accesorios de las mejores marcas.
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Tienda
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">Todos los productos</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Nuevos lanzamientos</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Mas vendidos</Link></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Ayuda
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-default">Envios y entregas</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Devoluciones</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Preguntas frecuentes</span></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Empresa
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-default">Sobre nosotros</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Garantias</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Contacto</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} TechZone. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
