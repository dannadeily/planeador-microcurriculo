import { useState } from "react";

const CreateCourse = () => {
  const [course, setCourse] = useState({
    name: "",
    description: "",
    code: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [fileBase64, setFileBase64] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCourse((prev) => ({
      ...prev,
      [name]: name === "code" ? value.replace(/\D/, "") : value.trim(), // Solo números en código
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
      setCourse((prev) => ({ ...prev, file }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!course.name) newErrors.name = "El nombre del curso es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const courseData = { ...course, fileBase64 };
      console.log("Curso creado:", courseData);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Crear Curso
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre del Curso */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nombre del Curso"
            value={course.name}
            onChange={handleChange}
            className={`border p-3 w-full rounded-md ${errors.name ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Descripción del Curso */}
        <div>
          <textarea
            name="description"
            placeholder="Descripción del Curso (Opcional)"
            value={course.description}
            onChange={handleChange}
            className="border p-3 w-full rounded-md border-gray-300 h-32 resize-none"
          />
        </div>

        {/* Código del Curso */}
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

        {/* Cargar Archivo */}
        <div>
          <label className="block font-medium mb-2">Cargar Archivo (Opcional):</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md p-2 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-red-500 hover:file:bg-red-700"
          />
        </div>

        {/* Botón de Envío */}
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
