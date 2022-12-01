import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Aid } from 'src/app/models/aid.model';
import { Physician } from 'src/app/models/physician.model';
import { AidService } from 'src/app/services/aid/aid.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { AidConstants } from 'src/assets/constants/aids/aid.constants';
import { AidColumnsConstants } from 'src/assets/constants/aids/aidColumns.contants';
import { CommonConstants } from 'src/assets/constants/commonConstants.constants';
import { ADD_FAIL, ADD_SUCCESS, CONTINUE_BUTTON, UPDATE_FAIL, UPDATE_SUCCESS } from 'src/assets/constants/generalConstants.constants';
import { AidType } from 'src/assets/enums/aidType.enum';
import { NewPhysicianComponent } from '../../physician/new-physician/new-physician.component';

@Component({
  selector: 'app-aid',
  templateUrl: './aid.component.html',
  styleUrls: ['./aid.component.scss']
})
export class AidComponent implements OnInit {

  public form!: FormGroup;
  public minDate: Date;
  public maxDate: String | null;
  public aid!: Aid;
  public aidConstants = AidConstants;
  public commonConstants = CommonConstants;
  public patientId!: string;
  public physicians: Physician[] = [];
  public aidColumsConstants = AidColumnsConstants;
  public aidTypes = AidType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {patientId: string, aid: Aid}, public dialog: MatDialog, public dialogRef: MatDialogRef<AidComponent>, private datePipe: DatePipe,
    public aidService: AidService, private _snackBar: MatSnackBar, private route: ActivatedRoute, public patientService: PatientService) { 
      
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 110, 0, 1);
    this.maxDate = this.datePipe.transform((new Date), 'MM/dd/yyyy');
  }

  ngOnInit(): void {
    this.patientId = this.data.patientId;
    this.getPhysicians();
    this.form = new FormGroup({
      reference: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      diagnosis: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      treatment: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      aidDate: new FormControl(null, [Validators.required]),
      physicianId: new FormControl(null, [Validators.required]),
      hospital: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      input: new FormControl(null),
      socialConcept: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      socioEcoSituation: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      monthlyIncome: new FormControl(null, [Validators.maxLength(2000)]),
      socialWorker: new FormControl(null, [Validators.maxLength(1000)]),
      aidType: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    });
    this.setAid();
  }

  public setAid(): void {
    this.form.patchValue({
      reference: this.data.aid.reference,
      diagnosis: this.data.aid.diagnosis,
      treatment: this.data.aid.treatment,
      aidDate: this.data.aid.aidDate,
      physicianId: this.data.aid.physicianId,
      hospital: this.data.aid.hospital,
      input: this.data.aid.input,
      socialConcept: this.data.aid.socialConcept,
      socioEcoSituation: this.data.aid.socioEcoSituation,
      monthlyIncome: this.data.aid.monthlyIncome,
      socialWorker: this.data.aid.socialWorker,
      aidType: this.data.aid.aidType,
    })
  }
  
  public close() {
    this.dialogRef.close();
  }

  public save() {
    this.aid = this.form.value;
    this.aid.patientId = this.patientId;
    if(this.data.aid !== undefined){
      this.aid.id = this.data.aid.id;
      this.aidService.updateAid(this.aid).subscribe(
        data => {this.openSnackBar(UPDATE_SUCCESS, CONTINUE_BUTTON)},
        error => {this.openSnackBar(`${UPDATE_FAIL}: ${error}`, CONTINUE_BUTTON)}
      );
    } else {
      this.aidService.addAid(this.aid).subscribe(
        data => {this.openSnackBar(ADD_SUCCESS, CONTINUE_BUTTON)},
        error => {this.openSnackBar(`${ADD_FAIL}: ${error}`, CONTINUE_BUTTON)}
      );
    }
    this.dialogRef.close(this.aid);
  }

  public getPhysicians(): void {
    this.patientService.getPhysicians()
    .subscribe(physicians => this.physicians = physicians);
  }

  public addPhysician(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(NewPhysicianComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
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
