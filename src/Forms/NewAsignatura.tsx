import { useEffect, useState } from "react";
import type { Asignatura_ins } from "../types/Asignaturas/Asignatura";
import Cookie from "js-cookie";

function NewAsignatura() {
    const [nombre, setNombre] = useState("");
    const [titulacion, setTitulacion] = useState("");
    const [creditos, setCreditos] = useState(4);
    const [curso, setCurso] = useState("1º");
    const [optatividad, setOptatividad] = useState("Obligatoria");
    
    const [cursos_str, setCursosStr] = useState<string[]>([]);

    const [nombreError, setNombreError] = useState("");

    useEffect(() => {
        const getCursos = async () => {
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
                alert("Tienes que ser un administrativo para dar de alta una asignatura");

                globalThis.location.href = "/login";
            }

            const id_titulacion = Cookie.get("TFG_titulacion");

            if(id_titulacion === undefined){
                globalThis.location.href = "/paginaPersonal"
            }

            const url = `http://gestor-master-interuniv.deno.dev/titulacion/cursos?id=${id_titulacion}`;
            const response = await fetch(url, {
                method: "GET",
            });

            if(response.status !== 200){
                const error = await response.json();
                alert(error.error);
                globalThis.location.href = "/paginaPersonal";
            }

            const data = await response.json();
            const cursos = data.cursos;
            
            setTitulacion(id_titulacion!);
            
            let count = 1;
            const new_Cursos: string[] = [];

            while(count <= cursos){
                new_Cursos.push(`${count}º`);

                count += 1;
            }
            
            setCursosStr(new_Cursos);
        }

        getCursos();
    }, []);

    const handleReset = () => {
        setNombre("");
        setCreditos(4);
        setCurso("1º");

        setNombreError("");
    }

    const handleCreation = async () => {
        let error_exists = false;

        if(nombre.trim() === ""){
            setNombreError("Hay que llenar este campo");
            error_exists = true;
        }

        if(error_exists === false){
            const data: Asignatura_ins = {
                nombre: nombre,
                titulacion: titulacion,
                curso: curso,
                creditos: creditos,
                optatividad: optatividad,
            }

            const url = `http://localhost:4000/asignatura`;
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
            });

            if(response.status !== 200){
                const error = await response.json();
                alert(error.error);
            }
            else{
                const data = await response.json();
                alert(data.message);

                globalThis.location.href = "/paginaPersonal";
            }
        }
    }
    
    return(
        <div>
            <form className="newAsignatura">
                <div className="column">
                    <label htmlFor="nombre">Nombre:</label>
                    <input id="nombre" name="nombre" value={nombre} placeholder="Nombre" onChange={(e) => {
                        setNombre(e.currentTarget.value);
                        setNombreError("");
                    }}/>
                    <div className="error">{nombreError}</div>
                </div>
                <div className="column">
                    <label htmlFor="creditos">Créditos:</label>
                    <input id="creditos" name="creditos" type="number" value={creditos} min="1" max="10" onChange={(e) => setCreditos(Math.trunc(Number(e.currentTarget.value)))}/>
                </div>
                <div className="column">
                    <label htmlFor="curso">Curso:</label>
                    <select id="curso" name="curso" defaultValue="1º" onChange={(e) => {setCurso(e.currentTarget.value)}}>
                        {
                            cursos_str.length !== 0 &&
                            cursos_str.map((curso) => {
                                return(
                                    <option key={curso} value={curso}>{curso}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="column">
                    <label>Optatividad:</label>
                    <select value={optatividad} onChange={(e) => setOptatividad(e.currentTarget.value)}>
                        <option value="Obligatoria">Obligatoria</option>
                        <option value="Optativa">Optativa</option>
                    </select>
                </div>
                <div className="buttons">
                    <button type="button" onClick={(_e) => globalThis.location.href = "/paginaPersonal"}>Volver atras</button>
                    <button type="reset" onClick={handleReset}>Vaciar campos</button>
                    <button type="button" onClick={handleCreation}>Enviar</button>
                </div>
            </form>
        </div>
    );
}

export default NewAsignatura;