import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import axios from '../../axios/Axios';
import ErrorAlert from '../../components/alerts/ErrorAlert';
import SuccessAlert from '../../components/alerts/SuccessAlert';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        actualPassword: '',
        newPassword: '',
        newPasswordConfirmation: ''
    });
    const [showPassword, setShowPassword] = useState({
        actualPassword: false,
        newPassword: false,
        newPasswordConfirmation: false
    });
    const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
    const [successAlert, setSuccessAlert] = useState({ success: false, message: "" });

    const toggleShowPassword = (field) => {
        setShowPassword(prevState => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorAlert({ error: false, message: "" });
        setSuccessAlert({ success: false, message: "" });

        if (passwords.newPassword !== passwords.newPasswordConfirmation) {
            setErrorAlert({ error: true, message: "Las contraseñas nuevas no coinciden" });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'user/password',
                {
                    actualPassword: passwords.actualPassword,
                    newPassword: passwords.newPassword,
                    newPasswordConfirmation: passwords.newPasswordConfirmation
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccessAlert({ success: true, message: "Contraseña actualizada exitosamente" });
            setPasswords({ actualPassword: '', newPassword: '', newPasswordConfirmation: '' });

            setTimeout(() => {
                navigate("/teacher");
            }, 3000);
        } catch (error) {
            setErrorAlert({
                error: true,
                message: error.response?.data || "Error al actualizar la contraseña"
            });
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                Cambiar Contraseña
            </h2>

            {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
            {successAlert.success && <SuccessAlert message={successAlert.message} />}

            <form onSubmit={handleSubmit} className="space-y-6">
                {['actualPassword', 'newPassword', 'newPasswordConfirmation'].map((field, index) => (
                    <div key={index} className="relative">
                        <label className="block text-gray-700">
                            {field === 'actualPassword' ? 'Contraseña Actual' : field === 'newPassword' ? 'Nueva Contraseña' : 'Repetir Contraseña'}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword[field] ? 'text' : 'password'}
                                name={field}
                                value={passwords[field]}
                                onChange={handleChange}
                                className="border p-3 w-full rounded-md border-gray-300 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => toggleShowPassword(field)}
                                className="absolute inset-y-0 right-3 flex items-center"
                            >
                                {showPassword[field] ? <FaEyeSlash size={20} /> : <IoEyeSharp size={20} />}
                            </button>
                        </div>
                    </div>
                ))}

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate("/teacher")}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePassword;
