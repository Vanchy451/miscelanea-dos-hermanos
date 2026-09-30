"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.id === producto.id
      );

      if (productoExistente) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        );
      }

      return [
        ...carritoActual,
        {
          ...producto,
          cantidad: 1,
        },
      ];
    });
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        setCarrito,
        agregarAlCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);

  if (!contexto) {
    throw new Error(
      "useCarrito debe utilizarse dentro de CarritoProvider"
    );
  }

  return contexto;
}