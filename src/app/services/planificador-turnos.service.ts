import { Injectable } from '@angular/core';
import { PlanificadorFifoService } from './planificador-fifo.service';
import { PlanificadorRrService } from './planificador-rr.service';
import { Turno } from '../models/turno';

export type Algoritmo = 'FIFO' | 'RR';

@Injectable({
  providedIn: 'root'
})
export class PlanificadorTurnosService {
  
  constructor(private fifo: PlanificadorFifoService,
    private rr: PlanificadorRrService
  ) { }

  obtenerAlgoritmo(turno: Turno): Algoritmo {
    if(turno.tipoAtencion === 'Entrega de medicamentos' || turno.tipoAtencion === 'Trámite administrativo') {
      return 'RR';
    }
    return 'FIFO';
  }

  agregarTurno(turno: Turno): void {
    if(this.obtenerAlgoritmo(turno) === 'RR'){
      this.rr.agregarTurno(turno);
    } else {
      this.fifo.agregarTurno(turno);
    }
  }

  llamarSiguiente(cubiculo: number, algoritmo: Algoritmo): Turno | null {
    const turno = algoritmo === 'FIFO' ? this.fifo.obtenerSiguienteTurno() : this.rr.obtenerSiguienteTurno();

    if(turno) {
      turno.cubiculo = cubiculo;
    }
    return turno;
  }

  finalizarAtencion(algoritmo: Algoritmo): void {
    if (algoritmo === 'FIFO') {
      this.fifo.finalizarTurno();
    } else {
      this.rr.finalizarTurno();
    }
  }

  obtenerCola(algoritmo: Algoritmo): Turno[] {
    return algoritmo === 'FIFO'
      ? this.fifo.obtenerCola()
      : this.rr.obtenerCola();
  }

  obtenerTurnoActual(algoritmo: Algoritmo): Turno | null {
    return algoritmo === 'FIFO'
      ? this.fifo.obtenerTurnoActual()
      : this.rr.obtenerTurnoActual();
  }
  
  bloquearAtencion(algoritmo: Algoritmo): Turno | null {
    return algoritmo === 'FIFO' ? this.fifo.bloquearTurno() : this.rr.bloquearTurno();
  }

  bloquearTurnoEnCola(id: number, algoritmo: Algoritmo): Turno | null {
    return algoritmo === 'FIFO' ? this.fifo.bloquearTurnoEnCola(id): this.rr.bloquearTurnoEnCola(id);
  }

  desbloquearAtencion(turno: Turno): void {
    if (this.obtenerAlgoritmo(turno) === 'RR') {
      this.rr.desbloquearTurno(turno);
    } else {
      this.fifo.desbloquearTurno(turno);
    }
  }

  retirarTurno(id: number, algoritmo: Algoritmo): void {
    if (algoritmo === 'FIFO') {
      this.fifo.retirarTurno(id);
    } else {
      this.rr.retirarTurno(id);
    }
  }

  ejecutarUnidadRR(): Turno | null {
    return this.rr.ejecutarUnidad();
  }

  configurarQuantumRR(nuevoQuantum: number): void {
    this.rr.configurarQuantum(nuevoQuantum);
  }

  obtenerQuantumRR(): number {
    return this.rr.obtenerQuantum();
  }

  obtenerTiempoQuantumRR(): number {
    return this.rr.obtenerTiempoQuantum();
  }
}
