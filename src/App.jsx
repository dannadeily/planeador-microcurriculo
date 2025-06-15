import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// Página principal
import Header from './components/header/Header'
import Login from './pages/Login'

// Director
import CreateUser from './pages/director/user/CreateUser'
import ListDirector from './pages/director/user/ListDirector'
import ListTeacher from './pages/director/user/ListTeacher'
import CreateCourse from './pages/director/course/CreateCourse'
import ListCourse from './pages/director/course/ListCourse'
import EditCourse from './pages/director/course/EditCourse'
import CreateSemester from './pages/director/semester/CreateSemester'
import ListSemester from './pages/director/semester/ListSemester'
import EditSemester from './pages/director/semester/EditSemester'
import ProfileDirector from './pages/director/ProfileDirector'
import UpdateProfileDirector from './pages/director/UpdateProfileDirector'
import DirectorView from './pages/director/DirectorView'
import AssignTeacher from './pages/director/AssignTeacher'
import CreateVersion from './pages/director/planner/CreateVersion'
import ListVersion from './pages/director/planner/ListVersion'
import GenerateReport from './pages/director/planner/GenerateReport'
import SeePlanner from './pages/director/planner/SeePlanner'


// Profesor
import TeacherView from './pages/teacher/TeacherView'
import UpdateProfileTeacher from './pages/teacher/UpdateProfileTeacher'
import ProfileTeacher from './pages/teacher/ProfilerTeacher'
import PlannerTeacher from './pages/teacher/PlannerTeacher'
import PlannerSemesterBefore from './pages/teacher/plannerSemesterBefore'

// Rutas privadas
import PrivateRouteDirector from './layout/PrivateRouteDirector'
import PrivateRouteTeacher from './layout/PrivateRouteTeacher'

// Footer
import Footer from './components/footer/Footer'

// Para director y profesor
import UpdatePassword from './pages/user/UpdatePassword'
import EmailPassword from './pages/EmailPassword'
import RecoverPassword from './pages/RecoverPassword'


// no se encontró
import NotFoundDirector from './components/notFound/NotFoundDirector'
import NotFoundTeacher from './components/notFound/NotFoundTeacher'

// Estilos
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>

            {/* Rutas de la página principal */}
            <Route path="/" element={<Header />}>
              <Route index element={<Login />} />
              <Route path="recover-password" element={<RecoverPassword />} />
              <Route path="email-password" element={<EmailPassword />} />
            </Route>

            {/* Rutas del director */}
            <Route path="director" element={<PrivateRouteDirector />}>
              <Route index element={<DirectorView />} />
              <Route path="assign-teacher" element={<AssignTeacher />} />
              <Route path="create-user" element={<CreateUser />} />
              <Route path="list-director" element={<ListDirector />} />
              <Route path="list-teacher" element={<ListTeacher />} />
              <Route path="create-course" element={<CreateCourse />} />
              <Route path="list-course" element={<ListCourse />} />
              <Route path="edit-course/:id" element={<EditCourse />} />
              <Route path="create-semester" element={<CreateSemester />} />
              <Route path="list-semester" element={<ListSemester />} />
              <Route path="edit-semester/:id" element={<EditSemester />} />
              <Route path="profile-director" element={<ProfileDirector />} />
              <Route path="profile-director/update-profile-director" element={<UpdateProfileDirector />} />
              <Route path="update-password" element={<UpdatePassword />} />
              <Route path='create-version' element={<CreateVersion />} />
              <Route path='list-version' element={<ListVersion />} />
              <Route path='generate-report' element={<GenerateReport />} />
              <Route path='see-planner/:assignmentId' element={<SeePlanner />} />
              <Route path="*" element={<NotFoundDirector />} />
            </Route>

            {/* Rutas del profesor */}
            <Route path="teacher" element={<PrivateRouteTeacher />}>
              <Route index element={<TeacherView />} />
              <Route path="profile-teacher" element={<ProfileTeacher />} />
              <Route path="profile-teacher/update-profile-teacher" element={<UpdateProfileTeacher />} />
              <Route path="update-password" element={<UpdatePassword />} />
              <Route path='planner-teacher/:courseId' element={<PlannerTeacher />} />
              <Route path='planner-semester-before/:courseId' element={<PlannerSemesterBefore />} />
              <Route path="*" element={<NotFoundTeacher />}
              />
            </Route>

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
