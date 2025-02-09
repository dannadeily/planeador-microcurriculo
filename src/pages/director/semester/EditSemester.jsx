import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditSemester = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [semester, setSemester] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const mockData = {
      id: id,
      name: "Semestre 2024-1",
      startDate: "2024-01-15",
      endDate: "2024-06-30"
    };
    setSemester(mockData);
  }, [id]);

  const handleChange = (e) => {
    setSemester({ ...semester, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Semestre actualizado:", semester);
    navigate(-1);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Editar Semestre
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-gray-700">Nombre del Semestre</label>
            <input
              type="text"
              name="name"
              placeholder="Nombre del Semestre"
              value={semester.name}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              name="startDate"
              value={semester.startDate}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700">Fecha de Fin</label>
            <input
              type="date"
              name="endDate"
              value={semester.endDate}
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

export default EditSemester;
