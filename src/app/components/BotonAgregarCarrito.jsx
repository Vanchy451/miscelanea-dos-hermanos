"use client";

import { useCarrito } from "../context/CarritoContext";
import StockNotice from "./StockNotice";

export default function BotonAgregarCarrito({ producto }) {
  const { carrito, agregarAlCarrito, obtenerDisponibilidad } = useCarrito();
  const { stock, limiteAlcanzado } = obtenerDisponibilidad(producto);

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

      <button
        type="button"
        disabled={limiteAlcanzado}
        onClick={() => agregarAlCarrito(producto)}
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
