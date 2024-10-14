import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import HistorialVentas from "../components/admin/historial/historial";
import { DarkModeContext } from "../context/darkMode";

vi.mock("../../../dataBase/firebase", () => ({
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

vi.mock("react-chartjs-2", () => ({
  Doughnut: vi.fn(() => <div>Mocked Doughnut Chart</div>),
}));

describe("HistorialVentas", () => {
  it("should render the component correctly", () => {
    render(
      <DarkModeContext.Provider value={{ isDarkMode: false }}>
        <HistorialVentas />
      </DarkModeContext.Provider>
    );

    expect(screen.getByText(/Ventas/i)).to.exist;
    expect(screen.getByText(/Boletas/i)).to.exist;
    expect(screen.getByText(/Facturas/i)).to.exist;
    expect(screen.getByText(/Mocked Doughnut Chart/i)).to.exist;
  });
});
