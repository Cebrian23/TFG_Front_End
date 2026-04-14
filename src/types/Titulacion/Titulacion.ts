import type { Asignatura_Short } from "../Asignaturas/Asignatura"
import type { TFM_Block_Short } from "../Asignaturas/TFM"
import type { Administrativo_Short } from "../Personas/Administrativo"
import type { Coordinador_Short } from "../Personas/Coordinador"
import type { Estudiante_Short } from "../Personas/Estudiante"
import type { Profesor_Short } from "../Personas/Profesor"

export type Titulacion = {
    id: string,
    nombre: string,
    universidades: string[],
    grados_aptos: string[],
    cursos: number,
    convocatorias_disponibles: number,
    asignaturas: Asignatura_Short[],
    TFM: TFM_Block_Short,
    administrativos: Administrativo_Short[],
    docentes: (Coordinador_Short | Profesor_Short)[],
    alumnos: Estudiante_Short[],
}

export type Titulacion_ins = {
    nombre: string,
    universidades: string[],
    grados_aptos: string[],
    cursos: number,
    convocatorias: number,
    asignaturas?: {nombre: string, curso: string, creditos: number}[],
    creditos_TFM: number,
    administrativo: string,
}

export type Titulacion_upt = {
    id: string,
    nombre: string,
    cursos: number,
    convocatorias: number,
    creditos_TFM: number,
}

export type Titulacion_Short = {
    id: string,
    nombre: string,
}