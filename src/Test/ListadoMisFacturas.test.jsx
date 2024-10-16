import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import ListadoMisFacturas from "../components/admin/listadoVentas/listadoMisFacturas";
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

describe("ListadoMisFacturas", () => {
  it("should render the table correctly", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <ListadoMisFacturas />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("table")).not.to.be.null;

    expect(screen.getByText("Nombre Del Archivo")).not.to.be.null;
    expect(screen.getByText("Acciones")).not.to.be.null;
  });
});
