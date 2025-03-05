import React, { useState, useEffect, useRef } from "react";
import Axios from "../../axios/Axios";
import { FaBars, FaUserCircle, FaSignOutAlt, FaBookOpen } from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import SemesterBefore from "../../pages/teacher/SemesterBefore";

const HeaderTeacher = () => {
  // Estado para el semestre activo
  const [activeSemester, setActiveSemester] = useState({ id: "", name: "", startDate: "", endDate: "" });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Referencias para detectar clics fuera
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Cierra el menú móvil al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchActiveSemester = async () => {
      try {
        const response = await Axios.get("semester/active");

        if (response.data && response.data.id) {
          const { id, name, startDate, endDate } = response.data;
          setActiveSemester((prev) =>
            prev.id !== id ? { id, name, startDate, endDate } : prev
          );
        } else {
          // Si no hay semestre activo, actualizar el estado
          setActiveSemester({ id: "", name: "", startDate: "", endDate: "" });
        }
      } catch (error) {
        console.error("Error al obtener el semestre activo:", error);
        setActiveSemester({ id: "", name: "", startDate: "", endDate: "" }); // Reiniciar en caso de error
      }
    };

    fetchActiveSemester();
    const interval = setInterval(fetchActiveSemester, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-red-500 p-5 fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16">
        <h1 className="text-white font-bold text-lg">
          {activeSemester.name ? `Semestre Activo:  ${activeSemester.name} Fecha Inicio: ${activeSemester.startDate}  Fecha Fin: ${activeSemester.endDate}` : "No Hay Semestre Activo"}
        </h1>
        <div className="flex items-center space-x-4">
          {/* Menú Usuario */}
          <div className="relative" ref={userMenuRef}>
            <button className="text-white flex items-center" onClick={toggleUserMenu}>
              <FaUserCircle size={24} />
            </button>
            {isUserMenuOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg">
                <li><Link to="profile-teacher" className="block px-4 py-2 hover:bg-gray-200">Perfil</Link></li>
                <li><Link to="update-password" className="block px-4 py-2 hover:bg-gray-200">Cambiar Contraseña</Link></li>
              </ul>
            )}
          </div>
          {/* Cerrar sesión */}
          <button className="text-white" onClick={handleLogout}><FaSignOutAlt size={24} /></button>
          {/* Menú móvil */}
          <button className="text-white md:hidden" onClick={toggleMobileMenu}><FaBars size={24} /></button>
        </div>
      </header>

      {/* Sidebar Semestres */}
      <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-red-500 text-white transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-40`}>
        <div className="flex justify-between items-center p-4">
          <button onClick={toggleSidebar} className="absolute top-4 right-4 text-white">
            ✖
          </button>
        </div>
        <ul className="mt-4 space-y-4 p-4">
          <li>
            <SemesterBefore />
          </li>
        </ul>
      </div>

      {/* Menú de Navegación */}
      <nav ref={mobileMenuRef} className={`bg-red-400 text-white fixed top-16 left-0 w-full z-40 p-2 transition-all duration-300 ${isMobileMenuOpen ? "block" : "hidden md:flex md:justify-center"}`}>
        <ul className="flex flex-col md:flex-row md:space-x-4 w-full">
          <li><Link to="/teacher" className="p-2 hover:bg-red-500 flex items-center w-full md:w-auto"><FaHouseChimney className="mr-2" /> Inicio</Link></li>
          <li>
            <button onClick={toggleSidebar} className="p-2 hover:bg-red-500 flex items-center w-full md:w-auto">
              <FaBookOpen className="mr-2" /> Semestres Anteriores
            </button>
          </li>
        </ul>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-grow p-5 md:mt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default HeaderTeacher;
