import StructuredData from "./components/StructuredData";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://miscelanea-dos-hermanos.vercel.app"),

  title: {
    default: "Miscelánea 2 Hermanos | Abarrotes y servicio a domicilio",
    template: "%s | Miscelánea 2 Hermanos",
  },

  description:
    "Miscelánea 2 Hermanos: abarrotes, bebidas, botanas, lácteos, helados, productos de limpieza, ferretería y más. Compra fácil y servicio a domicilio.",

  keywords: [
    "Miscelánea 2 Hermanos",
    "tienda de abarrotes",
    "abarrotes",
    "servicio a domicilio",
    "bebidas",
    "botanas",
    "lácteos",
    "helados",
    "productos de limpieza",
    "ferretería",
    "tienda de conveniencia",
  ],

  authors: [
    {
      name: "Miscelánea 2 Hermanos",
    },
  ],

  creator: "Miscelánea 2 Hermanos",
  publisher: "Miscelánea 2 Hermanos",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: "Miscelánea 2 Hermanos",

    title: "Miscelánea 2 Hermanos | Todo lo que necesitas cerca de ti",

    description:
      "Abarrotes, bebidas, botanas, lácteos, helados, limpieza, ferretería y más. Compra fácil y servicio a domicilio.",

    images: [
      {
        url: "/Sliders/IMG009.png",
        width: 1536,
        height: 1024,
        alt: "Miscelánea 2 Hermanos - atención y servicio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Miscelánea 2 Hermanos",

    description:
      "Abarrotes, bebidas, botanas, lácteos, helados, limpieza, ferretería y más.",

    images: ["/Sliders/IMG009.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}