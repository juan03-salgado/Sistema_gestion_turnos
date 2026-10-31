import { Injectable } from '@angular/core';
import { PlanificadorFifoService } from './planificador-fifo.service';
import { PlanificadorRrService } from './planificador-rr.service';
import { Turno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class PlanificadorTurnosService {
  
  private algoritmo: string = 'FIFO';

  constructor(private fifo: PlanificadorFifoService,
    private rr: PlanificadorRrService
  ) { }

  agregarTurno(turno: Turno): void {
    if(this.algoritmo === 'FIFO'){
      this.fifo.agregarTurno(turno);
    } else {
      this.rr.agregarTurno(turno);
    }
  }

  llamarSiguiente(consultorio: number): Turno | null {
    const turno = this.algoritmo === 'FIFO' ? this.fifo.obtenerSiguienteTurno() : this.rr.obtenerSiguienteTurno();

    if(turno) {
      turno.consultorio = consultorio;
    }
    return turno;
  }

  finalizarAtencion(): void {
    if (this.algoritmo === 'FIFO') {
      this.fifo.finalizarTurno();
    } else {
      this.rr.finalizarTurno();
    }
  }

  obtenerCola(): Turno[] {
    return this.algoritmo === 'FIFO'
      ? this.fifo.obtenerCola()
      : this.rr.obtenerCola();
  }

  obtenerTurnoActual(): Turno | null {
    return this.algoritmo === 'FIFO'
      ? this.fifo.obtenerTurnoActual()
      : this.rr.obtenerTurnoActual();
  }  
}
