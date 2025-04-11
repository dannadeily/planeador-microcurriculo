import React, { useState, useEffect } from 'react';
import axios from '../../../axios/Axios';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

const GenerateReport = () => {
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const { data } = await axios.get('semester');
        setSemesters(data);
      } catch (error) {
        console.error('Error al cargar semestres', error);
        Swal.fire('Error', 'No se pudo cargar la lista de semestres', 'error');
      }
    };

    fetchSemesters();
  }, []);

  const handleGenerateReport = async (semesterId, semesterName) => {
    try {
      const { data } = await axios.get(`/planner/report?semesterId=${semesterId}`);

      if (!data || data.length === 0) {
        Swal.fire('Sin datos', 'No hay planeadores para este semestre.', 'info');
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
      const pageHeight = 216;
      const pageWidth = 279;
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;

      data.forEach((item, index) => {
        if (index > 0) doc.addPage(); // Nueva página por grupo

        let y = margin;

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(`Reporte de Planeador - ${semesterName}`, pageWidth / 2, y, { align: 'center' });
        y += 10;

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Curso: ${item.courseName}`, margin, y);
        y += 6;
        doc.text(`Docente: ${item.teacherName}`, margin, y);
        y += 6;
        doc.text(`Grupo: ${item.group}`, margin, y);
        y += 6;
        doc.text(`Semestre: ${item.semesterName}`, margin, y);
        y += 6;
        doc.text(`Versión: ${item.versionName}`, margin, y);
        y += 10;

        if (item.columns && item.data) {
          const colChunks = [
            item.columns.slice(0, 5),
            item.columns.slice(5),
          ];

          const dataChunks = [
            item.data.map(row => row.slice(0, 5)),
            item.columns.length > 5 ? item.data.map(row => row.slice(5)) : [],
          ];

          for (let i = 0; i < colChunks.length; i++) {
            if (colChunks[i].length === 0) continue;

            const colCount = colChunks[i].length;
            const colWidth = maxWidth / colCount;

            // Ajustar encabezados
            const headerLines = colChunks[i].map(col =>
              doc.splitTextToSize(col.name, colWidth - 4)
            );
            const uniformHeaderHeight = Math.max(...headerLines.map(lines => lines.length)) * 6;

            if (y + uniformHeaderHeight + 6 > pageHeight - margin) {
              doc.addPage();
              y = margin;
            }

            doc.setFont(undefined, 'bold');
            headerLines.forEach((lines, colIdx) => {
              const x = margin + colIdx * colWidth;

              doc.setFillColor(200, 200, 200);
              doc.rect(x, y, colWidth, uniformHeaderHeight, 'F');
              doc.setDrawColor(0);
              doc.rect(x, y, colWidth, uniformHeaderHeight);

              lines.forEach((line, lIdx) => {
                doc.text(line, x + colWidth / 2, y + 6 * (lIdx + 1) - 2, { align: 'center' });
              });
            });

            y += uniformHeaderHeight;
            doc.setFont(undefined, 'normal');

            dataChunks[i].forEach((row) => {
              const cellInfo = row.map((cell, colIdx) => {
                const text = doc.splitTextToSize(String(cell), colWidth - 4);
                return { lines: text, height: text.length * 6 };
              });

              const rowHeight = Math.max(...cellInfo.map(c => c.height));

              if (y + rowHeight > pageHeight - margin) {
                doc.addPage();
                y = margin;
              }

              cellInfo.forEach((cell, colIdx) => {
                const x = margin + colIdx * colWidth;

                doc.rect(x, y, colWidth, rowHeight);

                cell.lines.forEach((line, lIdx) => {
                  doc.text(line, x + 2, y + 6 * (lIdx + 1) - 2);
                });
              });

              y += rowHeight;
            });

            y += 10;
          }
        }
      });

      doc.save(`Reporte_${semesterName}.pdf`);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      Swal.fire('Error', 'No se pudo generar el reporte', 'error');
    }
  };



  return (
    <div>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md md:p-8 lg:max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center uppercase border-b-2 border-red-500 shadow-md">
          Generar Reporte
        </h2>
        <p className="mb-6 text-center">
          Aquí puede descargar los reportes correspondientes a cada semestre.
        </p>

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
      </div>
    </div>
  );
};

export default GenerateReport;
