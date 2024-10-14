import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import GestionMantencionesAdmin from "../components/admin/gestionMantencionAdmin";
import { DarkModeContext } from "../context/darkMode";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../dataBase/firebase", () => ({
  db: {},
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

describe("GestionMantencionesAdmin", () => {
  it("should render the table headers correctly", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <GestionMantencionesAdmin />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    // Usar `getByRole` para seleccionar el encabezado de la tabla
    expect(
      screen.getByRole("columnheader", { name: /Patente/i })
    ).not.toBeNull();
    expect(
      screen.getByRole("columnheader", { name: /Estado/i })
    ).not.toBeNull();
    expect(
      screen.getByRole("columnheader", { name: /Persona a Cargo/i })
    ).not.toBeNull();
    expect(
      screen.getByRole("columnheader", { name: /Kilometraje/i })
    ).not.toBeNull();
    expect(screen.getByRole("columnheader", { name: /Fecha/i })).not.toBeNull();
    expect(
      screen.getByRole("columnheader", { name: /Descripción/i })
    ).not.toBeNull();
    expect(
      screen.getByRole("columnheader", { name: /Productos/i })
    ).not.toBeNull();
  });

  it("should render the input fields and date pickers", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <GestionMantencionesAdmin />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    // Verificar que los campos de entrada se renderizan correctamente
    expect(screen.getByPlaceholderText(/Buscar producto/i)).not.toBeNull();
    expect(screen.getByPlaceholderText(/Fecha Actual/i)).not.toBeNull();
  });
});
