import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import AgregarFactura from "../components/admin/agregarFactura";
import { DarkModeContext } from "../context/darkMode";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../dataBase/firebase", () => ({
  db: {},
  storage: {},
}));

vi.mock("firebase/messaging", () => ({
  getMessaging: () => ({}),
  getToken: () => Promise.resolve("fake-token"),
  onMessage: () => {},
}));

vi.mock("../context/AuthContext", () => ({
  UserAuth: () => ({
    user: { uid: "12345", nombre: "Test User" },
    logout: vi.fn(),
  }),
}));

vi.mock("../../context/darkMode", () => ({
  DarkModeContext: {
    Consumer: ({ children }) => children({ isDarkMode: false }),
  },
}));

describe("AgregarFactura", () => {
  it("should render the form correctly", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <AgregarFactura />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Proveedor/i)).not.toBeNull();
    expect(
      screen.getByLabelText(/Detalle/i, { selector: 'input[name="detalle"]' })
    ).not.toBeNull();
    expect(screen.getByLabelText(/ID del Producto/i)).not.toBeNull();
    expect(screen.getByLabelText(/Cantidad/i)).not.toBeNull();
    expect(screen.getByLabelText(/Precio Detalle/i)).not.toBeNull();

    expect(
      screen.getByRole("button", { name: /Agregar Factura/i })
    ).not.toBeNull();
  });
});
