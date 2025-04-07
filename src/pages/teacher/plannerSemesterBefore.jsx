import React, { useState, useEffect } from 'react';
import Axios from '../../axios/Axios';

const PlannerSemesterBefore = () => {
    const [planner, setPlanner] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const plannerPerPage = 5;

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await Axios.get('');
                setPlanner(response.data);
            } catch (err) {
                setError("Error al cargar los docentes");
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    const indexOfLastDocente = currentPage * plannerPerPage;
    const indexOfFirstDocente = indexOfLastDocente - plannerPerPage;
    const currentDocentes = planner.slice(indexOfFirstDocente, indexOfLastDocente);
    const totalPages = Math.ceil(planner.length / plannerPerPage);

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                       Planeador
                    </h2>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-300 pb-4 font-semibold text-gray-700">
                    <p>Nombre del Curso</p>
                    <p>Nombre del Docente</p>
                    <p>Grupo: grupo</p>
                    <p>Semestre:semestre</p>
                </div>

                <div className="mt-2 text-gray-600">
                    <p className="font-medium">Planeador - Nombre de la Versión</p>
                </div>
            </div>

           
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 rounded-lg shadow-sm">
                            <thead className="bg-red-500 text-white text-sm md:text-base">
                                <tr>
                                    <th className="px-3 py-2 text-center">RA Curso</th>
                                    <th className="px-3 py-2 text-center">Criterio de Desempeño</th>
                                    <th className="px-3 py-2 text-center">Temas</th>
                                    <th className="px-3 py-2 text-center">Actividades Pedagógicas</th>
                                    <th className="px-3 py-2 text-center">Instrumento de Evaluación</th>
                                    <th className="px-3 py-2 text-center">Evidencia de Aprendizaje</th>
                                    <th className="px-3 py-2 text-center">Peso Evaluación</th>
                                    <th className="px-3 py-2 text-center">Información Adicional</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDocentes.map((docente) => (
                                    <tr key={docente.id} className="border-t hover:bg-gray-100 text-xs md:text-sm">
                                        <td className="px-3 py-2 text-center"></td>
                                        <td className="px-3 py-2 text-center"></td>
                                        <td className="px-3 py-2 text-center"></td>
                                        <td className="px-3 py-2 text-center"></td>
                                        <td className="px-3 py-2 text-center"></td>
                                        <td className="px-3 py-2 text-center"></td>
                                        <td className="px-3 py-2 text-center"></td>
                                        <td className="px-3 py-2 text-center"></td>
                                    </tr>
                                ))}
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
                </>
            
        </div>
    );
};

export default PlannerSemesterBefore;