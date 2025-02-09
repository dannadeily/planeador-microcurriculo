import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    role: '',
    institutionalEmail: '',
    name: '',
    personalEmail: '',
    phone: '',
    code: ''
  });

  useEffect(() => {
    const mockData = {
      id: id,
      role: "Docente",
      institutionalEmail: "usuario@universidad.edu",
      name: "Juan Pérez",
      personalEmail: "juanperez@gmail.com",
      phone: "123456789",
      code: "U001"
    };
    setUser(mockData);
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Usuario actualizado:", user);
    navigate(-1);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Editar Usuario
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block text-gray-700">Correo Institucional</label>
          <div className="col-span-2">
            <input
              type="email"
              name="institutionalEmail"
              value={user.institutionalEmail}
              disabled
              className="border p-3 w-full rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-700">Nombre</label>
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
          <label className="block text-gray-700">Correo Personal</label>
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
          <label className="block text-gray-700">Telefono</label>
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
          <label className="block text-gray-700">Codigo</label>
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

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
