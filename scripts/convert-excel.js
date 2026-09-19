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

const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const filas = XLSX.utils.sheet_to_json(sheet, {
  defval: "",
});

// Convertimos las categorías del Excel al formato que usará la página
const categorias = {
  ABARROTES: "Abarrotes",
  BEBIDAS: "Bebidas",
  "LÁCTEOS": "Lácteos",
  DULCES: "Dulces",
  BOTANAS: "Botanas",
  LIMPIEZA: "Limpieza",
  "FERRETERÍA": "Ferretería",
  HIGIENE: "Higiene",
  "ALIMENTO PARA MASCOTAS": "Alimento para mascotas",
};

const limpiar = (valor) => String(valor ?? "").trim();

const productos = filas
  .map((fila) => {
    const categoriaRaw = limpiar(fila["CATEGORIA "]).toUpperCase();

    return {
      id: Number(fila["ID "]) || 0,
      codigo: limpiar(fila["CODIGO "]),
      nombre: limpiar(fila["NOMBRE "]),
      categoria: categorias[categoriaRaw] || categoriaRaw,
      marca: limpiar(fila["MARCA "]),
      presentacion: limpiar(fila["PRESENTACION  "]),
      compra: Number(fila["COMPRA"]) || 0,
      precio: `$${Number(fila["VENTA "]) || 0}`,
      ganancia: Number(fila["GANANCIA "]) || 0,
      stock: Number(fila["STOCK  "]) || 0,
      minimo: Number(fila["MINIMO"]) || 0,
      imagen: limpiar(fila["IMAGEN "])
        ? `/productos/${limpiar(fila["IMAGEN "])}`
        : "",
      estado: limpiar(fila["ESTADO "]),
      categoriaRaw,
    };
  })
  // Ignoramos filas vacías y excluimos Alcohol del catálogo web
  .filter(
    (producto) =>
      producto.id &&
      producto.nombre &&
      producto.categoriaRaw !== "ALCOHOL"
  )
  .map(({ categoriaRaw, ...producto }) => producto);

const contenido = `const productos = ${JSON.stringify(
  productos,
  null,
  2
)};

export default productos;
`;

fs.mkdirSync(path.dirname(outputPath), {
  recursive: true,
});

fs.writeFileSync(
  outputPath,
  contenido,
  "utf8"
);

console.log(
  `✅ Se generaron ${productos.length} productos en data/productos.js`
);