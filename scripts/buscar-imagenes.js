require("dotenv").config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_KEY = process.env.SERPAPI_KEY;

if (!API_KEY) {
  console.error("ERROR: No se encontro SERPAPI_KEY en .env.local");
  process.exit(1);
}

const productosPath = path.join(
  process.cwd(),
  "data",
  "productos.js"
);

const carpetaImagenes = path.join(
  process.cwd(),
  "public",
  "productos"
);

fs.mkdirSync(carpetaImagenes, {
  recursive: true,
});

// Leer productos.js
const productosTexto = fs.readFileSync(
  productosPath,
  "utf8"
);

try {
  eval(
    productosTexto
      .replace(
        "const productos =",
        "global.productos ="
      )
      .replace(
        "export default productos;",
        ""
      )
  );
} catch (error) {
  console.error("ERROR: No se pudo leer data/productos.js");
  console.error(error.message);
  process.exit(1);
}

const productos = global.productos;

if (!Array.isArray(productos)) {
  console.error("ERROR: productos.js no contiene una lista valida.");
  process.exit(1);
}

// Buscar archivo existente del producto
function buscarImagenExistente(id) {
  const extensiones = [
    "jpg",
    "jpeg",
    "png",
    "webp",
  ];

  for (const extension of extensiones) {
    const nombreArchivo = `${id}.${extension}`;

    const ruta = path.join(
      carpetaImagenes,
      nombreArchivo
    );

    if (fs.existsSync(ruta)) {
      return nombreArchivo;
    }
  }

  return null;
}

// Descargar imagen
async function buscarImagen(producto) {
  const consulta = `${producto.nombre} producto Mexico`;

  console.log("");
  console.log("----------------------------------------");
  console.log(`Producto ${producto.id}: ${producto.nombre}`);
  console.log(`Buscando: ${consulta}`);

  try {
    const respuesta = await axios.get(
      "https://serpapi.com/search.json",
      {
        params: {
          engine: "google_images",
          q: consulta,
          api_key: API_KEY,
          safe: "active",
          gl: "mx",
          hl: "es",
        },
        timeout: 20000,
      }
    );

    const resultados =
      respuesta.data.images_results;

    if (
      !Array.isArray(resultados) ||
      resultados.length === 0
    ) {
      console.log("No se encontraron resultados.");
      return null;
    }

    // Probar hasta 5 imagenes
    const candidatos = resultados.slice(1, 6);

    for (
      let i = 0;
      i < candidatos.length;
      i++
    ) {
      const imagenUrl =
        candidatos[i].original;

      if (!imagenUrl) {
        continue;
      }

      console.log(
        `Intentando imagen ${i + 1} de ${candidatos.length}...`
      );

      try {
        const imagen = await axios.get(
          imagenUrl,
          {
            responseType: "arraybuffer",
            timeout: 15000,

            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            },
          }
        );

        const tipo =
          imagen.headers["content-type"] || "";

        if (!tipo.startsWith("image/")) {
          console.log(
            "El resultado no era una imagen valida."
          );
          continue;
        }

        let extension = "jpg";

        if (tipo.includes("png")) {
          extension = "png";
        } else if (tipo.includes("webp")) {
          extension = "webp";
        }

        const nombreArchivo =
          `${producto.id}.${extension}`;

        const rutaFinal = path.join(
          carpetaImagenes,
          nombreArchivo
        );

        // Borrar otra extension anterior del mismo ID
        const extensiones = [
          "jpg",
          "jpeg",
          "png",
          "webp",
        ];

        for (const ext of extensiones) {
          const archivoAnterior = path.join(
            carpetaImagenes,
            `${producto.id}.${ext}`
          );

          if (
            archivoAnterior !== rutaFinal &&
            fs.existsSync(archivoAnterior)
          ) {
            fs.unlinkSync(archivoAnterior);
          }
        }

        fs.writeFileSync(
          rutaFinal,
          imagen.data
        );

        console.log(
          `Imagen guardada: ${nombreArchivo}`
        );

        return nombreArchivo;
      } catch (error) {
        console.log(
          `La imagen ${i + 1} fallo. Probando otra...`
        );
      }
    }

    console.log(
      "No se pudo descargar ninguna imagen."
    );

    return null;
  } catch (error) {
    console.log(
      `ERROR buscando ${producto.nombre}`
    );

    if (error.response) {
      console.log(
        `Codigo HTTP: ${error.response.status}`
      );
    }

    console.log(
      `Detalle: ${error.message}`
    );

    return null;
  }
}

// Guardar las rutas en productos.js
function guardarProductos() {
  const contenido = `const productos = ${JSON.stringify(
    productos,
    null,
    2
  )};

export default productos;
`;

  fs.writeFileSync(
    productosPath,
    contenido,
    "utf8"
  );
}

// Iniciar
async function iniciar() {
  console.log("");
  console.log("BUSQUEDA DE IMAGENES DE PRODUCTOS");
  console.log("----------------------------------------");
  console.log(
    `Productos encontrados: ${productos.length}`
  );
  console.log("");

  let descargadas = 0;
  let existentes = 0;
  let fallidas = 0;

  const productosAProcesar = productos.filter(
  (producto) => producto.id === 27
);

for (const producto of productosAProcesar) {

    // Comprobar si ya existe imagen
    const existente =
      buscarImagenExistente(producto.id);

    if (existente) {
      console.log(
        `Producto ${producto.id}: imagen existente ${existente}`
      );

      producto.imagen =
        `/productos/${existente}`;

      existentes++;

      continue;
    }

    const archivo =
      await buscarImagen(producto);

    if (archivo) {
      producto.imagen =
        `/productos/${archivo}`;

      descargadas++;
    } else {
      producto.imagen = "";
      fallidas++;
    }

    // Guardamos progreso después de cada producto
    guardarProductos();

    // Pausa para no hacer las solicitudes demasiado rapido
    await new Promise((resolve) =>
      setTimeout(resolve, 1500)
    );
  }

  // Guardar una ultima vez
  guardarProductos();

  console.log("");
  console.log("========================================");
  console.log("PROCESO TERMINADO");
  console.log("========================================");

  console.log(
    `Total de productos: ${productos.length}`
  );

  console.log(
    `Imagenes nuevas: ${descargadas}`
  );

  console.log(
    `Imagenes que ya existian: ${existentes}`
  );

  console.log(
    `Productos sin imagen: ${fallidas}`
  );

  console.log("");
  console.log(
    "Revisa la carpeta public/productos"
  );
}

iniciar();