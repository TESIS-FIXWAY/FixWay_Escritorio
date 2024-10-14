import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { DarkModeContext } from "../context/darkMode";
import GenerarFactura from "../components/admin/factura/generarFactura";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../dataBase/firebase", () => ({
  db: {},
}));

vi.mock("../context/AuthContext", () => ({
  UserAuth: () => ({
    user: { uid: "12345", nombre: "Test User" },
    logout: vi.fn(),
  }),
}));

vi.mock("firebase/messaging", () => ({
  getMessaging: () => ({}),
  getToken: () => Promise.resolve("fake-token"),
  onMessage: () => {},
}));

describe("GenerarFactura", () => {
  it("should render the component correctly", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <GenerarFactura />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    const heading = screen.getByRole("heading", { name: /Venta/i });
    expect(heading).to.exist;

    expect(screen.getByText(/Generar Factura/i)).to.exist;
    expect(screen.getByText(/Generar Boleta/i)).to.exist;
    expect(screen.getByText(/Código Producto/i)).to.exist;
    expect(screen.getByText(/Nombre del Producto/i)).to.exist;
    expect(screen.getByText(/Precio/i)).to.exist;
    expect(screen.getByText(/Cantidad Seleccionada/i)).to.exist;
    expect(screen.getByLabelText(/Buscar producto/i)).to.exist;
  });
});
