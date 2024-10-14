import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import AgregarUsuario from "../components/admin/agregarUsuario";
import { DarkModeContext } from "../context/darkMode";
import { MemoryRouter } from "react-router-dom";

vi.mock("../context/AuthContext", () => ({
  UserAuth: () => ({
    user: { uid: "12345", nombre: "Test User" },
    logout: vi.fn(),
  }),
}));

vi.mock("../../dataBase/firebase", () => ({
  db: {},
  storage: {},
  auth: {},
}));

vi.mock("firebase/messaging", () => ({
  getMessaging: () => ({}),
  getToken: () => Promise.resolve("fake-token"),
  onMessage: () => {},
}));

vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual("firebase/auth");
  return {
    ...actual,
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
  };
});

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    setDoc: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getFirestore: vi.fn(),
  };
});

describe("AgregarUsuario", () => {
  it("should render the form correctly", () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <AgregarUsuario />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Rut/i)).not.toBeNull();
    expect(screen.getByLabelText(/Nombre/i)).not.toBeNull();
    expect(screen.getByLabelText(/Apellido/i)).not.toBeNull();
    expect(screen.getByLabelText(/Teléfono/i)).not.toBeNull();
    expect(screen.getByLabelText(/Dirección/i)).not.toBeNull();
    expect(screen.getByLabelText(/Salario/i)).not.toBeNull();
    expect(screen.getByLabelText(/Correo/i)).not.toBeNull();
    expect(screen.getByLabelText(/Contraseña/i)).not.toBeNull();
  });
});
