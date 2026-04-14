import type { Coordinador_Short } from "../Personas/Coordinador"
import type { Estudiante_Short } from "../Personas/Estudiante"
import type { Profesor_Short } from "../Personas/Profesor"
import type { Convocatoria } from "./Convocatoria"

export type TFM_Block = {
    id: string,
    curso: "2º" | string,
    creditos: number,
    TFM: TFM[],
    tipo: "Bloque TFMs",
}

export type TFM_Block_Short = {
    id: string,
    curso: "2º" | string,
    creditos: number,
    tipo: "Bloque TFMs",
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