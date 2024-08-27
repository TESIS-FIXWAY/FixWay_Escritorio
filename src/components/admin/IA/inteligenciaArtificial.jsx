import Admin from "../admin";
import InventarioIA from "./tensorFlowModelInventario";
import HistorialVentasIA from "./tensorFlowModelHistorialVentas";
import BoletasFacturasIA from "./tensorFlowBoletaFactura";

export default function VistaIA() {
  return (
    <>
      <Admin />
      <InventarioIA />
      <HistorialVentasIA />
      <BoletasFacturasIA />
    </>
  );
}
