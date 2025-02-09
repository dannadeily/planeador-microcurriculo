import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AssignTeacher = () => {
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState({
        course: '',
        teacher: '',
        group: ''
    });

    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const groups = ['A', 'B', 'C', 'D', 'E'];

    useEffect(() => {
        setCourses([
            { id: 1, name: "Matemáticas" },
            { id: 2, name: "Física" },
            { id: 3, name: "Química" }
        ]);
        setTeachers([
            { id: 1, name: "Juan Pérez" },
            { id: 2, name: "María López" },
            { id: 3, name: "Carlos Díaz" }
        ]);
    }, []);

    const handleChange = (e) => {
        setAssignment({ ...assignment, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Asignación creada:", assignment);
        navigate(-1);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
                Asignar Docente a Curso
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-gray-700">Curso</label>
                        <select
                            name="course"
                            value={assignment.course}
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
                            name="teacher"
                            value={assignment.teacher}
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
                        onClick={() => navigate(-1)}
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
