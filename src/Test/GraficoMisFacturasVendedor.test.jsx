import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import GraficoMisFacturasVendedor from "../components/vendedor/Graficos/graficosMisFacturasVendedor";
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

vi.mock("react-google-charts", () => ({
  Chart: vi.fn(() => <div>Mocked Chart</div>),
}));

describe("GraficoMisFacturasVendedor", () => {
  it("should render the chart component", () => {
    render(
      <DarkModeContext.Provider value={{ isDarkMode: false }}>
        <GraficoMisFacturasVendedor />
      </DarkModeContext.Provider>
    );

    expect(screen.getByText(/Facturas/i)).to.exist;

    expect(screen.getByText(/Mocked Chart/i)).to.exist;
  });
});
