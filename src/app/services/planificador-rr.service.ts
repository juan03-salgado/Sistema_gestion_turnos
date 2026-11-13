import { Injectable } from '@angular/core';
import { Turno } from '../models/turno';
import { EstadoTurno } from '../models/estado-turno';

@Injectable({
  providedIn: 'root'
})
export class PlanificadorRrService {

  private cola: Turno[] = [];
  private turnoActual: Turno | null = null;
  private tiempoActual: number = 0;
  private quantum: number = 3;
  private tiempoQuantum: number = 0;

  constructor() { }

  agregarTurno(turno: Turno): void {

    const esSolicitudValida = turno.tipoAtencion === 'Entrega de medicamentos' || turno.tipoAtencion === 'Trámite administrativo';

    if(esSolicitudValida && turno.estado === EstadoTurno.LISTO && !this.cola.some(t => t.id === turno.id) && this.turnoActual?.id !== turno.id) {
      this.cola.push(turno);
    }
  }

  obtenerSiguienteTurno(): Turno | null {
    if(this.turnoActual) {
      return this.turnoActual;
    }

    while(this.cola.length > 0) {
      const siguiente = this.cola.shift()!; 

      if(siguiente.estado === EstadoTurno.LISTO) {
        this.turnoActual = siguiente;  
        siguiente.estado = EstadoTurno.EN_EJECUCION; 
        this.tiempoQuantum = 0;  

        return siguiente;     
      }
    }
    return null;
  }

  ejecutarUnidad(): Turno | null {
    const turno = this.obtenerSiguienteTurno();

    if(!turno){   
      this.tiempoActual++;
      return null;
    }

    turno.tiempoRestante--;
    this.tiempoActual++;
    this.tiempoQuantum++;

    if(turno.tiempoRestante <= 0) {
      turno.tiempoRestante = 0;
      turno.estado = EstadoTurno.FINALIZADO;
      this.turnoActual = null;
      this.tiempoQuantum = 0;

    } else if (this.tiempoQuantum >= this.quantum) {
      turno.estado = EstadoTurno.LISTO;
      this.turnoActual = null;
      this.tiempoQuantum = 0;
      this.cola.push(turno);
    }
    return turno;
  }

  bloquearTurno(): Turno | null{
    if(!this.turnoActual) {
      return null;
    }

    const bloqueado = this.turnoActual;
    bloqueado.estado = EstadoTurno.BLOQUEADO;
    this.turnoActual = null;
    this.tiempoQuantum = 0;

    return bloqueado;
  }

  bloquearTurnoEnCola(id: number): Turno | null {
    const turno = this.cola.find(t => t.id === id);

    if (!turno || turno.estado !== EstadoTurno.LISTO) {
      return null;
    }

    this.cola = this.cola.filter(t => t.id !== id);
    turno.estado = EstadoTurno.BLOQUEADO;

    return turno;
  }

  desbloquearTurno(turno: Turno): void {
    if(turno.estado !== EstadoTurno.BLOQUEADO){
      return;
    }

    turno.estado = EstadoTurno.LISTO;
    this.agregarTurno(turno);
  }

  configurarQuantum(nuevoQuantum: number): void {
    if(Number.isInteger(nuevoQuantum) && nuevoQuantum > 0) {
      this.quantum = nuevoQuantum;
    }
  }

  obtenerQuantum(): number {
    return this.quantum;
  }

  obtenerTiempoQuantum(): number {
    return this.tiempoQuantum;
  }

  obtenerCola(): Turno[] {
    return [...this.cola];
  }

  obtenerTurnoActual(): Turno | null {
    return this.turnoActual;
  }

  obtenerTiempoActual(): number {
    return this.tiempoActual;
  }

  retirarTurno(id: number): void {
    this.cola = this.cola.filter(t => t.id !== id);

    if (this.turnoActual?.id === id) {
      this.turnoActual = null;
      this.tiempoQuantum = 0;
    }
  }

  reiniciar(): void {
    this.cola = [];
    this.turnoActual = null;
    this.tiempoActual = 0;
    this.tiempoQuantum = 0;
  }

  finalizarTurno(): void {
    if (!this.turnoActual) {
      return;
    }

    this.turnoActual.tiempoRestante = 0;
    this.turnoActual.estado = EstadoTurno.FINALIZADO;
    this.turnoActual = null;
    this.tiempoQuantum = 0;
  }
}
