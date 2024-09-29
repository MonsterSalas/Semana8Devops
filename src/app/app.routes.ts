import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecoveryComponent } from './components/recovery/recovery.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { ListaPersonasComponent } from './components/lista-personas/lista-personas.component';


export const routes: Routes = [
    { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'recovery', component: RecoveryComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminComponent},
    { path: 'lista-personas', component: ListaPersonasComponent}
];
