import { useEffect, useState } from "react";
import type { Curso_ins } from "../types/Asignaturas/Asignatura";
import Cookie from "js-cookie";
import type { Estudiante } from "../types/Personas/Estudiante";
import type { Coordinador } from "../types/Personas/Coordinador";
import type { Profesor } from "../types/Personas/Profesor";

function NewCurso() {
    const [curso, setCurso] = useState("");
    const [cursito, setCursito] = useState(new Date().getFullYear());
    const [alumnos, setAlumnos] = useState<string[]>([]);
    const [docentes, setDocentes] = useState<string[]>([]);
    const [idAsignatura, setIdAsignatura] = useState("");
    const [nombreAsignatura, setNombreAsignatura] = useState("");

    const [estudiante, setEstudiante] = useState("");
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [profesor, setProfesor] = useState("");
    const [profesores, setProfesores] = useState<(Coordinador | Profesor)[]>([]);

    const [alumnosError, setAlumnosError] = useState("");
    const [docentesError, setDocentesError] = useState("");

    useEffect(() => {
        const getPersonas = async () => {
            const auth = Cookie.get("authTFG");
            if(auth === undefined){
                window.location.href = "/login";
            }

            const url_persona = `http://gestor-master-interuniv.deno.dev/persona/id?id=${auth}`;
            const response_persona = await fetch(url_persona, {
                method: "GET",
            });

            if(response_persona.status !== 200){
                const error = await response_persona.json();
                alert(error.error);

                window.location.href = "/login";
            }

            const data_persona = await response_persona.json();

            if(data_persona.rol !== "Administrativo"){
                alert("Tienes que ser un administrativo para dar de alta una titulación");

                window.location.href = "/login";
            }
            
            const TFG_asig = Cookie.get("TFG_asig");
            if(TFG_asig === undefined){
                window.location.href = "/paginaPersonal";
            }

            const url_asignatura = `http://gestor-master-interuniv.deno.dev/asignatura?id=${TFG_asig}`;
            const response_asignatura = await fetch(url_asignatura, {
                method: "GET",
            });

            if(response_asignatura.status !== 200){
                const error = await response_asignatura.json();
                alert(error.error);
                window.location.href = "/paginaPersonal";
            }
            else{
                const data = await response_asignatura.json();
                setIdAsignatura(data.id);
                setNombreAsignatura(data.nombre);
            }

            const date = new Date();
            setCursito(date.getFullYear());
            setCurso("Curso " + (Number(date.getFullYear())).toString() + "-" + (Number(date.getFullYear()) + 1).toString());

            const id_titulacion = Cookie.get("TFG_titulacion");

            if(id_titulacion === undefined){
                alert("No administras ninguna titulación");

                window.location.href = "/paginaPersonal";
            }

            const url_titulacion = `http://gestor-master-interuniv.deno.dev/titulacion?id=${id_titulacion}`;
            const response_titulacion = await fetch(url_titulacion, {
                method: "GET",
            });

            if(response_titulacion.status !== 200){
                const error = await response_titulacion.json();
                alert(error.error);
                window.location.href = "/paginaPersonal";
            }

            const urlAlumnos = `http://gestor-master-interuniv.deno.dev/personas/alumnos?titulacion=${id_titulacion}`;
            const dataAlumnos = await fetch(urlAlumnos,
                {
                    method: "GET",
                }
            );

            if(dataAlumnos.status !== 200){
                const error = await dataAlumnos.json();
                alert(error.error);
                window.location.href = "/paginaPersonal";
            }
            else{
                const data = await dataAlumnos.json();

                if(data.length === 0){
                    alert("Hay que tener al menos a un alumno dado de alta");
                    window.location.href = "/mostrarTitulaciones";
                }

                setEstudiantes(data);   
            }

            const urlDocentes = `http://gestor-master-interuniv.deno.dev/personas/docentes?titulacion=${id_titulacion}`;
            const dataDocentes = await fetch(urlDocentes,
                {
                    method: "GET",
                }
            );

            if(dataDocentes.status !== 200){
                const error = await dataDocentes.json();
                alert(error.error);
                window.location.href = "/paginaPersonal";
            }
            else{
                const data = await dataDocentes.json();

                if(data.length === 0){
                    alert("Hay que tener al menos a un docente dado de alta");
                    window.location.href = "/mostrarTitulaciones";
                }

                setProfesores(data);
            }
        }

        getPersonas();
    }, []);
    
    const handleReset = () => {
        setCurso("");
        setAlumnos([]);
        setDocentes([]);

        const date = new Date();
        setCursito(date.getFullYear());
        setCurso("Curso " + date.getFullYear().toString() + "-" + (date.getFullYear()+1).toString())

        setEstudiante("");
        setProfesor("");

        setAlumnosError("");
        setDocentesError("");
    }

    const handleCreation = async () => {
        let error_exists = false;

        if(alumnos.length === 0){
            setAlumnosError("Hay que insertar al menos a un alumno");
            error_exists = true;
        }

        if(docentes.length === 0){
            setDocentesError("Hay que insertar al menos a un docente");
            error_exists = true;
        }

        if(error_exists === false){
            const body: Curso_ins = {
                asignatura: idAsignatura,
                curso: curso,
                estudiantes: alumnos,
                profesores: docentes,
            }

            const url = `http://localhost:4000/curso`;
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
            });

            if(response.status !== 200){
                const error = await response.json();
                alert(error.error);
            }

            const data = await response.json();
            alert(data.message);
            window.location.href = "/ShowAsignaturasTitulacion"
        }
    }
    
    return(
        <div className="">
            <form className="newCurso">
                <h1>Registro de un curso</h1>
                <div className="column">
                    <label htmlFor="curso">Curso:</label>
                    <input id="curso" name="curso" defaultValue={cursito} type="number" min={cursito} max={cursito+1} onChange={(e) => {
                        setCurso("Curso " + (Math.trunc(Number(e.currentTarget.value))).toString() + "-" + (Math.trunc(Number(e.currentTarget.value)) + 1).toString());
                    }}/>
                </div>
                <div className="column">
                    <label htmlFor="docentes">Docentes:</label>
                    <div className="add_data">
                        <select id="docentes" name="docentes" onChange={(e) => {
                            setProfesor(e.currentTarget.value);
                        }}>
                            <option key="" value="">Selecciona alumno</option>
                            {
                                profesores.map((profesor) => {
                                    if(profesor.apellido_2 !== null && profesor.apellido_2 !== undefined && profesor.apellido_2.trim() !== ""){
                                        return(
                                            <option key={profesor.id} value={profesor.email}>{profesor.nombre} {profesor.apellido_1} {profesor.apellido_2} ({profesor.email})</option>
                                        )
                                    }
                                    else{
                                        return(
                                            <option key={profesor.id} value={profesor.email}>{profesor.nombre} {profesor.apellido_1} ({profesor.email})</option>
                                        )
                                    }
                                })
                            }
                        </select>
                        <button type="button" onClick={() => {
                            if(profesor.trim() !== ""){
                                const docente_exists = docentes.find((docente) => {
                                    if(docente === profesor){
                                        return docente;
                                    }
                                })

                                if(docente_exists === undefined){
                                    const docentes_aux = docentes;
                                    docentes_aux.push(profesor);
                                    setDocentes(docentes_aux);
                                    setDocentesError("");
                                }
                                else{
                                    alert("Docente ya insertado");
                                }
                            }

                            setProfesor("");
                        }}>Insertar a la lista</button>
                        <button type="button" onClick={() => {
                            setDocentes([]);
                        }}>Vaciar Lista</button>
                    </div>
                    <div className="error">{docentesError}</div>
                </div>
                <div className="column">
                    <label htmlFor="alumnos">Alumnos:</label>
                    <div className="add_data">
                        <select id="alumnos" name="alumnos" onChange={(e) => {
                            setEstudiante(e.currentTarget.value);
                        }}>
                            <option key="" value="">Selecciona alumno</option>
                            {
                                estudiantes.map((alumno) => {
                                    if(alumno.apellido_2 !== null && alumno.apellido_2 !== undefined && alumno.apellido_2.trim() !== ""){
                                        return(
                                            <option key={alumno.id} value={alumno.email}>{alumno.nombre} {alumno.apellido_1} {alumno.apellido_2} ({alumno.email})</option>
                                        )
                                    }
                                    else{
                                        return(
                                            <option key={alumno.id} value={alumno.email}>{alumno.nombre} {alumno.apellido_1} ({alumno.email})</option>
                                        )
                                    }
                                })
                            }
                        </select>
                        <button type="button" onClick={() => {
                            if(estudiante.trim() !== ""){
                                const alumno_exists = alumnos.find((alumno) => {
                                    if(alumno === estudiante){
                                        return alumno;
                                    }
                                })

                                if(alumno_exists === undefined){
                                    const alumnos_aux = alumnos;
                                    alumnos_aux.push(estudiante);
                                    setAlumnos(alumnos_aux);
                                    setAlumnosError("");
                                }
                                else{
                                    alert("Alumno ya insertado");
                                }
                            }

                            setEstudiante("");
                        }}>Insertar a la lista</button>
                        <button type="button" onClick={() => {
                            setAlumnos([]);
                        }}>Vaciar Lista</button>
                    </div>
                    <div className="error">{alumnosError}</div>
                </div>
                <div className="buttons">
                    <button type="button" onClick={() => window.location.href = "/mostrarAsignaturasTitulacion"}>Volver</button>
                    <button type="reset" onClick={handleReset}>Vaciar campos</button>
                    <button type="button" onClick={handleCreation}>Enviar</button>
                </div>
            </form>
            <div>
                <h3>Datos del curso:</h3>
                <div>
                    <p><b>Nombre de la asignatura: </b>{nombreAsignatura}</p>
                </div>
                <div>
                    <p><b>Curso academico: </b>{curso}</p>
                </div>
                {
                    docentes.length !== 0 &&
                    <div>
                        <p><b>Docentes:</b></p>
                        <ul>
                            {
                                docentes.map((docente) => {
                                    const persona = profesores.find((persona) => {
                                        if(persona.email === docente){
                                            return persona;
                                        }
                                    });

                                    if(persona === undefined){
                                        return;
                                    }
                                    
                                    if(persona.apellido_2 !== null && persona.apellido_2 !== undefined && persona.apellido_2.trim() !== ""){
                                        return(
                                            <li key={persona.id} value={persona.id}>{persona.nombre} {persona.apellido_1} {persona.apellido_2} ({persona.email})</li>
                                        )
                                    }
                                    else{
                                        return(
                                            <li key={persona.id} value={persona.id}>{persona.nombre} {persona.apellido_1} ({persona.email})</li>
                                        )
                                    }
                                })
                            }
                        </ul>
                    </div>
                }
                {
                    alumnos.length !== 0 &&
                    <div>
                        <p><b>Alumnos:</b></p>
                        <ul>
                            {
                                alumnos.map((alumno) => {
                                    const persona = estudiantes.find((persona) => {
                                        if(persona.email === alumno){
                                            return persona;
                                        }
                                    });

                                    if(persona === undefined){
                                        return;
                                    }
                                    
                                    if(persona.apellido_2 !== null && persona.apellido_2 !== undefined && persona.apellido_2.trim() !== ""){
                                        return(
                                            <li key={persona.id}>{persona.nombre} {persona.apellido_1} {persona.apellido_2} ({persona.email})</li>
                                        )
                                    }
                                    else{
                                        return(
                                            <li key={persona.id}>{persona.nombre} {persona.apellido_1} ({persona.email})</li>
                                        )
                                    }
                                })
                            }
                        </ul>
                    </div>
                }
            </div>
        </div>
    );
}

export default NewCurso;