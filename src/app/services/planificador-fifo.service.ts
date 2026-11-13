import { Injectable } from '@angular/core';
import { Turno } from '../models/turno';
import { EstadoTurno } from '../models/estado-turno';

@Injectable({
  providedIn: 'root'
})
export class PlanificadorFifoService {

  private cola: Turno[] = [];
  private turnoActual: Turno | null = null;
  private tiempoActual: number = 0;

  constructor() { }

  agregarTurno(turno: Turno): void {
    if(turno.estado === EstadoTurno.LISTO && !this.cola.some(t => t.id === turno.id) && this.turnoActual?.id !== turno.id) {
      this.cola.push(turno);
      this.ordenarCola();
    }
  }

  private turnoPrioritario(turno: Turno): boolean{
    return turno.tipoAtencion === 'Atención prioritaria';
  }

  private ordenarCola(): void {
    this.cola.sort((a, b) => {
      if(this.turnoPrioritario(a) != this.turnoPrioritario(b)) {
        return this.turnoPrioritario(a) ? -1 : 1;
      }

      if(a.tiempoLlegada !== b.tiempoLlegada) {
        return a.tiempoLlegada - b.tiempoLlegada;
      }

      return a.id - b.id;
    });
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
        return siguiente;
      }
    }
    return null;
  }

  ejecutarUnidad(): Turno | null {
    const turno = this.obtenerSiguienteTurno();

    if(!turno) {
      this.tiempoActual++;
      return null;
    }

    turno.tiempoRestante--;
    this.tiempoActual++;

    if(turno.tiempoRestante <= 0) {
      turno.tiempoRestante = 0;
      turno.estado = EstadoTurno.FINALIZADO;
      this.turnoActual = null;
    }
    return turno;
  }

  bloquearTurno(): Turno | null {
    if(!this.turnoActual) {
      return null;
    }
    const bloqueado = this.turnoActual;
    bloqueado.estado = EstadoTurno.BLOQUEADO;
    this.turnoActual = null;
    return bloqueado;
  }

  bloquearTurnoEnCola(id: number): Turno | null {
    const turno = this.cola.find(turno => turno.id === id);
    
    if(!turno || turno.estado !== EstadoTurno.LISTO) {
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
    turno.tiempoLlegada = this.tiempoActual;

    this.agregarTurno(turno);
  }

  retirarTurno(id: number): void {
    this.cola = this.cola.filter(turno => turno.id !== id);

    if(this.turnoActual?.id === id) {
      this.turnoActual = null;
    }
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

  reiniciar(): void {
    this.cola = [];
    this.turnoActual = null;
    this.tiempoActual = 0;
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
