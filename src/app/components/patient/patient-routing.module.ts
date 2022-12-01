import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPatientComponent } from './new-patient/new-patient.component';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { ShowPatientComponent } from './show-patient/show-patient.component';
import { SocialReportComponent } from './social-report/social-report.component';
import { WrapperComponent } from './wrapper/wrapper.component';

const routes: Routes = [
    {
        path: '',
        component: WrapperComponent,
        children: [
            {
              path: 'list',
              component: PatientsListComponent
            },
            {
              path: 'new',
              component: NewPatientComponent
            },
            {
              path: 'social-report',
              component: SocialReportComponent
            },
            {
              path: 'show-patient/:id',
              component: ShowPatientComponent
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }