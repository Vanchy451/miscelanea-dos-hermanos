export const CART_STORAGE_KEY = "dos-hermanos:carrito:v1";

export function restaurarCarrito(texto, catalogo) {
  if (!texto) return [];
  try {
    const guardado = JSON.parse(texto);
    if (guardado.version !== 1 || !Array.isArray(guardado.items)) return [];
    const porId = new Map(catalogo.map((producto) => [String(producto.id), producto]));
    const restaurados = new Map();
    for (const item of guardado.items) {
      if (!item || typeof item !== "object") continue;
      const producto = porId.get(String(item.id));
      const cantidad = Number(item.cantidad);
      const stock = Number(producto?.stock);
      if (!producto || !Number.isSafeInteger(cantidad) || cantidad <= 0 || !Number.isFinite(stock) || stock < 1) continue;
      const anterior = restaurados.get(producto.id);
      restaurados.set(producto.id, {
        ...producto,
        cantidad: Math.min((anterior?.cantidad || 0) + cantidad, Math.floor(stock)),
        seleccionado: item.seleccionado !== false,
      });
    }
    return [...restaurados.values()];
  } catch {
    return [];
  }
}

export function serializarCarrito(carrito) {
  return JSON.stringify({
    version: 1,
    items: carrito.map(({ id, cantidad, seleccionado }) => ({
      id, cantidad, seleccionado: seleccionado !== false,
    })),
  });
}
