
export interface OpcionesRespuesta {
    option: string;
    isText: boolean;
}

export interface SubPreguntas {
    id: number;
    texto: string;
    puntaje: number;
    id_pregunta: number;
}
export interface Preguntas {
    id: number;
    nombre: string;
    puntaje: number;
    id_seccion: number;
    isAffirmativeQuestion: boolean;
    isText: boolean;
    subPreguntas: SubPreguntas[]; // Opcionalmente, puedes añadir subPreguntas aquí
}


