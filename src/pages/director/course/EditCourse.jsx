import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    name: '',
    code: '',
    description: '',
    email: ''
  });

  useEffect(() => {
    const mockData = {
      id: id,
      name: "Matemáticas",
      code: "C001",
      description: "Este curso abarca los conceptos fundamentales de álgebra, cálculo y geometría, proporcionando una base sólida para estudios avanzados en ingeniería y ciencias.",
      email: "curso1@universidad.edu"
    };
    setCourse(mockData);
  }, [id]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Curso actualizado:", course);
    navigate("/cursos");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Editar Curso
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nombre del Curso</label>
          <input type="text" name="name" value={course.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label className="block text-gray-700">Código del Curso</label>
          <input type="text" name="code" value={course.code} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label className="block text-gray-700">Descripción</label>
          <textarea name="description" value={course.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" rows="4" required></textarea>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700">Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
