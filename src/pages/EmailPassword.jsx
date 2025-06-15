import React, { useState } from "react";
import Axios from "../axios/Axios";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../components/alerts/ErrorAlert";
import SuccessAlert from "../components/alerts/SuccessAlert";

const EmailPassword = () => {
  const [email, setEmail] = useState("");
  const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ success: false, message: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setErrorAlert({
        error: true,
        message: "El correo institucional es obligatorio",
      });
      setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
      return;
    }

    try {
      const res = await Axios.get(`user/otp?institutionalEmail=${encodeURIComponent(email)}`);

      if (res.status === 200) {
        setSuccessAlert({
          success: true,
          message: "El código de restablecimiento fue enviado a su correo.",
        });

        // Esperar 3 segundos y redirigir
        setTimeout(() => {
          setSuccessAlert({ success: false, message: "" });
          navigate("/recover-password");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setErrorAlert({
        error: true,
        message: error.response?.data || "Error al enviar el código.",
      });
      setTimeout(() => setErrorAlert({ error: false, message: "" }), 8000);
    }
  };

  return (
    <div className="xl:mx-96 lg:mx-60 md:mx-40 sm:mx-20 my-10 bg-white shadow rounded-lg p-10 border-2 border-red-700 shadow-lg shadow-red-400">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center">
          <h4 className="font-medium text-center">
            Ingrese su correo institucional para recuperar su contraseña
          </h4>
        </div>

        {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
        {successAlert.success && <SuccessAlert message={successAlert.message} />}

        <div className="my-5">
          <label
            className="uppercase text-gray-600 block font-bold"
            htmlFor="institutionalEmail"
          >
            Correo Institucional
          </label>
          <input
            id="institutionalEmail"
            type="email"
            name="institutionalEmail"
            placeholder="correo@ejemplo.com"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Enviar"
          className="bg-red-500 mb-5 w-full py-2 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-red-800 transition-colors"
        />
      </form>
    </div>
  );
};

export default EmailPassword;
