import { useState } from "react";

const CreateUser = () => {
  const [user, setUser] = useState({
    role: "",
    institutionalEmail: "",
    name: "",
    personalEmail: "",
    phone: "",
    code: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value.trim(),
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!user.role) newErrors.role = "Selecciona un rol";
    if (!user.institutionalEmail) {
      newErrors.institutionalEmail = "Correo institucional es obligatorio";
    } else if (!/^[\w.%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(user.institutionalEmail)) {
      newErrors.institutionalEmail = "Correo no válido";
    }
    if (!user.name) newErrors.name = "El nombre es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Usuario creado:", user);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Crear Usuario
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Rol */}
        <div className="flex flex-col items-center">
          <label className="font-medium mb-2 text-lg">Seleccione Rol:</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="Director"
                checked={user.role === "Director"}
                onChange={handleChange}
                className="w-5 h-5 accent-red-500"
              />
              Director
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="Docente"
                checked={user.role === "Docente"}
                onChange={handleChange}
                className="w-5 h-5 accent-red-500"
              />
              Docente
            </label>
          </div>
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
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
              className={`border p-3 w-full rounded-md ${
                errors.institutionalEmail ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.institutionalEmail && <p className="text-red-500 text-sm mt-1">{errors.institutionalEmail}</p>}
          </div>

          {/* Nombre */}
          <div className="col-span-2 md:col-span-1">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={user.name}
              onChange={handleChange}
              className={`border p-3 w-full rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
    </div>
  );
};

export default CreateUser;
