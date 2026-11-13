import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Turno } from '../../models/turno';
import { Algoritmo, PlanificadorTurnosService } from '../../services/planificador-turnos.service';
import { GestorTurnosService } from '../../services/gestor-turnos.service';

@Component({
  selector: 'app-gestion-atencion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gestion-atencion.component.html',
  styleUrl: './gestion-atencion.component.css'
})
export class GestionAtencionComponent implements OnInit{

  turnoActual: Turno | null = null;
  cola: Turno[] = [];
  bloqueados: Turno[] = [];
  cubiculo: number = 1;
  notificacion: string = '';

  constructor(private planificador: PlanificadorTurnosService,
    private gestor: GestorTurnosService
  ) {}

  ngOnInit(): void {
    this.actualizarDatos();
  }

  llamarSiguiente(): void {
    if (this.turnoActual) {
      return;
    }

    this.turnoActual = this.planificador.llamarSiguiente(this.cubiculo, 'FIFO');

    if(this.turnoActual){
      this.notificacion = `Se ha llamado al turno ${this.turnoActual.numero}.`;
    } else {
      this.notificacion = 'No hay solicitudes pendientes';
    }

    this.actualizarDatos();
  }

  finalizarAtencion(): void {
    if(!this.turnoActual) {
      return;
    }

    const numero = this.turnoActual.numero;
    this.planificador.finalizarAtencion('FIFO');
    this.notificacion = `La atención del turno ${numero} ha finalizado. Puede llamar al siguiente paciente.`;

    this.actualizarDatos();
  }

  bloquearAtencion(): void {
    if (!this.turnoActual) {
      return;
    }

    const turno = this.planificador.bloquearAtencion('FIFO');

    if (turno) {
      this.notificacion = `El turno ${turno.numero} ha sido pausado.`;
    }

    this.actualizarDatos();
  }

  bloquearTurnoPendiente(turno: Turno): void {
    const bloqueado = this.planificador.bloquearTurnoEnCola(turno.id, 'FIFO');

    if (!bloqueado) {
      this.notificacion = `No fue posible bloquear el turno ${turno.numero}.`;
      return;
    }

    this.notificacion = `El turno ${bloqueado.numero} ha sido pausado correctamente.`;
    this.actualizarDatos();
  }

  reincorporarTurno(turno: Turno): void {
    this.planificador.desbloquearAtencion(turno);
    this.notificacion = `El turno ${turno.numero} ha regresado a la cola de espera.`;

    this.actualizarDatos();
  }

  marcarNoPresentado(turno: Turno): void {
    const algoritmo = this.planificador.obtenerAlgoritmo(turno);
    const marcado = this.gestor.marcarNoPresentado(turno.id);

    if(marcado) {
      this.planificador.retirarTurno(turno.id, algoritmo);
      this.notificacion = `El turno ${turno.numero} ha sido marcado como no presentado.`;
    }

    this.actualizarDatos();
  }

  actualizarDatos(): void {
    this.turnoActual = this.planificador.obtenerTurnoActual('FIFO');

    this.cola = this.planificador.obtenerCola('FIFO');

    this.bloqueados = this.gestor.getTurnosBloqueados().filter(turno => this.planificador.obtenerAlgoritmo(turno) === 'FIFO');

  }

  esPrioritario(turno: Turno): boolean {
    return turno.tipoAtencion === 'Atención prioritaria';
  }
} 
