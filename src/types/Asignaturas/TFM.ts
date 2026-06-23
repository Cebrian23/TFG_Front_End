import type { Coordinador_Short } from "../Personas/Coordinador.ts";
import type { Estudiante_Short } from "../Personas/Estudiante.ts";
import type { Profesor_Short } from "../Personas/Profesor.ts";
import type { Convocatoria } from "./Convocatoria.ts";

export type TFM_Block = {
    id: string,
    curso: "2º" | string,
    creditos: number,
    //TFM: TFM[],
    cursos: TFM_Block_Curso[],
    optatividad: "Obligatoria",
    tipo: "Bloque TFMs",
}

export type TFM_Block_Short = {
    id: string,
    curso: "2º" | string,
    creditos: number,
    tipo: "Bloque TFMs",
    titulacion: string,
}

export type TFM_Block_Curso = {
    id: string,
    nombre: string,
    alumnos: Estudiante_Short[],
    TFM: TFM[],
    tipo: "Curso TFM",
}

export type TFM_Block_Curso_ins = {
    nombre: string,
    alumnos: string[],
    titulacion: string,
}

export type TFM = {
    id: string,
    bloque: string,
    titulo: string,
    curso_academico: string,
    estudiante: Estudiante_Short,
    director: (Profesor_Short | Coordinador_Short)[],
    miembros_tribunal: (Profesor_Short | Coordinador_Short)[],
    fecha_defensa: string,
    hora_defensa: string,
    convocatoria: Convocatoria,
    tipo: "TFM",
}

export type TFM_ins = {
    titulacion?: string,
    titulo: string,
    curso: string,
    alumno: string,
    director: string[],
    tribunal: string[],
    fecha_def: string,
    hora_def: string,
    convocatoria: string,
    nota: string | number,
}

export type TFM_alumno = {
    TFM: string,
    bloque: string,
    titulo: string,
    curso_academico: string,
    fecha_defensa: string,
    convocatoria: Convocatoria,
    tipo: "TFM",
}