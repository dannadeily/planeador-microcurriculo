import React, { useState, useEffect } from 'react';
import { MdEdit } from "react-icons/md";
import { Link } from 'react-router-dom';

const ListTeacher = () => {
  const [docentes, setDocentes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const docentesPerPage = 5;

  useEffect(() => {
    const mockData = [
      { id: 1, email: "docente1@universidad.edu", name: "Juan Pérez", personalEmail: "juan@gmail.com", phone: "123456789", code: "D001" },
      { id: 2, email: "docente2@universidad.edu", name: "María López", personalEmail: "maria@gmail.com", phone: "987654321", code: "D002" },
      { id: 3, email: "docente3@universidad.edu", name: "Carlos Sánchez", personalEmail: "carlos@gmail.com", phone: "456789123", code: "D003" },
      { id: 4, email: "docente4@universidad.edu", name: "Ana Ramírez", personalEmail: "ana@gmail.com", phone: "789123456", code: "D004" },
      { id: 5, email: "docente5@universidad.edu", name: "Luis Gómez", personalEmail: "luis@gmail.com", phone: "321654987", code: "D005" }
    ];
    setDocentes(mockData);
  }, []);

  const indexOfLastDocente = currentPage * docentesPerPage;
  const indexOfFirstDocente = indexOfLastDocente - docentesPerPage;
  const currentDocentes = docentes.slice(indexOfFirstDocente, indexOfLastDocente);
  const totalPages = Math.ceil(docentes.length / docentesPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Lista de Docentes Registrados
      </h2>

      {docentes.length === 0 ? (
        <p className="text-center text-gray-500">No hay docentes registrados.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Correo Institucional</th>
                  <th className="px-4 py-3 text-center">Nombre</th>
                  <th className="px-4 py-3 text-center">Correo Personal</th>
                  <th className="px-4 py-3 text-center">Teléfono</th>
                  <th className="px-4 py-3 text-center">Código</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentDocentes.map((docente) => (
                  <tr key={docente.id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-3">{docente.email}</td>
                    <td className="px-4 py-3 text-center">{docente.name}</td>
                    <td className="px-4 py-3 text-center">{docente.personalEmail}</td>
                    <td className="px-4 py-3 text-center">{docente.phone}</td>
                    <td className="px-4 py-3 text-center">{docente.code}</td>
                    <td className="px-4 py-3 text-center">
                      <Link to={`/director/edit-user/${docente.id}`}>
                        <button
                          className="relative text-blue-500 p-2 rounded-md hover:bg-red-200 transition-all group"
                        >
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

export default ListTeacher;
