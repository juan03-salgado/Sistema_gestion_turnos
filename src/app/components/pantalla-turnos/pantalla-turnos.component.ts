import { Component, OnDestroy, OnInit } from '@angular/core';
import { Turno } from '../../models/turno';
import { GestorTurnosService } from '../../services/gestor-turnos.service';
import { PlanificadorTurnosService } from '../../services/planificador-turnos.service';

@Component({
  selector: 'app-pantalla-turnos',
  standalone: true,
  imports: [],
  templateUrl: './pantalla-turnos.component.html',
  styleUrl: './pantalla-turnos.component.css'
})
export class PantallaTurnosComponent implements OnInit, OnDestroy {

  turnosActuales: Turno[] = [];
  turnosEspera: Turno[] = []; 

  private intervalo: any = null;

  constructor(private planificador: PlanificadorTurnosService) {}

  ngOnInit(): void {
    this.actualizarPantalla();

    this.intervalo = setInterval(() => {
      this.actualizarPantalla();
    }, 500);
  }

  actualizarPantalla(): void {
    const turnoFifo = this.planificador.obtenerTurnoActual('FIFO');
    const turnoRr = this.planificador.obtenerTurnoActual('RR');

    this.turnosActuales = [];

    if(turnoFifo) {
      this.turnosActuales.push(turnoFifo);
    }

    if(turnoRr) {
      this.turnosActuales.push(turnoRr);
    }

    this.turnosEspera = [...this.planificador.obtenerCola('FIFO'), ...this.planificador.obtenerCola('RR')
    ].sort((a, b) => a.tiempoLlegada - b.tiempoLlegada || a.id - b.id);
  }
  
  ngOnDestroy(): void {
    if(this.intervalo !== null) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }
}
