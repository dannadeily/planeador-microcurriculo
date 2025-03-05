import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import HeaderDirector from "../components/header/HeaderDirector";

const decodeToken = (token) => {
    try {
        const array = token.split(".");
        const payload = JSON.parse(atob(array[1]));
        return payload;
    } catch (error) {
        return null;
    }
};

const PrivateRouteDirector = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        const checkTokenExpiration = () => {
            const decodedToken = decodeToken(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (!decodedToken || decodedToken.exp < currentTime) {
                localStorage.removeItem("token");
                setToken(null); // Actualiza el estado para re-renderizar y redirigir
                navigate("/");
            }
        };

        const interval = setInterval(checkTokenExpiration, 5000); // Verifica cada 5 segundos

        // Escucha cambios en el localStorage para detectar eliminación del token en otra pestaña
        const handleStorageChange = (event) => {
            if (event.key === "token" && !event.newValue) {
                setToken(null);
                navigate("/");
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [token, navigate]);

    if (!token) return <Navigate to="/" />;

    // Verificar rol
    const decodedToken = decodeToken(token);
    if (!decodedToken || decodedToken.role !== "DIRECTOR") {
        return <Navigate to={`/${decodedToken?.role?.toLowerCase() || ""}`} />;
    }

    return (
        <>
            <HeaderDirector />
            
        </>
    );
};

export default PrivateRouteDirector;
