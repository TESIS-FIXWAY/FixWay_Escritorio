import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductoMasVendido from "../components/mecanico/Graficos/productoVendido";
import { getDocs } from "firebase/firestore";

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

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});

vi.mock("../../context/darkMode", () => ({
  DarkModeContext: {
    Consumer: ({ children }) => children({ isDarkMode: false }),
  },
}));

describe("ProductoMasVendido", () => {
  it("should render the table of most sold products", async () => {
    // Mock data response
    const mockData = [
      {
        id: "1",
        data: () => ({
          productos: [
            {
              nombreProducto: "Producto 1",
              cantidad: 5,
              precio: 100,
              codigoProducto: "001",
            },
            {
              nombreProducto: "Producto 2",
              cantidad: 3,
              precio: 200,
              codigoProducto: "002",
            },
          ],
        }),
      },
      {
        id: "2",
        data: () => ({
          productos: [
            {
              nombreProducto: "Producto 1",
              cantidad: 10,
              precio: 100,
              codigoProducto: "001",
            },
          ],
        }),
      },
    ];

    // Mockear la respuesta de getDocs
    getDocs.mockResolvedValueOnce({
      forEach: (callback) => {
        mockData.forEach(callback);
      },
    });

    render(<ProductoMasVendido />);

    expect(screen.getByText("Productos Más Vendidos")).to.exist;

    await waitFor(() => {
      expect(screen.getByRole("table")).to.exist;
      expect(screen.getByText("Producto 1")).to.exist;
      expect(screen.getByText("Producto 2")).to.exist;
    });
  });
});
