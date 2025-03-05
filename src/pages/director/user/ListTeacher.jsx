import React, { useState, useEffect } from 'react';
import { MdEdit } from "react-icons/md";
import { Link } from 'react-router-dom';
import Axios from '../../../axios/Axios';
import ErrorAlert from '../../../components/alerts/ErrorAlert';

const ListTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const docentesPerPage = 5;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await Axios.get('user/list?profileType=TEACHER');
        setTeachers(response.data);
      } catch (err) {
        setError("Error al cargar los docentes");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const indexOfLastDocente = currentPage * docentesPerPage;
  const indexOfFirstDocente = indexOfLastDocente - docentesPerPage;
  const currentDocentes = teachers.slice(indexOfFirstDocente, indexOfLastDocente);
  const totalPages = Math.ceil(teachers.length / docentesPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Lista de Docentes Registrados
      </h2>
      
      {teachers.length === 0 ? (
        <p className="text-center text-gray-500">No hay docentes registrados.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-center">Correo Institucional</th>
                  <th className="px-4 py-3 text-center">Nombre</th>
                  <th className="px-4 py-3 text-center">Correo Personal</th>
                  <th className="px-4 py-3 text-center">Teléfono</th>
                  <th className="px-4 py-3 text-center">Código</th>
               
                </tr>
              </thead>
              <tbody>
                {currentDocentes.map((docente) => (
                  <tr key={docente.id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-3">{docente.institutionalEmail}</td>
                    <td className="px-4 py-3 text-center">{docente.name}</td>
                    <td className="px-4 py-3 text-center">{docente.personalEmail || "N/A"}</td>
                    <td className="px-4 py-3 text-center">{docente.phone || "N/A"}</td>
                    <td className="px-4 py-3 text-center">{docente.code || "N/A"}</td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-700"}`}
            >
              Anterior
            </button>
            <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-700"}`}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListTeacher;
