import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import ListarUsuario from "../components/admin/listadoUsuario/listarUsuario";
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

describe("ListarUsuario", () => {
  it("should render the table correctly", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <ListarUsuario />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("table")).not.to.be.null;

    expect(screen.getByText("RUT")).not.to.be.null;
    expect(screen.getByText("Nombre")).not.to.be.null;
    expect(screen.getByText("Teléfono")).not.to.be.null;
    expect(screen.getByText("Correo Electrónico")).not.to.be.null;
    expect(screen.getByText("Cargo de trabajo")).not.to.be.null;
    expect(screen.getByText("Acciones")).not.to.be.null;
  });
});
