import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

//Pagina principal
import Header from './components/header/Header'
import Login from './pages/Login'


//Director
import HeaderDirector from './components/header/HeaderDirector'
import CreateUser from './pages/director/user/CreateUser'
import ListDirector from './pages/director/user/ListDirector'
import ListTeacher from './pages/director/user/ListTeacher'
import EditUser from './pages/director/user/EditUser'
import CreateCourse from './pages/director/course/CreateCourse'
import ListCourse from './pages/director/course/ListCourse'
import EditCourse from './pages/director/course/EditCourse'
import CreateSemester from './pages/director/semester/CreateSemester'
import ListSemester from './pages/director/semester/ListSemester'
import EditSemester from './pages/director/semester/EditSemester'
import ProfileDirector from './pages/director/ProfileDirector'
import UpdateProfile from './pages/director/UpdateProfile'
import DirectorView from './pages/director/DirectorView'

//Profesor
import HeaderTeacher from './components/header/HeaderTeacher'

//Footer
import Footer from './components/footer/Footer'

//para director y profesor
import UpdatePassword from './pages/UpdatePassword'

//Estilos
import './App.css'




function App() {


  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
          //Rutas de la pagina principal
              <Route path="/" element={<Header />} >
                <Route index element={<Login />} />

              </Route>

          //Rutas del director
              <Route path='director' element={<HeaderDirector />} >
                <Route index element={<DirectorView />} />
                <Route path='create-user' element={<CreateUser />} />
                <Route path='list-director' element={<ListDirector />} />
                <Route path='list-teacher' element={<ListTeacher />} />
                <Route path='edit-user/:id' element={<EditUser />} />
                <Route path='create-course' element={<CreateCourse />} />
                <Route path='list-course' element={<ListCourse />} />
                <Route path='edit-course/:id' element={<EditCourse />} />
                <Route path='create-semester' element={<CreateSemester />} />
                <Route path='list-semester' element={<ListSemester />} />
                <Route path='edit-semester/:id' element={<EditSemester />} />
                <Route path='profile-director' element={<ProfileDirector />} />
                <Route path='update-profile-director' element={<UpdateProfile />} />
                <Route path='update-password' element={<UpdatePassword />} />
              </Route>


          //Rutas del profesor
              <Route>
                <Route path='teacher' element={<HeaderTeacher />} />

              </Route>



            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App
