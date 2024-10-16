import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import ListadoFacturas from "../components/admin/listadoFacturas/listadoFacturas";
import { DarkModeContext } from "../context/darkMode";
import { MemoryRouter } from "react-router-dom";

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

describe("ListadoFacturas", () => {
  it("should render the table correctly", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <ListadoFacturas />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("table")).not.to.be.null;

    expect(screen.getAllByText("Proveedor")[0]).not.to.be.null; // Usamos getAllByText para manejar múltiples elementos
    expect(screen.getByText("ID Producto")).not.to.be.null;
    expect(screen.getByText("Fecha")).not.to.be.null;
    expect(screen.getByText("Detalle")).not.to.be.null;
    expect(screen.getByText("Cantidad")).not.to.be.null;
    expect(screen.getByText("Precio Detalle")).not.to.be.null;
    expect(screen.getByText("Acciones")).not.to.be.null;
  });
});
