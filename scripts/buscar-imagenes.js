require("dotenv").config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const API_KEY = process.env.SERPAPI_KEY;

if (!API_KEY) {
  console.error("❌ No se encontró SERPAPI_KEY en .env.local");
  process.exit(1);
}

const productosPath = path.join(
  process.cwd(),
  "data",
  "productos.js"
);

const productosTexto = fs.readFileSync(productosPath, "utf8");

const productos = eval(
  productosTexto
    .replace("const productos =", "global.productos =")
    .replace("export default productos;", "")
);

global.productos = productos;

const carpetaImagenes = path.join(
  process.cwd(),
  "public",
  "productos"
);

fs.mkdirSync(carpetaImagenes, { recursive: true });

async function buscarImagen(producto) {
  const consulta = `${producto.marca} ${producto.nombre} ${producto.presentacion}`;

  console.log(`🔎 Buscando: ${consulta}`);

  const respuesta = await axios.get(
    "https://serpapi.com/search.json",
    {
      params: {
        engine: "google_images",
        q: consulta,
        api_key: API_KEY,
        safe: "active",
      },
    }
  );

  const resultados = respuesta.data.images_results;

  if (!resultados || resultados.length === 0) {
    console.log(`⚠️ No se encontró imagen para: ${producto.nombre}`);
    return;
  }

  const imagenUrl = resultados[0].original;

  if (!imagenUrl) {
    console.log(`⚠️ Resultado sin imagen: ${producto.nombre}`);
    return;
  }

  try {
    const imagen = await axios.get(imagenUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
    });

    const extension = imagen.headers["content-type"]?.includes("png")
      ? "png"
      : "jpg";

    const nombreArchivo = `${producto.id}.${extension}`;

fs.writeFileSync(
  path.join(carpetaImagenes, nombreArchivo),
  imagen.data
);

// Relacionar el producto con su imagen
producto.imagen = `/productos/${nombreArchivo}`;

console.log(`✅ Imagen guardada: ${nombreArchivo}`);
  } catch (error) {
    console.log(`❌ No se pudo descargar: ${producto.nombre}`);
  }
}

async function iniciar() {
  console.log("🚀 Iniciando búsqueda de imágenes...\n");

  // PRUEBA: solamente los primeros 5 productos
  const prueba = productos;

  for (const producto of prueba) {
    await buscarImagen(producto);

    // Pequeña pausa entre búsquedas
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  console.log("\n🎉 Prueba terminada.");
}

iniciar();
