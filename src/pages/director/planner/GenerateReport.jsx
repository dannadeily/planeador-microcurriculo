import React, { useState } from 'react';
import axios from '../../../axios/Axios';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

const GenerateReport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [semesters, setSemesters] = useState([]);

  const handleOpenModal = async () => {
    try {
      const { data } = await axios.get('semester'); // Ajusta si tu endpoint es distinto
      setSemesters(data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error al cargar semestres', error);
      Swal.fire('Error', 'No se pudo cargar la lista de semestres', 'error');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleGenerateReport = async (semesterId, semesterName) => {
    try {
      const { data } = await axios.get(`/planner/report?semesterId=${semesterId}`);

      if (!data || data.length === 0) {
        Swal.fire('Sin datos', 'No hay planeadores para este semestre.', 'info');
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Reporte de Planeadores - ${semesterName}`, 10, 20);

      let y = 30;
      data.forEach((item, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. Curso: ${item.courseName}`, 10, y);
        doc.text(`Docente: ${item.teacherName}`, 10, y + 6);
        doc.text(`Grupo: ${item.group}`, 10, y + 12);
        y += 25;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      doc.save(`Reporte_${semesterName}.pdf`);
      setModalOpen(false);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      Swal.fire('Error', 'No se pudo generar el reporte', 'error');
    }
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generar reporte
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Selecciona un semestre</h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {semesters.map((semester) => (
                <li
                  key={semester.id}
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => handleGenerateReport(semester.id, semester.name)}
                >
                  {semester.name}
                </li>
              ))}
            </ul>
            <button
              onClick={handleCloseModal}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;

