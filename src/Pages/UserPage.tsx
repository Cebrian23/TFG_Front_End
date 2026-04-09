import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import type { Administrativo } from "../types/Personas/Administrativo.ts";
import type { Coordinador } from "../types/Personas/Coordinador.ts";
import type { Estudiante } from "../types/Personas/Estudiante.ts";
import type { Profesor } from "../types/Personas/Profesor.ts";

function UserPage() {
    const [user, setUser] = useState<(Coordinador | Estudiante | Profesor | Administrativo)>();
    const [noAdmin, setNoAdmin] = useState(false);
    const [noAsig, setNoAsig] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            Cookie.remove("TFG_asig");
            Cookie.remove("TFG_curso");
            Cookie.remove("TFG_conv");

            const auth = Cookie.get("authTFG");
            if(auth === undefined){
                globalThis.location.href = "/login";
            }
            else{
                const url_num =  `http://localhost:4000/titulaciones/num`;
                const response_num = await fetch(url_num, {
                    method: "GET"
                });

                const data = await response_num.json();
                const num_titulaciones = data.titulaciones_number;

                const url = `http://localhost:4000/persona/id?id=${auth}`;
                const response = await fetch(url, {
                    method: "GET",
                });

                if(response.status !== 200){
                    const error = await response.json();
                    alert(error.error);

                    globalThis.location.href = "/login";
                }

                const data_user = await response.json();

                if(data_user.rol === "Administrativo"){
                    const url_titulacion = `http://localhost:4000/administrativo/titulaciones?admin=${auth}`;
                    const response_titulacion = await fetch(url_titulacion, {
                        method: "GET",
                    });

                    if(response_titulacion.status !== 200){
                        const error = await response_titulacion.json();
                        alert(error.error);
                        globalThis.location.href = "/login";
                    }

                    const data = await response_titulacion.json();

                    if(data.length === 0 && num_titulaciones === 0){
                        globalThis.location.href = "/nuevaTitulacion";
                    }
                    else if(data.length === 0 && num_titulaciones !== 0){
                        setNoAdmin(true);
                    }
                    else if(data.length !== 0){
                        Cookie.set("TFG_titulacion", data[0].id, {expires: 7});
                    }
                }
                else{
                    const url_titulacion = `http://localhost:4000/docente/titulaciones?docente=${auth}`;
                    const response_titulacion = await fetch(url_titulacion, {
                        method: "GET",
                    });

                    if(response_titulacion.status !== 200){
                        const error = await response_titulacion.json();
                        alert(error.error);
                        globalThis.location.href = "/login";
                    }

                    const data = await response_titulacion.json();

                    if(data.length === 0 && num_titulaciones === 0){
                        globalThis.location.href = "/nuevaTitulacion";
                    }
                    else if(data.length === 0 && num_titulaciones !== 0){
                        setNoAsig(true);
                    }
                    else if(data.length !== 0){
                        Cookie.set("TFG_titulacion", data[0].id, {expires: 7});
                    }
                }

                setUser(data_user);
            }
        }

        getUser();
    },[]);

    const handleLogout = () => {
        Cookie.remove("authTFG");
        Cookie.remove("TFG_titulacion");
        Cookie.remove("TFG_asig");
        Cookie.remove("TFG_curso");
        Cookie.remove("TFG_conv");
        
        globalThis.location.href = "/login";
    }

    return(
        <>
            {
                user !== undefined &&
                <div className="userPage">
                    {
                        (user.apellido_2 !== undefined && user.apellido_2 !== null && user.apellido_2 !== "") &&
                        <h1>Hola, {user.nombre} {user.apellido_1} {user.apellido_2}</h1>
                    }
                    {
                        (user.apellido_2 === undefined || user.apellido_2 === null || user.apellido_2 === "") &&
                        <h1>Hola, {user.nombre} {user.apellido_1}</h1>
                    }
                    <form>
                        <h2>¿Que deseas hacer?</h2>
                        <div className="columns">
                            {
                               user.rol === "Administrativo" && noAdmin === false &&
                                <>
                                    <button type="button" onClick={() => globalThis.location.href = "/mostrarTitulaciones"}>Ver titulaciones administradas</button>
                                    <br/>
                                </>
                            }
                            {
                                (user.rol === "Coordinador" || user.rol === "Profesor") && noAsig === false &&
                                <>
                                    <button type="button" onClick={() => globalThis.location.href = "/mostrarAsignaturas"}>Ver asignaturas impartidas</button>
                                    <br/>
                                </>
                            }
                            {
                                user.rol === "Coordinador" &&
                                <>
                                    <button type="button" onClick={() => globalThis.location.href = "/nuevoTFM"}>Insertar TFM de un alumno</button>
                                    <br/>
                                </>
                            }
                            <button type="button" onClick={() => globalThis.location.href = "/actualizarDatosPersonales"}>Modificar información personal</button>
                            <br/>
                            <button type="button" onClick={handleLogout}>Cerrar sesion</button>
                        </div>
                    </form>
                </div>
            }
        </>
    );
}

export default UserPage;