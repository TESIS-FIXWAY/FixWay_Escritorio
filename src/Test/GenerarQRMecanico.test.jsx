import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import GenerarQRMecanico from "../components/mecanico/GenerarQR";
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

describe("GenerarQRMecanico", () => {
  it("should render the title and search input", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <GenerarQRMecanico />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    const title = screen.getByText("Generador de Códigos QR para Patentes");
    expect(title).not.toBeNull();

    const input = screen.getByLabelText("Buscar patente...");
    expect(input).not.toBeNull();
  });

  it("should show QR code when a valid patente is selected", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <GenerarQRMecanico />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    const input = screen.getByLabelText("Buscar patente...");
    fireEvent.change(input, { target: { value: "SZCJ29" } });

    const qrCode = screen.getByRole("img");
    expect(qrCode).not.toBeNull();
  });
});
