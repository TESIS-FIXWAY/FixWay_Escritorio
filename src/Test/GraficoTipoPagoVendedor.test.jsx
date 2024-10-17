import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import GraficoTipoPagoVendedor from "../components/vendedor/Graficos/graficoTipoPagoVendedor";

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

describe("GraficoTipoPagoVendedor", () => {
  it("should render the Doughnut chart", () => {
    render(<GraficoTipoPagoVendedor />);

    expect(screen.getByText(/Mocked Doughnut Chart/i)).to.exist;
  });
});
