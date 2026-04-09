import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import './Pages.css'
import type { Titulacion } from "../types/Titulacion/Titulacion";

function ShowTitulaciones() {
    const [titulaciones, setTitulaciones] = useState<Titulacion[]>([]);

    useEffect(() => {
        const getTitulaciones = async () => {
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

            const id_titulacion = Cookie.get("TFG_titulacion");

            if(id_titulacion === undefined){
                alert("No administras ninguna titulación");

                globalThis.location.href = "/paginaPersonal";
            }

            const url_titulacion = `http://gestor-master-interuniv.deno.dev/titulacion?id=${id_titulacion}`;
            const response_titulacion = await fetch(url_titulacion, {
                method: "GET",
            });

            if(response_titulacion.status !== 200){
                const error = await response_titulacion.json();
                alert(error.error);
                globalThis.location.href = "/paginaPersonal";
            }
            else{
                const data = await response_titulacion.json();
                const titulaciones: Titulacion[] = [];
                titulaciones.push(data);
                setTitulaciones(titulaciones);
            }
        }

        getTitulaciones();
    }, []);

    return(
        <div>
            {
                titulaciones !== undefined &&
                <>
                    <h1>Titulaciones administradas:</h1>
                    <div>
                    {
                        titulaciones.map((titulacion) => {
                            return(
                                <div key={titulacion.id} className="show">
                                    <div className="data">{titulacion.nombre}</div>
                                    <div className="buttons">
                                        <button type="button" onClick={() => globalThis.location.href = "/mostrarAsignaturasTitulacion"}>Ver asignaturas</button>
                                        <button type="button" onClick={() => globalThis.location.href = "/nuevaAsignatura"}>Insertar una asignatura nueva</button>
                                        <button type="button" onClick={() => globalThis.location.href = "/registrarPersona"}>Dar de alta a personas</button>
                                        <button type="button" onClick={() => globalThis.location.href = "/paginaTitulacion"}>Ver titulación</button>
                                        {
                                            //<button type="button" onClick={() => globalThis.location.href = "/actualizarDatosTitulacion"}>Editar datos</button>
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                    </div>
                </>
            }
            <div>
                <button type="button" onClick={() => globalThis.location.href = "/paginaPersonal"}>Volver atras</button>
            </div>
        </div>
    );
}

export default ShowTitulaciones;