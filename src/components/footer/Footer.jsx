import React from 'react';
import { FaFacebook, FaInstagram, FaEnvelope, FaGlobe } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-red-600 text-white py-2 w-full fixed bottom-0 left-0 z-40">
            <div className="container mx-auto flex justify-between items-center px-4">
                <p className="text-sm">&copy; {new Date().getFullYear()} UFPS. Todos los derechos reservados.</p>
                <div className="flex space-x-4">
                    
                    <a href="#" className="text-white hover:text-white transition"><FaEnvelope size={20} /></a>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
