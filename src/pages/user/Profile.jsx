import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios/Axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    personalEmail: '',
    phone: '',
    code: '',
    role: ''  // Nuevo estado para almacenar el rol
  });

  // Función para obtener el rol desde el token
  const getRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const array = token.split(".");
      const payload = JSON.parse(atob(array[1]));
      return payload.role;  // Ajusta esto según cómo se almacene el rol en tu token
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`user`);
        setUser({ ...response.data, role: getRoleFromToken() }); // Agrega el rol al estado
      } catch (error) {
        console.error('Error al obtener los datos del usuario', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Datos del Perfil
      </h2>
      <div className="space-y-4">
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Correo Personal:</strong> {user.personalEmail}</p>
        <p><strong>Teléfono:</strong> {user.phone}</p>
        <p><strong>Código:</strong> {user.code}</p>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => navigate(`/${user.role}/update-profile`)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
        >
          Editar Datos
        </button>
      </div>
    </div>
  );
};

export default Profile;
