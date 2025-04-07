import React, { useEffect, useState } from 'react';
import axios from '../../axios/Axios';
import { Link } from 'react-router-dom';

const SemesterBefore = () => {
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <p>Cargando semestres...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>

            {semesters.length > 0 ? (
                <ul>
                    {semesters.map((semester) => (
                        <li key={semester.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                            <Link to="planner-semester-before" className="text-blue-500 hover:underline">
                                {semester.name}
                            </Link>

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