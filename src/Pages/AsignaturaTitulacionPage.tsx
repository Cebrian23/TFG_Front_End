import { useState, useEffect } from "react";
import type { Asignatura, Asignatura_Short } from "../types/Asignaturas/Asignatura";
import Cookie from "js-cookie";
import type { Administrativo_Short } from "../types/Personas/Administrativo";

function AsignaturaTitulacionPage() {
    const [asignatura, setAsignatura] = useState<Asignatura>();
    const [showCursos, setShowCursos] = useState(false);
    
    useEffect(() => {
        const getAsignatura = async () => {
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

            if(data_user.rol !== "Administrativo"){
                window.location.href = "/paginaPersonal";
            }

            const TFG_titulacion = Cookie.get("TFG_titulacion");

            if(TFG_titulacion === undefined){
                window.location.href = "/paginaPersonal";
            }

            const url_titulacion = `http://gestor-master-interuniv.deno.dev/titulacion?id=${TFG_titulacion}`;
            const response_titulacion = await fetch(url_titulacion, {
                method: "GET",
            });

            if(response_titulacion.status !== 200){
                const error = await response_titulacion.json();
                alert(error);

                window.location.href = "/paginaPersonal";
            }

            const data_titulacion = await response_titulacion.json();

            const admin = data_titulacion.administrativos.find((administrativo: Administrativo_Short) => {
                if(administrativo.id === auth){
                    return administrativo;
                }
            });

            if(admin === undefined){
                window.location.href = "/paginaPersonal";
            }

            const TFG_asig = Cookie.get("TFG_asig");

            if(TFG_asig === undefined){
                window.location.href = "/paginaPersonal";
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
                window.location.href = "/paginaPersonal";
            }

            console.log(data_asig);

            setAsignatura(data_asig);
        }

        getAsignatura();
    }, []);
    
    return(
        <>
            {
                asignatura !== undefined &&
                <div>
                    <h1>Página de {asignatura.nombre}</h1>
                    <div>
                        <p><b>Nombre: </b>{asignatura.nombre}</p>
                    </div>
                    <div>
                        <p><b>Titulación: </b>{asignatura.titulacion}</p>
                    </div>
                    <div>
                        <p><b>Curso: </b>{asignatura.curso}</p>
                    </div>
                    <div>
                        <p><b>Créditos: </b>{asignatura.creditos}</p>
                    </div>
                    <div>
                        <p><b>Optatividad: </b>{asignatura.optatividad}</p>
                    </div>
                    <div>
                        <button type="button" onClick={() => setShowCursos(!showCursos)}>{showCursos === false ? <>Mostrar cursos académicos</> : <>Ocultar cursos académicos</>}</button>
                        {
                            showCursos === true && asignatura.cursos_academicos.length === 1 &&
                            <p>
                                <b>Curso académico: </b>
                                {
                                    asignatura.cursos_academicos.map((curso) => {
                                        return(
                                            <span key={curso.id}>{curso.curso_academico}</span>
                                        )
                                    })
                                }
                            </p>
                        }
                        {
                            showCursos === true && asignatura.cursos_academicos.length > 1 &&
                            <>
                                <p><b>Cursos académicos:</b></p>
                                <ul>
                                    {
                                        asignatura.cursos_academicos.map((curso) => {
                                            return(
                                                <li key={curso.id}>{curso.curso_academico}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </>
                        }
                    </div>
                    {
                        showCursos === false &&
                        <br/>
                    }
                    <button type="button" onClick={() => window.location.href = "/mostrarAsignaturasTitulacion"}>Volver</button>
                </div>
            }
        </>
    );
}

export default AsignaturaTitulacionPage;