export default function StructuredData() {
  const datosNegocio = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",

    name: "Miscelánea 2 Hermanos",

    url: "https://miscelanea-dos-hermanos.vercel.app",

    image:
      "https://miscelanea-dos-hermanos.vercel.app/Sliders/IMG009.png",

    description:
      "Miscelánea 2 Hermanos ofrece abarrotes, bebidas, botanas, lácteos, helados, productos de limpieza, ferretería y servicio a domicilio.",

    address: {
      "@type": "PostalAddress",
      streetAddress: "Quinta Sur, Col. 5 de Mayo",
      addressLocality: "Santiago Pinotepa Nacional",
      addressRegion: "Oaxaca",
      postalCode: "71604",
      addressCountry: "MX",
    },

    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "06:00",
        closes: "21:00",
      },
    ],

    hasMap:
      "https://maps.google.com/maps?ftid=0x85b7e1778f070b65:0x5823a671f865e848",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(datosNegocio),
      }}
    />
  );
}