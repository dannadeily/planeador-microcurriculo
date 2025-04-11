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
    const [editingRowData, setEditingRowData] = useState(null);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [compatiblePlanners, setCompatiblePlanners] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [groupCompatiblePlanners, setGroupCompatiblePlanners] = useState([]);
    const [showGroupModal, setShowGroupModal] = useState(false);


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
                Swal.fire({
                    icon: 'success',
                    title: 'Guardado',
                    text: 'La planeación fue guardada exitosamente.',

                    timer: 2000,
                    showConfirmButton: false,
                });
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

    const handleCancelNewRow = () => {
        setNewRow(null);
    };

    // Function to handle row edit
    const handleEditRow = (rowIndex) => {
        const absoluteIndex = indexOfFirstRow + rowIndex;
        setEditingRowIndex(absoluteIndex);
        setEditingRowData([...data[absoluteIndex]]);
    };

    const handleChangeEditCell = (index, value) => {
        const updated = [...editingRowData];
        updated[index] = value;
        setEditingRowData(updated);
    };

    const handleSaveEditRow = async () => {

        const confirm = await Swal.fire({
            title: '¿Guardar cambios?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
        });

        if (!confirm.isConfirmed) return;

        try {
            setSaving(true);

            const payload = {
                plannerId: parseInt(assignmentId),
                rowPosition: editingRowIndex, // <-- Probá con este valor (0-indexed). Cambiar a +1 si el backend lo necesita
                data: editingRowData.map(cell => cell.trim())
            };

            console.log("Payload que se enviará:", payload); // Debug

            const response = await Axios.put("planner", payload);

            if (response.status === 200 || response.status === 204) {
                await fetchPlanner();
                setEditingRowIndex(null);
                setEditingRowData(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Actualizado',
                    text: 'La planeación fue actualizada exitosamente.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                console.warn("Respuesta inesperada del servidor:", response);
            }

        } catch (error) {
            console.error("Error al actualizar:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Ocurrió un error al guardar los cambios.',
            });
        } finally {
            setSaving(false);
        }
    };

    // Function to handle row deletion

    const handleDeleteRow = async (rowIndex) => {
        const absoluteIndex = indexOfFirstRow + rowIndex;

        const confirm = await Swal.fire({
            title: '¿Eliminar planeación?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!confirm.isConfirmed) return;

        try {
            setSaving(true);

            const response = await Axios.delete(`planner?plannerId=${assignmentId}&rowPosition=${absoluteIndex}`);

            if (response.status === 200 || response.status === 204) {
                await fetchPlanner();
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'La planeación fue eliminada exitosamente.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                console.warn("Respuesta inesperada al eliminar:", response);
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo eliminar la planeación.',
            });
        } finally {
            setSaving(false);
        }
    };

    // Function to handle loading data from previous semester
    const handleLoadFromPreviousSemester = async () => {
        try {
            const response = await Axios.get(`planner/compatible/old?plannerId=${assignmentId}`);

            console.log("Response from previous semester:", response.data); // Debug
            setCompatiblePlanners(response.data); // Asumiendo que es un array de objetos con los campos necesarios
            setShowModal(true);
        } catch (error) {
            console.error("Error al obtener planeaciones anteriores:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la información del semestre anterior.',
            });
        }
    };

    // Function to handle loading data from active group

    const handleLoadFromActiveGroup = async () => {
        try {
            const response = await Axios.get(`planner/compatible/group?plannerId=${assignmentId}`);
            setGroupCompatiblePlanners(response.data); // Se espera que sea una lista de objetos con info del grupo
            setShowGroupModal(true);
        } catch (error) {
            console.error("Error al obtener planeaciones de grupo activo:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron obtener las planeaciones compatibles de otros grupos.',
            });
        }
    };

    const autoResizeTextarea = (textarea) => {
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
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
                                        <textarea
                                            value={cell}
                                            onChange={(e) => handleChangeCell(index, e.target.value)}
                                            rows={1}
                                            className="w-full border border-gray-300 px-2 py-1 rounded resize-none overflow-hidden"
                                            style={{ height: 'auto' }}
                                            onInput={(e) => {
                                                e.target.style.height = 'auto';
                                                e.target.style.height = `${e.target.scrollHeight}px`;
                                            }}
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
                                <td className="px-3 py-2 text-center">
                                    <button
                                        onClick={handleCancelNewRow}
                                        disabled={saving}
                                        className="text-red-600 p-2 rounded-md hover:bg-red-200 transition-all"
                                        title="Cancelar"
                                    >
                                        <MdDeleteForever />
                                    </button>
                                </td>
                            </tr>
                        )}

                        {(!planner || planner.data.length === 0) && !newRow ? (
                            <tr>
                                <td colSpan={columns.length + 2} className="px-3 py-4 text-center text-gray-500">
                                    No hay datos registrados en el planeador.
                                </td>
                            </tr>
                        ) : (
                            currentRows.map((row, rowIndex) => {
                                const absoluteIndex = indexOfFirstRow + rowIndex;
                                const isEditing = absoluteIndex === editingRowIndex;

                                return (
                                    <tr key={rowIndex} className="border-t hover:bg-gray-100 text-xs md:text-sm">
                                        {(isEditing ? editingRowData : row).map((cell, cellIndex) => (
                                            <td key={cellIndex} className="px-3 py-2 text-center">
                                                {isEditing ? (
                                                    <textarea
                                                        ref={(el) => autoResizeTextarea(el)}
                                                        value={cell}
                                                        onChange={(e) => handleChangeEditCell(cellIndex, e.target.value)}
                                                        rows={1}
                                                        className="w-full border border-gray-300 px-2 py-1 rounded resize-none overflow-hidden"
                                                        onInput={(e) => autoResizeTextarea(e.target)}
                                                        disabled={saving}
                                                    />

                                                ) : (
                                                    cell || '-'
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-3 py-2 text-center">
                                            {isEditing ? (
                                                <button
                                                    onClick={handleSaveEditRow}
                                                    disabled={saving}
                                                    className="text-green-600 p-2 rounded-md hover:bg-green-200 transition-all"
                                                >
                                                    <MdSave />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditRow(rowIndex)}
                                                    disabled={newRow || saving || editingRowIndex !== null}
                                                    className="text-blue-600 p-2 rounded-md hover:bg-blue-200 transition-all"
                                                >
                                                    <MdEdit />
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => handleDeleteRow(rowIndex)}
                                                disabled={newRow || saving || editingRowIndex !== null}
                                                className="text-red-600 p-2 rounded-md hover:bg-red-200 transition-all"
                                            >
                                                <MdDeleteForever />
                                            </button>

                                        </td>
                                    </tr>
                                );
                            })
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
                    onClick={handleLoadFromPreviousSemester}
                    disabled={hasData || newRow}
                    className={`px-4 py-2 rounded-md transition-all ${hasData || newRow ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-700"}`}
                >
                    Cargar desde semestre anterior
                </button>

                <button
                    onClick={handleLoadFromActiveGroup}
                    disabled={hasData || newRow}
                    className={`px-4 py-2 rounded-md transition-all ${hasData || newRow ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-700"}`}
                >
                    Cargar desde grupo activo
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-center">Selecciona una planeación del semestre anterior</h3>
                        <div className="max-h-64 overflow-y-auto">
                            {compatiblePlanners.length > 0 ? (
                                <ul className="space-y-2">
                                    {compatiblePlanners.map((plannerItem) => (
                                        <li
                                            key={plannerItem.id}
                                            className="border p-3 rounded-md hover:bg-gray-100 cursor-pointer transition"
                                            onClick={async () => {
                                                const confirm = await Swal.fire({
                                                    title: '¿Cargar esta planeación?',
                                                    text: `Docente: ${plannerItem.teacherName} | Grupo: ${plannerItem.group} | Semestre: ${plannerItem.semesterName}`,
                                                    icon: 'question',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Sí, cargar',
                                                    cancelButtonText: 'Cancelar',
                                                });

                                                if (!confirm.isConfirmed) return;

                                                try {
                                                    // Obtener la planeación original
                                                    const response = await Axios.get(`planner?assignmentId=${plannerItem.planningId}`);

                                                    console.log("Response de la planeación seleccionada:", response.data); // Debug
                                                    // Enviar al endpoint batch
                                                    const batchPayload = {
                                                        plannerId: assignmentId, // Usa el ID del planner activo donde se debe insertar
                                                        batchData: response.data.data.map(row => Object.values(row)), // Asegúrate de estructurar correctamente los datos
                                                    };

                                                    await Axios.post('planner/batch', batchPayload);

                                                    //actualizar el planner activo
                                                    const updatedResponse = await Axios.get(`planner?assignmentId=${assignmentId}`);
                                                    setPlanner(updatedResponse.data);
                                                    setShowModal(false);



                                                    Swal.fire({
                                                        icon: 'success',
                                                        title: 'Cargado',
                                                        text: 'La planeación fue cargada exitosamente.',
                                                        timer: 2000,
                                                        showConfirmButton: false,
                                                    });
                                                } catch (error) {
                                                    console.error("Error al cargar planeación:", error);
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Error',
                                                        text: 'No se pudo cargar la planeación seleccionada.',
                                                    });
                                                }
                                            }}
                                        >
                                            <strong>{plannerItem.teacherName}</strong> — Grupo: {plannerItem.group}, Semestre: {plannerItem.semesterName}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No hay planeaciones compatibles.</p>
                            )}
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showGroupModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-center">Selecciona un grupo compatible</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {groupCompatiblePlanners.length > 0 ? (
                                groupCompatiblePlanners.map((groupItem, idx) => (
                                    <div
                                        key={groupItem.groupId || idx}
                                        className="border p-3 rounded hover:bg-gray-100 cursor-pointer transition"
                                        onClick={async () => {
                                            const confirm = await Swal.fire({
                                                title: '¿Cargar esta planeación?',
                                                text: `Grupo: ${groupItem.group}`,
                                                icon: 'question',
                                                showCancelButton: true,
                                                confirmButtonText: 'Sí, cargar',
                                                cancelButtonText: 'Cancelar',
                                            });

                                            if (!confirm.isConfirmed) return;

                                            try {
                                                const response = await Axios.get(`planner?assignmentId=${groupItem.planningId}`);
                                                // Enviar al endpoint batch
                                                const batchPayload = {
                                                    plannerId: assignmentId, // Usa el ID del planner activo donde se debe insertar
                                                    batchData: response.data.data.map(row => Object.values(row)), // Asegúrate de estructurar correctamente los datos
                                                };

                                                await Axios.post('planner/batch', batchPayload);

                                                //actualizar el planner activo
                                                const updatedResponse = await Axios.get(`planner?assignmentId=${assignmentId}`);
                                                setPlanner(updatedResponse.data);
                                                setShowModal(false);
                                                setShowGroupModal(false);
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Planeación cargada',
                                                    timer: 1500,
                                                    showConfirmButton: false,
                                                });
                                            } catch (error) {
                                                console.error("Error al cargar planeación del grupo:", error);
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Error',
                                                    text: 'No se pudo cargar la planeación del grupo seleccionado.',
                                                });
                                            }
                                        }}
                                    >
                                        <p><strong>Grupo:</strong> {groupItem.group}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No hay grupos compatibles.</p>
                            )}
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setShowGroupModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PlannerTeacher;
