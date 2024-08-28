import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/");
  }, 3000);
  return (
    <div>
      <h1>404</h1>
      <h2>Pagina no encontrada</h2>
    </div>
  );
}
