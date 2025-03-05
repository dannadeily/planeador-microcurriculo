import React, { useState, useEffect } from 'react';
import axios from '../../../axios/Axios';
import { useParams, useNavigate } from 'react-router-dom';
import ErrorAlert from '../../../components/alerts/ErrorAlert';
import SuccessAlert from '../../../components/alerts/SuccessAlert';

const EditSemester = () => {
  const { id } = useParams(); // Obtener el id del semestre desde la URL
  const navigate = useNavigate();
  const [semester, setSemester] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [errorAlert, setErrorAlert] = useState({ error: false, message: '' });
  const [successAlert, setSuccessAlert] = useState({ success: false, message: '' });

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get(`semester/id?idSemester=${id}`); // Obtener todos los semestres
        if (response.data) {
          setSemester(response.data);
        } else {
          setErrorAlert({ error: true, message: 'Semestre no encontrado' });
        }
      } catch (error) {
        console.error('Error al obtener los semestres:', error);
        setErrorAlert({ error: true, message: error.response.data });
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, [id]); // Se ejecuta cuando cambia el id en la URL

  const handleChange = (e) => {
    setSemester({ ...semester, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!semester.name || !semester.startDate || !semester.endDate) {
      setErrorAlert({ error: true, message: 'Todos los campos son obligatorios' });
      return;
    }

    try {
      await axios.put(`semester?idSemester=${id}`, semester);
      setSuccessAlert({ success: true, message: 'Datos actualizados correctamente' });
      setTimeout(() => {
        navigate('/director/list-semester');
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar el semestre:', error);
      setErrorAlert({ error: true, message: error.response.data });
      setTimeout(() => {
        setErrorAlert({ error: false, message: '' });
      }, 3000);
       
    }
  };

  if (loading) {
    return <div className="text-center text-gray-700">Cargando...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Editar Semestre
      </h2>

      {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
      {successAlert.success && <SuccessAlert message={successAlert.message} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-gray-700">Nombre del Semestre</label>
            <input
              type="text"
              name="name"
              placeholder="Nombre del Semestre"
              value={semester.name}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
              required
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              name="startDate"
              value={semester.startDate}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
              required
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700">Fecha de Fin</label>
            <input
              type="date"
              name="endDate"
              value={semester.endDate}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/director/list-semester')}
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

export default EditSemester;
