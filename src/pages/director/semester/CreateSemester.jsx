import { useState } from "react";
import Axios from "../../../axios/Axios";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";

const CreateSemester = () => {
  const initialState = {
    name: "",
    startDate: "",
    endDate: "",
  };

  const [semester, setSemester] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ success: false, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSemester((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!semester.name) newErrors.name = "El nombre del semestre es obligatorio";
    if (!semester.startDate) newErrors.startDate = "La fecha de inicio es obligatoria";
    if (!semester.endDate) {
      newErrors.endDate = "La fecha de fin es obligatoria";
    } else if (semester.startDate && semester.endDate < semester.startDate) {
      newErrors.endDate = "La fecha de fin debe ser posterior a la de inicio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await Axios.post("semester", semester);
      if (res.status === 200) {
        setSuccessAlert({ success: true, message: res.data.message || "Semestre creado exitosamente" });
        setSemester(initialState); // Limpiar formulario
      }
    } catch (error) {
      console.error(error);
      setErrorAlert({ error: true, message: error.response?.data || "Error al crear el semestre" });
    }

    setTimeout(() => {
      setErrorAlert({ error: false, message: "" });
      setSuccessAlert({ success: false, message: "" });
    }, 5000);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Crear Semestre
      </h2>

      {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
      {successAlert.success && <SuccessAlert message={successAlert.message} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre del Semestre */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nombre del Semestre"
            value={semester.name}
            onChange={handleChange}
            className={`border p-3 w-full rounded-md ${errors.name ? "border-red-500" : "border-gray-300"
              }`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Fecha de Inicio */}
        <div>
          <label className="block font-medium mb-1">Fecha de Inicio:</label>
          <input
            type="date"
            name="startDate"
            value={semester.startDate}
            onChange={handleChange}
            className={`border p-3 w-full rounded-md ${errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            required
          />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
        </div>

        {/* Fecha de Fin */}
        <div>
          <label className="block font-medium mb-1">Fecha de Fin:</label>
          <input
            type="date"
            name="endDate"
            value={semester.endDate}
            onChange={handleChange}
            className={`border p-3 w-full rounded-md ${errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            required
          />
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          className="bg-red-500 w-full py-3 text-white uppercase font-bold rounded-md hover:bg-red-700 transition-all"
        >
          Crear Semestre
        </button>
      </form>
    </div>
  );
};

export default CreateSemester;
