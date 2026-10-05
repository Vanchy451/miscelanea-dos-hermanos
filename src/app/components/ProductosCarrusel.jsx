"use client";

import { useRef } from "react";
import Link from "next/link";
import { useCarrito } from "../context/CarritoContext";
import ProductImage from "./ProductImage";
import StockNotice from "./StockNotice";

export default function ProductosCarrusel({
  titulo,
  descripcion,
  productos,
}) {
  const carruselRef = useRef(null);
  const { carrito, agregarAlCarrito, obtenerDisponibilidad } = useCarrito();

  const mover = (direccion) => {
    if (!carruselRef.current) return;

    const distancia = carruselRef.current.clientWidth * 0.85;

    carruselRef.current.scrollBy({
      left: direccion === "derecha" ? distancia : -distancia,
      behavior: "smooth",
    });
  };

  if (!productos || productos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="pc-seccion">
        <div className="pc-encabezado">
          <h2>{titulo}</h2>
          <p>{descripcion}</p>
        </div>

        <div className="pc-wrapper">
          <button
            type="button"
            className="pc-flecha pc-izquierda"
            onClick={() => mover("izquierda")}
            aria-label="Productos anteriores"
          >
            ‹
          </button>

          <div
            ref={carruselRef}
            className="pc-carrusel"
          >
            {productos.map((item) => (
            <div
  key={item.id}
  className="pc-link"
  style={{
    flex: "0 0 260px",
    minWidth: "260px",
    maxWidth: "260px",
  }}
>
  <article className="pc-card">
    <Link
      href={`/producto/${item.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div className="pc-imagen-contenedor">
        {item.imagen ? (
          <ProductImage
            src={item.imagen}
            alt={item.nombre}
            className="pc-imagen"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <span className="pc-sin-imagen">
            Imagen no disponible
          </span>
        )}
      </div>

      <span className="pc-categoria">
        {item.categoria}
      </span>

      <h3>{item.nombre}</h3>

      <strong>{item.precio}</strong>
    </Link>

    {carrito.find(
      (productoCarrito) => productoCarrito.id === item.id
    ) && (
      <p
        style={{
          color: "#15803d",
          fontSize: "13px",
          fontWeight: "700",
          margin: "12px 0 5px",
        }}
      >
        En carrito:{" "}
        {
          carrito.find(
            (productoCarrito) =>
              productoCarrito.id === item.id
          ).cantidad
        }
      </p>
    )}

    <button
      type="button"
      onClick={() => agregarAlCarrito(item)}
      disabled={obtenerDisponibilidad(item).limiteAlcanzado}
      style={{
        width: "100%",
        marginTop: "14px",
        padding: "11px 8px",
        border: "none",
        borderRadius: "9px",
        background: obtenerDisponibilidad(item).limiteAlcanzado ? "#777" : "#d62828",
        color: "#ffffff",
        fontWeight: "700",
        cursor: "pointer",
      }}
    >
      {obtenerDisponibilidad(item).limiteAlcanzado ? (obtenerDisponibilidad(item).stock === 0 ? "Sin existencias" : "Limite alcanzado") : "Agregar al carrito"}
    </button>
    <StockNotice producto={item} />
  </article>
</div>
            ))}
          </div>

          <button
            type="button"
            className="pc-flecha pc-derecha"
            onClick={() => mover("derecha")}
            aria-label="Más productos"
          >
            ›
          </button>
        </div>
      </section>

      <style jsx>{`
        .pc-seccion {
          width: 100%;
          max-width: 1200px;
          margin: 60px auto 0;
          padding: 0 40px;
          box-sizing: border-box;
        }

        .pc-encabezado {
          margin-bottom: 22px;
        }

        .pc-encabezado h2 {
          margin: 0 0 7px;
          color: #172554;
          font-size: 28px;
          font-weight: 800;
        }

        .pc-encabezado p {
          margin: 0;
          color: #6b7280;
          font-size: 16px;
        }

        .pc-wrapper {
          position: relative;
          width: 100%;
        }

        .pc-carrusel {
          display: flex;
          gap: 20px;

          width: 100%;
          overflow-x: auto;

          padding: 5px 2px 20px;

          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;

          scrollbar-width: none;
          box-sizing: border-box;
        }

        .pc-carrusel::-webkit-scrollbar {
          display: none;
        }

        .pc-link {
          flex: 0 0 calc(25% - 15px);
          min-width: 0;

          text-decoration: none;
          color: inherit;

          scroll-snap-align: start;
        }

        .pc-card {
          height: 100%;
          min-height: 330px;

          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;

          padding: 18px;
          box-sizing: border-box;

          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .pc-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        .pc-imagen-contenedor {
  width: 100%;
  height: 190px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 15px;
}

        .pc-imagen {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .pc-sin-imagen {
          color: #9ca3af;
          font-size: 13px;
        }

        .pc-categoria {
          display: inline-block;

          margin-bottom: 8px;

          color: #9a6700;
          font-size: 13px;
        }

        .pc-card h3 {
  margin: 0 0 15px;

  color: #172554;
  font-size: 15px;
  line-height: 1.35;

  min-height: 42px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

        .pc-card strong {
          color: #d62828;
          font-size: 22px;
          font-weight: 800;
        }

        .pc-flecha {
          position: absolute;

          top: 50%;
          transform: translateY(-50%);

          width: 46px;
          height: 46px;

          border: none;
          border-radius: 50%;

          background: #d62828;
          color: white;

          font-size: 32px;
          font-weight: 700;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          z-index: 10;

          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .pc-flecha:hover {
          background: #b91c1c;
          transform: translateY(-50%) scale(1.08);
        }

        .pc-izquierda {
          left: -23px;
        }

        .pc-derecha {
          right: -23px;
        }

        @media (max-width: 900px) {
          .pc-link {
            flex: 0 0 calc(33.333% - 14px);
          }
        }

        @media (max-width: 768px) {
          .pc-seccion {
            padding: 0 18px;
            margin-top: 45px;
          }

          .pc-encabezado h2 {
            font-size: 23px;
          }

          .pc-link {
            flex: 0 0 calc(50% - 6px);
          }

          .pc-carrusel {
            gap: 12px;
          }

          .pc-card {
            min-height: 280px;
            padding: 12px;
          }

          .pc-imagen-contenedor {
            height: 130px;
          }

          .pc-card h3 {
            font-size: 13px;
          }

          .pc-card strong {
            font-size: 18px;
          }

          .pc-flecha {
            width: 36px;
            height: 36px;
            font-size: 26px;
          }

          .pc-izquierda {
            left: -8px;
          }

          .pc-derecha {
            right: -8px;
          }
        }
      `}</style>
    </>
  );
}
