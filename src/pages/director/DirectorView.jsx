import { useState, useEffect } from "react";
import { MdDeleteForever, MdSearch } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../axios/Axios";
import Swal from "sweetalert2";

const DirectorView = () => {
    const [assignments, setAssignments] = useState([]);
    const [isSemesterActive, setIsSemesterActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const assignmentsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "No has iniciado sesión",
                text: "Por favor, inicia sesión primero.",
                confirmButtonText: "Ir al inicio de sesión",
            }).then(() => {
                navigate("/login");
            });
            return;
        }

        const getActiveSemester = async () => {
            try {
                const response = await Axios.get("semester/active");
                if (response.data && response.data.id) {
                    setIsSemesterActive(true);
                    fetchAssignments(response.data.id);
                } else {
                    setIsSemesterActive(false);
                }
            } catch (error) {
                console.error("Error al obtener el semestre activo", error);
                setIsSemesterActive(false);
            }
        };

        getActiveSemester();
    }, [navigate]);

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

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará la asignación permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await Axios.delete(`assignment?idAssignment=${id}`);
                setAssignments(assignments.filter((assignment) => assignment.id !== id));
                Swal.fire("Eliminado", "La asignación ha sido eliminada.", "success");
            } catch (error) {
                console.error("Error al eliminar la asignación", error);
                Swal.fire("Error", "No se pudo eliminar la asignación.", "error");
            }
        }
    };

    const normalizeText = (text) => {
        return text
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .replace(/\s+/g, "")
            .toLowerCase();
    };

    const filteredAssignments = assignments.filter((assignment) => {
        return (
            normalizeText(assignment.teacherName).includes(normalizeText(searchTerm)) ||
            normalizeText(assignment.courseName).includes(normalizeText(searchTerm))
        );
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLastAssignment = currentPage * assignmentsPerPage;
    const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
    const currentAssignments = filteredAssignments.slice(indexOfFirstAssignment, indexOfLastAssignment);
    const totalPages = Math.ceil(filteredAssignments.length / assignmentsPerPage);

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {isSemesterActive ? (
                <>
                    <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                        Asignaciones Activas
                    </h2>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por docente o curso"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full pl-10"
                        />
                        <MdSearch className="absolute left-3 top-3 text-gray-500" size={20} />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                            <thead className="bg-red-500 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-center">Curso</th>
                                    <th className="px-4 py-3 text-center">Docente</th>
                                    <th className="px-4 py-3 text-center">Grupo</th>
                                    <th className="px-4 py-3 text-center">Revisar Planeador</th>
                                    <th className="px-4 py-3 text-center">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAssignments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-500">
                                            No se encontraron asignaciones.
                                        </td>
                                    </tr>
                                ) : (
                                    currentAssignments.map((assignment) => (
                                        <tr key={assignment.id} className="border-t hover:bg-gray-100">
                                            <td className="px-4 py-3">{assignment.courseName}</td>
                                            <td className="px-4 py-3 text-center">{assignment.teacherName}</td>
                                            <td className="px-4 py-3 text-center">{assignment.group}</td>
                                            <td className="px-4 py-3 text-center">
                                                <Link to={`/director/see-planner/${assignment.id}`}>
                                                    <button className="text-blue-600 px-4 py-2 hover:text-blue-900 transition-all">
                                                        Planeador
                                                    </button>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleDelete(assignment.id)}
                                                    className="text-red-600 p-2 rounded-md hover:bg-red-200 transition-all"
                                                    title="Eliminar asignación"
                                                    aria-label="Eliminar asignación"
                                                >
                                                    <MdDeleteForever size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-red-500 text-white hover:bg-red-700"}`}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-300" : "bg-red-700 text-white hover:bg-red-800"}`}
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
