import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './Forms/Login.tsx';
import NewAsignatura from './Forms/NewAsignatura.tsx';
import NewCurso from './Forms/NewCurso.tsx';
import NewNotas from './Forms/NewNotas.tsx';
import NewPersona from './Forms/NewPersona.tsx';
import NewTFM from './Forms/NewTFM.tsx';
import NewTitulacion from './Forms/NewTitulacion.tsx';
import UpdateUser from './Forms/UpdateUser.tsx';
import AsignaturaDocentePage from './Pages/AsignaturaDocentePage.tsx';
import AsignaturaTitulacionPage from './Pages/AsignaturaTitulacionPage.tsx';
import CursoPage from './Pages/CursoPage.tsx';
import ShowAsignaturasImpartidas from './Pages/ShowAsignaturasImpartidas.tsx';
import ShowAsignaturasTitulacion from './Pages/ShowAsignaturasTitulacion.tsx';
import ShowCursos from './Pages/ShowCursos.tsx';
import ShowTitulaciones from './Pages/ShowTitulaciones.tsx';
import TitulacionPage from './Pages/TitulacionPage.tsx';
import UserPage from './Pages/UserPage.tsx';

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
            /*
              <Route path="registroAdmin" element={<Register/>}/>
            */
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
