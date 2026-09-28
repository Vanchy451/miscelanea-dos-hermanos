const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const excelPath = path.join(
  process.cwd(),
  "BASE DE DATOS.xlsx"
);

const outputPath = path.join(
  process.cwd(),
  "data",
  "productos.js"
);

// Verificar que exista el Excel
if (!fs.existsSync(excelPath)) {
  console.error("ERROR: No se encontro BASE DE DATOS.xlsx");
  process.exit(1);
}

// Leer Excel
const workbook = XLSX.readFile(excelPath);

// Primera hoja
const nombreHoja = workbook.SheetNames[0];
const sheet = workbook.Sheets[nombreHoja];

console.log(`Leyendo hoja: ${nombreHoja}`);

// Convertir filas
const filasOriginales = XLSX.utils.sheet_to_json(sheet, {
  defval: "",
});

// Limpiar texto
function limpiar(valor) {
  return String(valor ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

// Normalizar nombres de columnas y categorias
function normalizar(valor) {
  return limpiar(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

// Esto permite leer encabezados con o sin espacios
const filas = filasOriginales.map((fila) => {
  const nuevaFila = {};

  for (const [clave, valor] of Object.entries(fila)) {
    nuevaFila[normalizar(clave)] = valor;
  }

  return nuevaFila;
});

// Categorias
const categorias = {
  ABARROTES: "Abarrotes",
  BEBIDAS: "Bebidas",
  LACTEOS: "Lacteos",
  DULCES: "Dulces",
  BOTANAS: "Botanas",
  LIMPIEZA: "Limpieza",
  FERRETERIA: "Ferreteria",
  HIGIENE: "Higiene",
  "ALIMENTO PARA MASCOTAS": "Alimento para mascotas",
  PANADERIA: "Panaderia",
  HELADOS: "Helados",
};

const productos = filas
  .map((fila) => {
    const categoriaRaw = normalizar(fila.CATEGORIA);

    const compra = Number(fila.COMPRA) || 0;
    const venta = Number(fila.VENTA) || 0;

    let ganancia = Number(fila.GANANCIA);

    if (!Number.isFinite(ganancia)) {
      ganancia = venta - compra;
    }

    const imagenExcel = limpiar(fila.IMAGEN);

    return {
      id: Number(fila.ID) || 0,

      codigo: limpiar(fila.CODIGO),

      nombre: limpiar(fila.NOMBRE),

      categoria:
        categorias[categoriaRaw] || limpiar(fila.CATEGORIA),

      marca: limpiar(fila.MARCA),

      compra: compra,

      precio: `$${venta}`,

      ganancia: Number(ganancia.toFixed(2)),

      stock: Number(fila.STOCK) || 0,

      minimo: Number(fila.MINIMO) || 0,

      imagen: imagenExcel
        ? `/productos/${imagenExcel}`
        : "",

      estado: limpiar(fila.ESTADO),

      categoriaRaw: categoriaRaw,
    };
  })

  // Quitar filas vacias
  .filter(
    (producto) =>
      producto.id > 0 &&
      producto.nombre !== ""
  )

  // categoriaRaw solo era auxiliar
  .map(({ categoriaRaw, ...producto }) => producto);

// Seguridad: si encuentra 0, NO borra productos.js
if (productos.length === 0) {
  console.error("");
  console.error("ERROR: Se encontraron 0 productos.");
  console.error("data/productos.js NO fue modificado.");
  process.exit(1);
}

// Crear contenido
const contenido = `const productos = ${JSON.stringify(
  productos,
  null,
  2
)};

export default productos;
`;

// Crear carpeta data si hace falta
fs.mkdirSync(path.dirname(outputPath), {
  recursive: true,
});

// Guardar
fs.writeFileSync(
  outputPath,
  contenido,
  "utf8"
);

console.log("");
console.log("----------------------------------------");
console.log(
  `Se generaron ${productos.length} productos correctamente.`
);
console.log("Archivo: data/productos.js");
console.log("----------------------------------------");