import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GenerarListadoMantencion from "../components/mecanico/generarListadoMantencion";
import { DarkModeContext } from "../context/darkMode";
import { MemoryRouter } from "react-router-dom";

vi.mock("../dataBase/firebase", () => ({
  db: {},
  auth: {
    currentUser: { uid: "12345", nombre: "Test User" },
  },
}));

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    getDocs: vi.fn(),
    collection: vi.fn(),
  };
});

vi.mock("../components/mecanico/mecanico", () => ({
  default: () => <div />,
}));

describe("GenerarListadoMantencion", () => {
  it("should render the table", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <GenerarListadoMantencion />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("table")).not.to.be.null;
  });
});
