import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../../axios/Axios';
import ErrorAlert from '../../components/alerts/ErrorAlert';
import SuccessAlert from '../../components/alerts/SuccessAlert';

const AssignTeacher = () => {
    const navigate = useNavigate();

    const initialState = {
        courseId: "",
        teacherId: "",
        semesterId: "",
        group: ""
    };

    const [assignment, setAssignment] = useState(initialState);
    const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
    const [successAlert, setSuccessAlert] = useState({ success: false, message: "" });
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [groups, setGroups] = useState(["A", "B", "C", "D", "E"]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesRes = await Axios.get('course');
                const teachersRes = await Axios.get('user/list?profileType=TEACHER');
                const semesterRes = await Axios.get('semester/active');

                setCourses(coursesRes.data);
                setTeachers(teachersRes.data);

                setAssignment(prevState => ({
                    ...prevState,
                    semesterId: semesterRes.data.id
                }));
            } catch (error) {
                setErrorAlert({ error: true, message: error.response?.data || "Error al obtener cursos y docentes" });
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setAssignment(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const validateForm = () => {
        if (!assignment.courseId || !assignment.teacherId || !assignment.group || !assignment.semesterId) {
            setErrorAlert({ error: true, message: "Todos los campos son obligatorios." });
            setTimeout(() => setErrorAlert({ error: false, message: "" }), 5000);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await Axios.post("/assignment", assignment);
            if (res.status === 200) {
                setSuccessAlert({ success: true, message: res.data.message || "Asignación creada exitosamente" });
                setAssignment(prevState => ({ ...initialState, semesterId: prevState.semesterId }));
            }
            setTimeout(() => {
                navigate('/director');
            }, 2000);
        } catch (error) {
            setErrorAlert({ error: true, message: error.response?.data || "Error al asignar docente" });
        }

        setTimeout(() => {
            setErrorAlert({ error: false, message: "" });
            setSuccessAlert({ success: false, message: "" });
        }, 5000);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                Asignar Docente a Curso
            </h2>
            {errorAlert.error && <ErrorAlert message={errorAlert.message} />}
            {successAlert.success && <SuccessAlert message={successAlert.message} />}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-gray-700">Curso</label>
                        <select
                            name="courseId"
                            value={assignment.courseId}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-md border-gray-300"
                        >
                            <option value="">Seleccione un curso</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700">Docente</label>
                        <select
                            name="teacherId"
                            value={assignment.teacherId}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-md border-gray-300"
                        >
                            <option value="">Seleccione un docente</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700">Grupo</label>
                        <select
                            name="group"
                            value={assignment.group}
                            onChange={handleChange}
                            className="border p-3 w-full rounded-md border-gray-300"
                        >
                            <option value="">Seleccione un grupo</option>
                            {groups.map((group, index) => (
                                <option key={index} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate("/director")}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                    >
                        Asignar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssignTeacher;
