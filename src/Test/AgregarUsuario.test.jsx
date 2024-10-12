import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import AgregarUsuario from "../components/admin/agregarUsuario";
import { DarkModeContext } from "../context/darkMode";
import { MemoryRouter } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  setDoc,
  doc,
  getDocs,
  query,
  where,
  getFirestore,
} from "firebase/firestore";

vi.mock("../context/AuthContext", () => ({
  UserAuth: () => ({
    user: { uid: "12345", nombre: "Test User" },
    logout: vi.fn(),
  }),
}));

// Mock Firebase app and services
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

// Mock Firebase authentication
vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual("firebase/auth");
  return {
    ...actual,
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
  };
});

// Mock Firebase Firestore
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    setDoc: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getFirestore: vi.fn(), // Now we mock getFirestore as well
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

    // Verifica que los elementos del formulario estén presentes
    expect(screen.getByLabelText(/Rut/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ROL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Salario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it("should show validation error when RUT is invalid", async () => {
    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <AgregarUsuario />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Rut/i), {
      target: { value: "invalid-rut" },
    });
    fireEvent.click(screen.getByText(/Agregar Usuario/i));

    const errorMessage = await screen.findByText(
      /El RUT ingresado es inválido/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should call Firebase methods on successful form submission", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "test-uid" },
    });
    setDoc.mockResolvedValue({});

    render(
      <MemoryRouter>
        <DarkModeContext.Provider value={{ isDarkMode: false }}>
          <AgregarUsuario />
        </DarkModeContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Rut/i), {
      target: { value: "11111111-1" },
    });
    fireEvent.change(screen.getByLabelText(/ROL/i), {
      target: { value: "administrador" },
    });
    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Test Name" },
    });
    fireEvent.change(screen.getByLabelText(/Apellido/i), {
      target: { value: "Test Lastname" },
    });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), {
      target: { value: "+56 9 12345678" },
    });
    fireEvent.change(screen.getByLabelText(/Dirección/i), {
      target: { value: "Test Address" },
    });
    fireEvent.change(screen.getByLabelText(/Salario/i), {
      target: { value: "1000000" },
    });
    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Fecha de Ingreso/i), {
      target: { value: "2023-10-10" },
    });

    fireEvent.click(screen.getByText(/Agregar Usuario/i));

    await waitFor(() =>
      expect(createUserWithEmailAndPassword).toHaveBeenCalled()
    );
    await waitFor(() => expect(setDoc).toHaveBeenCalled());
  });
});
