import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import SidebarCoordinador from "../Sidebar/SidebarCoordinador.tsx";
import Header from "../Header/Header.tsx";
import type { Administrativo_Short } from "../types/Personas/Administrativo.ts";

function ShowNotasUniversidad() {
    const [asignatura, setAsignatura] = useState("");
    const [alumnos, setAlumnos] = useState("");

    useEffect(() => {
        const getData = async () => {
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

            if(data_user.rol !== "Coordinador" && data_user.rol !== "Coordinador general"){
                alert("Tienes que ser un coordinador para poder ver los datos para hacer el control de calidad");
                globalThis.location.href = "/paginaPersonal";
            }

            const TFG_titulacion = Cookie.get("TFG_titulacion");

            if(TFG_titulacion === undefined){
                globalThis.location.href = "/paginaPersonal"
            }

            const url_titulacion = `http://localhost:4000/titulacion?id=${TFG_titulacion}`;
            const response_titulacion = await fetch(url_titulacion, {
                method: "GET",
            });

            if(response_titulacion.status !== 200){
                const error = await response_titulacion.json();
                alert(error);

                globalThis.location.href = "/paginaPersonal";
            }

            const data_titulacion = await response_titulacion.json();

            const admin_error: Administrativo_Short | undefined = data_titulacion.administrativos.find((admin: Administrativo_Short) => {
                if(admin.id === auth){
                    return auth;
                }
            });

            if(admin_error !== undefined){
                alert("No administras esta titulación");

                globalThis.location.href = "/paginaPersonal";
            }
        }

        getData();
    }, []);

    return(
         <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <SidebarCoordinador/>
                <div className="">
                    <form className="">
                        <div></div>
                    </form>
                    <div></div>
                </div>
            </div>
        </div>
    );
}

export default ShowNotasUniversidad;