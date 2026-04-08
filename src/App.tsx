import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './Forms/Login'
import NewPersona from './Forms/NewPersona'
import NewTitulacion from './Forms/NewTitulacion'
import NewAsignatura from './Forms/NewAsignatura'
import NewCurso from './Forms/NewCurso'
import NewTFM from './Forms/NewTFM'
import UserPage from './Pages/UserPage'
import UpdateUser from './Forms/UpdateUser'
import ShowTitulaciones from './Pages/ShowTitulaciones'
import ShowAsignaturasTitulacion from './Pages/ShowAsignaturasTitulacion'
import ShowAsignaturasImpartidas from './Pages/ShowAsignaturasImpartidas'
import ShowCursos from './Pages/ShowCursos'
import TitulacionPage from './Pages/TitulacionPage'
import CursoPage from './Pages/CursoPage'
import AsignaturaTitulacionPage from './Pages/AsignaturaTitulacionPage'
import AsignaturaDocentePage from './Pages/AsignaturaDocentePage'
import NewNotas from './Forms/NewNotas'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="registrarPersona" element={<NewPersona/>}/>
          <Route path="nuevaTitulacion" element={<NewTitulacion/>}/>
          <Route path="nuevaAsignatura" element={<NewAsignatura/>}/>
          <Route path="nuevoCurso" element={<NewCurso/>}/>
          <Route path="nuevoTFM" element={<NewTFM/>}/>
          <Route path="calificarAsignatura" element={<NewNotas/>}/>
          <Route path="paginaPersonal" element={<UserPage/>}/>
          <Route path="paginaTitulacion" element={<TitulacionPage/>}/>
          <Route path="paginaAsignaturaTitulacion" element={<AsignaturaTitulacionPage/>}/>
          <Route path="paginaAsignatura" element={<AsignaturaDocentePage/>}/>
          <Route path="paginaCurso" element={<CursoPage/>}/>
          <Route path="actualizarDatosPersonales" element={<UpdateUser/>}/>
          {
            /*<Route path="registroAdmin" element={<Register/>}/>*/
          }
          <Route path="mostrarTitulaciones" element={<ShowTitulaciones/>}/>
          <Route path="mostrarAsignaturasTitulacion" element={<ShowAsignaturasTitulacion/>}/>
          <Route path="mostrarAsignaturas" element={<ShowAsignaturasImpartidas/>}/>
          <Route path="mostrarCursos" element={<ShowCursos/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
