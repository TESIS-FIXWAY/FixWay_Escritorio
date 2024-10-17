import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import ListarInventario from "../components/mecanico/listarInventarioMecanico";
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

    expect(screen.getByText("Código Producto")).not.to.be.null;
    expect(screen.getByText("Nombre Producto")).not.to.be.null;
    expect(screen.getByText("Categoría")).not.to.be.null;
    expect(screen.getByText("Marca")).not.to.be.null;
    expect(screen.getByText("Cantidad")).not.to.be.null;
    expect(screen.getByText("Costo")).not.to.be.null;
  });
});
