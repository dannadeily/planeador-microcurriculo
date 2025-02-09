import React, { useState, useEffect } from 'react';
import { MdEdit } from "react-icons/md";
import { Link } from 'react-router-dom';

const ListCourse = () => {
  const [cursos, setCursos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const cursosPerPage = 5;

  useEffect(() => {
    const mockData = [
      { id: 1, email: "curso1@universidad.edu", name: "Matemáticas", code: "C001", description: "Este curso abarca los conceptos fundamentales de álgebra, cálculo y geometría, proporcionando una base sólida para estudios avanzados en ingeniería y ciencias." },
      { id: 2, email: "curso2@universidad.edu", name: "Física", code: "C002", description: "Explora las leyes del movimiento, termodinámica, electromagnetismo y mecánica cuántica con aplicaciones en la vida real." },
      { id: 3, email: "curso3@universidad.edu", name: "Química", code: "C003", description: "Estudia la estructura de la materia, reacciones químicas, enlaces moleculares y los principios de la química orgánica e inorgánica." },
      { id: 4, email: "curso4@universidad.edu", name: "Biología", code: "C004", description: "Un recorrido por la biología celular, genética, evolución y ecología, con enfoque en aplicaciones biomédicas." },
      { id: 5, email: "curso5@universidad.edu", name: "Historia", code: "C005", description: "Analiza eventos históricos clave desde la antigüedad hasta la era contemporánea, destacando su impacto en la sociedad actual." }
    ];
    setCursos(mockData);
  }, []);

  const indexOfLastCurso = currentPage * cursosPerPage;
  const indexOfFirstCurso = indexOfLastCurso - cursosPerPage;
  const currentCursos = cursos.slice(indexOfFirstCurso, indexOfLastCurso);
  const totalPages = Math.ceil(cursos.length / cursosPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Listado de Cursos
      </h2>

      {cursos.length === 0 ? (
        <p className="text-center text-gray-500">No hay cursos registrados.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre del Curso</th>
                  <th className="px-4 py-3 text-center">Descripción del Curso</th>
                  <th className="px-4 py-3 text-center">Código del Curso</th>
                  <th className="px-4 py-3 text-center">Ver Microcurrículo</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentCursos.map((curso) => (
                  <tr key={curso.id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-3">{curso.name}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => setSelectedCurso(selectedCurso === curso.id ? null : curso.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Ver Descripción
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">{curso.code}</td>
                    <td className="px-4 py-3 text-center">
                      <Link to={`/director/microcurriculo/${curso.id}`} className="text-blue-500 hover:underline">
                        Ver
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link to={`/director/edit-course/${curso.id}`}>
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
          {selectedCurso !== null && (
            <div className="p-4 mt-4 bg-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold">Descripción Completa:</h3>
              <p>{cursos.find(curso => curso.id === selectedCurso)?.description}</p>
              <button onClick={() => setSelectedCurso(null)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
                Cerrar
              </button>
            </div>
          )}
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

export default ListCourse;
