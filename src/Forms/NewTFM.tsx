import { useEffect, useState } from "react";
import type { Estudiante_Short } from "../types/Personas/Estudiante";
import type { Profesor_Short } from "../types/Personas/Profesor";
import type { Coordinador_Short } from "../types/Personas/Coordinador";
import type { TFM_ins } from "../types/Asignaturas/TFM";
import Cookie from "js-cookie";

function NewTFM() {
    const [nombre, setNombre] = useState("");
    const [estudiante, setEstudiante] = useState("");
    const [director, setDirector] = useState("");
    const [directores, setDirectores] = useState<string[]>([]);
    const [miembro, setMiembro] = useState("");
    const [miembrosTribunal, setTribunal] = useState<string[]>([]);
    const [convocatoria, setConvocatoria] = useState("Ordinaria");
    const [nota, setNota] = useState<string | number>("Sin calificar");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("12:00");
    const [curso, setCurso] = useState(0);
    const [year, setYear] = useState(0);
    const [titulacion, setTitulacion] = useState("");

    const [showNota, setShow] = useState(false);
    const [alumnos, setAlumnos] = useState<Estudiante_Short[]>([]);
    const [docentes, setDocentes] = useState<(Profesor_Short | Coordinador_Short)[]>([]);

    const [nombreError, setNombreError] = useState("");
    const [estudianteError, setEstudianteError] = useState("");
    const [directoresError, setDirectoresError] = useState("");
    const [tribunalError, setTribunalError] = useState("");
    const [calificacionError, setCalificacionError] = useState("");

    useEffect(() => {
        const getPersonas = async () => {
           const auth = Cookie.get("authTFG");
            if(auth === undefined){
                window.location.href = "/login";
            }
            
            const url_persona = `http://localhost:4000/persona/id?id=${auth}`;
            const response_persona = await fetch(url_persona, {
                method: "GET",
            });

            if(response_persona.status !== 200){
                const error = await response_persona.json();
                alert(error.error);

                window.location.href = "/login";
            }

            const data_persona = await response_persona.json();

            if(data_persona.rol !== "Coordinador"){
                alert("Tienes que ser un coordinador para registrar un TFM");

                window.location.href = "/login";
            }

            const TFG_titulacion = Cookie.get("TFG_titulacion");

            if(TFG_titulacion === undefined){
                if(data_persona.rol === "Coordinador"){
                    alert("No puedes insertar un TFM");
                }

                window.location.href = "/paginaPersonal";
            }

            const url_titulacion = `http://localhost:4000/titulacion?id=${TFG_titulacion}`;
            const response_titulacion = await fetch(url_titulacion, {
                method: "GET",
            });

            if(response_titulacion.status !== 200){
                const error = await response_titulacion.json();
                alert(error.error);

                window.location.href = "/paginaPersonal";
            }

            const data_titulacion = await response_titulacion.json();
            setTitulacion(data_titulacion.id);

            const docente_exists: (Profesor_Short | Coordinador_Short | undefined) = data_titulacion.docentes.find((docente: (Profesor_Short | Coordinador_Short)) => {
                if(docente.id === auth){
                    return docente;
                }
            });

            if(docente_exists === undefined){
                alert("No eres coordinador en esta titulación");

                window.location.href = "/paginaPersonal";
            }

            const urlAlumnos = `http://gestor-master-interuniv.deno.dev/personas/alumnos?titulacion=${TFG_titulacion}`;
            const urlDocentes = `http://localhost:4000/personas/docentes?titulacion=${TFG_titulacion}`;

            const dataAlumnos = await fetch(urlAlumnos,
                {
                    method: "GET",
                }
            );

            if(dataAlumnos.status !== 200){
                const error = await dataAlumnos.json();
                alert(error.error);
            }
            else{
                const data = await dataAlumnos.json();
                
                if(data.length === 0){
                    alert("Hay que tener al menos a un alumno dado de alta");

                    window.location.href = "/paginaPersonal";
                }
                
                setAlumnos(data);
                setEstudiante(data[0].DNI);
            }

            const dataDcocentes = await fetch(urlDocentes,
                {
                    method: "GET",
                }
            );

            if(dataDcocentes.status !== 200){
                const error = await dataDcocentes.json();
                alert(error.error);
            }
            else{
                const data = await dataDcocentes.json();

                if(data.length === 0){
                    alert("Hay que tener al menos a un docente dado de alta");

                    window.location.href = "/paginaPersonal";
                }

                setDocentes(data);
                setDirector(data[0].id);
                setMiembro(data[0].id);
            }
        }

        getPersonas();
    }, []);

    if(fecha === "" && curso === 0){
        const date = new Date();

        let month;
        let day;

        if(date.getMonth() < 10){

            month = "0" + (date.getMonth()+1).toString();
        }
        else{
            month = date.getMonth().toString();
        }

        if(date.getDate() < 10){
            day = "0" + date.getDate().toString();
        }
        else{
            day = date.getDate().toString();
        }

        const new_date = date.getFullYear().toString() + "-" + month + "-" + day

        setFecha(new_date);
        setCurso(date.getFullYear());
        setYear(date.getFullYear());
    }
    
    const handleReset = () => {
        setNombre("");
        setEstudiante(alumnos[0].DNI);
        setDirector(docentes[0].id)
        setDirectores([]);
        setMiembro(docentes[0].id)
        setTribunal([]);
        setConvocatoria("Ordinaria");
        setNota("Sin calificar");
        setFecha("");
        setCurso(0);
        setHora("12:00");
        setShow(false);

        setNombreError("");
        setEstudianteError("");
        setDirectoresError("");
        setTribunalError("");
        setCalificacionError("");
    }

    const handleCreation = async () => {
        let error_exists = false;

        if(nombre.trim() === ""){
            setNombreError("Hay que rellenar este campo");
            error_exists = true;
        }

        if(estudiante.trim() === ""){
            setEstudianteError("Hay que asignar un alumno al TFM");
            error_exists = true;
        }

        if(directores.length === 0){
            setDirectoresError("El estudiante debe tener al menos a un director");
            error_exists = true;
        }

        if(miembrosTribunal.length === 0){
            setTribunalError("El TFM debe tener miembros en el tribunal de defensa");
            error_exists = true;
        }

        if(nota === "Sin calificar" || (Number(nota) > 10.0 && Number(nota) < 0.0)){
            setCalificacionError("Hay que agregar una calificación");
            error_exists = true;
        }

        if(error_exists === false){
            const data_TFM: TFM_ins = {
                titulacion: titulacion,
                titulo: nombre,
                curso: `Curso ${curso}-${curso+1}`,
                alumno: estudiante,
                director: directores,
                tribunal: miembrosTribunal,
                fecha_def: fecha,
                hora_def: hora,
                convocatoria: convocatoria,
                nota: nota,
            }

            const url = `http://localhost:4000/TFM`;
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data_TFM),
            });

            if(response.status !== 200){
                const error = await response.json();
                alert(error.error);
            }

            const data = await response.json();
            alert(data.message);

            window.location.href = "/paginaPersonal";
        }
    }

    return(
        <div className="grid_group">
            <form className="newTFM">
                <h1>Registro de TFM</h1>
                {
                    /*<div>
                        <p className="message_auto">Autocompletar los campos con un PDF/Excel</p>
                        <input type="file" accept=".pdf, .xlsx"/>
                    </div>*/
                }
                <div className="column">
                    <label htmlFor="titulo">Título:</label>
                    <input type="text" placeholder="Titulo" onChange={(e) => {
                        setNombre(e.currentTarget.value);
                        setNombreError("");
                    }}/>
                    <div className="error">{nombreError}</div>
                </div>
                <div className="column">
                    <label>Alumno:</label>
                    <div className="add_data">
                        {
                            alumnos.length > 0 &&
                            <select defaultValue={alumnos[0].DNI} onChange={(e) => setEstudiante(e.currentTarget.value)}>
                                {
                                    alumnos.map((alumno) => {
                                        return(
                                            <option key={alumno.id} value={alumno.DNI}>{alumno.nombre} {alumno.apellido_1} ({alumno.email})</option>
                                        )
                                    })
                                }
                            </select>
                        }
                    </div>
                    <div className="error">{estudianteError}</div>
                </div>
                <div className="column">
                    <label>Director/es:</label>
                    <div className="add_data">
                        {
                            docentes.length > 0 &&
                            <>
                                <select defaultValue={docentes[0].id} onChange={(e) => setDirector(e.currentTarget.value)}>
                                    {
                                        docentes.map((docente) => {
                                            return(
                                                <option key={docente.id} value={docente.id}>{docente.nombre} {docente.apellido_1} ({docente.email})</option>
                                            )
                                        })
                                    }
                                </select>
                                <button type="button" onClick={() => {
                                    if(director.trim() !== ""){
                                        const docente_exists = directores.find((docente) => {
                                            if(docente === director){
                                                return docente;
                                            }
                                        })

                                        if(docente_exists === undefined){
                                            const directores_aux = directores;
                                            directores_aux.push(director);
                                            setDirectores(directores_aux);
                                            setDirector("");
                                        }
                                        else{
                                            alert("Director ya insertado");
                                        }
                                    }

                                    setDirectoresError("");
                                }}>Insertar a la lista</button>
                            </>   
                        }
                        <button type="button" disabled={directores.length === 0 ? true : false} onClick={() => setDirectores([])}>Reiniciar lista</button>
                    </div>
                    <div className="error">{directoresError}</div>
                </div>
                <div className="column">
                    <label>Miembros del tribunal:</label>
                    <div className="add_data">
                        {
                            docentes.length > 0 &&
                            <>
                                <select defaultValue={docentes[0].id} onChange={(e) => setMiembro(e.currentTarget.value)}>
                                    {
                                        docentes.map((docente) => {
                                            return(
                                                <option key={docente.id} value={docente.id}>{docente.nombre} {docente.apellido_1} ({docente.email})</option>
                                            )
                                        })
                                    }
                                </select>
                                <button type="button" onClick={() => {
                                    if(miembro.trim() !== ""){
                                        const miembro_exists = miembrosTribunal.find((docente) => {
                                            if(docente === miembro){
                                                return docente;
                                            }
                                        })

                                        if(miembro_exists === undefined){
                                            const miembros_aux = miembrosTribunal;
                                            miembros_aux.push(miembro);
                                            setTribunal(miembros_aux);
                                            setMiembro("");
                                        }
                                        else{
                                            alert("Miembro del tribunal ya insertado");
                                        }
                                    }

                                    setTribunalError("");
                                }}>Insertar a la lista</button>
                            </>
                        }
                    <button type="button" disabled={miembrosTribunal.length === 0 ? true : false} onClick={() => setTribunal([])}>Reiniciar lista</button>
                    </div>
                    <div className="error">{tribunalError}</div>
                </div>
                <div className="column">
                    <label>Curso:</label>
                    <input type="number" min={year} max={year+1} value={curso} onChange={(e) => setCurso(Math.trunc(Number(e.currentTarget.value)))}/>
                </div>
                <div className="column">
                    <label htmlFor="convocatoria">Convocatoria</label>
                    <select id="convocatoria" defaultValue="Ordinaria" onChange={(e) => setConvocatoria(e.currentTarget.value)}>
                        <option value="Ordinaria">Ordinaria</option>
                        <option value="Extraordinaria">Extraordinaria</option>
                    </select>
                </div>
                <div className="column">
                    <label htmlFor="fecha">Fecha de la defensa:</label>
                    <input type="date" value={fecha} onChange={(e) => {
                        setFecha(e.currentTarget.value);
                    }}/>
                </div>
                <div className="column">
                    <label htmlFor="hora">Hora de la defensa:</label>
                    <input type="time" name="hora" defaultValue={hora} onChange={(e) => setHora(e.currentTarget.value)}/>
                </div>
                <div className="column">
                    <label htmlFor="calificacion">Nota:</label>
                    <select defaultValue="Sin calificar" onChange={(e) => {
                        if(e.currentTarget.value !== "Calificar con valor numerico"){
                            setNota(e.currentTarget.value);
                            setShow(false);
                        }
                        else{
                            setNota(5);
                            setShow(true);
                        }

                        setCalificacionError("");
                    }}>
                        <option value="No presentado">No presentado</option>
                        <option value="Sin calificar">Sin calificar</option>
                        <option value="Calificar con valor numerico">Calificar</option>
                    </select>
                    {
                        showNota === true &&
                        <>
                            <input name="nota" type="number" defaultValue="5" min="0" max="10" step="0.1" onChange={(e) => {
                                setNota(e.currentTarget.value);

                                setCalificacionError("");
                            }}/>
                        </>
                    }
                    <div className="error">{calificacionError}</div>
                </div>
                <div className="buttons">
                    <button type="reset" onClick={handleReset}>Vaciar campos</button>
                    <button type="button" onClick={handleCreation}>Enviar</button>
                </div>
            </form>
            <div>
                <h3>Datos del TFM:</h3>
                <div>
                    <p><b>Título del TFM: </b>{nombre}</p>
                </div>
                <div>
                    <p>
                        {
                            estudiante !== "" &&
                            <>
                                <b>Alumno: </b>
                                {
                                    alumnos.map((alumno) => {
                                        if(alumno.id === estudiante){
                                            if(alumno.apellido_2 !== "" && alumno.apellido_2 !== undefined && alumno.apellido_2 !== null){
                                                return(
                                                    <span key={alumno.id}>{alumno.nombre} {alumno.apellido_1} {alumno.apellido_2}</span>
                                                )
                                            }
                                            else{
                                                return(
                                                    <span key={alumno.id}>{alumno.nombre} {alumno.apellido_1} ({alumno.email})</span>
                                                )
                                            }
                                        }
                                    })
                                }
                            </>
                            
                        }
                    </p>
                </div>
                {
                    directores.length === 1 &&
                    <div>
                        <p>
                            <b>Director: </b>
                            {
                                directores.map((director) => {
                                    const persona = docentes.find((persona) => {
                                        if(persona.id === director){
                                            return persona;
                                        }
                                    });

                                    if(persona === undefined){
                                        return;
                                    }
                                    
                                    if(persona.apellido_2 !== null && persona.apellido_2 !== undefined && persona.apellido_2.trim() !== ""){
                                        return(
                                            <span key={persona.id}>{persona.nombre} {persona.apellido_1} {persona.apellido_2} ({persona.email})</span>
                                        )
                                    }
                                    else{
                                        return(
                                            <span key={persona.id}>{persona.nombre} {persona.apellido_1} ({persona.email})</span>
                                        )
                                    }
                                })
                            }
                        </p>
                    </div>
                }
                {
                    directores.length > 1 &&
                    <div>
                        <p>
                            <b>Directores:</b>
                        </p>
                        <ul>
                            {
                                directores.map((director) => {
                                    const persona = docentes.find((persona) => {
                                        if(persona.id === director){
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
                    miembrosTribunal.length === 1 &&
                    <div>
                        <p>
                            <b>Miembro del tribunal: </b>
                            {
                                miembrosTribunal.map((miembro) => {
                                    const persona = docentes.find((persona) => {
                                        if(persona.id === miembro){
                                            return persona;
                                        }
                                    });

                                    if(persona === undefined){
                                        return;
                                    }
                                    
                                    if(persona.apellido_2 !== null && persona.apellido_2 !== undefined && persona.apellido_2.trim() !== ""){
                                        return(
                                            <span key={persona.id}>{persona.nombre} {persona.apellido_1} {persona.apellido_2} ({persona.email})</span>
                                        )
                                    }
                                    else{
                                        return(
                                            <span key={persona.id}>{persona.nombre} {persona.apellido_1} ({persona.email})</span>
                                        )
                                    }
                                })
                            }
                        </p>
                    </div>
                }
                {
                    miembrosTribunal.length > 1 &&
                    <div>
                        <p><b>Miembros del tribunal:</b></p>
                        <ul>
                            {
                                miembrosTribunal.map((miembro) => {
                                    const persona = docentes.find((persona) => {
                                        if(persona.id === miembro){
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
                    
                <div>
                    <p><b>Curso: </b>Curso {curso}-{curso+1}</p>
                </div>
                <div>
                    <p><b>Convocatoria: </b>{convocatoria}</p>
                </div>
                <div>
                    <p><b>Fecha y hora de la defensa: </b>{hora} {fecha}</p>
                </div>
                <div>
                    <p><b>Nota: </b>{nota}</p>
                </div>
            </div>
        </div>
    );
}

export default NewTFM;