
// src/axios/axios.js
import axios from 'axios';
import { useAlert } from '../context/AlertContext';

const instance = axios.create({
    baseURL: "http://localhost:8080/",  // Cambia por la URL base de tu API
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Reemplaza con tu token de autenticación válido

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
});

// Interceptor para manejar errores
instance.interceptors.response.use(
    response => response,  // Si la respuesta es exitosa, se pasa tal cual.
    error => {
        const { status } = error.response;

        // Error 401: No autenticado, redirigir al login
        if (status === 401) {
            useAlert().showMessage("Por favor, inicia sesión para continuar.");
            localStorage.removeItem("token");  // Eliminar el token si está presente
            window.location.href = '/';  // Redirigir al login
        }

        // Error 403: Sin permisos, redirigir a la página correspondiente
        if (status === 403) {
            useAlert().showMessage("No tienes permisos para acceder a este recurso.");
            const token = localStorage.getItem("token");
            if (token) {
                const decodedToken = decodeToken(token);
                const role = decodedToken.role;
                if (role === "DIRECTOR") {
                    window.location.href = "/director";  // Redirigir al dashboard del director
                } else if (role === "TEACHER") {
                    window.location.href = "/teacher";  // Redirigir al dashboard del profesor
                }
            }
        }

        return Promise.reject(error);
    }
);

// Decodificar el token
const decodeToken = (token) => {
    const array = token.split(".");
    const payload = JSON.parse(atob(array[1]));
    return payload;
};

export default instance;


