import { CarritoProvider } from "./context/CarritoContext";
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
    default: "Miscelánea 2 Hermanos | Abarrotes en Pinotepa Nacional",
    template: "%s | Miscelánea 2 Hermanos",
  },

  description:
  "Miscelánea 2 Hermanos en Santiago Pinotepa Nacional, Oaxaca. Tienda de abarrotes, bebidas, botanas, lácteos, limpieza y servicio a domicilio.",

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
verification: {
  google: "rUGccK4mcnB7kvj5NIk98ATDfE7g7A-b0wMeORPVQLI",
},
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: "Miscelánea 2 Hermanos",

    title: "Miscelánea 2 Hermanos | Abarrotes en Pinotepa Nacional",

    description:
      "Miscelánea 2 Hermanos en Santiago Pinotepa Nacional, Oaxaca. Tienda de abarrotes, bebidas, botanas, lácteos, limpieza y servicio a domicilio.",

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
      "Miscelánea 2 Hermanos en Santiago Pinotepa Nacional, Oaxaca. Tienda de abarrotes, bebidas, botanas, lácteos, limpieza y servicio a domicilio.",

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

  <CarritoProvider>
    {children}
  </CarritoProvider>
</body>
    </html>
  );
}   