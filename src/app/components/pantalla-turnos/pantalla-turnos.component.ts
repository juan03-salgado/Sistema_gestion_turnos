import { Component, OnDestroy, OnInit } from '@angular/core';
import { Turno } from '../../models/turno';
import { GestorTurnosService } from '../../services/gestor-turnos.service';

@Component({
  selector: 'app-pantalla-turnos',
  standalone: true,
  imports: [],
  templateUrl: './pantalla-turnos.component.html',
  styleUrl: './pantalla-turnos.component.css'
})
export class PantallaTurnosComponent implements OnInit, OnDestroy {

  turnoActual: Turno | null = null;
  turnosEspera: Turno[] = []; 

  private intervalo: any = null;

  constructor(private gestor: GestorTurnosService
    
  ) {}

  ngOnInit(): void {
    this.actualizarPantalla();

    this.intervalo = setInterval(() => {
      this.actualizarPantalla();
    }, 500);
  }

  actualizarPantalla(): void {
    const enEjecucion = this.gestor.getTurnosEnEjecucion();

    this.turnoActual = enEjecucion.length > 0 ? enEjecucion[0] : null;

    this.turnosEspera = this.gestor.getTurnosListos().sort((a, b) => a.tiempoLlegada - b.tiempoLlegada || a.id - b.id);
  }
  
  ngOnDestroy(): void {
    if(this.intervalo !== null) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }
}
