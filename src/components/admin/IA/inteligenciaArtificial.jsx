import Admin from "../admin";
import TensorflowModel from "./tensorFlowModel";
import HistorialVentasIA from "./tensorFlowModelHistorialVentas";

export default function VistaIA() {
  return (
    <>
      <Admin />
      <TensorflowModel />
      <HistorialVentasIA />
    </>
  );
}
