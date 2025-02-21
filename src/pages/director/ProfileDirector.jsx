import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios/Axios';

const ProfileDirector = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    personalEmail: '',
    phone: '',
    code: ''
  });

  // Función para decodificar el token
  const decodeToken = (token) => {
    const array = token.split(".");
    const payload = JSON.parse(atob(array[1]));
    return payload;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`user`);
        setUser(response.data);
      } catch (error) {
        setErrorAlert({ error: true, message: error.response.data });
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
          onClick={() => navigate(`/director/profile-director/update-profile-director`)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
        >
          Editar Datos
        </button>
      </div>
    </div>
  );
};

export default ProfileDirector;
