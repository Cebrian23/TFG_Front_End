import { useEffect, useState } from "react";
import type { Asignatura_titulacion_ins } from "../types/Asignaturas/Asignatura";
import type { Titulacion_ins } from "../types/Titulacion/Titulacion";
import Cookie from "js-cookie";

function NewTitulacion() {
    const [auth, setAuth] = useState("");
    const [nombre, setNombre] = useState("");
    const [cursos, setCursos] = useState(1);
    const [creditosTFM, setCreditos] = useState(10);
    const [universidad, setUniversidad] = useState("");
    const [universidades, setUniversidades] = useState<string[]>([]);
    const [grado, setGrado] = useState("");
    const [grados, setGrados] = useState<string[]>([]);
    const [nombre_asig, setNombreAsig] = useState("");
    const [curso_asig, setCursoAsig] = useState(1);
    const [creditos_asig, setCreditosAsig] = useState(4);
    const [optatividad_asig, setOptatividadAsig] = useState("Obligatoria")
    const [asignaturas, setAsignaturas] = useState<Asignatura_titulacion_ins[]>([]);
    const [convocatorias, setConvocatorias] = useState(4);

    const [nombreError, setNombreError] = useState("");
    const [universidadesError, setUniversidadesError] = useState("");
    const [gradosError, setGradosError] = useState("");
    const [asignaturaError, setAsignaturaError] = useState("");

    useEffect(() => {
        const Verification = async () => {
            const auth = Cookie.get("authTFG");

            if(auth === undefined){
                window.location.href = "/login";
            }
            else{
                setAuth(auth)
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
        }

        Verification();
    }, []);

    const handleReset = () => {
        setNombre("");
        setCursos(1);
        setCreditos(10);
        setUniversidad("");
        setUniversidades([]);
        setGrado("");
        setGrados([]);
        setNombreAsig("");
        setCursoAsig(1);
        setCreditosAsig(4);
        setAsignaturas([]);

        setNombreError("");
        setUniversidadesError("");
        setGradosError("");
        setAsignaturaError("");
    }

    const handleCreation = async () => {
        let error_exists = false;
        
        if(nombre.trim() === ""){
            setNombreError("Hay que rellenar este campo");
            error_exists = true;
        }

        if(universidades.length === 0){
            setUniversidadesError("Hay que insertar al menos una universidad");
            error_exists = true;
        }

        if(grados.length === 0){
            setGradosError("Hay que insertar al menos un grado");
            error_exists = true;
        }

        if(error_exists === false){
            const newTitulacion: Titulacion_ins = {
                nombre: nombre,
                universidades: universidades,
                grados_aptos: grados,
                cursos: cursos,
                convocatorias: convocatorias,
                administrativo: auth,
                creditos_TFM: creditosTFM,
                asignaturas: asignaturas,
            }

            const url = "http://gestor-master-interuniv.deno.dev/titulacion";
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(newTitulacion),
            });

            if(response.status !== 200){
                const error = await response.json();
                alert(error.error);
            }
            else{
                const data = await response.json();
                alert(data.message);

                Cookie.set("TFG_titulacion", data.id, {expires: 7});
                
                window.location.href = "/paginaPersonal";
            }
        }
    }

    const handleCursoVar = (cursito: number) => {
        const asigs_aux: Asignatura_titulacion_ins[] = [];

        asignaturas.forEach((asig) => {
            const asig_curso = asig.curso.split("º");
            if(Number(asig_curso[0]) > cursito){
                asigs_aux.push(
                    {
                        nombre: asig.nombre,
                        curso: `${cursito}º`,
                        creditos: asig.creditos,
                        optatividad: asig.optatividad,
                    }
                );
            }
            else{
                asigs_aux.push(asig);
            }
        });

        setAsignaturas(asigs_aux);
    }

    return(
        <div className="grid_group">
            <form className="newTitulacion">
                <h1>Registro de una titulacion</h1>
                <div className="column">
                    <label htmlFor="nombre">Nombre:</label>
                    <input id="nombre" name="nombre" placeholder="Nombre de la titulación" onChange={(e) => {
                        setNombre(e.currentTarget.value);
                        setNombreError("");
                    }}/>
                    <div className="error">{nombreError}</div>
                </div>
                <div className="column">
                    <label htmlFor="universidades">Universidades involucradas:</label>
                    <div id="universidades" className="add_data">
                        <input name="universidades" placeholder="Nombre de la universidad" value={universidad} onChange={(e) => {
                            setUniversidad(e.currentTarget.value);
                            setUniversidadesError("");
                        }}/>
                        <button type="button" onClick={() => {
                            if(universidad.trim() !== ""){
                                const uni_exists = universidades.find((uni) => {
                                    if(uni === universidad.trim()){
                                        return uni;
                                    }
                                });

                                if(uni_exists === undefined){
                                    const new_universidades = universidades;
                                    new_universidades.push(universidad);
                                    setUniversidades(new_universidades);
                                    setUniversidadesError("");
                                }
                                else{
                                    setUniversidadesError(`${universidad.trim()} ya existe en la lista`);
                                }
                            }
                            setUniversidad("");
                        }}>Insertar a la lista</button>
                        <button type="button" onClick={() => {
                            setUniversidad("");
                            setUniversidades([]);
                        }}>Reiniciar lista</button>
                    </div>
                    <div className="error">{universidadesError}</div>
                </div>
                <div className="column">
                    <label htmlFor="grados">Grados universitarios necesarios:</label>
                    <div id="grados" className="add_data">
                        <input name="grados" value={grado} placeholder="Nombre del grado" onChange={(e) => {
                            setGrado(e.currentTarget.value);
                            setGradosError("");
                        }}/>
                        <button type="button" onClick={() => {
                            if(grado.trim() !== ""){
                                const grado_exists = grados.find((gradito) => {
                                    if(gradito === grado.trim()){
                                        return gradito;
                                    }
                                });

                                if(grado_exists === undefined){
                                    const new_grados = grados;
                                    new_grados.push(grado);
                                    setGrados(new_grados);
                                    setGradosError("");
                                }
                                else{
                                    setGradosError(`${grado.trim()} ya existe en la lista`);
                                }
                            }
                            setGrado("");
                        }}>Insertar a la lista</button>
                        <button type="button" onClick={(_e) => setGrados([])}>Reiniciar lista</button>
                    </div>
                    <div className="error">{gradosError}</div>
                </div>
                <div className="column">
                    <label htmlFor="cursos">Cursos:</label>
                    <input name="cursos" type="number" defaultValue={cursos} min="1" max="4" onChange={(e) => {
                        setCursos(Math.trunc(Number(e.currentTarget.value)));

                        if(curso_asig > Math.trunc(Number(e.currentTarget.value))){
                            setCursoAsig(Math.trunc(Number(e.currentTarget.value)));
                        }

                        handleCursoVar(Math.trunc(Number(e.currentTarget.value)));
                    }}/>
                </div>
                <div className="column">
                    <label>Convocatorias por asignatura:</label>
                    <input type="number" value={convocatorias} min="1" max="7" onChange={(e) => setConvocatorias(Math.trunc(Number(e.currentTarget.value)))}/>
                </div>
                <div className="column">
                    <label>Asignaturas:</label>
                    <div className="intra_div">
                        <label>Nombre:</label>
                        <input placeholder="Nombre de la asignatura" value={nombre_asig} onChange={(e) => {
                            setNombreAsig(e.currentTarget.value);
                            setAsignaturaError("");
                        }}/>
                    </div>
                    <div className="intra_div">
                        <label>Curso:</label>
                        <input type="number" placeholder="Curso de la asignatura" value={curso_asig} min="1" max={cursos} onChange={(e) => {
                            setCursoAsig(Math.trunc(Number(e.currentTarget.value)));
                            setAsignaturaError("");
                        }}/>
                    </div>
                    <div className="intra_div">
                        <label>Creditos:</label>
                        <input type="number" placeholder="Creditos de la asigntura" value={creditos_asig} min="1" max="10"  onChange={(e) => {
                            setCreditosAsig(Math.trunc(Number(e.currentTarget.value)));
                            setAsignaturaError("");
                        }}/>
                    </div>
                    <div className="intra_div">
                        <label>Optatividad:</label>
                        <select value={optatividad_asig} onChange={(e) => setOptatividadAsig(e.currentTarget.value)}>
                            <option value="Obligatoria">Obligatoria</option>
                            <option value="Optativa">Optativa</option>
                        </select>
                    </div>
                    <div className="buttons"> 
                        <button type="button" onClick={(_e) => {
                            if(nombre_asig.trim() !== ""){
                                const asig_exists = asignaturas.find((asig) => {
                                    if(asig.nombre === nombre_asig.trim()){
                                        return asig;
                                    }
                                });

                                if(asig_exists === undefined){
                                    const new_asig: Asignatura_titulacion_ins = {
                                        nombre: nombre_asig,
                                        curso: `${curso_asig}º`,
                                        creditos: creditos_asig,
                                        optatividad: optatividad_asig,
                                    }
                                
                                    const upd_asignaturas = asignaturas;
                                    upd_asignaturas.push(new_asig);
                                
                                    setAsignaturas(upd_asignaturas);
                                    setAsignaturaError("");
                                }
                                else{
                                    setGradosError(`${universidad.trim()} ya existe en la lista`);
                                }
                            }

                            setNombreAsig("");
                            setCreditosAsig(4);
                            setCursoAsig(1);
                            setOptatividadAsig("Obligatoria")
                        }}>Insertar asignatura</button>
                        <button type="button" onClick={(_e) => {
                            setAsignaturas([]);
                            setNombreAsig("");
                            setCursoAsig(1);
                            setCreditosAsig(4);
                        }}>Reiniciar asignaturas</button>
                    </div>
                    <div className="error">{asignaturaError}</div>
                </div>
                <div className="column">
                    <label htmlFor="creditos">Creditos TFM:</label>
                    <input name="creditos" type="number" defaultValue="10" min="1" max="30" onChange={(e) => setCreditos(Math.trunc(Number(e.currentTarget.value)))}/>
                </div>
                <div className="buttons">
                    <button type="reset" onClick={handleReset}>Vaciar todos los campos</button>
                    <button type="button" onClick={handleCreation}>Enviar</button>
                </div>
            </form>
            <div>
                <h3>Datos de la titulación:</h3>
                <div>
                    <p>Nombre de la titulación: {nombre}</p>
                </div>
                {
                    universidades.length !== 0 &&
                    <div>
                        <span>Universidades insertadas:</span>
                        <ul>
                            {
                                universidades.map((uni) => {
                                    return(
                                        <li key={uni}>{uni}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                }
                {
                    grados.length !== 0 &&
                    <div>
                        <span>Grados insertados:</span>
                        <ul>
                        {
                            grados.map((grado) => {
                                return(
                                    <li key={grado}>{grado}</li>
                                )
                            })
                        }
                        </ul>
                    </div>
                }
                <div>
                    <p>Cursos en los que se desarrolla la titulación: {cursos}</p>
                </div>
                <div>
                    <p>Convocatorias posibles de los alumnos en cada asignatura: {convocatorias}</p>
                </div>
                {
                    asignaturas.length !== 0 &&
                    <div>
                        <span>Asignaturas:</span>
                        <ul>
                            {
                                asignaturas.map((asig) => {
                                    return(
                                        <li key={asig.nombre}>{asig.nombre} ({asig.curso}, {asig.creditos} ECTS, {asig.optatividad})</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                }
                <div>
                    <p>Creditos del TFM: {creditosTFM}</p>
                </div>
            </div>
        </div>
    );
}

export default NewTitulacion;
