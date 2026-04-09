import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import type { Estudiante } from "../types/Personas/Estudiante";
import type { Coordinador } from "../types/Personas/Coordinador";
import type { Profesor } from "../types/Personas/Profesor";
import type { Administrativo } from "../types/Personas/Administrativo";
import { Validate_Email } from "../utilities/Validations/Validate_Email";
import { Validate_Phone } from "../utilities/Validations/Validate_Phone";
import type { Persona_upt } from "../types/Personas/Persona";

function UpdateUser() {
    const [user, setUser] = useState<Estudiante | Coordinador | Profesor | Administrativo>();
    const [id, setId] = useState("");
    const [rol, setRol] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido1, setApellido1] = useState("");
    const [apellido2, setApellido2] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [prefix, setPrefix] = useState("+34");
    const [phone, setPhone] = useState("");

    //const [universidad, setUniversidad] = useState("");
    //const [universidades, setUniversidades] = useState<string[]>([]);

    const [nombreError, setNombreError] = useState("");
    const [apellido1Error, setApellido1Error] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [password1Error, setPassword1Error] = useState("");
    const [password2Error, setPassword2Error] = useState("");
    const [passLengthError, setPassLengthError] = useState("");
    const [passCharError, setPassCharError] = useState("");
    const [passNumError, setPassNumError] = useState("");
    const [passSpaceError, setPassSpaceError] = useState("");

    useEffect(() => {
        const getUser = async () => {
            const auth = Cookie.get("authTFG");
            if(auth === undefined){
                globalThis.location.href = "/login";
            }

            const url = `http://localhost:4000/persona/id?id=${auth}`;
            const response = await fetch(url, {
                method: "GET",
            });

            if(response.status !== 200){
                const error = await response.json();
                alert(error.error);
            }
            
            const data = await response.json();
            setUser(data);
            setId(data.id);
            setRol(data.rol);
            setNombre(data.nombre);
            setApellido1(data.apellido_1);
            if(data.apellido_2 !== null && data.apellido_2 !== undefined && data.apellido_2 !== ""){
                setApellido2(data.apellido_2);
            }
            else{
                setApellido2("");
            }
            setEmail(data.email);
            if(data.prefijo_movil !== null && data.prefijo_movil !== undefined && data.prefijo_movil !== ""){
                setPrefix(data.prefijo_movil);
            }
            else{
                setPrefix("+34");
            }
            if(data.numero_movil !== null && data.numero_movil !== undefined && data.numero_movil !== ""){
                setPhone(data.numero_movil);
            }
            else{
                setPhone("");
            }
        }

        getUser();
    }, []);

    const handleReset = () => {
        if(user !== undefined){
            setNombre(user.nombre);
            setApellido1(user.apellido_1);
            setEmail(user.email);
            setApellido1(user.apellido_1);

            if(user.apellido_2 !== null && user.apellido_2 !== undefined && user.apellido_2 !== ""){
                setApellido2(user.apellido_2);
            }
            else{
                setApellido2("");
            }

            if(user.prefijo_movil !== null && user.prefijo_movil !== undefined && user.prefijo_movil !== ""){
                setPrefix(user.prefijo_movil);
            }
            else{
                setPrefix("+34");
            }

            if(user.numero_movil !== null && user.numero_movil !== undefined && user.numero_movil !== ""){
                setPhone(user.numero_movil);
            }
            else{
                setPhone("");
            }

            setNombreError("");
            setApellido1Error("");
            setEmailError("");
            setPhoneError("");
            setPassword1Error("");
            setPassword2Error("");
            setPassLengthError("");
            setPassCharError("");
            setPassNumError("");
            setPassSpaceError("");
        }
    }

    const handleUpdate = async () => {
        let error_exists = false;

        if(nombre.trim() === ""){
            setNombreError("Hay que rellenar este campo");
            error_exists = true;
        }
    
        if(apellido1.trim() === ""){
            setApellido1Error("Hay que rellenar este campo");
            error_exists = true;
        }
    
        if(email.trim() === ""){
            setEmailError("Hay que rellenar este campo");
            error_exists = true;
        }
        else{
            const email_data = await Validate_Email(email);
    
            if(email_data.status !== 200){
                const error = await email_data.json();
    
                setEmailError(error.error);
                error_exists = true;
            }
        }
    
        if(user !== undefined && user.rol !== "Estudiante"){
            /*
            if(password1.trim() === ""){
                setPassword1Error("Hay que rellenar este campo");
                error_exists = true;
            }
            else if(password1.length < 12 && password1.length !== 0){
                setPassLengthError("El tamaño de la contraseña debe tener, al menos, 12 caracteres");
                error_exists = true;
            }
            */
            if(password1.trim() !== ""){
                let chars_count: number = 0;
                let nums_count: number = 0;
                let space_count: number = 0;
        
                const Pas_split = password1.split("");
                const Pas_ASCII = Pas_split.map((a) => a.charCodeAt(0));
        
                Pas_ASCII.forEach((a) => {
                    if(a>=48 && a<=57){
                        nums_count = nums_count+1;
                    }
                    else if((a>=65 && a<=90) || (a>=97 && a<=122)){
                        chars_count = chars_count+1;
                    }
                    else if(a == 32){
                        space_count = space_count+1;
                    }
                });
        
                if(chars_count === 0 && password1.length !== 0){
                    setPassCharError("Necesitas insertar en la contraseña alguna letra");
                    error_exists = true;
                }
        
                if(nums_count === 0 && password1.length !== 0){
                    setPassNumError("Necesitas insertar en la contraseña algún número");
                    error_exists = true;
                }
        
                if(space_count !== 0 && password1.length !== 0){
                    setPassSpaceError("No puede haber espacios en la contraseña");
                    error_exists = true;
                }

                if((password1.trim() !== password2.trim()) && (passCharError === "" && passNumError === "" && passSpaceError === "" && password1Error === "")){
                    setPassword2("La contraseña y su validación deben ser iguales");
                    error_exists = true;
                }
            }
        }
    
        if(phoneError === "" && phone !== ""){
            const phone_data = await Validate_Phone(prefix, phone);
        
            if(phone_data.status !== 200){
                const error = await phone_data.json();
    
                setPhoneError(error.error);
                error_exists = true;
            }
        }

        if(error_exists === false){
            const body: Persona_upt = {
                id: id,
                rol: rol,
                nombre: nombre,
                apellido_1: apellido1,
                email: email,
            }

            if(apellido2.trim() !== ""){
                body.apellido_2 = apellido2;
            }

            if(rol !== "Estudiante" && password1.trim() !== ""){
                body.password = password1;
            }

            if(phone.trim() !== ""){
                body.prefijo_movil = prefix;
                body.numero_movil = phone;
            }

            const url = "http://localhost:4000/datos_persona";
            const response = await fetch(url, {
                method: "PUT",
                body: JSON.stringify(body),
            });

            if(response.status !== 200){
                const error = await response.json();
                alert(error.error);

                globalThis.location.href = "/paginaPersonal";
            }
            
            const data = await response.json();
            alert(data.message);

            globalThis.location.href = "/paginaPersonal";
        }
    }

    return(
        <div>
            <form className="registerForm">
                <h2>Actualización de datos de usuario</h2>
                <div className="column">
                    <label htmlFor="nombre">Nombre:</label>
                    <input id="nombre" name="nombre" type="text" value={nombre} placeholder="Nombre" onChange={(e) => {
                        setNombre(e.currentTarget.value);
                        setNombreError("");
                    }} required/>
                    <div className="error">{nombreError}</div>
                </div>
                <div className="column">
                    <label htmlFor="1er_apellido">1er Apellido:</label>
                    <input id="1er_apellido" name="1er_apellido" type="text" value={apellido1} placeholder="1er Apellido" onChange={(e) => {
                        setApellido1(e.currentTarget.value);
                        setApellido1Error("");
                    }} required/>
                    <div className="error">{apellido1Error}</div>
                </div>
                <div className="column">
                    <label htmlFor="2do_apellido">2do Apellido:</label>
                    <input id="2do_apellido" name="2do_apellido" type="text" value={apellido2} placeholder="2do Apellido" onChange={(e) => setApellido2(e.currentTarget.value)}/>
                </div>
                <div className="column">
                    <label htmlFor="phone_number">Numero telefónico:</label>
                    <div id="phone_number" className="combo_data">
                        <select id="prefix" name="prefix" value={prefix !== "" ? prefix : "+34"} className="registerPhoneInput" onChange={(e) => setPrefix(e.currentTarget.value)}>
                            <option value="+30">+30</option>
                            <option value="+31">+31</option>
                            <option value="+32">+32</option>
                            <option value="+33">+33</option>
                            <option value="+34">+34</option>
                            <option value="+39">+39</option>
                            <option value="+49">+49</option>
                            <option value="+351">+351</option>
                        </select>
                        <input id="phone" name="phone" type="text" value={phone} placeholder="Número telefónico" className="registerPhoneSelect" onChange={(e) => {
                            setPhone(e.currentTarget.value);
                            setPhoneError("");
                        }}/>
                    </div>
                    <div className="">{phoneError}</div>
                </div>
                <div className="column">
                    <label htmlFor="email">Email:</label>
                    <input id="email" name="email" type="text" value={email} placeholder="Email" onChange={(e) => {
                        setEmail(e.currentTarget.value);
                        setEmailError("");
                    }} required/>
                    <div className="error">{emailError}</div>
                </div>
                {
                    rol !== "Estudiante" &&
                    <>
                        <div className="column">
                            <label htmlFor="password">Password:</label>
                            <input id="password" name="password" type="password" placeholder="Password" onChange={(e) => {
                                setPassword1(e.currentTarget.value);
                                setPassword1Error("");
                                setPassCharError("");
                                setPassLengthError("");
                                setPassNumError("");
                                setPassSpaceError("");
                            }} required/>
                            <div className="error">{password1Error}</div>
                            <div className="error">{passCharError}</div>
                            <div className="error">{passLengthError}</div>
                            <div className="error">{passNumError}</div>
                            <div className="error">{passSpaceError}</div>
                        </div>
                        <div className="column">
                            <label htmlFor="validation">Validacion:</label>
                            <input id="validation" name="validation" type="password" placeholder="Validation" onChange={(e) => {
                                setPassword2(e.currentTarget.value);
                                setPassword2Error("");
                            }} required/>
                            <div className="error">{password2Error}</div>
                        </div>
                    </>
                }
                {
                    /*user !== undefined && user.rol !== "Administrativo" &&
                    <div className="column">
                        <label htmlFor="universidad">Universidad:</label>
                        <select id="universidad" name="universidad" defaultValue={universidades[0]} onChange={(e) => setUniversidad(e.currentTarget.value)}>
                            {
                                universidades.map((uni) => {
                                    return(
                                        <option key={uni} value={uni}>{uni}</option>
                                    );
                                })
                            }
                            {
                                user.rol === "Profesor" &&
                                <option key="Externo" value="Externo">Externo</option>
                            }
                        </select>
                    </div>*/
                }
                {
                    /*user !== undefined && user.rol === "Estudiante" &&
                    <>
                        <div className="column">
                            <label htmlFor="curso">Curso de admisión:</label>
                            <input id="curso" name="curso" type="number" min="2020" max="2060" value={curso} onChange={(e) => {
                                setCursito(Number(e.currentTarget.value));
                                setCurso(`Curso ${Math.trunc(Number(e.currentTarget.value))}-${Math.trunc(Number(e.currentTarget.value)+1)}`);
                            }}/>
                        </div>
                        <div className="column">
                            <label htmlFor="grado">Grado univesitario cursado:</label>
                            <select id="grado" name="grado" defaultValue={gradosUniversitarios[0]} onChange={(e) => setGrado(e.currentTarget.value)}>
                                {
                                    gradosUniversitarios.map((grado) => {
                                        return(
                                            <option key={grado} value={grado}>{grado}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </>*/
                }
                <div className="buttons">
                    <button type="button" onClick={() => globalThis.location.href = "/paginaPersonal"}>Volver atras</button>
                    <button type="button" onClick={handleReset}>Vaciar campos</button>
                    <button type="button" onClick={handleUpdate}>Enviar</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateUser;