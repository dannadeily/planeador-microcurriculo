import React, { useEffect, useState } from 'react';
import axios from '../../axios/Axios';
import { Link, useNavigate } from 'react-router-dom';

const SemesterBefore = () => {
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [coursesBySemester, setCoursesBySemester] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await axios.get('/semester/before');
                setSemesters(response.data);
            } catch (err) {
                setError('Error al obtener los semestres anteriores');
            } finally {
                setLoading(false);
            }
        };
        fetchSemesters();
    }, []);

    const toggleCourses = async (semesterId) => {
        const isExpanded = expanded[semesterId];

        setExpanded((prev) => ({
            ...prev,
            [semesterId]: !isExpanded,
        }));

        if (!isExpanded && !coursesBySemester[semesterId]) {
            try {
                const response = await axios.get(`/assignment/teacher?idSemester=${semesterId}`);
                setCoursesBySemester((prev) => ({
                    ...prev,
                    [semesterId]: response.data,
                }));
            } catch (err) {
                console.error(`Error al cargar cursos para el semestre ${semesterId}`, err);
            }
        }
    };


    if (loading) return <p>Cargando semestres...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {semesters.length > 0 ? (
                <ul>
                    {semesters.map((semester) => (
                        <li key={semester.id} className="mb-4 border-b pb-2">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{semester.name}</span>
                                <button
                                    onClick={() => toggleCourses(semester.id)}
                                    className="text-sm text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
                                >
                                    {expanded[semester.id] ? 'Ocultar cursos' : 'Ver cursos'}
                                </button>
                            </div>

                            {expanded[semester.id] && (
                                <div className="mt-2 ml-4 flex flex-col gap-2">
                                    {coursesBySemester[semester.id]?.length > 0 ? (
                                        coursesBySemester[semester.id].map((course) => (
                                            <Link to={`/teacher/planner-semester-before/${course.id}`} key={`${semester.id}-${course.id}`}>
                                                <button
                                                    className="text-left   px-3 py-1 rounded border"
                                                >
                                                    {course.courseName} - Grupo {course.group}
                                                </button>
                                            </Link>

                                        ))
                                    ) : (
                                        <p>No hay cursos asignados para este semestre.</p>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay semestres anteriores disponibles.</p>
            )}
        </div>
    );
};

export default SemesterBefore;
