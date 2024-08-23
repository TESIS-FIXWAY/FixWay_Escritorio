import Admin from "../admin";
import InventarioIA from "./tensorFlowModelInventario";
import HistorialVentasIA from "./tensorFlowModelHistorialVentas";
import MantenimientoPredictor from "./tensorFlowModelMantenciones";

export default function VistaIA() {
  return (
    <>
      <Admin />
      <InventarioIA />
      <HistorialVentasIA />
      <MantenimientoPredictor />
    </>
  );
}
