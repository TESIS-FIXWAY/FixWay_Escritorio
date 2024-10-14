import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import AgregarCliente from "../components/admin/agregarCliente";
import { MemoryRouter } from "react-router-dom";
import { DarkModeContext } from "../context/darkMode";

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

describe("AgregarCliente", () => {
  it("should render the client form correctly", () => {
    const mockDarkModeContextValue = {
      isDarkMode: false,
      toggleDarkMode: () => {},
    };

    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={mockDarkModeContextValue}>
          <AgregarCliente />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    const titleElement = screen.getByRole("heading", {
      name: /Agregar Cliente/i,
    });
    expect(titleElement).not.toBeNull();

    const nombreInput = screen.getByLabelText(/Nombre/i);
    const apellidoInput = screen.getByLabelText(/Apellido/i);
    expect(nombreInput).not.toBeNull();
    expect(apellidoInput).not.toBeNull();

    const submitButton = screen.getByRole("button", {
      name: /Agregar Cliente/i,
    });
    expect(submitButton).not.toBeNull();
  });
});
