import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorAlert from '../../components/alerts/ErrorAlert';
import SuccessAlert from '../../components/alerts/SuccessAlert';
import { MdDeleteForever, MdEdit, MdSave } from "react-icons/md";

const PlannerTeacher = () => {
    const [planner, setPlanner] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
    const [successAlert, setSuccessAlert] = useState({ success: false, message: "" });

    useEffect(() => {
        const fetchPlanner = async () => {
            try {
                const response = await axios.get("https://tuapi.com/obtener-planeador");
                setPlanner(response.data.length > 0 ? response.data : []);
            } catch (error) {
                console.error("Error al obtener los datos", error);
                //setErrorAlert({ error: true, message: "Error al cargar la planeación" });

            }
        };
        fetchPlanner();
    }, []);

    const handleAddColumn = () => {
        if (editingItem) return;
        const newCol = { id: Date.now(), name: "", description: "", isEditing: true };
        setPlanner([...planner, newCol]);
        setEditingItem(newCol);
    };

    const handleEdit = (item) => {
        setEditingItem({ ...item });
    };

    const handleEditChange = (e, field) => {
        setEditingItem(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://tuapi.com/eliminar-planeador/${id}`);
            setPlanner(prevPlanner => prevPlanner.filter(item => item.id !== id));
            if (editingItem?.id === id) setEditingItem(null);
        } catch (error) {
            console.error("Error al eliminar", error);
            setErrorAlert({ error: true, message: "Error al eliminar la fila" });
        }
    };

    const handleSubmit = async () => {
        if (!editingItem) return;
        try {
            const response = editingItem.id ? 
                await axios.put(`https://tuapi.com/actualizar-planeador/${editingItem.id}`, editingItem) : 
                await axios.post("https://tuapi.com/crear-planeador", editingItem);
            
            setPlanner(planner.map(item => (item.id === editingItem.id ? response.data : item)));
            setEditingItem(null);
            setSuccessAlert({ success: true, message: "Guardado exitosamente" });
        } catch (error) {
            console.error(error);
            setErrorAlert({ error: true, message: "Error al guardar los cambios" });
        }
        setTimeout(() => {
            setErrorAlert({ error: false, message: "" });
            setSuccessAlert({ success: false, message: "" });
        }, 5000);
    };

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                Planeador
            </h2>
            {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
            {successAlert.success && <SuccessAlert message={successAlert.message} />}
            
            
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-red-500 text-white">
                        <tr>
                            <th className="px-3 py-2 text-center">Nombre</th>
                            <th className="px-3 py-2 text-center">Descripción</th>
                            <th className="px-4 py-3 text-center">Acción</th>
                            <th className="px-4 py-3 text-center">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planner.map((item) => (
                            <tr key={item.id} className="border-t hover:bg-gray-100">
                                <td className="px-4 py-3 text-center">
                                    {editingItem?.id === item.id ? (
                                        <input type="text" value={editingItem.name} onChange={(e) => handleEditChange(e, "name")} className="border p-2 w-full rounded" />
                                    ) : item.name}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {editingItem?.id === item.id ? (
                                        <input type="text" value={editingItem.description} onChange={(e) => handleEditChange(e, "description")} className="border p-2 w-full rounded" />
                                    ) : item.description}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {editingItem?.id === item.id ? (
                                        <button onClick={handleSubmit} className="text-green-600 p-2 rounded-md hover:bg-green-200 transition-all">
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
            </div>

            <div className="flex flex-col items-center mt-6 space-y-3">
                <button onClick={handleAddColumn} disabled={!!editingItem} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-all">
                    Nueva Planeación
                </button>
                <button disabled={planner.length > 0} className={`px-4 py-2 rounded-md transition-all ${planner.length > 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-700'}`}>Cargar desde Semestre Anterior</button>
                <button disabled={planner.length > 0} className={`px-4 py-2 rounded-md transition-all ${planner.length > 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-700'}`}>Cargar desde Grupo Activo</button>
            </div>
        </div>
    );
};

export default PlannerTeacher;
