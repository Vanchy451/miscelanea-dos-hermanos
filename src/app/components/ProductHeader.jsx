"use client";

import { useRouter } from "next/navigation";
import Header from "./Header";
import { useCarrito } from "../context/CarritoContext";

export default function ProductHeader() {
  const { carrito } = useCarrito();
  const router = useRouter();
  return (
    <>
      <Header carrito={carrito} carritoAbierto={false} homeHref="/" setCarritoAbierto={() => router.push("/?carrito=1")} />
      <div className="header-spacer" />
    </>
  );
}
