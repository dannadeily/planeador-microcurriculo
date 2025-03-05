import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundDirector = () => {
  const navigate = useNavigate();
  const hasRedirected = useRef(false); // Flag para evitar doble ejecución

  useEffect(() => {
    if (!hasRedirected.current) {
      alert("La ruta no existe, serás redirigido a la página principal.");
      navigate("/director");
      hasRedirected.current = true; // Marcamos que ya ejecutamos el efecto
    }
  }, [navigate]);

  return null;
};

export default NotFoundDirector;
