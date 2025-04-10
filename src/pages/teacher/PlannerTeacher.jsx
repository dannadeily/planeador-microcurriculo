import React, { useState, useEffect } from 'react';
import Axios from '../../axios/Axios';
import { useParams } from 'react-router-dom';
import { MdDeleteForever, MdEdit, MdSave } from 'react-icons/md';
import Swal from 'sweetalert2';

const PlannerTeacher = () => {
    const [planner, setPlanner] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRow, setNewRow] = useState(null);
    const [saving, setSaving] = useState(false);
    const [newRowData, setNewRowData] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);

    const rowsPerPage = 5;
    const { courseId: assignmentId } = useParams();

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

    useEffect(() => {
        if (assignmentId) {
            setLoading(true);
            fetchPlanner();
        }
    }, [assignmentId]);

    if (loading) return <div className="text-center text-gray-500">Cargando información...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    const data = planner?.data || [];
    const columns = planner?.columns || [];
    const hasData = data.length > 0;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.max(Math.ceil(data.length / rowsPerPage), 1);

    const handleCreateNewRow = () => {
        const emptyRow = Array(columns.length).fill('');
        setNewRow(emptyRow);
    };

    const handleChangeCell = (index, value) => {
        const updatedRow = [...newRow];
        updatedRow[index] = value;
        setNewRow(updatedRow);
    };

    const handleSaveNewRow = async () => {
        if (!newRow.every(value => value.trim() !== '')) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vacíos',
                text: 'Por favor completa todos los campos antes de guardar.',
            });
            return;
        }

        const confirm = await Swal.fire({
            title: '¿Guardar planeación?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
        });

        if (!confirm.isConfirmed) return;

        try {
            
            const response = await Axios.post("planner", {
                plannerId: parseInt(assignmentId),
                
                data: newRow.map(cell => cell.trim())
            });
            

            if (response.status === 200) {
                const res = await Axios.get(`planner?assignmentId=${assignmentId}`);
                setPlanner(res.data);
                setNewRow(null);
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Ocurrió un error al guardar la planeación.',
            });
        }
    };


    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                Planeador
            </h2>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-300 pb-4 text-gray-700">
                    <p><span className='font-semibold'>Curso:</span> {planner.courseName}</p>
                    <p><span className='font-semibold'>Docente:</span> {planner.teacherName}</p>
                    <p><span className='font-semibold'>Grupo:</span> {planner.group}</p>
                    <p><span className='font-semibold'>Semestre:</span> {planner.semesterName}</p>
                </div>
                <div className="mt-2 text-gray-600">
                    <span className='font-semibold'>Planeador -</span> {planner.versionName}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-red-500 text-white text-sm md:text-base">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="px-3 py-2 text-center" title={col.description}>
                                    {col.name}
                                </th>
                            ))}
                            <th className="px-3 py-2 text-center">Acción</th>
                            <th className="px-3 py-2 text-center">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newRow && (
                            <tr className="border-t bg-yellow-50 text-xs md:text-sm">
                                {newRow.map((cell, index) => (
                                    <td key={index} className="px-3 py-2 text-center">
                                        <input
                                            type="text"
                                            value={cell}
                                            onChange={(e) => handleChangeCell(index, e.target.value)}
                                            className="w-full border border-gray-300 px-2 py-1 rounded"
                                            disabled={saving}
                                        />
                                    </td>
                                ))}
                                <td className="px-3 py-2 text-center">
                                    <button
                                        onClick={handleSaveNewRow}
                                        disabled={saving}
                                        className="text-green-600 p-2 rounded-md hover:bg-green-200 transition-all"
                                    >
                                        <MdSave />
                                    </button>
                                </td>
                                <td className="px-3 py-2 text-center text-gray-400">-</td>
                            </tr>
                        )}

                        {(!planner || planner.data.length === 0) && !newRow ? (
                            <tr>
                                <td colSpan={columns.length + 2} className="px-3 py-4 text-center text-gray-500">
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
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            disabled={newRow || saving}
                                            className="text-blue-600 p-2 rounded-md hover:bg-blue-200 transition-all"
                                        >
                                            <MdEdit />
                                        </button>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            disabled={newRow || saving}
                                            className="text-red-600 p-2 rounded-md hover:bg-red-200 transition-all"
                                        >
                                            <MdDeleteForever />
                                        </button>
                                    </td>
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

            <div className="flex flex-col items-center mt-6 space-y-3">
                <button
                    onClick={handleCreateNewRow}
                    disabled={newRow || saving}
                    className="px-4 py-2 rounded-md transition-all bg-red-500 text-white hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Nueva planeación
                </button>

                <button
                    disabled={hasData || newRow}
                    className={`px-4 py-2 rounded-md transition-all ${hasData || newRow ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-700"}`}
                >
                    Cargar desde semestre anterior
                </button>

                <button
                    disabled={hasData || newRow}
                    className={`px-4 py-2 rounded-md transition-all ${hasData || newRow ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-700"}`}
                >
                    Cargar desde grupo activo
                </button>
            </div>
        </div>
    );
};

export default PlannerTeacher;
