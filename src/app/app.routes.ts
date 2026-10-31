import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { PantallaTurnosComponent } from './components/pantalla-turnos/pantalla-turnos.component';
import { GestionAtencionComponent } from './components/gestion-atencion/gestion-atencion.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'solicitar-turno', component: SolicitarTurnoComponent },
    { path: 'pantalla-turnos', component: PantallaTurnosComponent },
    { path: 'gestion-atencion', component: GestionAtencionComponent },
    { path: '**', redirectTo: ''},
];
