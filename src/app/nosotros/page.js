import Link from "next/link";

export const metadata = {
  title: "Nosotros",
  description:
    "Conoce Miscelánea 2 Hermanos, una tienda local en Santiago Pinotepa Nacional, Oaxaca.",
};

export default function Nosotros() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* ENCABEZADO */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "4px solid #d62828",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "#172554",
              fontWeight: "700",
            }}
          >
            ← Volver al inicio
          </Link>

          <strong
            style={{
              color: "#d62828",
              fontSize: "20px",
            }}
          >
            MISCELÁNEA 2 HERMANOS
          </strong>
        </div>
      </header>

      {/* CONTENIDO */}
      <section
        style={{
          padding: "70px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#d62828",
              fontWeight: "800",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            CONÓCENOS
          </p>

          <h1
            style={{
              color: "#172554",
              fontSize: "38px",
              marginBottom: "20px",
            }}
          >
            Miscelánea 2 Hermanos
          </h1>

          <p
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              fontSize: "18px",
              lineHeight: "1.8",
              color: "#4b5563",
            }}
          >
            Somos una tienda local en Santiago Pinotepa Nacional, Oaxaca,
            dedicada a ofrecer productos para el hogar y la familia.
            En Miscelánea 2 Hermanos puedes encontrar abarrotes, bebidas,
            botanas, lácteos, helados, productos de limpieza, ferretería
            y mucho más.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "24px",
              marginTop: "50px",
            }}
          >
            <div className="about-card">
              <div className="about-icon">🛒</div>
              <h3>Variedad</h3>
              <p>
                Productos para tus compras y necesidades de todos los días.
              </p>
            </div>

            <div className="about-card">
              <div className="about-icon">🤝</div>
              <h3>Atención cercana</h3>
              <p>
                Buscamos ofrecer una atención amable, rápida y de confianza.
              </p>
            </div>

            <div className="about-card">
              <div className="about-icon">🚚</div>
              <h3>Servicio a domicilio</h3>
              <p>
                Compra fácilmente y recibe tus productos de forma práctica.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "45px" }}>
            <Link
              href="/"
              style={{
                display: "inline-block",
                background: "#d62828",
                color: "#ffffff",
                textDecoration: "none",
                padding: "13px 24px",
                borderRadius: "10px",
                fontWeight: "700",
              }}
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}