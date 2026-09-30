"use client";

import { useCarrito } from "../context/CarritoContext";

export default function BotonAgregarCarrito({ producto }) {
  const { carrito, agregarAlCarrito } = useCarrito();

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
        onClick={() => agregarAlCarrito(producto)}
        style={{
          width: "100%",
          maxWidth: "330px",
          padding: "15px 22px",
          border: "none",
          borderRadius: "10px",
          background: "#d62828",
          color: "#ffffff",
          fontSize: "17px",
          fontWeight: "800",
          cursor: "pointer",
        }}
      >
        🛒 Agregar al carrito
      </button>
    </div>
  );
}