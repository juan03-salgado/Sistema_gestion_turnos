import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Turno } from '../../models/turno';
import { GestorTurnosService } from '../../services/gestor-turnos.service';
import { EstadoTurno } from '../../models/estado-turno';
import { PlanificadorTurnosService } from '../../services/planificador-turnos.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [FormsModule, RouterLink], 
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent {
  paciente: string = '';
  tipoAtencion: string = '';
  tiempoCPU: number = 0;

  turnoGenerado: Turno | null = null;

  constructor(private gestor: GestorTurnosService,
    private planificador: PlanificadorTurnosService
  ) {}

  seleccionarAtencion(tipo: string): void {

    if(this.tipoAtencion === tipo) {
      this.tipoAtencion = '';
      this.tiempoCPU = 0;
      return;
    }

    this.tipoAtencion = tipo;

    switch (tipo) {
      case 'Consulta inicial':
        this.tiempoCPU = 5;
        break;

      case 'Consulta de control':
        this.tiempoCPU = 3;
        break;

      case 'Autorización de medicamentos':
        this.tiempoCPU = 2;
        break;
      
      case 'Autorización de citas':
        this.tiempoCPU = 2;
        break;

      case 'Procedimientos médicos':
        this.tiempoCPU = 6;
        break;
      
      case 'Atención prioritaria':
        this.tiempoCPU = 4;
        break;

      default:
        this.tiempoCPU = 0;
  }
}

  generarTurno(): void {
    if(!this.paciente.trim() || !this.tipoAtencion) {
      return;
    }

    const nuevoTurno = new Turno(
      0,
      '',
      this.paciente,
      this.tipoAtencion,
      this.tiempoCPU,
      this.tiempoCPU,
      EstadoTurno.LISTO,
      0
    );

    const turno = this.gestor.crearTurno(nuevoTurno);

    this.turnoGenerado = turno;
    this.planificador.agregarTurno(turno);

    this.paciente = '';
    this.tipoAtencion = '';
    this.tiempoCPU = 0;
  }

  cerrarComprobante(): void {
    this.turnoGenerado = null;
  }
}
