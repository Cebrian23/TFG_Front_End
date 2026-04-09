import { useEffect, useState } from "react";
import Cookie from "js-cookie";

function NewNotas() {
    //cconst [calificados, setCalificados] = useState([])

    const [alumnos, setAlumnos] = useState([]);
    const [convocatoria, setConvocatoria] = useState("");

    useEffect(() => {
        const getAlumnos = async () => {
            const auth = Cookie.get("authTFG");

            if(auth === undefined){
                globalThis.location.href = "/login";
            }

            const url_auth = `http://localhost:4000/persona/id?id=${auth}`;
            const response_user = await fetch(url_auth, {
                method: "GET",
            });

            if(response_user.status !== 200){
                const error = await response_user.json();
                alert(error.error);

                globalThis.location.href = "/login";
            }

            const data_user = await response_user.json();
            console.log(data_user);

            if(data_user.rol !== "Coordinador" && data_user.rol !== "Profesor"){
                alert("Tienes que ser un docente para poder calificar una asignatura");
                globalThis.location.href = "/paginaPersonal";
            }

            const TFG_titulacion = Cookie.get("TFG_titulacion");

            if(TFG_titulacion === undefined){
                globalThis.location.href = "/paginaPersonal"
            }

            const url_titulacion = `http://gestor-master-interuniv.deno.dev/titulacion?id=${TFG_titulacion}`;
            const response_titulacion = await fetch(url_titulacion, {
                method: "GET",
            });

            if(response_titulacion.status !== 200){
                const error = await response_titulacion.json();
                alert(error);

                globalThis.location.href = "/paginaPersonal";
            }

            const TFG_asig = Cookie.get("TFG_asig");

            if(TFG_asig === undefined){
                globalThis.location.href = "/mostrarAsignaturas";
            }

            const url_asig = `http://gestor-master-interuniv.deno.dev/asignatura?id=${TFG_asig}`;
            const response_asig = await fetch(url_asig, {
                method: "GET",
            });

            if(response_asig.status !== 200){
                const error = await response_asig.json();
                alert(error.error);

                globalThis.location.href = "/paginaPersonal";
            }

            //const data_asig = await response_asig.json();

            const TFG_curso = Cookie.get("TFG_curso");

            if(TFG_curso === undefined){
                globalThis.location.href = "/mostrarAsignaturas";
            }

            const url_curso = `http://localhost:4000/curso?asignatura=${TFG_asig}&curso=${TFG_curso}`;
            const response_curso = await fetch(url_curso, {
                method: "GET",
            });

            if(response_curso.status !== 200){
                const error = await response_curso.json();
                alert(error);

                globalThis.location.href = "/paginaPersonal";
            }

            //const data_curso = await response_curso.json();

            const TFG_conv = Cookie.get("TFG_conv");

            if(TFG_conv === undefined){
                globalThis.location.href = "/mostrarAsignaturas";
            }

            setConvocatoria(TFG_conv!);
            setAlumnos([])
        }

        getAlumnos();
    },[]);

    const handleCalificar = () => {
        //
    }

    return(
        <div>
            <h3>Calificación de la convocatoria {convocatoria.toLowerCase()}</h3>
            {
                alumnos !== undefined &&
                <>
                    <table className="tablaNotas">
                        <tr>
                            <th>Nombre completo</th>
                            <th>Email</th>
                            <th>DNI</th>
                            <th>Presentado</th>
                            <th>Calificacion</th>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                    <br/>
                </>
            }
            <div>
                <button type="button" onClick={() => globalThis.location.href = "/mostrarAsignaturas"}>Volver</button>
                <button type="button" disabled={alumnos === undefined ? true : false} onClick={handleCalificar}>Enviar</button>
            </div>
        </div>
    );
}

export default NewNotas;