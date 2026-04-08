import { useEffect, useState } from "react";
import type { Asignatura_curso, Asignatura_Short } from "../types/Asignaturas/Asignatura";
import Cookie from "js-cookie";
import type { Coordinador_Short } from "../types/Personas/Coordinador";
import type { Profesor_Short } from "../types/Personas/Profesor";

function AsignaturaDocentePage() {
    const [asignatura, setAsignatura] = useState<Asignatura_curso>();
    const [showAlumnos, setShowAlumnos] = useState(false);

    useEffect(() => {
        const getAsignatura = async () => {
            Cookie.remove("TFG_conv");

            const auth = Cookie.get("authTFG");

            if(auth === undefined){
                window.location.href = "/login";
            }

            const url_auth = `http://localhost:4000/persona/id?id=${auth}`;
            const response_user = await fetch(url_auth, {
                method: "GET",
            });

            if(response_user.status !== 200){
                const error = await response_user.json();
                alert(error.error);

                window.location.href = "/login";
            }

            const data_user = await response_user.json();

            if(data_user.rol !== "Coordinador" && data_user.rol !== "Profesor"){
                window.location.href = "/paginaPersonal";
            }

            const TFG_titulacion = Cookie.get("TFG_titulacion");

            if(TFG_titulacion === undefined){
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

            const docente_exists: (Profesor_Short | Coordinador_Short | undefined) = data_titulacion.docentes.find((docente: (Profesor_Short | Coordinador_Short)) => {
                if(docente.id === auth){
                    return docente;
                }
            });
        
            if(docente_exists === undefined){
                alert("No das clase en esta titulación");
        
                window.location.href = "/paginaPersonal";
            }

            const TFG_asig = Cookie.get("TFG_asig");

            if(TFG_asig === undefined){
                window.location.href = "/mostrarAsignaturas"
            }

            const url_asig = `http://localhost:4000/asignatura?id=${TFG_asig}`;
            const response_asig = await fetch(url_asig, {
                method: "GET",
            })

            if(response_asig.status !== 200){
                const error = await response_asig.json();
                alert(error.error);

                window.location.href = "/paginaPersonal";
            }
            
            const data_asig = await response_asig.json();

            const asignatura_exists = data_titulacion.asignaturas.find((asignatura: Asignatura_Short) => {
                if(asignatura.id === data_asig.id){
                    return asignatura;
                }
            });

            if(asignatura_exists === undefined){
                alert(`Asignatura no encontrada en el ${data_titulacion.nombre}`);

                window.location.href = "/paginaPersonal";
            }

            const TFG_curso = Cookie.get("TFG_curso");

            if(TFG_curso === undefined){
                window.location.href = "/mostrarAsignaturas";
            }

            const url_curso = `http://localhost:4000/curso?curso=${TFG_curso}&asignatura=${TFG_asig}`;
            const response_curso = await fetch(url_curso, {
                method: "GET",
            });

            if(response_curso.status !== 200){
                const error = await response_curso.json();
                alert(error.error);

                window.location.href = "/paginaPersonal";
            }

            const data_curso = await response_curso.json();

            if(data_curso.id_asig !== data_asig.id){
                alert(`Curso no encontrado en ${data_asig.nombre}`);

                window.location.href = "/paginaPersonal";
            }

            const docente_in = data_curso.profesores.find((profesor: (Profesor_Short | Coordinador_Short)) => {
                if(profesor.id === auth){
                    return profesor;
                }
            });

            if(docente_in === undefined){
                window.location.href = "/paginaPersonal";
            }

            setAsignatura(data_curso);
        }

        getAsignatura();
    }, []);

    return(
        <>
            {
                asignatura !== undefined &&
                <div>
                    <h3>{asignatura.nombre} ({asignatura.curso_academico})</h3>
                    <div>
                        <button type="button" onClick={() => setShowAlumnos(!showAlumnos)}>
                            {
                                showAlumnos === false ? <>Mostrar alumnos</> : <>Ocultar alumnos</>
                            }
                        </button>
                        {
                            showAlumnos === true &&
                            <ul>
                                {
                                asignatura.estudiantes.map((alumno) => {
                                    if(alumno.apellido_2 !== null && alumno.apellido_2 !== undefined && alumno.apellido_2.trim() !== ""){
                                        return(
                                            <li key={alumno.id}>{alumno.nombre} {alumno.apellido_1} {alumno.apellido_2} ({alumno.email})</li>
                                        )
                                    }
                                    else{
                                        return(
                                            <li key={alumno.id}>{alumno.nombre} {alumno.apellido_1} ({alumno.email})</li>
                                        )
                                    }
                                })
                            }
                            </ul>
                        }
                        {
                            showAlumnos === false &&
                            <>
                                <br/>
                                <br/>
                            </>
                        }
                    </div>
                    <div>
                        <button type="button" onClick={() => {
                            const curso_aux = asignatura.curso_academico.split(" ")[1].split("-")[1];

                            const date = new Date();

                            if((date.getFullYear() > Number(curso_aux)) || date.getMonth() >= 8){
                                alert("No se puede evaluar una asignatura fuera de fecha");

                                window.location.href = "/mostrarAsignaturas";
                            }

                            if(asignatura.ordinaria_firmada === false){
                                Cookie.set("TFG_conv", "Ordinaria", {expires: 7});

                                window.location.href = "/calificarAsignatura";
                            }
                            else if(asignatura.extraordinaria_firmada === false){
                                Cookie.set("TFG_conv", "Extraordinaria", {expires: 7});

                                window.location.href = "/calificarAsignatura";
                            }
                            else{
                                alert("Ambas convocatorias ya estan evaluadas y firmadas");

                                window.location.href = "/mostrarAsignaturas";
                            }
                        }}>
                            {
                                asignatura.ordinaria_firmada === false ? <>Calificar convocatoria ordinaria</> : <>Calificar convocatoria extraordinaria</>
                            }
                        </button>
                        <br/>
                        <br/>
                        <button type="button" onClick={() => {
                            Cookie.remove("TFG_conv");

                            window.location.href =  "/mostrarAsignaturas";
                        }}>Volver</button>
                    </div>
                </div>
            }
        </>
    );
}

export default AsignaturaDocentePage;