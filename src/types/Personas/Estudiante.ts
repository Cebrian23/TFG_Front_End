import type { Asignatura_alumno } from "../Asignaturas/Asignatura"
import type { TFM_alumno } from "../Asignaturas/TFM"

export type Estudiante = {
    id: string,
    nombre: string,
    apellido_1: string,
    apellido_2?: string,
    DNI: string,
    prefijo_movil?: string,
    numero_movil?: string,
    email: string,
    password?: string,
    rol: "Estudiante",
    grado_academico: string,
    universidad: string,
    curso_admision: string,
    asignaturas_cursadas: (TFM_alumno | Asignatura_alumno)[],
    asignaturas_aprobadas: (TFM_alumno | Asignatura_alumno)[],
}

export type Estudiante_Short = {
    id: string,
    nombre: string,
    apellido_1: string,
    apellido_2?: string,
    DNI: string,
    email: string,
    rol: "Estudiante",
}