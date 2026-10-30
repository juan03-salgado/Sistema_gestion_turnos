import { Injectable } from '@angular/core';
import { GestorTurnosService } from './gestor-turnos.service';
import { PlanificadorFifoService } from './planificador-fifo.service';
import { PlanificadorRrService } from './planificador-rr.service';
import { Turno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class SimuladorService {
  
  private algoritmo: string = 'FIFO';
  private intervalo: any = null;
  private velocidad: number = 1000;

  constructor(private gestor: GestorTurnosService, 
    private fifo: PlanificadorFifoService,
    private rr: PlanificadorRrService
  ) { }

  seleccionarAlgoritmo(algoritmo: string): void {
    this.algoritmo = algoritmo;
  }

  agregarTurno(turno: Turno): void {
    if(this.algoritmo === 'FIFO'){
      this.fifo.agregarTurno(turno);
    } else {
      this.rr.agregarTurno(turno);
    }
  }

  ejecutarPaso(): Turno | null {
    let turno: Turno | null = null;

    if(this.algoritmo === 'FIFO'){
      turno = this.fifo.ejecutarUnidad();
    } else {
      turno = this.rr.ejecutarUnidad();
    }

    this.gestor.actualizarTiempoActual(this.obtenerTiempoActual());
    return turno;
  }

  iniciar(): void {
    if(this.intervalo !== null) {
      return;
    }

    this.intervalo = setInterval(() => {
      this.ejecutarPaso();
    }, this.velocidad);
  }

  pausar(): void {
    if(this.intervalo !== null) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  configurarQuantum(quantum: number): void {
    this.rr.configurarQuantum(quantum);
  }

  obtenerCola(): Turno[] {
    return this.algoritmo === 'FIFO' ? this.fifo.obtenerCola() : this.rr.obtenerCola();
  }

  obtenerTurnoActual(): Turno | null {
    return this.algoritmo === 'FIFO' ? this.fifo.obtenerTurnoActual() : this.rr.obtenerTurnoActual();
  }

  obtenerTiempoActual(): number {
    return this.algoritmo === 'FIFO' ? this.fifo.obtenerTiempoActual() : this.rr.obtenerTiempoActual();
  }

  reiniciar(): void {
    this.pausar();
    this.fifo.reiniciar();
    this.rr.reiniciar();
    this.gestor.reiniciarTurnos();
  }
}
