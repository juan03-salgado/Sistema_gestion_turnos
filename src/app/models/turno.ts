import { EstadoTurno } from './estado-turno';

export class Turno {
    constructor(
        public id: number, 
        public numero: string,
        public paciente: string,
        public tipoAtencion: string,
        public tiempoCPU: number,
        public tiempoRestante: number,
        public estado: EstadoTurno,
        public tiempoLlegada: number,
        public cubiculo?: number
    ){}
}
