import React, { useState, useEffect, useRef } from "react";
import Axios from "../../axios/Axios";
import {
    FaBars,
    FaUser,
    FaTimes,
    FaUserCircle,
    FaSignOutAlt,
    FaCalendarDay,
    FaBookOpen,
    FaBook,
} from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";

const HeaderDirector = () => {
    const [activeSemester, setActiveSemester] = useState({
        id: "",
        name: "",
        startDate: "",
        endDate: "",
    });
    const [userName, setUserName] = useState(""); // 👈 nombre del usuario
    const [activeMenu, setActiveMenu] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const mobileMenuRef = useRef(null);
    const userMenuRef = useRef(null);
    const subMenuRef = useRef(null);

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // 🔹 Obtener datos del semestre activo
    useEffect(() => {
        const fetchActiveSemester = async () => {
            try {
                const response = await Axios.get("semester/active");
                const { id, name, startDate, endDate } = response.data || {};
                if (id) {
                    setActiveSemester((prev) =>
                        prev.id !== id ? { id, name, startDate, endDate } : prev
                    );
                } else {
                    setActiveSemester({
                        id: "",
                        name: "",
                        startDate: "",
                        endDate: "",
                    });
                }
            } catch (error) {
                console.error("Error al obtener el semestre activo:", error);
                setActiveSemester({
                    id: "",
                    name: "",
                    startDate: "",
                    endDate: "",
                });
            }
        };

        fetchActiveSemester();
        const interval = setInterval(fetchActiveSemester, 30000);
        return () => clearInterval(interval);
    }, []);

    // 🔹 Obtener usuario logueado
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await Axios.get("user");
                setUserName(res.data?.name || "Usuario");
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };
        fetchUser();
    }, []);

    // 🔹 Cierre del menú de usuario si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target) &&
                subMenuRef.current &&
                !subMenuRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
                setActiveMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target) &&
                subMenuRef.current &&
                !subMenuRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
                setActiveMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-red-500 p-5 fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16">
                <h1 className="text-white font-bold text-lg">
                    {activeSemester.name
                        ? `Semestre Activo:  ${activeSemester.name} Fecha Inicio: ${activeSemester.startDate}  Fecha Fin: ${activeSemester.endDate}`
                        : "No Hay Semestre Activo"}
                </h1>

                <div className="flex items-center space-x-4 ">
                 <div className="hidden md:inline text-white flex items-center space-x-2 font-bold uppercase">
                   {userName}
                  </div> 
                    <div
                        ref={userMenuRef}
                        className="relative user-menu-container"
                    >
                        <button
                            className="text-white flex items-center space-x-2"
                            onClick={toggleUserMenu}
                        >
                            <FaUserCircle size={24} />
                        </button>
                        {isUserMenuOpen && (
                            <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg overflow-hidden">
                                <li className="border-b border-gray-300 last:border-none">
                                    <Link
                                        to="Profile-director"
                                        className="block px-4 py-2 hover:bg-gray-200"
                                    >
                                        Perfil
                                    </Link>
                                </li>
                                <li className="last:border-none">
                                    <Link
                                        to="update-password"
                                        className="block px-4 py-2 hover:bg-gray-200"
                                    >
                                        Cambiar Contraseña
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                    <button className="text-white" onClick={handleLogout}>
                        <FaSignOutAlt size={24} />
                    </button>
                    <button
                        className="text-white md:hidden"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? (
                            <FaTimes size={24} />
                        ) : (
                            <FaBars size={24} />
                        )}
                    </button>
                </div>
            </header>
            <nav
                ref={mobileMenuRef}
                className={`bg-red-400 text-white fixed top-16 left-0 w-full z-40 p-2 transition-all duration-300 ${
                    isMobileMenuOpen
                        ? "block"
                        : "hidden md:flex md:justify-center"
                }`}
            >
                <ul
                    className="flex flex-col md:flex-row md:space-x-4 w-full"
                    ref={subMenuRef}
                >
                    <li key="opcion0">
                        <Link
                            to="/director"
                            className="p-2 hover:bg-red-500 flex items-center w-full md:w-auto"
                        >
                            <FaHouseChimney className="mr-2" /> Inicio
                        </Link>
                    </li>
                    {[
                        {
                            key: "opcion1",
                            icon: <FaUser className="mr-2" />,
                            label: "Usuarios",
                            links: [
                                {
                                    name: "Crear Nuevo Usuario",
                                    path: "create-user",
                                },
                                { name: "Ver Docentes", path: "list-teacher" },
                                {
                                    name: "Ver Directores",
                                    path: "list-director",
                                },
                            ],
                        },
                        {
                            key: "opcion2",
                            icon: <FaBookOpen className="mr-2" />,
                            label: "Cursos",
                            links: [
                                {
                                    name: "Crear Nuevo Curso",
                                    path: "create-course",
                                },
                                { name: "Ver Cursos", path: "list-course" },
                            ],
                        },
                        {
                            key: "opcion3",
                            icon: <FaCalendarDay className="mr-2" />,
                            label: "Semestres",
                            links: [
                                {
                                    name: "Crear Nuevo Semestre",
                                    path: "create-semester",
                                },
                                {
                                    name: "Ver Semestres",
                                    path: "list-semester",
                                },
                            ],
                        },
                        {
                            key: "opcion4",
                            icon: <FaBook className="mr-2" />,
                            label: "Planeadores",
                            links: [
                                {
                                    name: "Crear Nueva Versión",
                                    path: "create-version",
                                },
                                { name: "Ver Versiones", path: "list-version" },
                                {
                                    name: "Generar Reporte",
                                    path: "generate-report",
                                },
                            ],
                        },
                    ].map(({ key, icon, label, links }) => (
                        <li key={key} className="relative submenu-container">
                            <button
                                onClick={() => toggleMenu(key)}
                                className="p-2 hover:bg-red-500 flex items-center w-full md:w-auto"
                            >
                                {icon} {label}
                            </button>
                            {activeMenu === key && (
                                <ul className="bg-red-500 p-2 rounded-md shadow-md transition-all duration-300 md:absolute md:left-0 md:w-max md:top-full md:z-50">
                                    {links.map(({ name, path }, index) => (
                                        <li
                                            key={index}
                                            className="border-b border-gray-300 last:border-none"
                                        >
                                            <Link
                                                to={path}
                                                className="block p-2 hover:bg-red-800"
                                            >
                                                {name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="flex-grow p-5 md:mt-20">
                <Outlet />
            </main>
        </div>
    );
};

export default HeaderDirector;
