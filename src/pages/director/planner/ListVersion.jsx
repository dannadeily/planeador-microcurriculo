import React, { useState, useEffect } from 'react';
import axios from '../../../axios/Axios';
import { MdDeleteForever } from "react-icons/md";
import { FaCircleDot } from "react-icons/fa6";

const ListVersion = () => {
  const [versions, setVersions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const VersionPerPage = 5;

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await axios.get('version/list');
        setVersions(response.data);
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };
    fetchVersions();
  }, []);

  const indexOfLastVersion = currentPage * VersionPerPage;
  const indexOfFirstVersion = indexOfLastVersion - VersionPerPage;
  const currentVersion = versions.slice(indexOfFirstVersion, indexOfLastVersion);
  const totalPages = Math.ceil(versions.length / VersionPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Listado de versiones
      </h2>

      {versions.length === 0 ? (
        <p className="text-center text-gray-500">No hay versions registrados.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-center">Nombre de la Versión</th>
                  <th className="px-4 py-3 text-center">Columnas</th>
                  <th className="px-4 py-3 text-center">Versión Activa</th>
                  <th className="px-4 py-3 text-center">Eliminar</th>

                </tr>
              </thead>
              <tbody>
                {currentVersion.map((version) => (
                  <tr key={version.id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-3">{version.versionName}</td>
                    <td className="px-4 py-3 text-center">{version.versionColumns}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center">
                        <FaCircleDot className={version.defaultVersion ? 'text-green-500' : 'text-gray-400'} size={20} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="text-red-600 p-2 rounded-md hover:bg-red-200 transition-all"
                      >
                        <MdDeleteForever size={20} />
                      </button>
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

export default ListVersion;
