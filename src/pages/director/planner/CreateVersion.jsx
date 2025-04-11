import React, { useState, useEffect, useRef } from 'react';
import axios from '../../../axios/Axios';
import ErrorAlert from '../../../components/alerts/ErrorAlert';
import SuccessAlert from '../../../components/alerts/SuccessAlert';
import { MdDeleteForever, MdEdit, MdSave } from "react-icons/md";

const CreateVersion = () => {
    const [planner, setPlanner] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingItem, setEditingItem] = useState(null);
    const plannerPerPage = 5;
    const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
    const [successAlert, setSuccessAlert] = useState({ success: false, message: "" });
    const [showVersionList, setShowVersionList] = useState(false);
    const [availableVersions, setAvailableVersions] = useState([]);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [showVersionModal, setShowVersionModal] = useState(false);
    const [isDefaultVersion, setIsDefaultVersion] = useState(false);
    const [versionName, setVersionName] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        const storedPlanner = JSON.parse(localStorage.getItem("planner")) || [];
        setPlanner(storedPlanner);
        setInitialLoaded(true);
    }, []);

    useEffect(() => {
        if (initialLoaded) {
            const filteredPlanner = planner.filter(item =>
                !(editingItem?.id === item.id && (!item.name.trim() || !item.description.trim()))
            );
            localStorage.setItem("planner", JSON.stringify(filteredPlanner));
        }
    }, [planner, initialLoaded, editingItem]);



    const handleAddColumn = () => {
        if (editingItem) return;
        const newCol = { id: Date.now(), name: "", description: "" };
        const newPlanner = [...planner, newCol];
        setPlanner(newPlanner);
        setEditingItem(newCol);

        const newTotalPages = Math.ceil(newPlanner.length / plannerPerPage);
        setCurrentPage(newTotalPages);
    };

    const handleSaveColumn = (id) => {
        if (!editingItem.name.trim() || !editingItem.description.trim()) return;
        setPlanner(prevPlanner =>
            prevPlanner.map(item => item.id === id ? editingItem : item)
        );
        setEditingItem(null);
    };

    const handleEdit = (item) => {
        setEditingItem({ ...item });
    };

    const handleEditChange = (e, field) => {
        setEditingItem(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleDelete = (id) => {
        setPlanner(prevPlanner => prevPlanner.filter(item => item.id !== id));
        if (editingItem?.id === id) setEditingItem(null);
    };

    const handleClearPlanner = () => {
        localStorage.removeItem("planner");
        setPlanner([]);
        setEditingItem(null);
        setSuccessAlert({ success: true, message: "Planeador limpio exitosamente." });
        setTimeout(() => setSuccessAlert({ success: false, message: "" }), 5000);
    };

    const handleGenerateVersion = async () => {
        if (!versionName.trim()) {
            setErrorAlert({ error: true, message: "El nombre de la versión es obligatorio." });
            setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
            return;
        }

        const hasEmptyColumns = planner.some(item =>
            !item.name?.trim() || !item.description?.trim()
        );

        if (hasEmptyColumns) {
            setErrorAlert({ error: true, message: "Todas las columnas deben tener nombre y descripción." });
            setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
            return;
        }
        console.log(planner);
        try {
            const response = await axios.post("version", {
                name: versionName,
                defaultVersion: isDefaultVersion,
                columnDefinitions: planner.map(({ name, description }) => ({
                    name: name.trim(),
                    description: description.trim()
                }))
            });

            if (response.status === 200) {
                setSuccessAlert({ success: true, message: "Nueva versión generada exitosamente" });
                localStorage.removeItem("planner");
                setPlanner([]);
                setShowVersionModal(false);

                setTimeout(() => {
                    window.location.href = "/director";
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            setErrorAlert({ error: true, message: error.response?.data || "Error al generar la nueva versión" });
        }

        setTimeout(() => {
            setErrorAlert({ error: false, message: "" });
            setSuccessAlert({ success: false, message: "" });
        }, 5000);
    };

    const handleLoadVersionList = async () => {
        if (availableVersions.length === 0) {
            try {
                const response = await axios.get("version/list");
                const versions = Array.isArray(response.data) ? response.data : [];
                setAvailableVersions(versions);
            } catch (error) {
                console.error(error);
                setErrorAlert({ error: true, message: "Error al obtener las versiones disponibles" });
                setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
                return;
            }
        }
        setShowVersionList(prev => !prev);
    };

    const handleSelectVersion = async (versionId) => {
        if (editingItem) {
            setErrorAlert({ error: true, message: "Termina de editar antes de cargar una versión." });
            setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
            return;
        }

        try {
            const response = await axios.get(`version?versionId=${versionId}`);
            const versionData = response.data;

            if (!Array.isArray(versionData.columnDefinitions)) {
                throw new Error("La versión no contiene columnas válidas.");
            }

            const mappedData = versionData.columnDefinitions.map((col) => ({
                id: crypto.randomUUID(),
                name: col.name || "",
                description: col.description || ""
            }));

            setPlanner(mappedData);
            localStorage.setItem("planner", JSON.stringify(mappedData));
            setEditingItem(null);
            setShowVersionList(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setSuccessAlert({
                success: true,
                message: "Versión cargada exitosamente. Puedes editarla y generar una nueva versión si lo deseas."
            });
        } catch (error) {
            console.error("Error al cargar la versión:", error);

            setErrorAlert({ error: true, message: "Error al cargar la versión seleccionada" });
        }

        setTimeout(() => {
            setErrorAlert({ error: false, message: "" });
            setSuccessAlert({ success: false, message: "" });
        }, 5000);
    };

    const openVersionModal = () => {
        if (planner.length === 0 || editingItem) return;
        setShowVersionModal(true);
    };

    useEffect(() => {
        const totalPages = Math.ceil(planner.length / plannerPerPage);
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(totalPages, 1));
        }
    }, [planner, currentPage, plannerPerPage]);

    const indexOfLastItem = currentPage * plannerPerPage;
    const indexOfFirstItem = indexOfLastItem - plannerPerPage;
    const currentItems = planner.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(planner.length / plannerPerPage);

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                Crear Nuevo Planeador
            </h2>

            {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
            {successAlert.success && <SuccessAlert message={successAlert.message} />}

            {planner.length === 0 ? (
                <p className="text-center text-gray-500">Crea Una Nueva Columna o Carga una Versión Anterior</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                        <thead className="bg-red-500 text-white">
                            <tr>
                                <th className="px-4 py-3 text-center">Columna de Planeación</th>
                                <th className="px-4 py-3 text-center">Descripción</th>
                                <th className="px-4 py-3 text-center">Acción</th>
                                <th className="px-4 py-3 text-center">Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id} className="border-t hover:bg-gray-100">
                                    <td className="px-4 py-3 text-center">
                                        {editingItem?.id === item.id ? (
                                            <input
                                                type="text"
                                                value={editingItem.name}
                                                onChange={(e) => handleEditChange(e, "name")}
                                                className="border p-2 w-full rounded"
                                                autoFocus={editingItem.name === ""}
                                            />
                                        ) : item.name}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {editingItem?.id === item.id ? (
                                            <input
                                                type="text"
                                                value={editingItem.description}
                                                onChange={(e) => handleEditChange(e, "description")}
                                                className="border p-2 w-full rounded"
                                            />
                                        ) : item.description}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {editingItem?.id === item.id ? (
                                            <button onClick={() => handleSaveColumn(item.id)} className="text-green-600 p-2 rounded-md hover:bg-green-200 transition-all">
                                                <MdSave size={20} />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleEdit(item)} className="text-blue-600 p-2 rounded-md hover:bg-blue-200 transition-all">
                                                <MdEdit size={20} />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2 rounded-md hover:bg-red-200 transition-all">
                                            <MdDeleteForever size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4 space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col items-center mt-6 space-y-3">
                <button onClick={handleAddColumn} disabled={!!editingItem} className={`px-4 py-2 rounded-md transition-all ${editingItem ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-700'}`}>
                    Nueva Columna de Planeación
                </button>
                <button onClick={handleLoadVersionList} disabled={planner.length > 0} className={`px-4 py-2 rounded-md transition-all ${planner.length > 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-700'}`}>
                    {showVersionList ? "Ocultar versiones disponibles" : "Cargar desde otra versión"}
                </button>
                <button
                    onClick={openVersionModal}
                    disabled={planner.length === 0 || !!editingItem}
                    className={`px-4 py-2 rounded-md transition-all ${planner.length === 0 || editingItem ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-700'}`}
                >
                    Generar nueva versión
                </button>
                {planner.length > 0 && (
                    <button
                        onClick={handleClearPlanner}
                        className="px-4 py-2 rounded-md transition-all bg-red-500 text-white hover:bg-red-700"
                    >
                        Limpiar planeador
                    </button>
                )}
            </div>

            {showVersionList && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                        <div className="overflow-x-auto">
                            <label className="block mb-2 font-medium">Selecciona una version anterior:</label>
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base">
                                <thead className="bg-gray-200 text-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Nombre de la Versión</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap" title="Nombre de columnas">Columnas</th>
                                        <th className="px-4 py-3 text-center whitespace-nowrap">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(availableVersions) && availableVersions.map((version) => (
                                        <tr key={version.id} className="border-t hover:bg-gray-100">
                                            <td className="px-4 py-3">{version.versionName}</td>
                                            <td
                                                className="px-4 py-3 text-gray-500 text-sm truncate max-w-xs"
                                                title={version.versionColumns}
                                            >
                                                {version.versionColumns?.slice(0, 60)}...
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleSelectVersion(version.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all text-sm"
                                                >
                                                    Cargar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                onClick={() => setShowVersionList(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showVersionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Detalles de la Nueva Versión</h3>
                        <label className="block mb-2 font-medium">Nombre de la versión:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded mb-4"
                            value={versionName}
                            onChange={(e) => setVersionName(e.target.value)}
                            placeholder="Ej. 2025 I"
                        />

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="defaultVersion"
                                checked={isDefaultVersion}
                                onChange={() => setIsDefaultVersion(prev => !prev)}
                                className="mr-2"
                            />
                            <label htmlFor="defaultVersion">Usar esta versión por defecto</label>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowVersionModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGenerateVersion}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Confirmar y Crear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateVersion;