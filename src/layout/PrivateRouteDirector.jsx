import React from "react";
import { Navigate } from "react-router-dom";
import HeaderDirector from "../components/header/HeaderDirector";


const decodeToken = (token) => {
    const array = token.split(".");
    const payload = JSON.parse(atob(array[1]));
    return payload;
}

const PrivateRouteDirector = ({ component: Component, ...rest }) => {
    const checkAuthentication = () => {
        const token = localStorage.getItem("token");
        if (token) {
            // Verificar la fecha de expiración del token
            const tokenExpiration = localStorage.getItem("tokenExpiration");
            if (tokenExpiration && new Date(tokenExpiration) < new Date()) {
                // El token ha expirado, borrarlo y redirigir al usuario a la página de inicio
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiration");
                return false;
            }

            // Decodificar el token y obtener el rol
            const decodedToken = decodeToken(token);
            const role = decodedToken.role; // Extraer el rol del token
            if (role !== "DIRECTOR") {
                // Si el rol no es DIRECTOR, redirigir al login
                return false;
            }

            return true;
        }
        return false;
    };

    const isAuthenticated = checkAuthentication();

    if (!isAuthenticated) {
        // Si no está autenticado o no tiene el rol adecuado, redirigir a la página de inicio
        return <Navigate to="/" />;
    }

    // Si está autenticado y tiene el rol adecuado, renderizar el componente
    return <HeaderDirector />;
};

export default PrivateRouteDirector;
