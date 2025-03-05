import { useState } from "react";
import Axios from "../../../axios/Axios";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import { FaCopy } from "react-icons/fa";

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
  const [showModal, setShowModal] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

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
        setSuccessAlert({ success: true, message: res.data.message || "Usuario creado exitosamente" });
        setCreatedUser(res.data); // Guardar los datos recibidos del servidor
        setShowModal(true); // Mostrar el modal con los datos
      }
    } catch (error) {
      console.error(error);
      setErrorAlert({ error: true, message: error.response?.data || "Error al crear el usuario" });
    }

    setTimeout(() => {
      setErrorAlert({ error: false, message: "" });
      setSuccessAlert({ success: false, message: "" });
    }, 5000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCreatedUser(null);
    // Limpiar los inputs del formulario
    setUser({
      institutionalEmail: "",
      name: "",
      personalEmail: "",
      phone: "",
      code: "",
      profileType: "",
    });
  };

  const copyToClipboard = () => {
    if (createdUser?.password) {
      navigator.clipboard.writeText(createdUser.password);
      alert("Contraseña copiada al portapapeles");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Crear Usuario
      </h2>

      {/* Alerta */}
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
          {/* Correo Institucional */}
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

          {/* Nombre */}
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

          {/* Correo Personal */}
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

          {/* Teléfono */}
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

          {/* Código */}
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

        {/* Botón de envío */}
        <button
          type="submit"
          className="bg-red-500 w-full py-3 text-white uppercase font-bold rounded-md hover:bg-red-700 transition-all"
        >
          Crear Usuario
        </button>
      </form>

      {/* Modal */}
      {showModal && createdUser && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h3 className="text-xl font-bold mb-4">Usuario Creado Exitosamente</h3>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
              <strong>Advertencia:</strong> Por favor, copie la contraseña antes de cerrar el modal. No se volvera a mostrar.
            </div>
            <p><strong>Nombre:</strong> {createdUser.name}</p>
            <p><strong>Correo Institucional:</strong> {createdUser.institutionalEmail}</p>
            <div className=" items-center justify-between bg-gray-100  rounded-md ">
              <p><strong>Contraseña:</strong> {createdUser.password}
               <button
                onClick={copyToClipboard}
                className=" relative text-black p-2 rounded-md hover:bg-blue-200 transition-all group"
              >
                <FaCopy /> 
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Copiar
                </span>
              </button></p>
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUser;
