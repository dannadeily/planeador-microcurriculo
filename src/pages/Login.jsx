import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import ErrorAlert from '../components/alerts/ErrorAlert'
import SuccessAlert from "../components/alerts/SuccessAlert";
import { useState } from "react";


const Login = () => {
    const navigate = useNavigate();


    //alertas
    const [ErrorAlert, setErrorAlert] = useState({
        error: false,
        message: "",
    });
    const [SuccessAlert, setSuccessAlert] = useState({ error: false, message: "", });


    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

    };
    return (
        <>
            <div className="flex flex-col items-center justify-center ">

                <h2 className="text-xl font-medium text-center mt-4">
                    Bienvenido al Sistema de Planeador de Actividades
                </h2>
            </div>
            <div className=" xl:mx-96 lg:mx-60 md:mx-40 sm:mx-20 my-10 bg-white shadow rounded-lg p-10 border-2 border-red-700 shadow-lg shadow-red-400  ">
                <form onSubmit={handleSubmit}>
                    <h1 className=" text-lg font-bold  text-center text-gray-900 dark:text-red-500 ">
                        INICIAR SESIÓN
                    </h1>
                    {ErrorAlert.error && !SuccessAlert.error && (
                        <ErrorAlert message={ErrorAlert.message} />
                    )}
                    {SuccessAlert.error && (
                        <SuccessAlert message={SuccessAlert.message} />
                    )}

                    <div className="my-5">
                        <label
                            className="uppercase text-gray-600 block  font-bold"
                            htmlFor="email"
                            name="email"
                            type="email"
                        >
                            Correo Institucional
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"

                        />
                    </div>
                    <div className="my-5">
                        <label
                            className="uppercase text-gray-600 block  font-bold"
                            htmlFor="password"
                            name="password"
                            type="password"
                        >
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Contraseña "
                            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"

                        />
                    </div>

                    <input
                        type="submit"
                        value="Iniciar Sesión"
                        className="bg-red-500 mb-5 w-full py-2 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-red-800 transition-colors"
                    />
                </form>

                
            </div>
        </>
    )
}

export default Login
