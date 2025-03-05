import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../axios/Axios';
import ErrorAlert from '../../../components/alerts/ErrorAlert';
import SuccessAlert from '../../../components/alerts/SuccessAlert';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    courseName: '',
    description: '',
    code: '',
    fileContent: '',
    fileType: '',
  });

  const [loading, setLoading] = useState(true);
  const [errorAlert, setErrorAlert] = useState({ error: false, message: '' });
  const [successAlert, setSuccessAlert] = useState({ success: false, message: '' });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`course/id?idCourse=${id}`);
        setCourse({
          courseName: response.data.name,
          description: response.data.description,
          code: response.data.code,

        });

        // Solo agregar archivo si se ha subido uno nuevo
        if (course.fileContent && course.fileType) {
          payload.fileContent = course.fileContent;
          payload.fileType = course.fileType;
        }
      } catch (error) {
        console.error('Error al obtener el curso:', error);
        setErrorAlert({ error: true, message: error.response?.data || 'Error al obtener datos' });
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const allowedTypes = {
        "application/pdf": "pdf",
        "application/msword": "word",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
      };
  
      if (allowedTypes[file.type]) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setCourse((prev) => ({
            ...prev,
            fileContent: reader.result,
            fileType: allowedTypes[file.type], // "pdf" o "word"
          }));
        };
      } else {
        alert("Solo se permiten archivos PDF o Word (.doc, .docx)");
        e.target.value = ""; // Limpiar el input
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.courseName) {
      setErrorAlert({ error: true, message: 'Todos los campos son obligatorios' });
      return;
    }

    try {
      const payload = {
        courseName: course.courseName,
        description: course.description,
        code: course.code,
        fileContent: course.fileContent,
        fileType: course.fileType,
      };

      const response = await axios.put(`course?idCourse=${id}`, payload);
      console.log('Respuesta del servidor:', response.data);
      setSuccessAlert({ success: true, message: 'Datos actualizados correctamente' });

      setTimeout(() => {
        navigate('/director/list-course');
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
      setErrorAlert({ error: true, message: error.response?.data || 'Error desconocido' });
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
          <input type="text" name="courseName" value={course.courseName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label className="block text-gray-700">Descripción</label>
          <textarea name="description" value={course.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" rows="4"></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Código del Curso</label>
          <input type="text" name="code" value={course.code} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block font-medium mb-2">Cargar Archivo (Opcional):</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md p-2"
          />
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
