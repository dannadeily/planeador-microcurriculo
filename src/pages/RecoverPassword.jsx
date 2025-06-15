import React, { useState } from "react";
import Axios from "../axios/Axios";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../components/alerts/ErrorAlert";
import SuccessAlert from "../components/alerts/SuccessAlert";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

const RecoverPassword = () => {
  const [user, setUser] = useState({
    institutionalEmail: "",
    otp: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ success: false, message: "" });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      user.institutionalEmail.trim() === "" ||
      user.otp.trim() === "" ||
      user.newPassword.trim() === ""
    ) {
      setErrorAlert({
        error: true,
        message: "Todos los campos son obligatorios",
      });
      setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
      return;
    }

    try {
      const res = await Axios.post("/user/otp", {
        institutionalEmail: user.institutionalEmail,
        otp: user.otp,
        newPassword: user.newPassword,
      });

      if (res.status === 200) {
        setSuccessAlert({
          success: true,
          message: "La contraseña fue actualizada con éxito.",
        });

        // Limpiar los campos
        setUser({ institutionalEmail: "", otp: "", newPassword: "" });

        // Esperar y redirigir al login
        setTimeout(() => {
          setSuccessAlert({ success: false, message: "" });
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setErrorAlert({
        error: true,
        message: error.response?.data || "Error al actualizar la contraseña.",
      });
      setTimeout(() => setErrorAlert({ error: false, message: "" }), 8000);
    }
  };

  return (
    <div className="xl:mx-96 lg:mx-60 md:mx-40 sm:mx-20 my-10 bg-white shadow rounded-lg p-10 border-2 border-red-700 shadow-lg shadow-red-400">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center">
          <h4 className="font-medium text-center">
            Restablece tu contraseña
          </h4>
          <h1 className="text-lg font-bold text-center text-gray-900 dark:text-red-500 mt-4">
            RECUPERAR CONTRASEÑA
          </h1>
        </div>

        {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
        {successAlert.success && <SuccessAlert message={successAlert.message} />}

        <div className="my-5">
          <label className="uppercase text-gray-600 block font-bold" htmlFor="institutionalEmail">
            Correo Institucional
          </label>
          <input
            id="institutionalEmail"
            type="email"
            name="institutionalEmail"
            placeholder="correo@ejemplo.com"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={user.institutionalEmail}
            onChange={handleChange}
          />
        </div>

        <div className="my-5">
          <label className="uppercase text-gray-600 block font-bold" htmlFor="otp">
            Código de Restablecimiento
          </label>
          <input
            id="otp"
            type="text"
            name="otp"
            placeholder="Código enviado al correo"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={user.otp}
            onChange={handleChange}
          />
        </div>

        <div className="my-5 relative">
          <label className="uppercase text-gray-600 block font-bold" htmlFor="newPassword">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Nueva contraseña"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50 pr-10"
              value={user.newPassword}
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
          value="Actualizar Contraseña"
          className="bg-red-500 mb-5 w-full py-2 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-red-800 transition-colors"
        />
        <a
          href="/"
          className="text-red-500 hover:text-red-800 transition-colors"
        >
          ¿Ya tienes una cuenta? Iniciar sesión
        </a>
      </form>
    </div>
  );
};

export default RecoverPassword;
