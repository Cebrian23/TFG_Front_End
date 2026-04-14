import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import type { Asignatura } from "../types/Asignaturas/Asignatura.ts";

function ShowAsignaturasTitulacion() {
    const [titulacion, setTitulacion] = useState("");
    const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);

    useEffect(() => {
        const getAsignaturas = async () => {
            Cookie.remove("TFG_asig");
            Cookie.remove("TFG_curso");
            const auth = Cookie.get("authTFG");
            if(auth === undefined){
                globalThis.location.href = "/login";
            }
            
            const url_persona = `http://gestor-master-interuniv.deno.dev/persona/id?id=${auth}`;
            const response_persona = await fetch(url_persona, {
                method: "GET",
            });

            if(response_persona.status !== 200){
                const error = await response_persona.json();
                alert(error.error);

                globalThis.location.href = "/login";
            }

            const data_persona = await response_persona.json();

            if(data_persona.rol !== "Administrativo"){
                alert("Tienes que ser un administrativo para ver estos datos");

                globalThis.location.href = "/login";
            }

            const TFG_titulacion = Cookie.get("TFG_titulacion");

            if(TFG_titulacion === undefined){
                alert("No administras ninguna titulación");

                globalThis.location.href = "/paginaPersonal";
            }

            const url_titulacion = `http://gestor-master-interuniv.deno.dev/titulacion?id=${TFG_titulacion}`;
            const response_titulacion = await fetch(url_titulacion, {
                method: "GET",
            });

            if(response_titulacion.status !== 200){
                const error = await response_titulacion.json();
                alert(error.error);
                globalThis.location.href = "/paginaPersonal";
            }
            
            const data = await response_titulacion.json();
            setTitulacion(data.nombre);
            setAsignaturas(data.asignaturas);
        }

        getAsignaturas();

    }, []);

    return(
        <div>
            <h1>Asignaturas de {titulacion}</h1>
            {
                asignaturas.length !== 0 &&
                asignaturas.map((asig) => {
                    return(
                        <div key={asig.id} className="show">
                            <div className="data">{asig.nombre} ({asig.curso}, {asig.creditos})</div>
                            <div className="buttons">
                                <button type="button" onClick={() => {
                                    Cookie.set("TFG_asig", asig.id, {expires: 7});
                                    
                                    globalThis.location.href = "/mostrarCursos";
                                }}>Ver cursos</button>
                                <button type="button" onClick={() => {
                                    Cookie.set("TFG_asig", asig.id, {expires: 7});

                                    globalThis.location.href = "/nuevoCurso";
                                }}>Insertar un curso nuevo</button>
                                <button type="button" onClick={() => {
                                    Cookie.set("TFG_asig", asig.id, {expires: 7});

                                    globalThis.location.href = "/paginaAsignaturaTitulacion";
                                }}>Ver asignatura</button>
                                {
                                    /*
                                    <>
                                        <button type="button" onClick={() => globalThis.location.href = "/actualizarDatosAsignatura"}>Editar datos</button>
                                    </>
                                    */
                                }
                            </div>
                        </div>
                    );
                })
            }
            <button type="button" onClick={() => globalThis.location.href = "/mostrarTitulaciones"}>Volver atras</button>
        </div>
    );
}

export default ShowAsignaturasTitulacion;