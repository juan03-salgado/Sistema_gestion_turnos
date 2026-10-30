export class Proceso {
    constructor(
        public id: number,
        public nombre: string,
        public tiempoCPU: number,
        public tiempoRestante: number,
        public tiempoLlegada: number,
        public estado: string
    ) {}
}
