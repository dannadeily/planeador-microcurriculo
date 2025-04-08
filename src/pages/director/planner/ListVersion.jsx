import React, { useState, useEffect } from 'react';
import axios from '../../../axios/Axios';
import { MdDeleteForever } from "react-icons/md";
import { FaCircleDot } from "react-icons/fa6";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListVersion = () => {
  const [versions, setVersions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const VersionPerPage = 5;

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const response = await axios.get('version/list');
      setVersions(response.data);
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast.error('Error al cargar las versiones');
    }
  };

  const handleSetDefault = async (versionId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas establecer esta versión como la versión por defecto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, establecer',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.get(`version/default?versionId=${versionId}`);
      setVersions((prev) =>
        prev.map((v) => ({
          ...v,
          defaultVersion: v.id === versionId,
        }))
      );
      toast.success('Versión establecida como por defecto');
    } catch (error) {
      console.error('Error al establecer versión por defecto:', error);
      toast.error('No se pudo establecer la versión como predeterminada');
    }
  };

  const handleDelete = async (versionId) => {
    const result = await Swal.fire({
      title: '¿Eliminar versión?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`version?versionId=${versionId}`);
      setVersions((prev) => prev.filter((v) => v.id !== versionId));
      toast.success('Versión eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar versión:', error);
      toast.error('No se pudo eliminar la versión');
    }
  };

  const indexOfLastVersion = currentPage * VersionPerPage;
  const indexOfFirstVersion = indexOfLastVersion - VersionPerPage;
  const currentVersion = versions.slice(indexOfFirstVersion, indexOfLastVersion);
  const totalPages = Math.ceil(versions.length / VersionPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Listado de versiones
      </h2>

      {versions.length === 0 ? (
        <p className="text-center text-gray-500">No hay versiones registradas.</p>
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
                      <button
                        onClick={() => {
                          if (!version.defaultVersion) handleSetDefault(version.id);
                        }}
                        className="flex justify-center items-center w-full"
                      >
                        <FaCircleDot
                          className={version.defaultVersion ? 'text-green-500' : 'text-gray-400'}
                          size={20}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(version.id)}
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
