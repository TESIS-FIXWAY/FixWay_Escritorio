import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import AgregarAutomovilAdmin from "../components/admin/agregarAutomnovil";
import { MemoryRouter } from "react-router-dom";
import { DarkModeContext } from "../context/darkMode";

vi.mock("firebase/messaging", () => ({
  getMessaging: () => ({}),
  getToken: () => Promise.resolve("fake-token"),
  onMessage: () => {},
}));

vi.mock("../../dataBase/firebase", () => ({
  db: {},
}));

vi.mock("../context/AuthContext", () => ({
  UserAuth: () => ({
    user: { uid: "12345", nombre: "Test User" },
    logout: vi.fn(),
  }),
}));

describe("AgregarAutomovilAdmin", () => {
  it("should render the form correctly", () => {
    const mockDarkModeContextValue = {
      isDarkMode: false,
      toggleDarkMode: () => {},
    };

    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={mockDarkModeContextValue}>
          <AgregarAutomovilAdmin />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    const titleElement = screen.getByRole("heading", {
      name: /Agregar Automóvil/i,
    });
    expect(titleElement).not.toBeNull();

    const patenteInput = screen.getByLabelText(/Patente/i);
    const modeloInput = screen.getByLabelText(/Modelo/i);
    const kilometrajeInput = screen.getByLabelText(/Kilometro Automóvil/i);
    const colorInput = screen.getByLabelText(/Color/i);
    const numChasisInput = screen.getByLabelText(/Número de Chasis/i);

    expect(patenteInput).not.toBeNull();
    expect(modeloInput).not.toBeNull();
    expect(kilometrajeInput).not.toBeNull();
    expect(colorInput).not.toBeNull();
    expect(numChasisInput).not.toBeNull();

    const submitButton = screen.getByRole("button", {
      name: /Agregar Automóvil/i,
    });
    expect(submitButton).not.toBeNull();
  });
});
