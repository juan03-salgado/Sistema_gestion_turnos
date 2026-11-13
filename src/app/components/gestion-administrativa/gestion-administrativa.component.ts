import { Component, OnInit } from '@angular/core';
import { Turno } from '../../models/turno';
import { PlanificadorTurnosService } from '../../services/planificador-turnos.service';
import { GestorTurnosService } from '../../services/gestor-turnos.service';
import { EstadoTurno } from '../../models/estado-turno';

@Component({
  selector: 'app-gestion-administrativa',
  standalone: true,
  imports: [],
  templateUrl: './gestion-administrativa.component.html',
  styleUrl: './gestion-administrativa.component.css'
})
export class GestionAdministrativaComponent implements OnInit {

  turnoActual: Turno | null = null;
  cola: Turno[] = [];
  bloqueados: Turno[] = [];
  notificacion: string = '';

  private temporizador: any;

  constructor(private planificador: PlanificadorTurnosService,
    private gestor: GestorTurnosService
  ) {}

  ngOnInit(): void {
    this.actualizarDatos();
  }

  obtenerIndicaciones(): string[] {
    if(!this.turnoActual) {
      return [];
    }

    switch (this.turnoActual.tipoAtencion) {
    case 'Entrega de medicamentos':
      return [
        'Verificar la identidad del paciente.',
        'Comprobar la fórmula o autorización médica.',
        'Verificar la disponibilidad de los medicamentos.',
        'Registrar la entrega correspondiente.'
      ];

    case 'Trámite administrativo':
      return [
        'Consultar el motivo del trámite.',
        'Verificar los documentos requeridos.',
        'Revisar la información proporcionada.',
        'Registrar y confirmar la realización del trámite.'
      ];

    default:
      return [
        'Verificar la información de la solicitud.',
        'Realizar el procedimiento correspondiente.',
        'Confirmar la atención al paciente.'
      ];
    }
  }

  llamarSiguiente(): void {
    if (this.turnoActual) {
      return;
    }

    this.turnoActual = this.planificador.llamarSiguiente(3, 'RR');

    if (this.turnoActual) {
      this.notificacion =
        `Se ha llamado a la solicitud ${this.turnoActual.numero}.`;
    } else {
      this.notificacion = 'No hay solicitudes pendientes.';
    }

    this.actualizarDatos();

    if(this.turnoActual) {
      this.iniciarProcesamiento();
    }
  }

  iniciarProcesamiento(): void {

    if (this.temporizador) {
      return;
    }

    this.temporizador = setInterval(() => {
      const turno = this.planificador.ejecutarUnidadRR();

      if(turno?.estado === EstadoTurno.FINALIZADO){
        this.notificacion = `La solicitud ${turno.numero} ha finalizado.`;

      } else if (turno?.estado === EstadoTurno.LISTO) {
        this.notificacion = `La solicitud ${turno.numero} regresó a la cola.`;
      }

      this.actualizarDatos();

      if(!this.turnoActual && this.cola.length === 0) {
        clearInterval(this.temporizador);
        this.temporizador = null;
      }
    }, 5000);
  }

  pausarGestion(): void {
    if (!this.turnoActual) {
      return;
    }

    const turno = this.planificador.bloquearAtencion('RR');

    if (turno) {
      this.notificacion = `La solicitud ${turno.numero} ha sido pausada.`;
    }

    this.actualizarDatos();
  }

  pausarSolicitudPendiente(turno: Turno): void {
    const bloqueado =
      this.planificador.bloquearTurnoEnCola(turno.id, 'RR');

    if (!bloqueado) {
      this.notificacion = `No fue posible pausar la solicitud ${turno.numero}.`;
      return;
    }

    this.notificacion = `La solicitud ${bloqueado.numero} ha sido pausada correctamente.`;

    this.actualizarDatos();
  }

  reincorporarSolicitud(turno: Turno): void {
    this.planificador.desbloquearAtencion(turno);

    this.notificacion = `La solicitud ${turno.numero} ha regresado a la cola de espera.`;
    this.actualizarDatos();
  }

  marcarNoPresentado(turno: Turno): void {
    const marcado = this.gestor.marcarNoPresentado(turno.id);

    if (marcado) {
      this.planificador.retirarTurno(turno.id, 'RR');

      this.notificacion = `La solicitud ${turno.numero} ha sido marcada como no presentada.`;
    }

    this.actualizarDatos();
  }

  actualizarDatos(): void {
    this.turnoActual =
      this.planificador.obtenerTurnoActual('RR');

    this.cola =
      this.planificador.obtenerCola('RR');

    this.bloqueados = this.gestor.getTurnosBloqueados()
      .filter(turno =>
        this.planificador.obtenerAlgoritmo(turno) === 'RR'
      );
  }
}
