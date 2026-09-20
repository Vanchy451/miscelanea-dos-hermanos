"use client";

import { useEffect, useState } from "react";

export default function Header({
  carrito,
  setCarritoAbierto,
  carritoAbierto,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const cerrarMenu = () => {
    setMenuMovilAbierto(false);
  };

  return (
    <header
      className={`site-header ${isScrolled ? "header-scrolled" : ""}`}
    >
      <div className="header-main">
        {/* LOGO */}
        <a href="#inicio" className="header-logo-link">
          <img
            src="/logo.png"
            alt="Miscelánea Dos Hermanos"
            className="header-logo"
          />
        </a>

        {/* NOMBRE */}
        <div className="header-negocio">
          <h1>MISCELÁNEA 2 HERMANOS</h1>
          <p>Todo lo que necesitas en un solo lugar.</p>
        </div>

        {/* MENÚ DE COMPUTADORA */}
        <nav className="desktop-nav">
          <a href="#inicio">Inicio</a>
          <a href="#categorias">Categorías</a>
          <a href="#promociones">Promociones</a>
          <a href="#contacto">Contacto</a>
        </nav>

        {/* BOTÓN MENÚ CELULAR */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          aria-label="Abrir menú"
        >
          {menuMovilAbierto ? "✕" : "☰"}
        </button>

        {/* CARRITO */}
        <button
          type="button"
          className="header-cart-button"
          onClick={() => {
            setCarritoAbierto(!carritoAbierto);
            setMenuMovilAbierto(false);
          }}
        >
          🛒 <span className="cart-text">Carrito </span>
          ({carrito.length})
        </button>
      </div>

      {/* MENÚ DE CELULAR */}
      {menuMovilAbierto && (
        <nav className="mobile-nav">
          <a href="#inicio" onClick={cerrarMenu}>
            Inicio
          </a>

          <a href="#categorias" onClick={cerrarMenu}>
            Categorías
          </a>

          <a href="#promociones" onClick={cerrarMenu}>
            Promociones
          </a>

          <a href="#contacto" onClick={cerrarMenu}>
            Contacto
          </a>
        </nav>
      )}

      {/* FRANJA AMARILLA */}
      <div className="header-delivery">
        🚚 Servicio a domicilio · Compra fácil y rápido
      </div>
    </header>
  );
}