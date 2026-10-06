"use client";

import { useCallback, useState } from "react";
import { ImageOff } from "lucide-react";

export default function ProductImage({ src, alt, style, className = "", ...props }) {
  const [imagenFallida, setImagenFallida] = useState(null);
  const [imagenLista, setImagenLista] = useState(null);
  const comprobarImagen = useCallback((imagen) => {
    // An image can fail before React attaches its error handler during hydration.
    if (imagen?.complete && imagen.naturalWidth === 0) setImagenFallida(src);
    if (imagen?.complete && imagen.naturalWidth > 0) setImagenLista(src);
  }, [src]);
  if (!src || imagenFallida === src) {
    return (
      <span
        role="img"
        aria-label={`Imagen no disponible: ${alt}`}
        className={`product-image-fallback ${className}`}
        style={{ ...style, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", backgroundColor: "#f4f6f5", color: "#66736d", fontSize: "10px", textAlign: "center", overflow: "hidden" }}
      >
        <ImageOff size={24} aria-hidden="true" />
        <span>Sin imagen</span>
      </span>
    );
  }
  // Preserve the original image dimensions and presentation when it loads.
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={comprobarImagen} loading="lazy" decoding="async" {...props} src={src} alt={alt} style={style} className={`${className} product-image ${imagenLista === src ? "is-loaded" : "is-loading"}`} onLoad={() => setImagenLista(src)} onError={() => setImagenFallida(src)} />;
}
