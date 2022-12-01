import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Physician } from 'src/app/models/physician.model';
import { Responsible } from 'src/app/models/responsible.model';
import { Surgery } from 'src/app/models/surgery.model';
import { PhysicianService } from 'src/app/services/physician/physician.service';
import { SurgeryService } from 'src/app/services/surgery/surgery.service';
import { CommonConstants } from 'src/assets/constants/commonConstants.constants';
import { ADD_FAIL, ADD_SUCCESS, CONTINUE_BUTTON, UPDATE_FAIL, UPDATE_SUCCESS } from 'src/assets/constants/generalConstants.constants';
import { SurgeryConstants } from 'src/assets/constants/surgery/surgery.constants';
import { NewPhysicianComponent } from '../../physician/new-physician/new-physician.component';
import { HospitalComponent } from '../hospital/hospital.component';
import { ResponsibleComponent } from '../responsible/responsible.component';

@Component({
  selector: 'app-surgery',
  templateUrl: './surgery.component.html',
  styleUrls: ['./surgery.component.scss']
})
export class SurgeryComponent implements OnInit {

  public id!: string;
  public surgeryConstants = SurgeryConstants;
  public isCreating: Boolean = false;
  public isEditing: Boolean = false;
  public existReport: Boolean = false;
  public surgery!: Surgery;
  public form!: FormGroup;
  public responsibles: Responsible[] = [];
  public hospitals: Hospital[] = [];
  public newSurgery!: Surgery;
  public editSurgery!: Surgery;
  public surgeryId!: string;
  public physicians: Physician[] = [];
  public commonConstants = CommonConstants;
  public minDate: Date;
  public maxDate: String | null;

  constructor(public surgeryService: SurgeryService, private route: ActivatedRoute, private dialog: MatDialog,
    public router: Router, private _snackBar: MatSnackBar, public physicianService: PhysicianService, private datePipe: DatePipe) { 
      const currentYear = new Date().getFullYear();
      this.minDate = new Date(currentYear - 110, 0, 1);
      this.maxDate = this.datePipe.transform((new Date), 'MM/dd/yyyy');
    }

  ngOnInit(): void {
    this.isCreating = false;
    this.isEditing = false;
    this.initializarForm();
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.getSurgery();
    this.getResponsibles();
    this.getHospitals();
    this.getPhysicians();
  }

  public getSurgery(): void {
    this.surgeryService.getSurgeryByPatient(this.route.snapshot.paramMap.get('id') as string)
    .subscribe(surgery => {
      if(surgery){
        this.surgery = surgery;
        this.setForm(this.surgery);
        this.existReport = true;
        this.form.disable();
      } else {
        this.existReport = false;
      }
    });
  }

  public initializarForm(): void {
    this.form = new FormGroup({
      physicianSurgeryId: new FormControl(null, [Validators.required]),
      physicianFollowId: new FormControl(null, [Validators.required]),
      surgeryDate: new FormControl(null, [Validators.required]),
      pacemakerSerial: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      atrialSerial: new FormControl(null, [Validators.maxLength(100)]),
      ventricularSerial: new FormControl(null, [Validators.maxLength(100)]),
      leftVentricularSerial: new FormControl(null, [Validators.maxLength(100)]),
      pacemakerModel: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      atrialModel: new FormControl(null, [Validators.maxLength(500)]),
      ventricularModel: new FormControl(null, [Validators.maxLength(500)]),
      leftVentricularModel: new FormControl(null, [Validators.maxLength(500)]),
      socialWorker: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      hospitalId: new FormControl(null, [Validators.required]),
      hospitalFollowId: new FormControl(null, [Validators.required]),
      responsibleId: new FormControl(null, [Validators.required]),
    });
  }

  public setForm(surgery: Surgery): void {
    this.form.patchValue({
      physicianSurgeryId: surgery.physicianSurgeryId,
      physicianFollowId: surgery.physicianFollowId,
      surgeryDate: surgery.surgeryDate,
      pacemakerSerial: surgery.pacemakerSerial,
      atrialSerial: surgery.atrialSerial,
      ventricularSerial: surgery.ventricularSerial,
      leftVentricularSerial: surgery.leftVentricularSerial,
      pacemakerModel: surgery.pacemakerModel,
      atrialModel: surgery.atrialModel,
      ventricularModel: surgery.ventricularModel,
      leftVentricularModel: surgery.leftVentricularModel,
      socialWorker: surgery.socialWorker,
      hospitalId: surgery.hospitalId,
      hospitalFollowId: surgery.hospitalFollowId,
      responsibleId: surgery.responsibleId,
    });
  }

  public getResponsibles(): void {
    this.surgeryService.getResponsibles()
    .subscribe(responsibles => this.responsibles = responsibles);
  }

  public getHospitals(): void {
    this.surgeryService.getHospitals()
    .subscribe(hospitals => this.hospitals = hospitals);
  }

  public getPhysicians(): void {
    this.physicianService.getPhysicians()
    .subscribe(physicians => this.physicians = physicians);
  }

  public save(): void {
    if(!this.existReport){
      this.newSurgery = this.form.value;
      this.newSurgery.patientId = this.id;
      this.surgeryService.addSurgery(this.newSurgery).subscribe(
        data => {this.openSnackBar(ADD_SUCCESS, CONTINUE_BUTTON)},
        error => {this.openSnackBar(`${ADD_FAIL}: ${error}`, CONTINUE_BUTTON)}
      );
      
    } else {
      this.editSurgery = this.form.value;
      this.editSurgery.id = this.surgery.id;
      this.editSurgery.patientId = this.id;
      this.surgeryService.updateSurgery(this.editSurgery).subscribe(
        data => {this.openSnackBar(UPDATE_SUCCESS, CONTINUE_BUTTON)},
        error => {this.openSnackBar(`${UPDATE_FAIL}: ${error}`, CONTINUE_BUTTON)}
      );
    }
    this.ngOnInit();
  }

  public enableDisableForm(): void {
    if(this.isEditing){
      this.form.disable();
    } else {
      this.form.enable();
    }
    this.isEditing = !this.isEditing
  }

  public addResponsible(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(ResponsibleComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.responsibles.push(result);
        this.getResponsibles();
      }
    });
  }

  public addHospital(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(HospitalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.hospitals.push(result);
        this.getHospitals();
      }
    });
  }

  public addPhysician(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(NewPhysicianComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.physicians.push(result);
        this.getPhysicians();
      }
    });
  }

  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
