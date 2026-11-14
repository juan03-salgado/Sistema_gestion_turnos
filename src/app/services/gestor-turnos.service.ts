import { Injectable } from '@angular/core';
import { Turno } from '../models/turno';
import { EstadoTurno } from '../models/estado-turno';

@Injectable({
  providedIn: 'root'
})
export class GestorTurnosService {

  private turnos: Turno[] = [];
  private contadorTurnos: number = 1;
  private tiempoActual: number = 0;

  private listaPrefijos = [
    { tipo: 'Atención prioritaria', letra: 'P' },
    { tipo: 'Consulta inicial', letra: 'M' },
    { tipo: 'Consulta de control', letra: 'M' },
    { tipo: 'Procedimientos médicos', letra: 'PR' },
    { tipo: 'Entrega de medicamentos', letra: 'F' },
    { tipo: 'Autorización de medicamentos', letra: 'A' },
    { tipo: 'Autorización de citas', letra: 'A' },
    { tipo: 'Trámite administrativo', letra: 'A' }
  ];

  constructor() { }

  crearTurno(turno: Turno): Turno {

    if (!turno.paciente.trim() || turno.tiempoCPU <= 0) {
      throw new Error('Los datos del turno no son válidos');
    }

    const encontrado = this.listaPrefijos.find(item => item.tipo === turno.tipoAtencion);
    const prefijo = encontrado ? encontrado.letra : 'A';
    
    const nuevoTurno = new Turno(
      this.contadorTurnos,
      `${prefijo}-${String(this.contadorTurnos).padStart(3, '0')}`,
      turno.paciente,
      turno.tipoAtencion,
      turno.tiempoCPU,
      turno.tiempoCPU,
      EstadoTurno.LISTO,
      this.tiempoActual
    );

    this.turnos.push(nuevoTurno);
    this.contadorTurnos++;
    return nuevoTurno;
  }

  getTurnos(): Turno[] {
    return [...this.turnos];
  }

  getTurnosListos(): Turno[] {
    return this.turnos.filter(turno => turno.estado === EstadoTurno.LISTO);
  }

  getTurnosEnEjecucion(): Turno[] {
    return this.turnos.filter(turno => turno.estado === EstadoTurno.EN_EJECUCION);
  }

  getTurnosBloqueados(): Turno[] {
    return this.turnos.filter(turno => turno.estado === EstadoTurno.BLOQUEADO);
  }

  getTurnosFinalizados(): Turno[] {
    return this.turnos.filter(turno => turno.estado === EstadoTurno.FINALIZADO);
  }

  getTurnosNoPresentados(): Turno[] {
    return this.turnos.filter(turno => turno.estado === EstadoTurno.NO_PRESENTADO);
  }

  getTurnoId(id: number): Turno | undefined {
    return this.turnos.find(turno => turno.id === id);
  }

  actualizarEstado(id: number, nuevoEstado: EstadoTurno): void {
    const turno = this.getTurnoId(id);

    if(turno) {
      turno.estado = nuevoEstado;
    }
  }

  actualizarTiempoRestante(id: number, tiempoRestante: number): void {
    const turno = this.getTurnoId(id);

    if(turno) {
      turno.tiempoRestante = Math.max(0, tiempoRestante);
    }
  }

  actualizarTiempoActual(tiempo: number): void {
    this.tiempoActual = tiempo;
  }

  getTiempoActual(): number {
    return this.tiempoActual;
  }

  marcarNoPresentado(id: number): boolean {
    const turno = this.getTurnoId(id);

    if(!turno || (turno.estado !== EstadoTurno.LISTO && turno.estado !== EstadoTurno.EN_EJECUCION)) {
      return false;
    }

    turno.estado = EstadoTurno.NO_PRESENTADO;
    return true;
  }

  getCantidadTurnos(): number {
    return this.turnos.length;
  }

  reiniciarTurnos(): void {
    this.turnos = [];
    this.contadorTurnos = 1;
    this.tiempoActual = 0;
  }
}
