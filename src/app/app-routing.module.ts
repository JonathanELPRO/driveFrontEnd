import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa los componentes
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DocumentsComponent } from './documents/documents.component';
import { AuthGuard } from './guards/auth.guard'; // Importa el guard


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'documents', component: DocumentsComponent , canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Ruta por defecto
  { path: '**', redirectTo: '/login' } // Ruta comodín en caso de rutas no definidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Se configura el enrutamiento
  exports: [RouterModule]  // Se exporta para que se use en otros módulos
})
export class AppRoutingModule { }


