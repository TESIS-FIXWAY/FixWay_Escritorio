import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import ListarInventario from "../components/admin/listadoInventario/listarInventario";
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

describe("ListarInventario", () => {
  it("should render the table correctly", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <ListarInventario />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("table")).not.to.be.null;

    expect(screen.getByText("Año")).not.to.be.null;
    expect(screen.getByText("Código")).not.to.be.null;
    expect(screen.getByText("Producto")).not.to.be.null;
    expect(screen.getByText("Categoría")).not.to.be.null;
    expect(screen.getByText("Vehículo")).not.to.be.null;
    expect(screen.getByText("Marca | Origen")).not.to.be.null;
    expect(screen.getByText("Cantidad")).not.to.be.null;
    expect(screen.getByText("Precio Detalle")).not.to.be.null;
    expect(screen.getByText("Precio Venta")).not.to.be.null;
    expect(screen.getByText("Acciones")).not.to.be.null;
  });
});
