import test from "node:test";
import assert from "node:assert/strict";
import { safeReturnPath, parseProduct } from "../src/app/lib/auth-config.mjs";

test("OAuth return destinations stay inside the allowed routes", () => {
  for (const path of ["/", "/cuenta", "/admin", "/?carrito=1"]) assert.equal(safeReturnPath(path), path);
  for (const path of ["https://evil.test", "//evil.test", "/\\evil.test", null, "/admin?next=https://evil.test"]) assert.equal(safeReturnPath(path), "/cuenta");
});

function form(overrides = {}) {
  const value = new FormData();
  Object.entries({ nombre: "Pepsi", categoria: "Bebidas", precio: "17.50", stock: "20", imagen: "https://example.test/pepsi.png", activo: "on", ...overrides }).forEach(([k, v]) => value.set(k, v));
  return value;
}

test("Admin data stores integer cents and nonnegative stock", () => {
  assert.deepEqual(parseProduct(form()), { nombre: "Pepsi", categoria: "Bebidas", precio_centavos: 1750, stock: 20, imagen: "https://example.test/pepsi.png", activo: true });
  assert.equal(parseProduct(form({ precio: "0", stock: "0", imagen: "", activo: "" })).activo, false);
  for (const data of [{ precio: "-1" }, { precio: "1.999" }, { precio: "Infinity" }, { stock: "1.5" }, { stock: "-1" }, { nombre: " " }, { categoria: " " }, { imagen: "javascript:alert(1)" }, { imagen: "https://" }]) assert.throws(() => parseProduct(form(data)));
});
