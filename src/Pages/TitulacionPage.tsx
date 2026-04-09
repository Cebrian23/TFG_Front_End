import { useEffect, useState } from "react";
import type { Titulacion } from "../types/Titulacion/Titulacion";
import Cookie from "js-cookie";
import type { Administrativo_Short } from "../types/Personas/Administrativo";

function TitulacionPage() {
    const [titulacion, setTitulacion] = useState<Titulacion>();
    const [showUnis, setShowUnis] = useState(false);
    const [showGrados, setShowGrados] = useState(false);
    const [showAsigs, setShowAsigs] = useState(false);
    const [showTFM, setShowTFM] = useState(false);

    useEffect(() => {
        const getTitulacion = async () => {
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

            if(data_user.rol !== "Administrativo"){
                globalThis.location.href = "/paginaPersonal";
            }

            const TFG_titulacion = Cookie.get("TFG_titulacion");

            if(TFG_titulacion === undefined){
                globalThis.location.href = "/paginaPersonal";
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

            const data_titulacion = await response_titulacion.json();

            const admin = data_titulacion.administrativos.find((administrativo: Administrativo_Short) => {
                if(administrativo.id === auth){
                    return administrativo;
                }
            });

            if(admin === undefined){
                globalThis.location.href = "/paginaPersonal";
            }

            setTitulacion(data_titulacion);
        }

        getTitulacion();
    }, []);

    return(
        <>
            {
                titulacion !== undefined &&
                <div>
                    <h1>Página de {titulacion.nombre}</h1>
                    <div>
                        <p><b>Nombre de la titulación: </b>{titulacion.nombre}</p>
                    </div>
                    <div>
                        <button type="button" onClick={() => setShowUnis(!showUnis)}>{showUnis === false ? <>Mostrar universidades involucradas</> : <>Ocultar universidades involucradas</>}</button>
                        {
                            showUnis === true && titulacion.universidades.length === 1 &&
                            <p>
                                <b>Universidad involucrada: </b>
                                {
                                    titulacion.universidades.map((uni) => {
                                        return(
                                            <span key={uni}>{uni}</span>
                                        )
                                    })
                                }
                            </p>
                        }
                        {
                            showUnis === true && titulacion.universidades.length > 1 &&
                            <>
                                <p><b>Universidades involucradas:</b></p>
                                <ul>
                                    {
                                        titulacion.universidades.map((uni) => {
                                            return(
                                                <li key={uni}>{uni}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </>
                        }
                    </div>
                    {
                        showUnis === false &&
                        <br/>
                    }
                    <div>
                        <button type="button" onClick={() => setShowGrados(!showGrados)}>{showGrados === false ? <>Mostrar cursos requeridos</> : <>Ocultar cursos requeridos</>}</button>
                        {
                            showGrados === true && titulacion.grados_aptos.length === 1 &&
                            <p>
                                <b>Grado requerido para optar a la titulación: </b>
                                {
                                    titulacion.grados_aptos.map((grado) => {
                                        return(
                                            <span key={grado}>{grado}</span>
                                        )
                                    })
                                }
                            </p>
                        }
                        {
                            showGrados === true && titulacion.grados_aptos.length > 1 &&
                            <>
                                <p><b>Grados requeridos para optar a la titulación: </b></p>
                                <ul>
                                    {
                                        titulacion.grados_aptos.map((grado) => {
                                            return(
                                                <li key={grado}>{grado}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </>
                        }
                    </div>
                    {
                        showGrados === false &&
                        <br/>
                    }
                    <div>
                        <button type="button" onClick={() => setShowAsigs(!showAsigs)}>{showAsigs === false ? <>Mostrar asignaturas</> : <>Ocultar asignaturas</>}</button>
                        {
                            showAsigs === true && titulacion.asignaturas.length === 1 &&
                            <p>
                                <b>Asignatura: </b>
                                {
                                    titulacion.asignaturas.map((asig) => {
                                        return(
                                            <span key={asig.id}>{asig.nombre} ({asig.curso}, {asig.creditos} ECTS, {asig.optatividad})</span>
                                        )
                                    })
                                }
                            </p>
                        }
                        {
                            showAsigs === true && titulacion.asignaturas.length > 1 &&
                            <>
                                <p><b>Asignaturas:</b></p>
                                <ul>
                                    {
                                        titulacion.asignaturas.map((asig) => {
                                            return(
                                                <li key={asig.id}>{asig.nombre} ({asig.curso}, {asig.creditos} ECTS, {asig.optatividad})</li>
                                            )
                                        })
                                    }
                                </ul>
                            </>
                        }
                    </div>
                    {
                        showAsigs === false &&
                        <br/>
                    }
                    <div>
                        <button type="button" onClick={() => setShowTFM(!showTFM)}>{showTFM === false ? <>Mostrar datos del TFM</> : <>Ocultar datos del TFM</>}</button>
                        {
                            showTFM === true &&
                            <>
                                <p><b>Datos del TFM:</b></p>
                                <ul>
                                    <li>Curso: {titulacion.TFM.curso}</li>
                                    <li>Créditos: {titulacion.TFM.creditos} ECTS</li>
                                </ul>
                            </>
                        }
                    </div>
                    {
                        showTFM === false &&
                        <br/>
                    }
                    <button type="button" onClick={() => globalThis.location.href = "/mostrarTitulaciones"}>Volver</button>
                </div>
            }
        </>
    );
}

export default TitulacionPage;