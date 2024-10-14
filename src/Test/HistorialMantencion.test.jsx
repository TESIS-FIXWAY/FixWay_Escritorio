import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import HistorialMantencionAdmin from "../components/admin/historialMantencion";
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

vi.mock("../../dataBase/firebase", () => ({
  db: {},
}));

vi.mock("../../context/darkMode", () => ({
  DarkModeContext: {
    Consumer: ({ children }) => children({ isDarkMode: false }),
  },
}));

describe("HistorialMantencionAdmin", () => {
  it("should render the table headers correctly", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <HistorialMantencionAdmin />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("columnheader", { name: /Patente/i })).not.to.be
      .null;
    expect(screen.getByRole("columnheader", { name: /Fecha/i })).not.to.be.null;
    expect(
      screen.getByRole("columnheader", { name: /Kilometraje de Mantención/i })
    ).not.to.be.null;
    expect(screen.getByRole("columnheader", { name: /Acciones/i })).not.to.be
      .null;
  });

  it("should render the search input field", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <HistorialMantencionAdmin />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/Buscar Patente/i);
    expect(searchInput).not.to.be.null;

    fireEvent.change(searchInput, { target: { value: "ABC123" } });
    expect(searchInput.value).toBe("ABC123");
  });
});
