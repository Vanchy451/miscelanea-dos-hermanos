export default function Galeria() {
  const imagenes = Array.from({ length: 15 }, (_, i) => {
    const numero = String(i + 1).padStart(3, "0");

    return {
      nombre: `IMG${numero}.png`,
      ruta: `/Sliders/IMG${numero}.png`,
    };
  });

  return (
    <main
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        background: "#f5f5f5",
      }}
    >
      <h1 style={{ marginBottom: "25px" }}>
        Imágenes del carrusel
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {imagenes.map((imagen) => (
          <div
            key={imagen.nombre}
            style={{
              background: "white",
              padding: "12px",
              borderRadius: "12px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
            }}
          >
            <img
              src={imagen.ruta}
              alt={imagen.nombre}
              style={{
                width: "100%",
                height: "190px",
                objectFit: "contain",
                background: "#eee",
              }}
            />

            <h3
              style={{
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              {imagen.nombre}
            </h3>
          </div>
        ))}
      </div>
    </main>
  );
}