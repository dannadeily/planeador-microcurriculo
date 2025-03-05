// src/axios/axios.js
import axios from "axios";

const conexionAxios = axios.create({
    baseURL: "http://localhost:8080/", // Cambia por la URL base de tu API
});

conexionAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Reemplaza con tu token de autenticación válido

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
});

export default conexionAxios;