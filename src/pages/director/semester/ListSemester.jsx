import React, { useState, useEffect } from 'react';
import axios from '../../../axios/Axios';
import { MdEdit } from "react-icons/md";
import { Link } from 'react-router-dom';

const ListSemester = () => {
  const [semestres, setSemestres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const semestresPerPage = 5;

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get('semester');
        setSemestres(response.data);
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };
    fetchSemesters();
  }, []);

  const indexOfLastSemestre = currentPage * semestresPerPage;
  const indexOfFirstSemestre = indexOfLastSemestre - semestresPerPage;
  const currentSemestre = semestres.slice(indexOfFirstSemestre, indexOfLastSemestre);
  const totalPages = Math.ceil(semestres.length / semestresPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Listado de semestres
      </h2>

      {semestres.length === 0 ? (
        <p className="text-center text-gray-500">No hay semestres registrados.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-center">Nombre del Semestre</th>
                  <th className="px-4 py-3 text-center">Fecha de Inicio</th>
                  <th className="px-4 py-3 text-center">Fecha de Fin</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentSemestre.map((semester) => (
                  <tr key={semester.id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-3">{semester.name}</td>
                    <td className="px-4 py-3 text-center">{semester.startDate}</td>
                    <td className="px-4 py-3 text-center">{semester.endDate}</td>
                    <td className="px-4 py-3 text-center">
                      <Link to={`/director/edit-semester/${semester.id}`} state={{ semester }}>
                        <button className="relative text-blue-500 p-2 rounded-md hover:bg-red-200 transition-all group">
                          <MdEdit size={20} />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Editar
                          </span>
                        </button>
                      </Link>
                    </td>
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

export default ListSemester;
