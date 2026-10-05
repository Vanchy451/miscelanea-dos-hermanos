import BotonAgregarCarrito from "../../components/BotonAgregarCarrito";
import ProductosCarrusel from "../../components/ProductosCarrusel";
import Link from "next/link";
import { notFound } from "next/navigation";
import productos from "../../../../data/productos";
import ProductImage from "../../components/ProductImage";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const producto = productos.find(
    (producto) => producto.id === Number(id)
  );

  if (!producto) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: producto.nombre,
    description: `${producto.nombre} disponible en Miscelánea 2 Hermanos, Santiago Pinotepa Nacional, Oaxaca.`,
  };
}

export default async function ProductoPage({ params }) {
  const { id } = await params;

  const producto = productos.find(
    (producto) => producto.id === Number(id)
  );

  if (!producto) {
    notFound();
  }

  // Productos de la misma categoría
  const relacionados = productos
    .filter(
      (p) =>
        p.id !== producto.id &&
        p.categoria === producto.categoria
    )
    .slice(0, 12);

  // Categorías que combinan entre sí
  const categoriasComplementarias = {
    Bebidas: ["Botanas", "Dulces"],
    Botanas: ["Bebidas"],
    Dulces: ["Bebidas", "Botanas"],
    Abarrotes: ["Bebidas", "Lácteos"],
    Lácteos: ["Abarrotes"],
    Limpieza: ["Higiene"],
    Higiene: ["Limpieza"],
    Panadería: ["Bebidas", "Lácteos"],
    Helados: ["Botanas", "Bebidas"],
  };

  const categoriasParaCombinar =
    categoriasComplementarias[producto.categoria] || [];

  let complementarios = productos.filter(
    (p) =>
      p.id !== producto.id &&
      categoriasParaCombinar.includes(p.categoria)
  );

  // Si estamos viendo una bebida, damos prioridad
  // a botanas conocidas como Sabritas, Doritos, etc.
  if (producto.categoria === "Bebidas") {
    const marcasPrioritarias = [
      "SABRITAS",
      "DORITOS",
      "RUFFLES",
      "CHEETOS",
    ];

    complementarios = complementarios.sort((a, b) => {
      const aPrioridad = marcasPrioritarias.some((marca) =>
        a.nombre.toUpperCase().includes(marca)
      );

      const bPrioridad = marcasPrioritarias.some((marca) =>
        b.nombre.toUpperCase().includes(marca)
      );

      return Number(bPrioridad) - Number(aPrioridad);
    });
  }

  complementarios = complementarios.slice(0, 12);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        paddingBottom: "70px",
      }}
    >
      {/* BARRA SUPERIOR */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "18px 20px",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#1e3a8a",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            ← Volver a la tienda
          </Link>
        </div>
      </div>

      {/* PRODUCTO PRINCIPAL */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "40px auto 0",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "22px",
            padding: "40px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "50px",
            alignItems: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          {/* IMAGEN */}
          <div
            style={{
              minHeight: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#ffffff",
              borderRadius: "18px",
            }}
          >
            {producto.imagen ? (
              <ProductImage
                src={producto.imagen}
                alt={producto.nombre}
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "400px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <p>Imagen no disponible</p>
            )}
          </div>

          {/* INFORMACIÓN */}
          <div>
            <span
              style={{
                display: "inline-block",
                background: "#fff3cd",
                color: "#8a6500",
                padding: "7px 13px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              {producto.categoria}
            </span>

            <h1
              style={{
                fontSize: "36px",
                lineHeight: "1.15",
                color: "#172554",
                margin: "0 0 18px",
              }}
            >
              {producto.nombre}
            </h1>

            {producto.marca && (
              <p
                style={{
                  fontSize: "17px",
                  color: "#6b7280",
                  marginBottom: "15px",
                }}
              >
                Marca:{" "}
                <strong style={{ color: "#374151" }}>
                  {producto.marca}
                </strong>
              </p>
            )}

            <div
              style={{
                fontSize: "34px",
                color: "#d62828",
                fontWeight: "800",
                margin: "20px 0",
              }}
            >
              {producto.precio}
            </div>
            <BotonAgregarCarrito producto={producto} />
            {/* DISPONIBILIDAD */}
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <strong style={{ color: "#15803d" }}>
                ✓ Disponible en Miscelánea 2 Hermanos
              </strong>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#4b5563",
                  fontSize: "14px",
                }}
              >
                Compra fácil y servicio a domicilio.
              </p>
            </div>

            {/* INFORMACIÓN DEL PRODUCTO */}
            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: "20px",
              }}
            >
              <h3
                style={{
                  color: "#172554",
                  marginBottom: "15px",
                }}
              >
                Información del producto
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: "10px",
                  color: "#4b5563",
                }}
              >
                <div>
                  <strong>Categoría:</strong>{" "}
                  {producto.categoria}
                </div>

                {producto.marca && (
                  <div>
                    <strong>Marca:</strong>{" "}
                    {producto.marca}
                  </div>
                )}

                {producto.codigo && (
                  <div>
                    <strong>Código:</strong>{" "}
                    {producto.codigo}
                  </div>
                )}

                <div>
                  <strong>Disponibilidad:</strong>{" "}
                  <span style={{ color: "#15803d" }}>
                    En existencia
                  </span>
                </div>
              </div>
            </div>

            {/* BENEFICIOS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "12px",
                marginTop: "25px",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  padding: "14px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                🚚
                <br />
                <strong>Servicio a domicilio</strong>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  padding: "14px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                🛒
                <br />
                <strong>Compra fácil</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
<ProductosCarrusel
  titulo="Productos relacionados"
  descripcion="También podrían interesarte estos productos."
  productos={relacionados}
/>

<ProductosCarrusel
  titulo="Combínalo con"
  descripcion="Agrega algo más a tu compra."
  productos={complementarios}
/>
   </main>
  );
}
