import React, { useState, useEffect } from 'react';
import axios from '../../../axios/Axios';
import { MdEdit } from "react-icons/md";
import { Link } from 'react-router-dom';
import ErrorAlert from '../../../components/alerts/ErrorAlert';

const ListCourse = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const cursosPerPage = 5;
  const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('course');
        console.log('cursos', response.data);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleDownloadMicrocurriculum = async (idCourse) => {
    try {
      const response = await axios.get(`course/microcurriculum?idCourse=${idCourse}`);
      console.log("API Response:", response.data);

      const { content, fileName, mimeType } = response.data;

      // Extraer solo la parte base64 eliminando el prefijo "data:application/pdf;base64,"
      const base64String = content.split(',')[1];

      // Convertir base64 a binario
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Crear un Blob con el tipo MIME correcto
      const blob = new Blob([byteArray], { type: mimeType });

      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error downloading microcurriculum:", error);
      setErrorAlert({ error: true, message: error.response?.data || "Error al descargar el microcurrículo" });
      setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
    }
  };



  const indexOfLastCurso = currentPage * cursosPerPage;
  const indexOfFirstCurso = indexOfLastCurso - cursosPerPage;
  const currentCursos = courses.slice(indexOfFirstCurso, indexOfLastCurso);
  const totalPages = Math.ceil(courses.length / cursosPerPage);
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Listado de Cursos
      </h2>

      {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No hay cursos registrados.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-center">Nombre del Curso</th>
                  <th className="px-4 py-3 text-center">Descripción del Curso</th>
                  <th className="px-4 py-3 text-center">Código del Curso</th>
                  <th className="px-4 py-3 text-center">Ver Microcurrículo</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentCursos.map((course) => (
                  <tr key={course.id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-3">{course.name}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedCurso(selectedCurso === course.id ? null : course.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Ver Descripción
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">{course.code}</td>
                    <td className="px-4 py-3 text-center"><button onClick={() => handleDownloadMicrocurriculum(course.id)} className="text-blue-500 hover:underline">
                        Descargar
                      </button>
                      
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link to={`/director/edit-course/${course.id}`} state={{ course }}>
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
              <p>{courses.find(course => course.id === selectedCurso)?.description}</p>
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
