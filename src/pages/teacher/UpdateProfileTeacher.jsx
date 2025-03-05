import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios/Axios';
import ErrorAlert from '../../components/alerts/ErrorAlert';
import SuccessAlert from '../../components/alerts/SuccessAlert';

const UpdateProfileTeacher = () => {
    const navigate = useNavigate();
    const { role } = useParams(); // Obtener el rol de la URL (director o teacher)

    const [user, setUser] = useState({
        name: '',
        personalEmail: '',
        phone: '',
        code: ''
    });

    const [errorAlert, setErrorAlert] = useState({ error: false, message: '' });
    const [successAlert, setSuccessAlert] = useState({ success: false, message: '' });

    // Obtener datos del usuario logueado y prellenar el formulario
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`user`);
                setUser(response.data);
            } catch (error) {
                console.error('Error al obtener los datos del usuario', error);
                setErrorAlert({ error: true, message: error.response.data });
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('user', user);

            // Mostrar la alerta de éxito
            setSuccessAlert({ success: true, message: 'Datos actualizados correctamente' });
            setUser({ name: '', personalEmail: '', phone: '', code: '' }); // Limpiar el formulario de edición

            // Esperar un momento para mostrar la alerta antes de redirigir
            setTimeout(() => {
                navigate(`/teacher/profile-teacher`); // Redirigir al perfil según el rol
            }, 2000);
        } catch (error) {
            console.error('Error al actualizar los datos', error);
            setErrorAlert({ error: true, message: error.response.data });
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                Editar Perfil
            </h2>
            {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
            {successAlert.success && <SuccessAlert message={successAlert.message} />}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="personalEmail" className="block font-medium">Correo Personal:</label>
                    <input
                        type="email"
                        id="personalEmail"
                        name="personalEmail"
                        value={user.personalEmail}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block font-medium">Teléfono:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="code" className="block font-medium">Código:</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={user.code}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                    <Link to={`/teacher/profile-teacher`} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                        Volver
                    </Link>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfileTeacher;
