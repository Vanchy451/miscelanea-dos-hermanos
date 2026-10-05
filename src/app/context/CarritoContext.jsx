"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
} from "react";
import productos from "../../../data/productos";
import { CART_STORAGE_KEY, restaurarCarrito, serializarCarrito } from "../lib/carrito-persistence.mjs";

const CarritoContext = createContext(null);
const carritoVacio = [];
let carritoGuardado = carritoVacio;
let inicializado = false;
const suscriptores = new Set();

function getSnapshot() {
  if (!inicializado && typeof window !== "undefined") {
    inicializado = true;
    try {
      carritoGuardado = restaurarCarrito(window.localStorage.getItem(CART_STORAGE_KEY), productos);
    } catch {
      carritoGuardado = carritoVacio;
    }
  }
  return carritoGuardado;
}

function notificar() {
  suscriptores.forEach((actualizar) => actualizar());
}

function subscribe(actualizar) {
  suscriptores.add(actualizar);
  const sincronizar = (evento) => {
    if (evento.key !== CART_STORAGE_KEY && evento.key !== null) return;
    carritoGuardado = restaurarCarrito(evento.newValue, productos);
    notificar();
  };
  window.addEventListener("storage", sincronizar);
  return () => {
    suscriptores.delete(actualizar);
    window.removeEventListener("storage", sincronizar);
  };
}

function setCarrito(valor) {
  const actual = getSnapshot();
  carritoGuardado = typeof valor === "function" ? valor(actual) : valor;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, serializarCarrito(carritoGuardado));
  } catch {
    // Browsers with storage disabled can still use the cart during this visit.
  }
  notificar();
}

export function CarritoProvider({ children }) {
  const carrito = useSyncExternalStore(subscribe, getSnapshot, () => carritoVacio);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.id === producto.id
      );
      const stock = Number(producto.stock);
      if (!Number.isFinite(stock) || stock <= 0 || (productoExistente?.cantidad || 0) >= stock) {
        return carritoActual;
      }

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
