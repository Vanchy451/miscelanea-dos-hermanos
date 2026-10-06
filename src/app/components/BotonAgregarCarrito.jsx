"use client";

import { useCarrito } from "../context/CarritoContext";
import StockNotice from "./StockNotice";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function BotonAgregarCarrito({ producto }) {
  const { carrito, agregarAlCarrito, obtenerDisponibilidad } = useCarrito();
  const { stock, limiteAlcanzado } = obtenerDisponibilidad(producto);
  const [cantidad, setCantidad] = useState(1);
  const disponibles = Math.max(0, stock - (carrito.find((item) => item.id === producto.id)?.cantidad || 0));
  const elegida = Math.min(cantidad, Math.max(1, disponibles));

  const productoEnCarrito = carrito.find(
    (item) => item.id === producto.id
  );

  return (
    <div style={{ marginTop: "22px" }}>
      {productoEnCarrito && (
        <p
          style={{
            color: "#15803d",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          🛒 En carrito: {productoEnCarrito.cantidad}{" "}
          {productoEnCarrito.cantidad === 1 ? "pieza" : "piezas"}
        </p>
      )}

      <div className="product-quantity" role="group" aria-label="Cantidad de piezas">
        <button type="button" title="Restar una pieza" aria-label="Restar una pieza" disabled={elegida <= 1 || limiteAlcanzado} onClick={() => setCantidad(elegida - 1)}><Minus size={18} /></button>
        <output aria-live="polite">{limiteAlcanzado ? 0 : elegida}</output>
        <button type="button" title="Sumar una pieza" aria-label="Sumar una pieza" disabled={elegida >= disponibles} onClick={() => setCantidad(elegida + 1)}><Plus size={18} /></button>
      </div>
      <button
        type="button"
        disabled={limiteAlcanzado}
        onClick={() => { agregarAlCarrito(producto, elegida); setCantidad(1); }}
        style={{
          width: "100%",
          maxWidth: "330px",
          padding: "15px 22px",
          border: "none",
          borderRadius: "10px",
          background: limiteAlcanzado ? "#777" : "#d62828",
          color: "#ffffff",
          fontSize: "17px",
          fontWeight: "800",
          cursor: limiteAlcanzado ? "not-allowed" : "pointer",
        }}
      >
        {limiteAlcanzado ? (stock === 0 ? "Sin existencias" : "Límite alcanzado") : "🛒 Agregar al carrito"}
      </button>
      <StockNotice producto={producto} />
    </div>
  );
}
