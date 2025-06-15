import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../axios/Axios";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import SuccessAlert from "../../components/alerts/SuccessAlert";
import { Listbox } from "@headlessui/react";

const groupsList = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const GroupSelect = ({ selected, onChange }) => (
  <div>
    <label className="block text-gray-700">Grupo</label>
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="border p-3 w-full rounded-md border-gray-300 text-left">
          {selected || "Seleccione un grupo"}
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {groupsList.map((group, index) => (
            <Listbox.Option
              key={index}
              value={group}
              className={({ active }) =>
                `cursor-pointer select-none p-2 ${
                  active ? "bg-red-100 text-red-700" : ""
                }`
              }
            >
              {group}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  </div>
);

const AssignTeacher = () => {
  const navigate = useNavigate();

  const initialState = {
    courseId: "",
    teacherId: "",
    semesterId: "",
    group: "",
    plannerVersionId: "",
  };

  const [assignment, setAssignment] = useState(initialState);
  const [errorAlert, setErrorAlert] = useState({ error: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({
    success: false,
    message: "",
  });
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [defaultVersion, setDefaultVersion] = useState(null);
  const [otherVersions, setOtherVersions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, teachersRes, semesterRes, versionsRes] =
          await Promise.all([
            Axios.get("course"),
            Axios.get("user/list?profileType=TEACHER"),
            Axios.get("semester/active"),
            Axios.get("version/list"),
          ]);

        setCourses(coursesRes.data);
        setTeachers(teachersRes.data);

        const activeSemesterId = semesterRes.data.id;
        const versions = versionsRes.data;

        const defaultVer = versions.find((v) => v.defaultVersion);
        const otherVers = versions.filter((v) => !v.defaultVersion);

        setDefaultVersion(defaultVer);
        setOtherVersions(otherVers);

        setAssignment((prev) => ({
          ...prev,
          semesterId: activeSemesterId,
          plannerVersionId: defaultVer?.id || "",
        }));
      } catch (error) {
        setErrorAlert({
          error: true,
          message:
            error.response?.data || "Error al obtener información inicial",
        });
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setAssignment((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (
      !assignment.courseId ||
      !assignment.teacherId ||
      !assignment.group ||
      !assignment.semesterId ||
      !assignment.plannerVersionId
    ) {
      setErrorAlert({
        error: true,
        message: "Todos los campos son obligatorios.",
      });
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
        setSuccessAlert({
          success: true,
          message: res.data.message || "Asignación creada exitosamente",
        });
        setAssignment((prevState) => ({
          ...initialState,
          semesterId: prevState.semesterId,
          plannerVersionId: defaultVersion?.id || "",
        }));
      }
      setTimeout(() => {
        navigate("/director");
      }, 2000);
    } catch (error) {
      setErrorAlert({
        error: true,
        message: error.response?.data || "Error al asignar docente",
      });
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
      {successAlert.success && (
        <SuccessAlert message={successAlert.message} />
      )}
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
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
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
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          {/* 👇 Grupo personalizado con scroll limitado */}
          <GroupSelect
            selected={assignment.group}
            onChange={(value) =>
              setAssignment((prev) => ({ ...prev, group: value }))
            }
          />

          <div>
            <label className="block text-gray-700">
              Versión del Planeador
            </label>
            <select
              name="plannerVersionId"
              value={assignment.plannerVersionId}
              onChange={handleChange}
              className="border p-3 w-full rounded-md border-gray-300"
            >
              {[defaultVersion, ...otherVersions]
                .filter(Boolean)
                .map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.versionName}{" "}
                    {version.defaultVersion ? "(por defecto)" : ""}
                  </option>
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
