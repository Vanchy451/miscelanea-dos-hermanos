"use client";

import { useEffect, useState } from "react";

export default function Header({
  carrito,
  setCarritoAbierto,
  carritoAbierto,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [botonActivo, setBotonActivo] = useState("");
  useEffect(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (!isScrolled && scrollY > 150) {
      setIsScrolled(true);
    }

    if (isScrolled && scrollY < 50) {
      setIsScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [isScrolled]);

  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "3px solid #d62828",
           
    overflow: "visible",
        boxShadow: isScrolled
          ? "0 3px 15px rgba(0,0,0,0.15)"
          : "0 3px 12px rgba(0,0,0,0.10)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {/* ZONA PRINCIPAL */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isScrolled ? "5px 25px" : "12px 25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "25px",
          transition: "all 0.4s ease",
          
        }}
      >
        {/* LOGO */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isScrolled ? "flex-start" : "center",
            textDecoration: "none",
            transition: "all 0.4s ease",
          }}
        >
          <img
  src="/logo.png"
  alt="2 Hermanos Tienda de Abarrotes"
  style={{
    width: isScrolled ? "180px" : "240px",
    height: isScrolled ? "90px" : "120px",
    objectFit: "contain",
    transform: "scale(1.55)",
    transition: "all 0.4s ease",
  }}
/>
        </a>

        {/* NOMBRE DEL NEGOCIO */}
        <div
          style={{
            flex: 1,
            minWidth: "220px",
            transition: "all 0.4s ease",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#d62828",
              fontSize: isScrolled ? "22px" : "30px",
              fontWeight: 800,
              transition: "font-size 0.4s ease",
            }}
          >
            MISCELÁNEA 2 HERMANOS
          </h1>

          <p
            style={{
              margin: "5px 0 0",
              color: "#333333",
              fontSize: isScrolled ? "12px" : "14px",
              fontWeight: "800",
              transition: "all 0.4s ease",
            }}
          >
            Todo lo que necesitas en un solo lugar.
          </p>
        </div>

        {/* MENÚ */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#inicio"
            style={{
              ...menuButton,
              backgroundColor:
                botonActivo === "inicio" ? "#d62828" : "transparent",
              color:
                botonActivo === "inicio" ? "#ffffff" : "#111111",
              transform:
                botonActivo === "inicio"
                  ? "translateY(-2px)"
                  : "translateY(0)",
              boxShadow:
                botonActivo === "inicio"
                  ? "0 4px 10px rgba(214,40,40,0.25)"
                  : "none",
            }}
            onMouseEnter={() => setBotonActivo("inicio")}
            onMouseLeave={() => setBotonActivo("")}
          >
            Inicio
          </a>

          <a
            href="#categorias"
            style={{
              ...menuButton,
              backgroundColor:
                botonActivo === "categorias"
                  ? "#d62828"
                  : "transparent",
              color:
                botonActivo === "categorias"
                  ? "#ffffff"
                  : "#111111",
              transform:
                botonActivo === "categorias"
                  ? "translateY(-2px)"
                  : "translateY(0)",
              boxShadow:
                botonActivo === "categorias"
                  ? "0 4px 10px rgba(214,40,40,0.25)"
                  : "none",
            }}
            onMouseEnter={() => setBotonActivo("categorias")}
            onMouseLeave={() => setBotonActivo("")}
          >
            Categorías
          </a>

          <a
            href="#promociones"
            style={{
              ...menuButton,
              backgroundColor:
                botonActivo === "promociones"
                  ? "#d62828"
                  : "transparent",
              color:
                botonActivo === "promociones"
                  ? "#ffffff"
                  : "#111111",
              transform:
                botonActivo === "promociones"
                  ? "translateY(-2px)"
                  : "translateY(0)",
              boxShadow:
                botonActivo === "promociones"
                  ? "0 4px 10px rgba(214,40,40,0.25)"
                  : "none",
            }}
            onMouseEnter={() => setBotonActivo("promociones")}
            onMouseLeave={() => setBotonActivo("")}
          >
            Promociones
          </a>

          <a
            href="#contacto"
            style={{
              ...menuButton,
              backgroundColor:
                botonActivo === "contacto"
                  ? "#d62828"
                  : "transparent",
              color:
                botonActivo === "contacto"
                  ? "#ffffff"
                  : "#111111",
              transform:
                botonActivo === "contacto"
                  ? "translateY(-2px)"
                  : "translateY(0)",
              boxShadow:
                botonActivo === "contacto"
                  ? "0 4px 10px rgba(214,40,40,0.25)"
                  : "none",
            }}
            onMouseEnter={() => setBotonActivo("contacto")}
            onMouseLeave={() => setBotonActivo("")}
          >
            Contacto
          </a>
        </nav>

        {/* CARRITO */}
       <button
  type="button"
  onClick={() => setCarritoAbierto(!carritoAbierto)}
  style={{
    backgroundColor: "#d62828",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  🛒 Carrito ({carrito.length})
</button>
      </div>

      {/* FRANJA INFERIOR */}
      <div
        style={{
          backgroundColor: "#ffd60a",
          padding: isScrolled ? "5px 20px" : "8px 20px",
          textAlign: "center",
          color: "#111111",
          fontSize: isScrolled ? "12px" : "14px",
          fontWeight: "700",
          transition: "all 0.4s ease",
        }}
      >
        🚚 Servicio a domicilio · Compra fácil y rápido
      </div>
    </header>
  );
}

const menuButton = {
  color: "#111111",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "700",
  padding: "10px 14px",
  borderRadius: "8px",
  transition: "all 0.25s ease",
};
