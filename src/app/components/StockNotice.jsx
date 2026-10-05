"use client";

import { useCarrito } from "../context/CarritoContext";

export default function StockNotice({ producto }) {
  const { obtenerDisponibilidad } = useCarrito();
  const { stock, limiteAlcanzado } = obtenerDisponibilidad(producto);
  if (!limiteAlcanzado) return null;
  return (
    <p role="status" className="stock-notice" style={{ color: "#945c00", fontSize: "13px", lineHeight: 1.5, marginTop: "10px" }}>
      {stock === 0 ? "Sin existencias disponibles." : `Ya tienes las ${stock} piezas disponibles en el carrito.`}
    </p>
  );
}
