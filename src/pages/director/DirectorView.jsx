import { useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import Axios from "../../axios/Axios";

const DirectorView = () => {
    const [assignments, setAssignments] = useState([]);
    const [isSemesterActive, setIsSemesterActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);  // Cambiar de 1 a 0
    const assignmentsPerPage = 5;

    useEffect(() => {
        // Obtener el semestre activo
        const getActiveSemester = async () => {
            try {
                const response = await Axios.get("semester/active");
                if (response.data && response.data.id) {
                    setIsSemesterActive(true); // El semestre está activo
                    fetchAssignments(response.data.id); // Obtener asignaciones para el semestre activo
                } else {
                    setIsSemesterActive(false); // No hay semestre activo
                }
            } catch (error) {
                console.error("Error al obtener el semestre activo", error);
                setIsSemesterActive(false); // En caso de error, no hay semestre activo
            }
        };
        getActiveSemester();
    }, []);

    // Obtener asignaciones para un semestre específico
    const fetchAssignments = async (idSemester) => {
        try {
            const response = await Axios.get(`assignment/director?idSemester=${idSemester}`);
            if (response.data) {
                setAssignments(response.data);
            }
        } catch (error) {
            console.error("Error al obtener las asignaciones", error);
        }
    };

    // Eliminar una asignación
    const handleDelete = async (id) => {
        try {
            // Hacer una solicitud DELETE para eliminar la asignación por ID
            const response = await Axios.delete(`assignment?idAssignment=${id}`);
            console.log("Asignación eliminada exitosamente", response.data);

            // Eliminar la asignación localmente
            setAssignments(assignments.filter((assignment) => assignment.id !== id));
        } catch (error) {
            if (error.response) {
                // Si hay una respuesta del servidor
                console.error("Error al eliminar la asignación", error.response.data);
            } else if (error.request) {
                // Si la solicitud fue realizada pero no hubo respuesta
                console.error("Error en la solicitud", error.request);
            } else {
                // Si hubo un error al configurar la solicitud
                console.error("Error desconocido", error.message);
            }
        }
    };

    // Ajustar los índices de la paginación para empezar desde 0
    const indexOfLastAssignment = (currentPage + 1) * assignmentsPerPage;
    const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
    const currentAssignments = assignments.slice(indexOfFirstAssignment, indexOfLastAssignment);
    const totalPages = Math.ceil(assignments.length / assignmentsPerPage);

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {isSemesterActive ? (
                <>
                    <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                        Asignaciones Activas
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                            <thead className="bg-red-500 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left">Curso</th>
                                    <th className="px-4 py-3 text-center">Docente</th>
                                    <th className="px-4 py-3 text-center">Grupo</th>
                                    <th className="px-4 py-3 text-center">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAssignments.map((assignment) => (
                                    <tr key={assignment.id} className="border-t hover:bg-gray-100">
                                        <td className="px-4 py-3">{assignment.courseName}</td>
                                        <td className="px-4 py-3 text-center">{assignment.teacherName}</td>
                                        <td className="px-4 py-3 text-center">{assignment.group}</td>
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
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}  // Cambiar a 0 en vez de 1
                            disabled={currentPage === 0}  // No puede ir a páginas menores que 0
                            className={`px-4 py-2 rounded-md ${currentPage === 0 ? "bg-gray-300" : "bg-red-500 text-white hover:bg-red-700"}`}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span> {/* Mostrar la página directamente */}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}  // Ajustar para que no supere el número total de páginas
                            disabled={currentPage === totalPages - 1}
                            className={`px-4 py-2 rounded-md ${currentPage === totalPages - 1 ? "bg-gray-300" : "bg-red-700 text-white hover:bg-red-800"}`}
                        >
                            Siguiente
                        </button>
                    </div>
                    <Link to="/director/assign-teacher">
                        <div className="mt-4 text-center">
                            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all">
                                Asignar Docente a un Curso
                            </button>
                        </div>
                    </Link>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                    <h2 className="text-3xl font-bold text-gray-700">No hay un semestre activo</h2>
                    <p className="text-gray-500 mt-2">Por favor, espere hasta que se active un semestre.</p>
                </div>
            )}
        </div>
    );
};

export default DirectorView;