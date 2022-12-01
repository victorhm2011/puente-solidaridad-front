import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from 'src/app/services/patient/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONTINUE_BUTTON, DELETE_FAIL, DELETE_SUCCESS, FAMILY_SITUATION, SHOW_PATIENT, SOCIO_SITUATION, UPDATE_FAIL, UPDATE_SUCCESS } from 'src/assets/constants/generalConstants.constants';
import { CivilStatus } from 'src/app/models/civilStatus.model';
import { Gender } from 'src/app/models/gender.model';
import { City } from 'src/app/models/city.model';
import { DatePipe } from '@angular/common';
import { Physician } from 'src/app/models/physician.model';
import { SocioEcoSituation } from 'src/app/models/socioEcoSituation.model';
import { NewRelative } from 'src/app/models/newRelative.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RelativeComponent } from './relative/relative.component';
import { DialogBoxComponent } from '../common/dialog-box/dialog-box.component';
import { CommonConstants } from 'src/assets/constants/commonConstants.constants';
import { NewPhysicianComponent } from '../physician/new-physician/new-physician.component';
import { PatientConstants } from 'src/assets/constants/patients/patient.constants';
import { SocialReportConstants } from 'src/assets/constants/patients/socialReport.constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  public id!: string;
  public patient!: Patient;
  public editPatient!: Patient;
  public form!: FormGroup;
  public messageAccion = CONTINUE_BUTTON;
  public title = SHOW_PATIENT;
  public titleSocioEco = SOCIO_SITUATION;
  public genders: Gender[] = [];
  public cities: City[] = [];
  public minDate: Date;
  public maxDate: String | null;
  public physicians: Physician[] = [];
  public socioEcoSituation!: SocioEcoSituation;
  public editSocioEcoSituation!: SocioEcoSituation;
  public formSocioEcoSituation!: FormGroup;
  public newRelative!: NewRelative;
  public relatives: NewRelative[] = [];
  public update: Boolean = false;
  public titleFamily = FAMILY_SITUATION;
  public isEditing: Boolean = false;
  public commonConstants = CommonConstants;
  public patientConstants = PatientConstants;
  public reportConstants = SocialReportConstants;
  public totalExpenses: number = 0;
  public expenses: number[] = [];

  constructor(public patientService: PatientService, private route: ActivatedRoute, private dialog: MatDialog,
     private _snackBar: MatSnackBar, private datePipe: DatePipe, public router: Router) { 

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 110, 0, 1);
    this.maxDate = this.datePipe.transform((new Date), 'MM/dd/yyyy');
  }

  ngOnInit(): void {
    this.update = false;
    this.isEditing = false;
    this.initializarForm();
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.getPatient(this.id);
    this.getSocioEcoSituation(this.id);
    this.getGenders();
    this.getCities();
    this.getPhysicians();
    this.getRelatives();
    this.form.disable();
    this.formSocioEcoSituation.disable();
  }

  public initializarForm(): void {
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
  }

  public getPatient(id: string): void {
    this.patientService.getPatient(id)
      .subscribe(
        data => {
          this.patient = data;
          this.setForm(this.patient)
        },
        error => {
          {this.openSnackBar(`Error Patient: ${error}`, this.messageAccion)}
        });
  }

  public setForm(patient: Patient): void {
    this.form.patchValue({
      patientName: patient.patientName,
      patientFirstLastName: patient.patientFirstLastName,
      patientSecondLastName: patient.patientSecondLastName,
      patientCellphone: patient.patientCellphone,
      patientPhone: patient.patientPhone,
      patientDateOfBirth: patient.patientDateOfBirth,
      patientOccupation: patient.patientOccupation,
      familySituation: patient.familySituation,
      genderId: patient.genderId,
      civilStatus: patient.civilStatus,
      socioEcoSituationId: patient.socioEcoSituationId,
      medicalDiagnostic: patient.medicalDiagnostic,
      reference: patient.reference,
      surgeryDate: patient.surgeryDate,
      hospitalizationDate: patient.hospitalizationDate,
      treatingPhysicianId: patient.treatingPhysicianId,
      placeOfBirth: patient.placeOfBirth,
      placeOfResidence: patient.placeOfResidence,
    })
  }

  public setFormSocioEcoSituation(socioEcoSituation: SocioEcoSituation): void {
    this.formSocioEcoSituation.patchValue({
      dependentMembers: socioEcoSituation.dependentMembers,
      totalIncome: socioEcoSituation.totalIncome,
      housing: socioEcoSituation.housing,
      tenancy: socioEcoSituation.tenancy,
      numberOfRooms: socioEcoSituation.numberOfRooms,
      totalExpenses: socioEcoSituation.totalExpenses,
      waterConsumption: socioEcoSituation.waterConsumption,
      electricityConsumption: socioEcoSituation.electricityConsumption,
      livingPlaceConsumption: socioEcoSituation.livingPlaceConsumption,
      feedingConsumption: socioEcoSituation.feedingConsumption,
      educationConsumption: socioEcoSituation.educationConsumption,
      telephoneConsumption: socioEcoSituation.telephoneConsumption,
      transportationConsumption: socioEcoSituation.transportationConsumption,
      healthConsumption: socioEcoSituation.healthConsumption,
      otherConsumption: socioEcoSituation.otherConsumption,
      waterConsumptionDetail: socioEcoSituation.waterConsumptionDetail,
      electricityConsumptionDetail: socioEcoSituation.electricityConsumptionDetail,
      livingPlaceConsumptionDetail: socioEcoSituation.livingPlaceConsumptionDetail,
      feedingConsumptionDetail: socioEcoSituation.feedingConsumptionDetail,
      educationConsumptionDetail: socioEcoSituation.educationConsumptionDetail,
      telephoneConsumptionDetail: socioEcoSituation.telephoneConsumptionDetail,
      transportationConsumptionDetail: socioEcoSituation.transportationConsumptionDetail,
      healthConsumptionDetail: socioEcoSituation.healthConsumptionDetail,
      otherConsumptionDetail: socioEcoSituation.otherConsumptionDetail,
    });
  }

  public enableDisableForm(): void {
    if(this.isEditing){
      this.formSocioEcoSituation.disable();
      this.form.disable();
    } else {
      this.formSocioEcoSituation.enable();
      this.form.enable();
    }
    this.isEditing = !this.isEditing
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  public save(): void {
    this.editPatient = this.form.value;
    this.editSocioEcoSituation = this.formSocioEcoSituation.value;
    this.editSocioEcoSituation.totalExpenses = this.totalExpenses;
    this.patientService.updatePatient(this.editPatient, this.id).subscribe(
      data => {this.openSnackBar(UPDATE_SUCCESS, this.messageAccion)},
      error => {this.openSnackBar(`${UPDATE_FAIL}: ${error}`, this.messageAccion)}
    );
    this.patientService.updateSocioEcoSituation(this.editSocioEcoSituation, this.id).subscribe(
      data => {this.openSnackBar(UPDATE_SUCCESS, this.messageAccion)},
      error => {this.openSnackBar(`${UPDATE_FAIL}: ${error}`, this.messageAccion)}
    );

    this.patientService.deleteRelatives(this.id).subscribe(
      data => {this.openSnackBar(DELETE_SUCCESS, this.messageAccion)},
      error => {this.openSnackBar(`${DELETE_FAIL}: ${error}`, this.messageAccion)}
    );

    const relatives = this.patientService.addRelativeList(this.relatives, this.id);
    for(let i = 0; i < relatives.length; i++){
      relatives[i].subscribe();
    }
    
    this.ngOnInit();
  }

  public getGenders(): void {
    this.patientService.getGenders()
    .subscribe(genders => this.genders = genders);
  }
  
  public getCities(): void {
    this.patientService.getCities()
    .subscribe(cities => this.cities = cities);
  }

  public getPhysicians(): void {
    this.patientService.getPhysicians()
    .subscribe(physicians => this.physicians = physicians);
  }

  public getRelatives(): void {
    this.patientService.getRelatives(this.id)
    .subscribe(relatives => this.relatives = relatives);
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

  public getSocioEcoSituation(id: string): void {
    this.patientService.getSocioEcoSituation(id)
      .subscribe(
        data => {
          this.socioEcoSituation = data;
          this.setFormSocioEcoSituation(this.socioEcoSituation);
          this.setupTotalExpenses(this.socioEcoSituation);
        },
        error => {
          {this.openSnackBar(`Error SocioEcoSituation: ${error}`, this.messageAccion)}
        });
  }

  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  public hasErrorSocioEcoSituation = (controlName:string, errorName:string) =>{
    return this.formSocioEcoSituation.controls[controlName].hasError(errorName);
  }

  public openDeleteDialog(obj:any) {
    obj.action = this.commonConstants.DELETE;
    obj.model = this.commonConstants.PATIENT;
    obj.name = obj.patientName + ' ' + obj.patientFirstLastName;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event != 'Cancel'){
        this.deletePatient();
      }
    });
  }

  public deletePatient(): void {
    this.patientService.deletePatient(this.id).subscribe();
    this.router.navigate(['patients/list']);
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

  public setupTotalExpenses(socioEcoSituation: SocioEcoSituation): void {
    this.totalExpenses = socioEcoSituation.totalExpenses;
    this.expenses[0] = socioEcoSituation.waterConsumption !== null ? socioEcoSituation.waterConsumption : 0;
    this.expenses[1] = socioEcoSituation.electricityConsumption !== null ? socioEcoSituation.electricityConsumption : 0;
    this.expenses[2] = socioEcoSituation.livingPlaceConsumption !== null ? socioEcoSituation.livingPlaceConsumption : 0;
    this.expenses[3] = socioEcoSituation.feedingConsumption !== null ? socioEcoSituation.feedingConsumption : 0;
    this.expenses[4] = socioEcoSituation.educationConsumption !== null ? socioEcoSituation.educationConsumption : 0;
    this.expenses[5] = socioEcoSituation.telephoneConsumption !== null ? socioEcoSituation.telephoneConsumption : 0;
    this.expenses[6] = socioEcoSituation.transportationConsumption !== null ? socioEcoSituation.transportationConsumption : 0;
    this.expenses[7] = socioEcoSituation.healthConsumption !== null ? socioEcoSituation.healthConsumption : 0;
    this.expenses[8] = socioEcoSituation.otherConsumption !== null ? socioEcoSituation.otherConsumption : 0;
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

  //@ViewChild('content') content: ElementRef; 
  public export() {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });
  }
}
