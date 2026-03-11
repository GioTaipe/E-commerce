import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import ToastContainer from "@/components/ui/ToastContainer";
import "../styles/globals.css";

export const metadata = {
  title: "TechZone — Tu universo tech",
  description: "Laptops, PC gaming, perifericos y mas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-bg text-ink min-h-screen flex flex-col">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
