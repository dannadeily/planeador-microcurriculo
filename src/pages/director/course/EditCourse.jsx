import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../axios/Axios';
import ErrorAlert from '../../../components/alerts/ErrorAlert';
import SuccessAlert from '../../../components/alerts/SuccessAlert';


const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    name: '',
    description: '',
    code: '',

  });

  const [loading, setLoading] = useState(true);
  const [errorAlert, setErrorAlert] = useState({ error: false, message: '' });
  const [successAlert, setSuccessAlert] = useState({ success: false, message: '' });


  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get('course'); // Obtener todos los cursos
        console.log('cursos', response.data);
        const foundCourse = response.data.find(cou => cou.id.toString() === id); // Filtrar por ID

        if (foundCourse) {
          setCourse({
            name: foundCourse.name,
            description: foundCourse.description,
            code: foundCourse.code,
          });
        } else {
          setErrorAlert({ error: true, message: 'Curso no encontrado' });
        }
      } catch (error) {
        console.error('Error al obtener los semestres:', error);
        setErrorAlert({ error: true, message: error.response.data });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]); // Se ejecuta cuando cambia el id en la URL

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCourse((prevState) => ({
      ...prevState,
      [name]: value.toString(), // Convierte cualquier entrada en string
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.name) {
      setErrorAlert({ error: true, message: 'Todos los campos son obligatorios' });
      return;
    }

    try {
      await axios.put(`course?idCourse=${id}`, course);

      setSuccessAlert({ success: true, message: 'Datos actualizados correctamente' });
      setTimeout(() => {
        navigate('/director/list-course');
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
      setErrorAlert({ error: true, message: error.response.data });
    }
  };

  if (loading) {
    return <div className="text-center text-gray-700">Cargando...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
        Editar Curso
      </h2>
      {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
      {successAlert.success && <SuccessAlert message={successAlert.message} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nombre del Curso</label>
          <input type="text" name="name" value={course.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label className="block text-gray-700">Descripción</label>
          <textarea name="description" value={course.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" rows="4" ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Código del Curso</label>
          <input type="text" name="code" value={course.code} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>


        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/director/list-course')} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700">Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
