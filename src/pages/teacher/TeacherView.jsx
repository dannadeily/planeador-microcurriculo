import { useState, useEffect } from "react";
import Axios from "../../axios/Axios";
import { FaDownload } from "react-icons/fa";
import { RiFileEditFill } from "react-icons/ri";
import ErrorAlert from "../../components/alerts/ErrorAlert";

const TeacherView = () => {
    const [assignments, setAssignments] = useState([]);
    const [isSemesterActive, setIsSemesterActive] = useState(false);
    const [idSemester, setIdSemester] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const assignmentsPerPage = 5;
    const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });

    useEffect(() => {
        const getActiveSemester = async () => {
            try {
                const response = await Axios.get("semester/active");
                if (response.data && response.data.id) {
                    setIsSemesterActive(true);
                    setIdSemester(response.data.id);
                } else {
                    setIsSemesterActive(false);
                }
            } catch (error) {
                console.error("Error al obtener el semestre activo", error);
                setIsSemesterActive(false);
            }
        };
        getActiveSemester();
    }, []);

    useEffect(() => {
        if (idSemester) {
            const fetchAssignments = async () => {
                try {
                    const response = await Axios.get(`/assignment/teacher?idSemester=${idSemester}`);
                    setAssignments(response.data);
                } catch (error) {
                    console.error("Error al obtener las asignaciones", error);
                }
            };
            fetchAssignments();
        }
    }, [idSemester]);

    const handleDownloadMicrocurriculum = async (idCourse) => {
        try {
            const response = await Axios.get(`course/microcurriculum?idCourse=${idCourse}`);
            const { content, fileName, mimeType } = response.data;
            const base64String = content.split(',')[1];
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading microcurriculum:", error);
            setErrorAlert({ error: true, message: error.response?.data || "Error al crear el curso" });
        }
        setTimeout(() => {
            setErrorAlert({ error: false, message: "" });
        }, 3000);
    };

    const indexOfLastAssignment = currentPage * assignmentsPerPage;
    const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
    const currentAssignments = assignments.slice(indexOfFirstAssignment, indexOfLastAssignment);
    const totalPages = Math.max(1, Math.ceil(assignments.length / assignmentsPerPage));

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {isSemesterActive ? (
                <>
                    <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                        Asignaciones
                    </h2>

                    {errorAlert.error && <ErrorAlert message={errorAlert.message} />}

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                            <thead className="bg-red-500 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-center">Curso</th>
                                    <th className="px-4 py-3 text-center">Planear</th>
                                    <th className="px-4 py-3 text-center">Grupo</th>
                                    <th className="px-4 py-3 text-center">Descargar Microcurrículo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAssignments.length > 0 ? (
                                    currentAssignments.map((assignment) => (
                                        <tr key={assignment.id} className="border-t hover:bg-gray-100">
                                            <td className="px-4 py-3">{assignment.courseName}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="relative text-green-500 p-2 rounded-md hover:bg-green-200 transition-all group">
                                                    <RiFileEditFill size={20} />
                                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Planear
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-center">{assignment.group}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => handleDownloadMicrocurriculum(assignment.courseId)} className="relative text-blue-500 p-2 rounded-md hover:bg-blue-200 transition-all group">
                                                    <FaDownload size={20} />
                                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Descargar
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-gray-500">
                                            No hay asignaciones disponibles.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {assignments.length > 0 && (
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-700"}`}
                            >
                                Anterior
                            </button>
                            <span>Página {currentPage} de {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-red-700 text-white hover:bg-red-800"}`}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
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

export default TeacherView;
