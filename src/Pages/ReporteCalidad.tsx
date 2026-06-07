import { useEffect } from "react";
import Header from "../Header/Header.tsx";
import SidebarAdministrativo from "../Sidebar/SidebarAdministrativo.tsx";
import Cookie from "js-cookie";

function ReporteCalidad() {
    useEffect(() => {
        const getData = async () => {
            const id_user = Cookie.get("authTFG");

            if(id_user === undefined){
                globalThis.location.href = "/login";
            }
            
            const url_persona = `https://tfg-back-end.onrender.com/persona/id?id=${id_user}`;
            const response_persona = await fetch(url_persona, {
                method: "GET",
            });

            if(response_persona.status !== 200){
                const error = await response_persona.json();
                alert(error.error);

                Cookie.remove("authTFG");
                globalThis.location.href = "/login";
            }

            const data = await response_persona.json();

            if(data.rol !== "Administrativo"){
                alert("Tienes que ser un administrtivo para dar de alta a otras personas");

                globalThis.location.href = "/login";
            }
        }

        getData();
    }, []);

    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <SidebarAdministrativo/>
                <div className="">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}

export default ReporteCalidad;