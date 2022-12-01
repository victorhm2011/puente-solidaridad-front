import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'home',
    component: HomeComponent,
  },
  {
    path: 'patients',
    loadChildren: () => import('./components/patient/patient.module').then(m => m.PatientModule)
  },
  {
    path: 'physicians',
    loadChildren: () => import('./components/physician/physician.module').then(m => m.PhysicianModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
