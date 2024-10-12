import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import AgregarInventario from "../components/admin/agregarInventario";
import { MemoryRouter } from "react-router-dom";
import { DarkModeContext } from "../context/darkMode";

vi.mock("../../dataBase/firebase", () => ({
  db: {},
  storage: {},
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

// Mock Firestore
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn(),
    setDoc: vi.fn(),
  };
});

vi.mock("firebase/storage", async () => {
  const actual = await vi.importActual("firebase/storage");
  return {
    ...actual,
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi
      .fn()
      .mockResolvedValue("http://fakeurl.com/fakeimage.jpg"),
  };
});

vi.mock("../../context/darkMode", () => ({
  DarkModeContext: {
    Consumer: ({ children }) => children({ isDarkMode: false }),
  },
}));

describe("AgregarInventario", () => {
  it("should render the form correctly", async () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <AgregarInventario />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    const titleElement = screen.getByRole("heading", {
      name: /Agregar Inventario/i,
    });
    expect(titleElement).to.exist;

    const nombreProductoInput = screen.getByLabelText(/Nombre Producto/i);
    const descripcionInput = screen.getByLabelText(/Descripción/i);
    const cantidadInput = screen.getByLabelText(/Cantidad/i);
    const costoInput = screen.getByLabelText(/Precio Venta/i);
    const marcaAutomovilInput = screen.getByLabelText(/Marca Automóvil/i);

    expect(nombreProductoInput).to.exist;
    expect(descripcionInput).to.exist;
    expect(cantidadInput).to.exist;
    expect(costoInput).to.exist;
    expect(marcaAutomovilInput).to.exist;
  });
});
