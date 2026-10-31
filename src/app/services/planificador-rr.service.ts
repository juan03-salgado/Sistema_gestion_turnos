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
    if(turno.estado === EstadoTurno.LISTO && !this.cola.some(t => t.id === turno.id) && this.turnoActual?.id !== turno.id) {
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

  obtenerCola(): Turno[] {
    return [...this.cola];
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

  desbloquearTurno(turno: Turno): void {
    if(turno.estado !== EstadoTurno.BLOQUEADO){
      return;
    }

    turno.estado = EstadoTurno.LISTO;
    this.agregarTurno(turno);
  }

  configurarQuantum(nuevoQuantum: number): void {
    if(nuevoQuantum > 0) {
      this.quantum = nuevoQuantum;
    }
  }

  obtenerTurnoActual(): Turno | null {
    return this.turnoActual;
  }

  obtenerTiempoActual(): number {
    return this.tiempoActual;
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
  }
}
