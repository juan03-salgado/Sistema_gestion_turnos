import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Turno } from '../../models/turno';
import { PlanificadorTurnosService } from '../../services/planificador-turnos.service';

@Component({
  selector: 'app-gestion-atencion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gestion-atencion.component.html',
  styleUrl: './gestion-atencion.component.css'
})
export class GestionAtencionComponent implements OnInit, OnDestroy{

  turnoActual: Turno | null = null;
  cola: Turno[] = [];
  consultorio: number = 1;

  private intervalo: any = null;

  constructor(private planificador: PlanificadorTurnosService) {}

  ngOnInit(): void {
    this.actualizarDatos();

    this.intervalo = setInterval(() => {
      this.actualizarDatos();
    }, 500);
  }

  llamarSiguiente(): void {
    if (this.turnoActual) {
      return;
    }

    this.turnoActual = this.planificador.llamarSiguiente(this.consultorio);
    this.actualizarDatos();
  }

  finalizarAtencion(): void {
    if(!this.turnoActual) {
      return;
    }

    this.planificador.finalizarAtencion();
    this.turnoActual = null;
    this.actualizarDatos();
  }

  actualizarDatos(): void {
    this.turnoActual = this.planificador.obtenerTurnoActual();
    this.cola = this.planificador.obtenerCola();
  }

  ngOnDestroy(): void {
    if(this.intervalo !== null) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }
} 
