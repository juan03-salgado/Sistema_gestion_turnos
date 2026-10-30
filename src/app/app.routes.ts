import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { PantallaTurnosComponent } from './components/pantalla-turnos/pantalla-turnos.component';
import { PanelSimulacionComponent } from './components/panel-simulacion/panel-simulacion.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'solicitar-turno', component: SolicitarTurnoComponent },
    { path: 'pantalla-turnos', component: PantallaTurnosComponent },
    { path: 'panel-simulacion', component: PanelSimulacionComponent },
    { path: '**', redirectTo: ''},
];
