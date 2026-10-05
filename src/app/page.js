"use client";
import Link from "next/link";
import { useCarrito } from "./context/CarritoContext";
import productos from "../../data/productos";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import { Home as HomeIcon, Grid2X2, ShoppingCart, X, Pencil } from "lucide-react";
import ProductImage from "./components/ProductImage";
import StockNotice from "./components/StockNotice";
const PEDIDO_MINIMO = 150;
const normalizarBusqueda = (valor) => String(valor || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const slides = [
  {
    imagen: "/Sliders/IMG009.png",
    titulo: "Atención cercana y servicio de confianza.",
    descripcion:
      "En Miscelánea 2 Hermanos te atendemos con amabilidad y rapidez.",
  },

  {
    imagen: "/Sliders/IMG001.png",
    titulo: "Todo lo que necesitas, en un solo lugar.",
    descripcion:
      "Abarrotes, bebidas, panadería, productos frescos y mucho más.",
  },

  {
    imagen: "/Sliders/IMG002.png",
    titulo: "Todo para tu familia.",
    descripcion:
      "Haz tus compras fácil y encuentra productos para todos en un solo lugar.",
  },

  {
    imagen: "/Sliders/IMG003.png",
    titulo: "Tu compra hasta la puerta de casa.",
    descripcion:
      "Servicio a domicilio para que recibas lo que necesitas cómodamente.",
  },

  {
    imagen: "/Sliders/IMG004.png",
    titulo: "Frescura para todos los días.",
    descripcion:
      "Frutas y verduras frescas para complementar las comidas de tu familia.",
  },

  {
    imagen: "/Sliders/IMG005.png",
    titulo: "Bebidas bien frías para cualquier ocasión.",
    descripcion:
      "Refrescos, energizantes y bebidas listas para disfrutar.",
  },

  {
    imagen: "/Sliders/IMG006.png",
    titulo: "El antojo perfecto para compartir.",
    descripcion:
      "Botanas, papitas y snacks para reuniones, partidos y momentos especiales.",
  },

  {
    imagen: "/Sliders/IMG007.png",
    titulo: "Lo esencial para tu hogar.",
    descripcion:
      "Arroz, frijol, aceite, huevo, harina y productos de la canasta básica.",
  },

  {
    imagen: "/Sliders/IMG008.png",
    titulo: "Frescura y calidad para tu familia.",
    descripcion:
      "Leche, quesos, yogurts y productos refrigerados para todos los días.",
  },

  {
    imagen: "/Sliders/IMG010.png",
    titulo: "Todo para cuidar tu hogar.",
    descripcion:
      "Productos de limpieza e higiene para mantener tu casa limpia y fresca.",
  },

  {
    imagen: "/Sliders/IMG011.png",
    titulo: "Recarga tu día.",
    descripcion:
      "Electrolitos, Clamato, salsa y productos ideales para comenzar el día.",
  },

  {
    imagen: "/Sliders/IMG012.png",
    titulo: "Un momento fresco para disfrutar.",
    descripcion:
      "Helados y paletas Holanda para refrescar cualquier momento del día.",
  },

  {
    imagen: "/Sliders/IMG013.png",
    titulo: "También consentimos a tu mejor amigo.",
    descripcion:
      "Encuentra productos Pedigree para alimentar y cuidar a tu mascota.",
  },

  {
    imagen: "/Sliders/IMG014.png",
    titulo: "Empieza el día en familia.",
    descripcion:
      "Leche, café, cereal y galletas para disfrutar un desayuno práctico.",
  },

  {
    imagen: "/Sliders/IMG015.png",
    titulo: "Paga como prefieras.",
    descripcion:
      "Paga al recibir tu pedido o por transferencia bancaria.",
  },
];

export default function Home() {
  const [slideActual, setSlideActual] = useState(0);
  const [search, setSearch] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const { carrito, setCarrito, agregarAlCarrito, obtenerDisponibilidad } = useCarrito();
  const [productoAgregado, setProductoAgregado] = useState("");
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("carrito") !== "1") return;
    // Read the product-page handoff after hydration to keep server markup stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCarritoAbierto(true);
    url.searchParams.delete("carrito");
    window.history.replaceState(window.history.state, "", url);
  }, []);
  useEffect(() => {
  const intervalo = setInterval(() => {
    setSlideActual((actual) => (actual + 1) % slides.length);
  }, 4000);

  return () => clearInterval(intervalo);
}, []);
  useEffect(() => {
  if (carritoAbierto) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [carritoAbierto]);
  const [pedidoAbierto, setPedidoAbierto] = useState(false);
  const [resumenPedido, setResumenPedido] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");
const [telefonoCliente, setTelefonoCliente] = useState("");
const [direccionCliente, setDireccionCliente] = useState("");
const [direccionCampos, setDireccionCampos] = useState({ calle: "", numero: "", colonia: "", referencias: "" });
const direccionLibre = !!direccionCliente && !Object.values(direccionCampos).some((valor) => valor.trim());
const actualizarDireccion = (campo, valor) => {
  const nueva = { ...direccionCampos, [campo]: valor };
  setDireccionCampos(nueva);
  setDireccionCliente([nueva.calle.trim(), nueva.numero.trim() && `Numero ${nueva.numero.trim()}`, nueva.colonia.trim() && `Colonia ${nueva.colonia.trim()}`, nueva.referencias.trim() && `Referencias: ${nueva.referencias.trim()}`].filter(Boolean).join(", "));
  setErroresPedido((actual) => ({ ...actual, [campo]: "", direccion: "" }));
};
const [notasPedido, setNotasPedido] = useState("");
const [metodoPago, setMetodoPago] = useState("contra_entrega");
const [ciudadConfirmada, setCiudadConfirmada] = useState(false);
const [erroresPedido, setErroresPedido] = useState({});
const limpiarError = (campo) => setErroresPedido((actual) => ({ ...actual, [campo]: "" }));
const validarPedido = () => {
  const errores = {};
  if (totalCompra < PEDIDO_MINIMO) {
    errores.pedido = "La compra minima para entrega a domicilio es de $150.";
  }
  if (!ciudadConfirmada) {
    errores.ciudad = "Confirma que tu direccion esta dentro de Pinotepa Nacional.";
  }
  if (productosSeleccionados.some((producto) => producto.cantidad > Number(producto.stock) || !(Number(producto.stock) > 0))) {
    errores.pedido = "Revisa las cantidades: un producto supera las existencias disponibles.";
  }
  if (!nombreCliente.trim()) errores.nombre = "Escribe tu nombre.";
  if (!/^(?:52)?\d{10}$/.test(telefonoCliente.replace(/\D/g, ""))) {
    errores.telefono = "Escribe un telefono de 10 digitos; puedes incluir +52.";
  }
  if (window.matchMedia("(max-width: 768px)").matches && !direccionLibre) {
    if (!direccionCampos.calle.trim()) errores.calle = "Escribe la calle.";
    if (!direccionCampos.numero.trim()) errores.numero = "Escribe el numero o S/N.";
    if (!direccionCampos.colonia.trim()) errores.colonia = "Escribe la colonia.";
  } else if (!direccionCliente.trim()) errores.direccion = "Escribe la calle, numero, colonia y referencias.";
  setErroresPedido(errores);
  const primerCampo = ["nombre", "telefono", "direccion", "calle", "numero", "colonia", "ciudad"].find((campo) => errores[campo]);
  if (primerCampo) document.getElementById(`pedido-${primerCampo}`)?.focus();
  return Object.keys(errores).length === 0;
};
const confirmarPedido = () => {
  if (!validarPedido()) return;

  setPedidoAbierto(false);
  setResumenPedido(true);
};
const continuarPedido = () => {
  if (productosSeleccionados.length > 0 && totalCompra >= PEDIDO_MINIMO) setPedidoAbierto(true);
};

const cambiarSeleccionProducto = (nombreProducto) => {
  setCarrito((carritoActual) =>
    carritoActual.map((item) =>
      item.nombre === nombreProducto
        ? { ...item, seleccionado: item.seleccionado === false }
        : item
    )
  );
};
const cambiarSeleccionTodos = () => {
  const todosSeleccionados = carrito.every(
    (producto) => producto.seleccionado !== false
  );

  setCarrito((carritoActual) =>
    carritoActual.map((producto) => ({
      ...producto,
      seleccionado: !todosSeleccionados,
    }))
  );
};
const cambiarSeleccionCategoria = (categoria) => {
  const productosDeCategoria = carrito.filter(
    (producto) => producto.categoria === categoria
  );

  const todosSeleccionados = productosDeCategoria.every(
    (producto) => producto.seleccionado !== false
  );

  setCarrito((carritoActual) =>
    carritoActual.map((producto) =>
      producto.categoria === categoria
        ? {
            ...producto,
            seleccionado: !todosSeleccionados,
          }
        : producto
    )
  );
};
const productosSeleccionados = carrito.filter(
  (producto) => producto.seleccionado !== false
);

const totalProductosSeleccionados = productosSeleccionados.reduce(
  (total, producto) => total + producto.cantidad,
  0
);

const totalCompra = productosSeleccionados.reduce(
  (total, producto) =>
    total + Number(producto.precio.replace("$", "")) * producto.cantidad,
  0
);
const productosPorCategoria = carrito.reduce((categorias, producto) => {
  const categoria = producto.categoria || "Otros";

  if (!categorias[categoria]) {
    categorias[categoria] = [];
  }

  categorias[categoria].push(producto);

  return categorias;
}, {});

const productosFiltrados = productos.filter((producto) => {
  const coincideBusqueda = normalizarBusqueda(producto.nombre)
    .includes(normalizarBusqueda(search));

  const coincideCategoria =
    categoriaSeleccionada === "" ||
    normalizarBusqueda(producto.categoria) === normalizarBusqueda(categoriaSeleccionada);

  return coincideBusqueda && coincideCategoria;
});
  const menuButton = {
    background: "transparent",
    border: "none",
    color: "#333",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  };

  const primaryButton = {
    backgroundColor: "#d62828",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  };

  const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  padding: "22px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
  border: "1px solid #e6e6e6",
  transition: "all 0.2s ease",
};

 return (
  <main className="store-home"
    style={{
      minHeight: "100vh",
      backgroundColor: "#f5f7fa",
      fontFamily: "Arial, sans-serif",
      color: "#222",
    }}
  >
    <Header
  carrito={carrito}
  setCarritoAbierto={setCarritoAbierto}
  carritoAbierto={carritoAbierto}
  
/>
<div className="header-spacer" />

      <section className="store-search"
  style={{
    backgroundColor: "#ffffff",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  }}
>
  <div
    style={{
      maxWidth: "900px",
      margin: "auto",
      display: "flex",
      gap: "10px",
    }}
  >
    <input
      id="buscar-productos"
      aria-label="Buscar productos"
      type="text"
      placeholder="Buscar productos..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        flex: 1,
        padding: "15px",
        borderRadius: "10px",
        border: "2px solid #ddd",
        fontSize: "16px",
      }}
    />

    {search && <button type="button" className="mobile-only search-clear" aria-label="Borrar busqueda" title="Borrar busqueda" onClick={() => { setSearch(""); document.getElementById("buscar-productos")?.focus(); }}><X size={20} aria-hidden="true" /></button>}

    <button
      type="button"
      onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth", block: "start" })}
      style={{
        backgroundColor: "#d62828",
        color: "#fff",
        border: "none",
        padding: "0 25px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Buscar
    </button>
  </div>
  {search.trim() !== "" && (
  <div
    style={{
      maxWidth: "900px",
      margin: "10px auto 0",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "15px 20px",
        borderBottom: "1px solid #eeeeee",
      }}
    >
      <strong>
        🔎 Resultados para: &quot;{search}&quot;
      </strong>
    </div>

    {productosFiltrados.length === 0 ? (
      <p
        style={{
          padding: "20px",
          margin: 0,
          color: "#666666",
        }}
      >
        No encontramos productos con ese nombre.
      </p>
    ) : (
      productosFiltrados.map((producto) => (
        <div
          key={producto.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "15px 20px",
            borderBottom: "1px solid #eeeeee",
          }}
        >
          <ProductImage
            src={producto.imagen || null}
            alt={producto.nombre}
            style={{
              width: "55px",
              height: "55px",
              objectFit: "contain",
              borderRadius: "8px",
              border: "1px solid #eeeeee",
            }}
          />

          <div style={{ flex: 1 }}>
            <strong>{producto.nombre}</strong>

            <div
              style={{
                color: "#d62828",
                fontWeight: "bold",
                marginTop: "5px",
              }}
            >
              {producto.precio}
            </div>
          </div>

          <button
            type="button"
            disabled={obtenerDisponibilidad(producto).limiteAlcanzado}
            onClick={() => agregarAlCarrito(producto)}
            style={{
              backgroundColor: "#d62828",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {obtenerDisponibilidad(producto).limiteAlcanzado ? "Sin disponibilidad" : "Agregar"}
          </button>
        </div>
      ))
    )}
  </div>
)}
</section>

      {/* HERO - CARRUSEL */}
<section
  id="inicio"
  className="hero-carousel"
  style={{
    position: "relative",
    width: "100%",
    height: "430px",
    overflow: "hidden",
    backgroundColor: "#111",
  }}
>
  {slides.map((slide, index) => (
    <div
      key={slide.imagen}
      style={{
        position: "absolute",
        inset: 0,
        opacity: index === slideActual ? 1 : 0,
        transition: "opacity 1s ease-in-out",
        pointerEvents: index === slideActual ? "auto" : "none",
      }}
    >
      {/* Fondo desenfocado */}
<img
  src={slide.imagen}
  alt=""
  aria-hidden="true"
  style={{
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "blur(18px) brightness(0.65)",
    transform: "scale(1.08)",
  }}
/>

{/* Imagen principal completa */}
<img
  src={slide.imagen}
  alt={slide.titulo}
  style={{
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center center",
    zIndex: 1,
  }}
/>
      {/* Capa oscura */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.30) 48%, rgba(0,0,0,0.08) 100%)",
            zIndex: 2,
        }}
      />

      {/* Texto */}
      <div
      className="hero-content"
        style={{
          position: "absolute",
          top: "50%",
          left: "8%",
          transform: "translateY(-50%)",
          maxWidth: "650px",
          color: "#ffffff",
          zIndex: 3,
          textShadow: "0 2px 8px rgba(0,0,0,0.55)",
        }}
      >
        <h1
        className="hero-title"
          style={{
            fontSize: "48px",
            lineHeight: "1.1",
            marginBottom: "18px",
            fontWeight: "800",
          }}
        >
          {slide.titulo}
        </h1>

        <p
        className="hero-description"
          style={{
            fontSize: "21px",
            lineHeight: "1.5",
            marginBottom: "28px",
          }}
        >
          {slide.descripcion}
        </p>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("categorias")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          style={{
            backgroundColor: "#d62828",
            color: "#ffffff",
            border: "none",
            padding: "15px 30px",
            borderRadius: "10px",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
          }}
        >
          🛒 Comprar ahora
        </button>
      </div>
    </div>
  ))}

  {/* Flecha izquierda */}
  <button
    type="button"
    className="hero-arrow hero-arrow-left"
    aria-label="Imagen anterior"
    onClick={() =>
      setSlideActual(
        (slideActual - 1 + slides.length) % slides.length
      )
    }
  
    style={{
      position: "absolute",
      left: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 5,
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.7)",
      backgroundColor: "rgba(0,0,0,0.35)",
      color: "#ffffff",
      fontSize: "32px",
      cursor: "pointer",
    }}
  >
    ‹
  </button>

  {/* Flecha derecha */}
  <button
    type="button"
    className="hero-arrow hero-arrow-right"
    aria-label="Siguiente imagen"
    onClick={() =>
      setSlideActual((slideActual + 1) % slides.length)
    }
    style={{
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 5,
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.7)",
      backgroundColor: "rgba(0,0,0,0.35)",
      color: "#ffffff",
      fontSize: "32px",
      cursor: "pointer",
    }}
  >
    ›
  </button>

  {/* Indicadores */}
  <div
    className="hero-dots"
    style={{
      position: "absolute",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "9px",
      zIndex: 5,
    }}
  >
    {slides.map((_, index) => (
      <button
        key={index}
        type="button"
        aria-label={`Ir a imagen ${index + 1}`}
        onClick={() => setSlideActual(index)}
        style={{
          width: index === slideActual ? "28px" : "11px",
          height: "11px",
          borderRadius: "20px",
          border: "none",
          backgroundColor:
            index === slideActual
              ? "#ffd60a"
              : "rgba(255,255,255,0.75)",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      />
    ))}
  </div>
</section>

      {/* CATEGORIAS */}
      <section
        id="categorias"
        style={{
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Explora nuestras categorías
        </h2>

        <div
        className="categories-grid"
          style={{
            display: "grid",
            gridTemplateColumns:  "repeat(auto-fit,minmax(180px,1fr))",
            gap: "20px",
          }}
        >
          {[
            "🛒 Abarrotes",
            "🥤 Bebidas",
            "🧀 Lácteos",
            "🍬 Dulces",
            "🥔 Botanas",
            "🧽 Limpieza",
            "🔧 Ferretería",
            "🍺 Alcohol",
            "🧴 Higiene",
            "🐶 Alimento para mascotas",
          ].map((categoria) => (
  <button
    key={categoria}
    type="button"
    aria-pressed={normalizarBusqueda(categoriaSeleccionada) === normalizarBusqueda(categoria.replace(/^.*?\s/, ""))}
    onClick={() => {
      const nombreCategoria = categoria.replace(/^.*?\s/, "");
      setCategoriaSeleccionada((actual) => normalizarBusqueda(actual) === normalizarBusqueda(nombreCategoria) ? "" : nombreCategoria);
      if (window.matchMedia("(max-width: 768px)").matches) document.getElementById("productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }}
    style={{
      ...cardStyle,
      textAlign: "center",
      fontWeight: "bold",
      cursor: "pointer",
      border: "none",
      fontSize: "16px",
    }}
  >
    {categoria}
  </button>
))}
        </div>
        <button type="button" className="mobile-only categories-all" aria-pressed={categoriaSeleccionada === ""} onClick={() => setCategoriaSeleccionada("")}>Todos</button>
      </section>
      {/* PROMOCIONES */}
<section
  id="promociones"
  style={{
    padding: "60px 20px",
    backgroundColor: "#fff7d6",
  }}
>
  <div
    style={{
      maxWidth: "1200px",
      margin: "auto",
    }}
  >
    <h2
      style={{
        textAlign: "center",
        fontSize: "32px",
        marginBottom: "10px",
        color: "#d62828",
      }}
    >
      🔥 Promociones
    </h2>

    <p
      style={{
        textAlign: "center",
        fontSize: "18px",
        marginBottom: "35px",
        color: "#333",
      }}
    >
      Aprovecha nuestras ofertas y ahorra en tus productos favoritos.
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(250px,1fr))",
        gap: "20px",
      }}
    >
      <div style={cardStyle}>
        <h3>🔥 Ofertas del día</h3>
        <p>Encuentra productos seleccionados con precios especiales.</p>
      </div>

      <div style={cardStyle}>
        <h3>🏷️ Descuentos especiales</h3>
        <p>Aprovecha descuentos en productos seleccionados.</p>
      </div>

      <div style={cardStyle}>
        <h3>🛒 2x1</h3>
        <p>Llévate dos productos por el precio de uno en promociones participantes.</p>
      </div>

      <div style={cardStyle}>
        <h3>💰 Precio rebajado</h3>
        <p>Productos con precios especiales por tiempo limitado.</p>
      </div>

      <div style={cardStyle}>
        <h3>📦 Combos</h3>
        <p>Arma tus compras con nuestros paquetes y combinaciones especiales.</p>
      </div>

      <div style={cardStyle}>j
        <h3>⭐ Ofertas destacadas</h3>
        <p>Las promociones que no te quieres perder.</p>
      </div>
    </div>
  </div>
</section>

      {/* PRODUCTOS */}
      <section id="productos"
        style={{
          padding: "60px 20px",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            Productos destacados
          </h2>
          <div className="mobile-only catalog-status" aria-live="polite">
            <span>{categoriaSeleccionada || "Todos los productos"} · {productosFiltrados.length} resultados</span>
            {(categoriaSeleccionada || search) && <button type="button" onClick={() => { setCategoriaSeleccionada(""); setSearch(""); }}>Ver todos</button>}
          </div>

<div
  className="products-grid"
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "28px",
    alignItems: "stretch",
  }}
>
            {productosFiltrados.length === 0 && (
  <div
    style={{
      textAlign: "center",
      padding: "40px",
      fontSize: "18px",
      color: "#666",
    }}
  >
    No encontramos productos.
  </div>
)}
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                style={cardStyle}
              >
  <Link
  href={`/producto/${producto.id}`}
  style={{
    display: "block",
    textDecoration: "none",
  }}
>
  <div
    style={{
      height: "150px",
      borderRadius: "10px",
      marginBottom: "15px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff",
      overflow: "hidden",
      cursor: "pointer",
    }}
  >
    <ProductImage
      src={producto.imagen || undefined}
      alt={producto.nombre}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  </div>
</Link>
<span
  style={{
    display: "inline-block",
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "8px",
  }}
>
  {producto.categoria}
</span>
                <Link
  href={`/producto/${producto.id}`}
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <h3
    style={{
      cursor: "pointer",
    }}
  >
    {producto.nombre}
  </h3>
</Link>

                <p
                  style={{
                    color: "#d62828",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {producto.precio}
                </p>
{(() => {
  const productoEnCarrito = carrito.find(
    (item) => item.nombre === producto.nombre
  );

  if (!productoEnCarrito) return null;

  return (
    <p
      style={{
        margin: "8px 0 12px",
        color: "#198754",
        fontSize: "14px",
        fontWeight: "700",
      }}
    >
      🛒 En carrito: {productoEnCarrito.cantidad} pieza
      {productoEnCarrito.cantidad !== 1 ? "s" : ""}
    </p>
  );
})()}
    <StockNotice producto={producto} />
    <button
  disabled={obtenerDisponibilidad(producto).limiteAlcanzado}
  style={primaryButton}
  onClick={() => {
    agregarAlCarrito(producto);
    setProductoAgregado(producto.nombre);

    setTimeout(() => {
      setProductoAgregado("");
    }, 1200);
  }}
>
  {obtenerDisponibilidad(producto).limiteAlcanzado
    ? (obtenerDisponibilidad(producto).stock === 0 ? "Sin existencias" : "Límite alcanzado")
    : productoAgregado === producto.nombre
    ? "✅ Agregado"
    : "Agregar al carrito"}
</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section
        style={{
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          <div style={cardStyle}>
            <h3>🚚 Entrega rápida</h3>
            <p>Recibe tus productos en minutos.</p>
          </div>

          <div style={cardStyle}>
            <h3>💳 Pago seguro</h3>
            <p>Paga con confianza y seguridad.</p>
          </div>

          <div style={cardStyle}>
            <h3>🏪 Gran variedad</h3>
            <p>Todo para tu hogar en un solo lugar.</p>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section
      
  id="contacto"
        style={{
          backgroundColor: "#fff",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2>Contacto</h2>

        <p>📱 WhatsApp: +52 9541301043</p>
        <p>☎️ Teléfono: +52 954 130 1043</p>
        <p>📧 correo@doshermanos.com</p>
        <p>📍 Tu ciudad, México</p>
      </section>
      {/* CARRITO */}
{carritoAbierto && (
  <div className={`cart-overlay ${carrito.length > 0 ? "has-quick-summary" : ""}`}
  style={{
    position: "fixed",
    top: "110px",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "#f5f6f8",
    zIndex: 900,
    overflowY: "auto",
    paddingTop: "0",
  }}
>
    <div className="cart-container"
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "30px 25px 50px",
      }}
    >
      {/* ENCABEZADO DEL CARRITO */}
      <div className="cart-heading"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "30px",
              color: "#111111",
            }}
          >
            🛒 Mi carrito
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#666666",
            }}
          >
            {carrito.length} productos guardados ·{" "}
            {totalProductosSeleccionados} productos seleccionados para comprar
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCarritoAbierto(false)}
          style={{
            border: "none",
            backgroundColor: "#ffffff",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            fontSize: "22px",
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(0,0,0,0.10)",
          }}
        >
          ✕
        </button>
      </div>

      {carrito.length === 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "50px 20px",
            borderRadius: "16px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "50px" }}>🛒</div>

          <h3 style={{ fontSize: "22px" }}>
            Tu carrito está vacío
          </h3>

          <p style={{ color: "#666666" }}>
            Agrega productos de nuestra tienda para comenzar tu compra.
          </p>

          <button
            type="button"
            onClick={() => setCarritoAbierto(false)}
            style={{
              marginTop: "15px",
              padding: "12px 20px",
              backgroundColor: "#d62828",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Seguir comprando
          </button>
        </div>
      ) : (
        <div className="cart-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 360px",
            gap: "25px",
            alignItems: "start",
          }}
        >
          {/* PRODUCTOS DEL CARRITO */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}

          >
          {/* SELECCIONAR TODOS */}
<div
  style={{
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "16px 20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }}
>
  <input
    type="checkbox"
    checked={
      carrito.length > 0 &&
      carrito.every(
        (producto) => producto.seleccionado !== false
      )
    }
    onChange={cambiarSeleccionTodos}
    style={{
      width: "20px",
      height: "20px",
      cursor: "pointer",
    }}
  />

  <div>
    <strong
      style={{
        fontSize: "17px",
      }}
    >
      Seleccionar todos los productos
    </strong>

    <p
      style={{
        margin: "3px 0 0",
        color: "#666666",
        fontSize: "14px",
      }}
    >
      Marca o desmarca todos los productos de tu carrito.
    </p>
  </div>
</div>
            {Object.entries(productosPorCategoria).map(
              ([categoria, productos]) => (
                <div
                  key={categoria}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* NOMBRE Y SELECCIÓN DE LA CATEGORÍA */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px",
    borderBottom: "2px solid #eeeeee",
    paddingBottom: "12px",
  }}
>
  <input
    type="checkbox"
    checked={productos.every(
      (producto) => producto.seleccionado !== false
    )}
    onChange={() => cambiarSeleccionCategoria(categoria)}
    style={{
      width: "20px",
      height: "20px",
      cursor: "pointer",
    }}
  />

  <h3
    style={{
      margin: 0,
      color: "#d62828",
      fontSize: "20px",
    }}
  >
    📦 {categoria} ({productos.length})
  </h3>
</div>

                  {productos.map((producto, index) => (
                    <div
                      key={`${producto.nombre}-${index}`}
                      style={{
                        padding: "15px 0",
                        borderBottom:
                          index === productos.length - 1
                            ? "none"
                            : "1px solid #eeeeee",
                        opacity:
                          producto.seleccionado === false ? 0.6 : 1,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* NOMBRE Y ELIMINAR */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <input
  type="checkbox"
  checked={producto.seleccionado !== false}
  onChange={() =>
    cambiarSeleccionProducto(producto.nombre)
  }
  style={{
    width: "20px",
    height: "20px",
    cursor: "pointer",
  }}
/>

<ProductImage
  src={producto.imagen || undefined}
  alt={producto.nombre}
  style={{
    width: "80px",
    height: "80px",
    objectFit: "contain",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "5px",
    border: "1px solid #eeeeee",
  }}
/>

<div>
                            <strong
                              style={{
                                fontSize: "17px",
                                textDecoration:
                                  producto.seleccionado === false
                                    ? "line-through"
                                    : "none",
                              }}
                            >
                              {producto.nombre}
                            </strong>

                            <div
                              style={{
                                marginTop: "4px",
                                color: "#666666",
                                fontSize: "14px",
                              }}
                            >
                              {producto.precio} c/u
                            </div>
                          </div>
                        </div>

                        {/* ELIMINAR */}
                        <button
                          type="button"
                          onClick={() => {
                            setCarrito((carritoActual) =>
                              carritoActual.filter(
                                (item) =>
                                  item.nombre !== producto.nombre
                              )
                            );
                          }}
                          style={{
                            border: "none",
                            backgroundColor: "#fff0f0",
                            color: "#d62828",
                            borderRadius: "8px",
                            padding: "8px 10px",
                            cursor: "pointer",
                          }}
                          title="Eliminar producto"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* CANTIDAD Y SUBTOTAL */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "15px",
                          paddingLeft: "32px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setCarrito((carritoActual) =>
                                carritoActual
                                  .map((item) =>
                                    item.nombre === producto.nombre
                                      ? {
                                          ...item,
                                          cantidad:
                                            item.cantidad - 1,
                                        }
                                      : item
                                  )
                                  .filter((item) => item.cantidad > 0)
                              );
                            }}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: "1px solid #dddddd",
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                              fontSize: "18px",
                            }}
                          >
                            −
                          </button>

                          <strong>{producto.cantidad}</strong>

                          <button
                            type="button"
                            disabled={obtenerDisponibilidad(producto).limiteAlcanzado}
                            onClick={() =>
                              agregarAlCarrito(producto)
                            }
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: "none",
                              backgroundColor: "#d62828",
                              color: "#ffffff",
                              cursor: "pointer",
                              fontSize: "18px",
                            }}
                          >
                            +
                          </button>
                        </div>

                        <strong
                          style={{
                            color: "#d62828",
                            fontSize: "18px",
                          }}
                        >
                          $
                          {Number(
                            producto.precio.replace("$", "")
                          ) * producto.cantidad}
                        </strong>
                      </div>
                      <StockNotice producto={producto} />
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* RESUMEN DE COMPRA */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "22px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.10)",
              position: "sticky",
              top: "20px",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                fontSize: "22px",
              }}
            >
              🧾 Resumen de compra
            </h3>

            {productosSeleccionados.length === 0 ? (
              <p
                style={{
                  color: "#666666",
                  lineHeight: "1.5",
                }}
              >
                Selecciona al menos un producto para incluirlo
                en tu compra.
              </p>
            ) : (
              <div>
                {productosSeleccionados.map((producto) => (
                  <div
                    key={`resumen-${producto.nombre}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "12px",
                      fontSize: "14px",
                    }}
                  >
                    <span>
                      {producto.nombre} × {producto.cantidad}
                    </span>

                    <strong>
                      $
                      {Number(
                        producto.precio.replace("$", "")
                      ) * producto.cantidad}
                    </strong>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                borderTop: "2px solid #eeeeee",
                marginTop: "20px",
                paddingTop: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#666666",
                  marginBottom: "10px",
                }}
              >
                <span>Artículos seleccionados</span>
                <span>{totalProductosSeleccionados}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "24px",
                  fontWeight: "800",
                }}
              >
                <span>Subtotal</span>

                <span style={{ color: "#d62828" }}>
                  ${totalCompra}
                </span>
              </div>

              <button
                type="button"
                className="desktop-continue"
                disabled={productosSeleccionados.length === 0 || totalCompra < PEDIDO_MINIMO}
                onClick={continuarPedido}
                style={{
                  width: "100%",
                  marginTop: "22px",
                  padding: "15px",
                  backgroundColor:
                    productosSeleccionados.length === 0 || totalCompra < PEDIDO_MINIMO
                      ? "#cccccc"
                      : "#d62828",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor:
                    productosSeleccionados.length === 0 || totalCompra < PEDIDO_MINIMO
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Continuar pedido
              </button>
              <p style={{ marginTop: "12px", fontSize: "14px", color: "#555" }}>
                Entregas solo en Pinotepa Nacional, Oaxaca. Compra minima: $150.
                {totalCompra < PEDIDO_MINIMO && ` Te faltan $${(PEDIDO_MINIMO - totalCompra).toFixed(2)}.`}
                {" "}El costo de envio se confirma con la tienda antes de aceptar el pedido.
              </p>

              <button
                type="button"
                onClick={() => setCarritoAbierto(false)}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "12px",
                  backgroundColor: "transparent",
                  color: "#333333",
                  border: "1px solid #dddddd",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

{/* DATOS DEL PEDIDO */}

      {/* DATOS DEL PEDIDO */}
      {/* FOOTER */}
      
{pedidoAbierto && (
  <div className="checkout-overlay"
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      zIndex: 3000,
    }}
  >
    <div className="checkout-panel"
      style={{
        backgroundColor: "#ffffff",
        width: "100%",
        maxWidth: "500px",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "18px",
        padding: "30px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          📦 Datos de entrega
        </h2>

        <button
          type="button"
          onClick={() => setPedidoAbierto(false)}
          style={{
            border: "none",
            backgroundColor: "transparent",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <p
        style={{
          color: "#555",
          marginBottom: "25px",
        }}
      >
        Entrega en Pinotepa Nacional, Oaxaca. Compra minima de $150.
      </p>
      {erroresPedido.pedido && <p role="alert" className="field-error">{erroresPedido.pedido}</p>}

      <label
        htmlFor="pedido-nombre"
        style={{
          display: "block",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Nombre
      </label>

      <input
        type="text"
        id="pedido-nombre"
        autoComplete="name"
        aria-invalid={!!erroresPedido.nombre}
        aria-describedby={erroresPedido.nombre ? "error-nombre" : undefined}
        placeholder="Tu nombre"
        value={nombreCliente}
onChange={(e) => { setNombreCliente(e.target.value); limpiarError("nombre"); }}
        style={{
          width: "100%",
          padding: "13px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontSize: "16px",
          marginBottom: "18px",
          boxSizing: "border-box",
        }}
      />

      {erroresPedido.nombre && <p id="error-nombre" role="alert" className="field-error">{erroresPedido.nombre}</p>}

      <label
        htmlFor="pedido-telefono"
        style={{
          display: "block",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Teléfono
      </label>

      <input
        type="tel"
        id="pedido-telefono"
        autoComplete="tel"
        inputMode="tel"
        aria-invalid={!!erroresPedido.telefono}
        aria-describedby={erroresPedido.telefono ? "error-telefono" : undefined}
        placeholder="Tu número de teléfono"
        value={telefonoCliente}
        onChange={(e) => { setTelefonoCliente(e.target.value); limpiarError("telefono"); }}
        style={{
          width: "100%",
          padding: "13px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontSize: "16px",
          marginBottom: "18px",
          boxSizing: "border-box",
        }}
      />

      {erroresPedido.telefono && <p id="error-telefono" role="alert" className="field-error">{erroresPedido.telefono}</p>}

      <div className={direccionLibre ? "address-free" : "address-free desktop-address"}>
      <label
        htmlFor="pedido-direccion"
        style={{
          display: "block",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Dirección de entrega
      </label>

      <textarea
        id="pedido-direccion"
        autoComplete="street-address"
        aria-invalid={!!erroresPedido.direccion}
        aria-describedby={erroresPedido.direccion ? "error-direccion" : undefined}
        placeholder="Calle, número, colonia, referencias..."
        value={direccionCliente}
onChange={(e) => { setDireccionCliente(e.target.value); setDireccionCampos({ calle: "", numero: "", colonia: "", referencias: "" }); limpiarError("direccion"); }}
        rows={4}
        style={{
          width: "100%",
          padding: "13px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontSize: "16px",
          marginBottom: "18px",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      {erroresPedido.direccion && <p id="error-direccion" role="alert" className="field-error">{erroresPedido.direccion}</p>}
      </div>
      {!direccionLibre && <fieldset className="mobile-only structured-address">
        <legend>Dirección de entrega</legend>
        {[
          ["calle", "Calle", "Nombre de la calle"],
          ["numero", "Número o S/N", "Número exterior o S/N"],
          ["colonia", "Colonia", "Nombre de la colonia"],
          ["referencias", "Referencias (opcional)", "Entre calles, color de la casa..."],
        ].map(([campo, etiqueta, placeholder]) => (
          <div key={campo}>
            <label htmlFor={`pedido-${campo}`}>{etiqueta}</label>
            <input id={`pedido-${campo}`} value={direccionCampos[campo]} placeholder={placeholder} autoComplete={campo === "calle" ? "address-line1" : "off"} onChange={(e) => actualizarDireccion(campo, e.target.value)} aria-invalid={!!erroresPedido[campo]} aria-describedby={erroresPedido[campo] ? `error-${campo}` : undefined} />
            {erroresPedido[campo] && <p id={`error-${campo}`} role="alert" className="field-error">{erroresPedido[campo]}</p>}
          </div>
        ))}
      </fieldset>}

      <label
        style={{
          display: "block",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Notas del pedido
      </label>

      <textarea
        placeholder="Alguna indicación adicional..."
        value={notasPedido}
        onChange={(e) => setNotasPedido(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: "13px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontSize: "16px",
          marginBottom: "25px",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "20px" }}>
        <input id="pedido-ciudad" type="checkbox" aria-invalid={!!erroresPedido.ciudad} aria-describedby={erroresPedido.ciudad ? "error-ciudad" : undefined} checked={ciudadConfirmada} onChange={(e) => { setCiudadConfirmada(e.target.checked); limpiarError("ciudad"); }} />
        Mi direccion esta dentro de Pinotepa Nacional, Oaxaca.
      </label>
      {erroresPedido.ciudad && <p id="error-ciudad" role="alert" className="field-error">{erroresPedido.ciudad}</p>}
      <fieldset style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <legend>Metodo de pago</legend>
        <label style={{ display: "block", marginBottom: "12px" }}>
          <input type="radio" name="metodoPago" value="contra_entrega" checked={metodoPago === "contra_entrega"} onChange={(e) => setMetodoPago(e.target.value)} /> Pago al entregar
        </label>
        <label style={{ display: "block" }}>
          <input type="radio" name="metodoPago" value="transferencia" checked={metodoPago === "transferencia"} onChange={(e) => setMetodoPago(e.target.value)} /> Transferencia bancaria
        </label>
        {metodoPago === "transferencia" && <p style={{ fontSize: "14px", marginTop: "12px" }}>La tienda te compartira los datos bancarios al confirmar el pedido. El pago queda pendiente de verificacion.</p>}
      </fieldset>
      <button
        type="button"
        onClick={confirmarPedido}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#d62828",
          color: "#ffffff",
          border: "none",
          borderRadius: "10px",
          fontSize: "17px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Confirmar pedido
      </button>
    </div>
  </div>
)}
{/* RESUMEN DEL PEDIDO */}
{resumenPedido && (
  <div className="checkout-overlay"
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      zIndex: 4000,
    }}
  >
    <div className="checkout-panel"
      style={{
        backgroundColor: "#ffffff",
        width: "100%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "18px",
        padding: "30px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          📋 Resumen de tu pedido
        </h2>

        <button
          type="button"
          onClick={() => setResumenPedido(false)}
          style={{
            border: "none",
            backgroundColor: "transparent",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* PRODUCTOS */}
      <h3>🛒 Productos</h3>

      {productosSeleccionados.map((producto, index) => (
        <div
          key={`${producto.nombre}-${index}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
            padding: "12px 0",
            gap: "15px",
          }}
        >
          <div>
            <strong>{producto.nombre}</strong>

            <p
              style={{
                margin: "5px 0 0",
                color: "#666",
                fontSize: "14px",
              }}
            >
              {producto.cantidad} pieza
              {producto.cantidad !== 1 ? "s" : ""} ×{" "}
              {producto.precio}
            </p>
          </div>

          <strong
            style={{
              color: "#d62828",
              whiteSpace: "nowrap",
            }}
          >
            $
            {Number(producto.precio.replace("$", "")) *
              producto.cantidad}
          </strong>
        </div>
      ))}

      {/* TOTAL */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          paddingTop: "15px",
          borderTop: "2px solid #222",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        <span>Subtotal de productos:</span>

        <span style={{ color: "#d62828" }}>
          ${totalCompra.toFixed(2)}
        </span>
      </div>

      {/* DATOS DEL CLIENTE */}
      <div
        style={{
          marginTop: "30px",
          backgroundColor: "#f7f7f7",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          📦 Datos de entrega
        </h3>

        <p>
          <strong>Nombre:</strong> {nombreCliente}
        </p>

        <p>
          <strong>Teléfono:</strong> {telefonoCliente}
        </p>

        <p>
          <strong>Dirección:</strong> {direccionCliente}
        </p>
        <p><strong>Ciudad:</strong> Pinotepa Nacional, Oaxaca</p>
        <p><strong>Envio:</strong> Costo pendiente de confirmar con la tienda. No incluido en el subtotal.</p>
        <p><strong>Pago:</strong> {metodoPago === "transferencia" ? "Transferencia bancaria (pendiente de verificacion)" : "Al entregar"}</p>

        {notasPedido.trim() && (
          <p>
            <strong>Notas:</strong> {notasPedido}
          </p>
        )}
      </div>

      {/* BOTÓN FINAL */}
      <button type="button" className="edit-order" onClick={() => { setResumenPedido(false); setPedidoAbierto(true); setErroresPedido({}); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", marginTop: "20px", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", background: "white", cursor: "pointer" }}><Pencil size={18} aria-hidden="true" />Editar datos del pedido</button>
      {erroresPedido.pedido && <p role="alert" className="field-error">{erroresPedido.pedido}</p>}
      <button
  type="button"
  onClick={() => {
    if (!validarPedido()) return;
    const productosPedido = productosSeleccionados
      .map(
        (producto) =>
          `• ${producto.nombre} x${producto.cantidad} = $${
            Number(producto.precio.replace("$", "")) *
            producto.cantidad
          }`
      )
      .join("\n");

    const mensaje = `*NUEVO PEDIDO*
*MISCELÁNEA DOS HERMANOS*

---

*CLIENTE*
${nombreCliente}

*TELÉFONO*
${telefonoCliente}

*PRODUCTOS*
${productosPedido}

---

*TOTAL DE PRODUCTOS: $${totalCompra.toFixed(2)}*

*ENVIO: costo pendiente de confirmar antes de aceptar el pedido. No incluido en el subtotal.*

*PAGO*
${metodoPago === "transferencia" ? "Transferencia bancaria (pendiente de verificacion)" : "Al entregar"}

---

*DIRECCIÓN DE ENTREGA*
${direccionCliente}
Pinotepa Nacional, Oaxaca

*NOTAS*
${notasPedido || "Sin notas"}

---

Gracias por tu compra.`;




    const whatsapp = `https://wa.me/529541301043?text=${encodeURIComponent(
      mensaje
  )}`;

    window.open(whatsapp, "_blank", "noopener,noreferrer");
  }}
  style={{
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    backgroundColor: "#d62828",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Enviar pedido
</button>
    </div>
  </div>
)}
      {carritoAbierto && carrito.length > 0 && !pedidoAbierto && !resumenPedido && (
        <div className="mobile-only cart-quick-summary">
          <div aria-live="polite"><span>Subtotal de productos</span><strong>${totalCompra.toFixed(2)}</strong>{totalCompra < PEDIDO_MINIMO && <small>Faltan ${(PEDIDO_MINIMO - totalCompra).toFixed(2)}</small>}</div>
          <button type="button" disabled={productosSeleccionados.length === 0 || totalCompra < PEDIDO_MINIMO} onClick={continuarPedido}>Continuar pedido</button>
        </div>
      )}
      <nav className="mobile-bottom-nav" aria-label="Navegacion principal movil">
        <button type="button" aria-label="Inicio" onClick={() => { setCarritoAbierto(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <HomeIcon size={22} aria-hidden="true" /><span>Inicio</span>
        </button>
        <button type="button" aria-label="Categorias" onClick={() => { setCarritoAbierto(false); document.getElementById("categorias")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
          <Grid2X2 size={22} aria-hidden="true" /><span>Categorias</span>
        </button>
        <button type="button" aria-label={`Carrito, ${carrito.reduce((total, item) => total + item.cantidad, 0)} articulos`} aria-pressed={carritoAbierto} onClick={() => setCarritoAbierto(!carritoAbierto)}>
          <span className="bottom-cart-icon"><ShoppingCart size={22} aria-hidden="true" />{carrito.length > 0 && <span className="bottom-cart-count">{carrito.reduce((total, item) => total + item.cantidad, 0)}</span>}</span><span>Carrito</span>
        </button>
      </nav>
      <footer
        style={{
          backgroundColor: "#1f2937",
          color: "#fff",
          textAlign: "center",
          padding: "25px",
        }}
      >
        © 2026 Miscelánea Dos Hermanos · Todos los derechos reservados
      </footer>
    </main>
  );
}
