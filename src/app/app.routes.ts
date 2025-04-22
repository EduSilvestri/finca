import { Routes } from '@angular/router';
import { VisitaComponent } from './views/visita/visita.component';
import { AnimalesComponent } from './views/animales/animales.component';
import { NosotrosComponent } from './views/nosotros/nosotros.component';
import { RegistroComponent } from './views/registro/registro.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { AdminAnimalesComponent } from './views/admin/admin-animales/admin-animales.component';
import { AdminVisitasComponent } from './views/admin/admin-visitas/admin-visitas.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'nosotros', component: NosotrosComponent },
    { path: 'animales', component: AnimalesComponent, canActivate: [AuthGuard] },
    { path: 'visita', component: VisitaComponent, canActivate: [AuthGuard] },
    { path: 'admin/animales', component: AdminAnimalesComponent, canActivate: [AdminGuard] },
    { path: 'admin/visitas', component: AdminVisitasComponent, canActivate: [AdminGuard] }
];
