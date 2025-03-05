import { useState } from "react";
import Axios from "../../../axios/Axios";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";

const CreateCourse = () => {
  const initialState = {
    courseName: "",
    description: "",
    code: "",
    fileContent: "",
    fileType: "",
  };

  const [course, setCourse] = useState(initialState);
  const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ success: false, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: name === "code" ? value.replace(/\D/g, "") : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const allowedTypes = {
        "application/pdf": "pdf",
        "application/msword": "word",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
      };
  
      if (allowedTypes[file.type]) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setCourse((prev) => ({
            ...prev,
            fileContent: reader.result,
            fileType: allowedTypes[file.type], // "pdf" o "word"
          }));
        };
      } else {
        alert("Solo se permiten archivos PDF o Word (.doc, .docx)");
        e.target.value = ""; // Limpiar el input
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.courseName) {
      setErrorAlert({ error: true, message: "El nombre del curso es obligatorio" });
      setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
      return;
    }

    try {
      const res = await Axios.post("course", course);
      if (res.status === 200) {
        setSuccessAlert({ success: true, message: res.data.message || "Curso creado exitosamente" });
        setCourse(initialState); // Limpiar el formulario
      }
    } catch (error) {
      console.error(error);
      setErrorAlert({ error: true, message: error.response?.data || "Error al crear el curso" });
    }

    setTimeout(() => {
      setErrorAlert({ error: false, message: "" });
      setSuccessAlert({ success: false, message: "" });
    }, 5000);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Crear Curso
      </h2>

      {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
      {successAlert.success && <SuccessAlert message={successAlert.message} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            name="courseName"
            placeholder="Nombre del Curso"
            value={course.courseName}
            onChange={handleChange}
            className="border p-3 w-full rounded-md border-gray-300"
            required
          />
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Descripción del Curso (Opcional)"
            value={course.description}
            onChange={handleChange}
            className="border p-3 w-full rounded-md border-gray-300 h-32 resize-none"
          />
        </div>

        <div>
          <input
            type="text"
            name="code"
            placeholder="Código del Curso (Opcional)"
            value={course.code}
            onChange={handleChange}
            className="border p-3 w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Cargar Archivo (Opcional):</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md p-2 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-red-500 hover:file:bg-red-700"
          />
        </div>

        <button
          type="submit"
          className="bg-red-500 w-full py-3 text-white uppercase font-bold rounded-md hover:bg-red-700 transition-all"
        >
          Crear Curso
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
