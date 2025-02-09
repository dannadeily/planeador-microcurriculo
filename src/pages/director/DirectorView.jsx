import { useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";

const DirectorView = () => {
    const [assignments, setAssignments] = useState([]);
    const [isSemesterActive, setIsSemesterActive] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const assignmentsPerPage = 5;

    useEffect(() => {
        const mockData = [
            { id: 1, course: "Matemáticas Avanzadas", docente: "pepe", group: "A1" },
            { id: 2, course: "Historia Universal", docente: "pepe 2", group: "B2" },
            { id: 3, course: "Programación Web", docente: "pepe 3", group: "C3" },
            { id: 4, course: "Física Cuántica", docente: "pepe 4", group: "D4" },
            { id: 5, course: "Química Orgánica", docente: "pepe 5", group: "E5" },
            { id: 6, course: "Literatura Española", docente: "pepe 6", group: "F6" },
            { id: 7, course: "Geometría Analítica", docente: "pepe 7", group: "G7" }
        ];
        setAssignments(mockData);
    }, []);

    const handleDelete = (id) => {
        setAssignments(assignments.filter((assignment) => assignment.id !== id));
    };

    const indexOfLastAssignment = currentPage * assignmentsPerPage;
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
                                        <td className="px-4 py-3">{assignment.course}</td>
                                        <td className="px-4 py-3 text-center">{assignment.docente}</td>
                                        <td className="px-4 py-3 text-center">{assignment.group}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleDelete(assignment.id)}
                                                className=" text-red-600 p-2 rounded-md hover:bg-red-200 transition-all"
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
                    <Link  to="/director/assign-teacher">
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