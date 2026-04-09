import { useEffect, useState } from "react"
import './Forms.css'
import { Validate_Email } from "../utilities/Validations/Validate_Email";
import type { Coordinador } from "../types/Personas/Coordinador";
import type { Estudiante } from "../types/Personas/Estudiante";
import type { Profesor } from "../types/Personas/Profesor";
import type { Administrativo } from "../types/Personas/Administrativo";
import Cookie from "js-cookie";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emptyError, setEmptyError] = useState("");
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        const Verify_Id = () => {
            const auth = Cookie.get("authTFG");

            if(auth !== undefined){
                globalThis.location.href = "/paginaPersonal";
            }
        }

        Verify_Id();
    }, []);

    const handleReset = () => {
        setEmail("");
        setPassword("");
        
        setEmailError("");
        setPasswordError("");
        setEmptyError("");
        setValidationError("");
    }

    const handleLogin = async () => {
        let error_exists = false;

        const email_aux = email.trim();
        const password_aux = password.trim();
        if(email_aux === "" || password_aux === ""){
            setEmptyError("Hay que rellenar todos los parámetros");
            error_exists = true;
        }
        else if(email_aux === "" && password_aux !== ""){
            setEmailError("Hay que rellenar este campo");
            error_exists = true;
        }
        else if(email_aux !== "" && password_aux === ""){
            setPasswordError("Hay que rellenar este campo");
            error_exists = true;
        }

        if(email_aux !== ""){
            const validate_email = await Validate_Email(email);

            if(validate_email.status !== 200){
                const objeto = await validate_email.json();
                setValidationError(objeto.error);
                error_exists = true;
            }
        }
        
        if(error_exists === false){
            const URL = `http://localhost:4000/login?email=${email}&password=${password}`;
            const response = await fetch(URL, {
                method: "GET",
            });

            if(response.status !== 200){
                const error = await response.json();
                alert(error.error);
            }
            else{
                const data: (Coordinador | Estudiante | Profesor | Administrativo) = await response.json();

                Cookie.set("authTFG", data.id, {expires: 7});
            
                globalThis.location.href = "/paginaPersonal";
            }
        }
    }
    
    return (
        <div>
            <form className="loginForm" onSubmit={(e) => e.preventDefault()}>
                <h2>Inicio de sesión</h2>
                <div className="column">
                    <label htmlFor="email">Email:</label>
                    <input id="email" name="email" type="text" placeholder="Email" onChange={(e) => {
                        setEmail(e.currentTarget.value);
                        setEmptyError("");
                        setEmailError("");
                        setValidationError("");
                    }}/>
                    <div className="error">{emailError}</div>
                    <div className="error">{validationError}</div>
                </div>
                <div className="column">
                    <label htmlFor="password">Password:</label>
                    <input id="password" name="password" type="password" placeholder="Password" onChange={(e) => {
                        setPassword(e.currentTarget.value);
                        setPasswordError("");
                        setEmptyError("");
                    }}/>
                    <div className="error">{passwordError}</div>
                </div>
                <div className="error">{emptyError}</div>
                <div className="buttons">
                    <button type="reset" onClick={handleReset}>Vaciar campos</button>
                    <button type="button" onClick={handleLogin}>Enviar</button>
                </div>
            </form>
        </div>
    )
}

export default Login;