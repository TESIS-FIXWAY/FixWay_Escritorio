import React from "react";
import { db } from "../../../dataBase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "../../styles/graficos.css";

export default function GraficoTipoPagoVendedor() {
  const chartContainerRef = useRef(null);
  const [data, setData] = useState({ debito: 0, credito: 0, contado: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = String(today.getFullYear()).slice(-2);
        const todayString = `${day}/${month}/${year}`;

        const q = query(
          collection(db, "historialVentas"),
          where("fecha", "==", todayString)
        );

        const querySnapshot = await getDocs(q);
        const tipoPagoCount = { debito: 0, credito: 0, contado: 0 };

        querySnapshot.forEach((doc) => {
          const { tipoPago } = doc.data();
          if (
            tipoPago === "debito" ||
            tipoPago === "credito" ||
            tipoPago === "contado"
          ) {
            tipoPagoCount[tipoPago]++;
          }
        });

        setData(tipoPagoCount);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["Débito", "Crédito", "Contado"],
    datasets: [
      {
        label: "Tipo de Pago",
        data: [data.debito, data.credito, data.contado],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div>
      <div>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
