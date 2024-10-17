import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GestionMantenciones from "../components/mecanico/gestionMantenciones";
import { DarkModeContext } from "../context/darkMode";

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

vi.mock("../components/mecanico/mecanico", () => ({
  default: () => <div>Mecanico Component</div>,
}));

describe("GestionMantenciones Component", () => {
  it("should render without crashing", () => {
    render(
      <DarkModeContext.Provider value={{ isDarkMode: false }}>
        <GestionMantenciones />
      </DarkModeContext.Provider>
    );

    expect(screen.getByText("Pendientes")).not.toBeNull();
    expect(screen.getByText("En Proceso")).not.toBeNull();
    expect(screen.getByText("Terminadas")).not.toBeNull();
  });
});
