import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ADD_SUCCESS, CONTINUE_BUTTON, FAMILY_SITUATION, NEW_PATIENT_FORM, SOCIO_SITUATION } from 'src/assets/constants/generalConstants.constants';
import { DatePipe } from '@angular/common';
import { NewPatient } from 'src/app/models/newPatient.model';
import { PatientService } from 'src/app/services/patient/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CivilStatus } from 'src/app/models/civilStatus.model';
import { Gender } from 'src/app/models/gender.model';
import { City } from 'src/app/models/city.model';
import { Physician } from 'src/app/models/physician.model';
import { NewSocioEcoSituation } from 'src/app/models/newSocioEcoSituation.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RelativeComponent } from '../relative/relative.component';
import { NewRelative } from 'src/app/models/newRelative.model';
import { NewPhysicianComponent } from '../../physician/new-physician/new-physician.component';
import { PatientConstants } from 'src/assets/constants/patients/patient.constants';
import { SocialReportConstants } from 'src/assets/constants/patients/socialReport.constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss'],
})
export class NewPatientComponent implements OnInit {

  public title = NEW_PATIENT_FORM;
  public titleSocioEco = SOCIO_SITUATION;
  public titleFamily = FAMILY_SITUATION;
  public form!: FormGroup;
  public formSocioEcoSituation!: FormGroup;
  public minDate: Date;
  public maxDate: String | null;
  public newPatient!: NewPatient;
  public patientId!: string;
  public genders: Gender[] = [];
  public cities: City[] = [];
  public physicians: Physician[] = [];
  public newSocioEcoSituation!: NewSocioEcoSituation;
  public newRelative!: NewRelative;
  public relatives: NewRelative[] = [];
  public update: Boolean = false;
  public newPhysician!: Physician;
  public patientConstants = PatientConstants;
  public reportConstants = SocialReportConstants;
  public totalExpenses: number = 0;
  public expenses: number[] = [];

  constructor(private datePipe: DatePipe, public patientService: PatientService, private route: ActivatedRoute, 
              private router: Router,  private dialog: MatDialog, private _snackBar: MatSnackBar) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 110, 0, 1);
    this.maxDate = this.datePipe.transform((new Date), 'MM/dd/yyyy');
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      patientName: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      patientFirstLastName: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      patientSecondLastName: new FormControl(null, [Validators.maxLength(500)]),
      patientCellphone: new FormControl(null, [Validators.required]),
      patientPhone: new FormControl(null),
      patientDateOfBirth: new FormControl(null, [Validators.required]),
      patientOccupation: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      familySituation: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      socioEcoSituationId: new FormControl(null),
      genderId: new FormControl(null, [Validators.required]),
      civilStatus: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      medicalDiagnostic: new FormControl(null, [Validators.maxLength(2000)]),
      reference: new FormControl(null, [Validators.maxLength(2000)]),
      surgeryDate: new FormControl(null),
      hospitalizationDate: new FormControl(null),
      treatingPhysicianId: new FormControl(null),
      placeOfBirth: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      placeOfResidence: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
    });

    this.formSocioEcoSituation = new FormGroup({
      dependentMembers: new FormControl(null),
      totalIncome: new FormControl(null),
      housing: new FormControl(null, [Validators.maxLength(1000)]),
      tenancy: new FormControl(null, [Validators.maxLength(1000)]),
      numberOfRooms: new FormControl(null),
      totalExpenses: new FormControl(null),
      waterConsumption: new FormControl(null),
      electricityConsumption: new FormControl(null),
      livingPlaceConsumption: new FormControl(null),
      feedingConsumption: new FormControl(null),
      educationConsumption: new FormControl(null),
      telephoneConsumption: new FormControl(null),
      transportationConsumption: new FormControl(null),
      healthConsumption: new FormControl(null),
      otherConsumption: new FormControl(null),
      waterConsumptionDetail: new FormControl(null, [Validators.maxLength(1000)]),
      electricityConsumptionDetail: new FormControl(null, [Validators.maxLength(1000)]),
      livingPlaceConsumptionDetail: new FormControl(null, [Validators.maxLength(1000)]),
      feedingConsumptionDetail: new FormControl(null, [Validators.maxLength(1000)]),
      educationConsumptionDetail: new FormControl(null, [Validators.maxLength(1000)]),
      telephoneConsumptionDetail: new FormControl(null, [Validators.maxLength(1000)]),
      transportationConsumptionDetail: new FormControl(null, [Validators.maxLength(1000)]),
      healthConsumptionDetail: new FormControl(null, [Validators.maxLength(1000)]),
      otherConsumptionDetail: new FormControl(null, [Validators.maxLength(1000)]),
    });
    this.getGenders();
    this.getCities();
    this.getPhysicians();
    this.setupTotalExpenses();
  }

  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  public hasErrorSocioEcoSituation = (controlName:string, errorName:string) =>{
    return this.formSocioEcoSituation.controls[controlName].hasError(errorName);
  }

  public save() {
    this.newPatient = this.form.value;
    this.newSocioEcoSituation = this.formSocioEcoSituation.value;
    this.newSocioEcoSituation.totalExpenses = this.totalExpenses;
    this.patientService.addPatient(this.newPatient).subscribe(data => {
      this.patientService.addSocioEcoSituation(this.newSocioEcoSituation, data.patientId).subscribe();  
      const relatives = this.patientService.addRelativeList(this.relatives, data.patientId);
      for(let i = 0; i < relatives.length; i++){
        relatives[i].subscribe();
      }
    });
    this.openSnackBar(ADD_SUCCESS, CONTINUE_BUTTON);
    this.router.navigate(['/patients/list']);
  }

  public addRelative() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(RelativeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.relatives.push(result);
        this.update = !this.update
      }
    });
  }

  public getGenders(): void {
    this.patientService.getGenders()
    .subscribe(genders => this.genders = genders);
  }

  public addPhysician(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(NewPhysicianComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.physicians.push(result);
        this.form.setValue({
          treatingPhysicianId: result.treatingPhysicianId,
        });
      }
    });
  }
  
  public getCities(): void {
    this.patientService.getCities()
    .subscribe(cities => this.cities = cities);
  }

  public getPhysicians(): void {
    this.patientService.getPhysicians()
    .subscribe(physicians => this.physicians = physicians);
  }

  public setupTotalExpenses(): void {
    for(let i=0; i<9; i++){
      this.expenses[i] = 0;
    }
  }

  public setTotalExpenses(): void {
    this.totalExpenses = 0;
    for(let i=0; i<9; i++){
      if(this.expenses[i] !== 0){
        this.totalExpenses = this.totalExpenses + (this.expenses[i] * 1);
      }
    }
  }

  public setExpense(data: any, position: number){
    this.expenses[position] = data;
    this.setTotalExpenses();
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
