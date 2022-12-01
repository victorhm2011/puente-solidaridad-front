import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { HomeLogoComponent } from './components/home/home-logo/home-logo.component';
import { HomeCardComponent } from './components/home/home-card/home-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { PatientComponent } from './components/patient/patient.component';
import { PatientsListComponent } from './components/patient/patients-list/patients-list.component';
import { NewPatientComponent } from './components/patient/new-patient/new-patient.component';
import { SocialReportComponent } from './components/patient/social-report/social-report.component';
import { ShowPatientComponent } from './components/patient/show-patient/show-patient.component';
import { WrapperComponent } from './components/patient/wrapper/wrapper.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RelativeComponent } from './components/patient/relative/relative.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RelativeListComponent } from './components/patient/relative-list/relative-list.component';
import { DialogBoxComponent } from './components/common/dialog-box/dialog-box.component';
import { PhysicianListComponent } from './components/physician/physician-list/physician-list.component';
import { PhysicianWrapperComponent } from './components/physician/physician-wrapper/physician-wrapper.component';
import { ShowPhysicianComponent } from './components/physician/show-physician/show-physician.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { NewPhysicianComponent } from './components/physician/new-physician/new-physician.component';
import { AidListComponent } from './components/aid/aid-list/aid-list.component';
import { AidComponent } from './components/aid/aid/aid.component';
import { UserWrapperComponent } from './components/users/user-wrapper/user-wrapper.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserComponent } from './components/users/user/user.component';
import { SurgeryComponent } from './components/surgery/surgery/surgery.component';
import { HospitalComponent } from './components/surgery/hospital/hospital.component';
import { ResponsibleComponent } from './components/surgery/responsible/responsible.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    HomeLogoComponent,
    HomeCardComponent,
    PatientComponent,
    PatientsListComponent,
    NewPatientComponent,
    SocialReportComponent,
    WrapperComponent,
    ShowPatientComponent,
    RelativeComponent,
    RelativeListComponent,
    DialogBoxComponent,
    PhysicianListComponent,
    PhysicianWrapperComponent,
    ShowPhysicianComponent,
    NewPhysicianComponent,
    AidListComponent,
    AidComponent,
    UserWrapperComponent,
    UserListComponent,
    UserComponent,
    SurgeryComponent,
    HospitalComponent,
    ResponsibleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
