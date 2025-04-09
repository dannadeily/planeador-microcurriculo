import React, { useState, useEffect } from 'react';
import Axios from '../../../axios/Axios';
import { useParams } from 'react-router-dom';

const SeePlanner = () => {
    const [planner, setPlanner] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const rowsPerPage = 5;
    const { assignmentId } = useParams();

    useEffect(() => {
        const fetchPlanner = async () => {
            try {
                const response = await Axios.get(`planner?assignmentId=${assignmentId}`);
                setPlanner(response.data);
            } catch (err) {
                console.error("Error fetching planner:", err);
                setError("Error al cargar el planeador");
            } finally {
                setLoading(false);
            }
        };

        if (assignmentId) {
            fetchPlanner();
        }
    }, [assignmentId]);

    if (loading) {
        return <div className="text-center text-gray-500">Cargando información...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    const data = planner?.data || [];
    const columns = planner?.columns || [];
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.max(Math.ceil(data.length / rowsPerPage), 1);

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                Planeador
            </h2>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-300 pb-4 text-gray-700">
                    <p><span className='font-semibold '>Curso:</span> {planner.courseName}</p>
                    <p><span className='font-semibold '>Docente:</span>  {planner.teacherName}</p>
                    <p><span className='font-semibold '>Grupo:</span>  {planner.group}</p>
                    <p><span className='font-semibold '>Semestre:</span>  {planner.semesterName}</p>
                </div>
                <div className="mt-2 text-gray-600 ">
                    <span className='font-semibold '>Planeador -</span>  {planner.versionName}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-red-500 text-white text-sm md:text-base">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-3 py-2 text-center"
                                    title={col.description}
                                >
                                    {col.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-3 py-4 text-center text-gray-500">
                                    No hay datos registrados en el planeador.
                                </td>
                            </tr>
                        ) : (
                            currentRows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-t hover:bg-gray-100 text-xs md:text-sm">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="px-3 py-2 text-center">
                                            {cell || '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-4 space-x-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md transition-all ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-700"}`}
                >
                    Anterior
                </button>
                <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md transition-all ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-700"}`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default SeePlanner;
