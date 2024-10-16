import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import ListadoAutomovil from "../components/admin/listadoAutomovil/listadoAutomovil";
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

describe("ListadoAutomovil", () => {
  it("should render the table correctly", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <ListadoAutomovil />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("table")).not.to.be.null;

    expect(screen.getByText("Patente")).not.to.be.null;
    expect(screen.getByText("Marca")).not.to.be.null;
    expect(screen.getByText("Modelo")).not.to.be.null;
    expect(screen.getByText("Año")).not.to.be.null;
    expect(screen.getByText("Color")).not.to.be.null;
    expect(screen.getByText("Kilometro")).not.to.be.null;
    expect(screen.getByText("Numero Chasis")).not.to.be.null;
  });
});
