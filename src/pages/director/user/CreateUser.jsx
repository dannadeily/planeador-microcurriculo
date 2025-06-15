import { useState } from "react";
import Axios from "../../../axios/Axios";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";


const CreateUser = () => {
  const [user, setUser] = useState({
    institutionalEmail: "",
    name: "",
    personalEmail: "",
    phone: "",
    code: "",
    profileType: "",
  });

  const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ success: false, message: "" });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.institutionalEmail || !user.name || !user.profileType) {
      setErrorAlert({ error: true, message: "Todos los campos obligatorios deben estar completos" });
      setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
      return;
    }

    try {
      const res = await Axios.post("user", user);
      if (res.status === 200) {
        setSuccessAlert({
          success: true,
          message: "Usuario creado exitosamente. Las credenciales han sido enviadas al correo.",
        });

        // Limpiar el formulario después de éxito
        setUser({
          institutionalEmail: "",
          name: "",
          personalEmail: "",
          phone: "",
          code: "",
          profileType: "",
        });
      }
    } catch (error) {
      console.error(error);
      setErrorAlert({
        error: true,
        message: error.response?.data || "Error al crear el usuario",
      });
    }

    setTimeout(() => {
      setErrorAlert({ error: false, message: "" });
      setSuccessAlert({ success: false, message: "" });
    }, 5000);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Crear Usuario
      </h2>

      {/* Alertas */}
      {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
      {successAlert.success && <SuccessAlert message={successAlert.message} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Rol */}
        <div className="flex flex-col items-center">
          <label className="font-medium mb-2 text-lg">Seleccione Rol:</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="profileType"
                value="DIRECTOR"
                checked={user.profileType === "DIRECTOR"}
                onChange={handleChange}
                className="w-5 h-5 accent-red-500"
              />
              Director
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="profileType"
                value="TEACHER"
                checked={user.profileType === "TEACHER"}
                onChange={handleChange}
                className="w-5 h-5 accent-red-500"
              />
              Docente
            </label>
          </div>
        </div>

        {/* Campos del Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <input
              type="email"
              name="institutionalEmail"
              placeholder="Correo Institucional"
              value={user.institutionalEmail}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={user.name}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <input
              type="email"
              name="personalEmail"
              placeholder="Correo Personal (Opcional)"
              value={user.personalEmail}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono (Opcional)"
              value={user.phone}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <input
              type="text"
              name="code"
              placeholder="Código (Opcional)"
              value={user.code}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-red-500 w-full py-3 text-white uppercase font-bold rounded-md hover:bg-red-700 transition-all"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
