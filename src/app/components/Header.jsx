"use client";

import { useEffect, useState } from "react";

export default function Header({
  carrito,
  setCarritoAbierto,
  carritoAbierto,
  homeHref = "",
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  useEffect(() => {
    if (!menuMovilAbierto) return;
    const cerrarConEscape = (evento) => {
      if (evento.key === "Escape") {
        setMenuMovilAbierto(false);
        document.getElementById("mobile-menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [menuMovilAbierto]);

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
        <a href={`${homeHref}#inicio`} className="header-logo-link">
          <img
            src="/logo.png"
            alt="Miscelánea Dos Hermanos"
            className="header-logo"
          />
        </a>

        <div className="header-negocio">
  <h1>MISCELÁNEA 2 HERMANOS</h1>

  <p>Todo lo que necesitas en un solo lugar.</p>

  <span className="header-location">
    📍 Santiago Pinotepa Nacional, Oaxaca
  </span>
</div>

        <nav className="desktop-nav">
  <a href={`${homeHref}#inicio`}>Inicio</a>
  <a href={`${homeHref}#categorias`}>Categorías</a>
  <a href={`${homeHref}#promociones`}>Promociones</a>
  <a href="/nosotros">Nosotros</a>
  <a href={`${homeHref}#contacto`}>Contacto</a>
</nav>

        {/* BOTÓN MENÚ CELULAR */}
        <button
          type="button"
          className="mobile-menu-button"
          id="mobile-menu-toggle"
          aria-expanded={menuMovilAbierto}
          aria-controls="mobile-menu"
          onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          aria-label={menuMovilAbierto ? "Cerrar menú" : "Abrir menú"}
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
        <nav className="mobile-nav" id="mobile-menu" aria-label="Menu movil">
          <a href={`${homeHref}#inicio`} onClick={cerrarMenu}>
            Inicio
          </a>

          <a href={`${homeHref}#categorias`} onClick={cerrarMenu}>
            Categorías
          </a>

          <a href={`${homeHref}#promociones`} onClick={cerrarMenu}>
            Promociones
          </a>
          <a href="/nosotros" onClick={cerrarMenu}>
            Nosotros
          </a>
          <a href={`${homeHref}#contacto`} onClick={cerrarMenu}>
            Contacto
          </a>
        </nav>
      )}

      {/* FRANJA AMARILLA */}
      <div className="header-delivery">
        🚚 Entregas en Pinotepa Nacional · Compra mínima $150
      </div>
    </header>
  );
}

