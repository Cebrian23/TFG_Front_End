import type { Titulacion_Short } from "../Titulacion/Titulacion";

export type Administrativo = {
    id: string,
    nombre: string;
    apellido_1: string;
    apellido_2?: string;
    DNI: string;
    prefijo_movil?: string;
    numero_movil?: string;
    email: string;
    rol: "Administrativo";
    titulaciones: Titulacion_Short[],
}

export type Administrativo_Short = {
    id: string;
    nombre: string;
    apellido_1: string;
    apellido_2?: string;
    email: string;
    rol: "Administrativo",
}