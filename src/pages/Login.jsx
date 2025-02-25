import React, { useState } from "react";
import Axios from "../axios/Axios";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../components/alerts/ErrorAlert";
import SuccessAlert from "../components/alerts/SuccessAlert";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

const decodeToken = (token) => {
    const array = token.split(".");
    const payload = JSON.parse(atob(array[1]));
    return payload;
};

const Login = () => {
    const [user, setUser] = useState({
        institutionalEmail: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.institutionalEmail.trim() === "" || user.password.trim() === "") {
            setErrorAlert({ error: true, message: "Todos los campos son obligatorios" });
            setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
            return;
        }

        try {
            const res = await Axios.post("auth/login", {
                institutionalEmail: user.institutionalEmail,
                password: user.password,
            });

            if (res.status === 200) {
                const accessToken = res.data;
                localStorage.setItem("token", accessToken);
                console.log("Token de acceso:", accessToken);

                const decodedToken = decodeToken(accessToken);
                console.log("Token decodificado:", decodedToken);

                const role = decodedToken.role;
                console.log("Rol del usuario:", role);

                if (role === "DIRECTOR") {
                    navigate("/director");
                } else if (role === "TEACHER") {
                    navigate("/teacher");
                }
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setErrorAlert({ error: true, message: error.response.data });
            }
            setTimeout(() => setErrorAlert({ error: false, message: "" }), 10000);
        }
    };

    return (
        <>
            
            <div className="xl:mx-96 lg:mx-60 md:mx-40 sm:mx-20 my-10 bg-white shadow rounded-lg p-10 border-2 border-red-700 shadow-lg shadow-red-400">
                <form onSubmit={handleSubmit}>
                    
                    <div className="flex flex-col items-center justify-center">
                <h4 className=" font-medium text-center ">
                    Bienvenido al Sistema de Planeador de Actividades
                </h4>
                <h1 className="text-lg font-bold text-center text-gray-900 dark:text-red-500 mt-4">
                        INICIAR SESIÓN
                    </h1>
            </div>
                    {errorAlert.error && <ErrorAlert message={errorAlert.message} />}

                    <div className="my-5">
                        <label className="uppercase text-gray-600 block font-bold" htmlFor="institutionalEmail">
                            Correo Institucional
                        </label>
                        <input
                            id="institutionalEmail"
                            type="email"
                            name="institutionalEmail"
                            placeholder="Email"
                            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                            value={user.institutionalEmail}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="my-5 relative">
                        <label className="uppercase text-gray-600 block font-bold" htmlFor="password">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Contraseña"
                                className="w-full mt-3 p-3 border rounded-xl bg-gray-50 pr-10"
                                value={user.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <IoEyeSharp className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <input
                        type="submit"
                        value="Iniciar Sesión"
                        className="bg-red-500 mb-5 w-full py-2 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-red-800 transition-colors"
                    />
                </form>
            </div>
        </>
    );
};

export default Login;
