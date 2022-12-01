import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CivilStatus } from 'src/app/models/civilStatus.model';
import { Relative } from 'src/app/models/relative.model';
import { PatientService } from 'src/app/services/patient/patient.service';
import { ADD, ADD_SUCCESS, CONTINUE_BUTTON, RELATIVE, SAVE, UPDATE_SUCCESS } from 'src/assets/constants/generalConstants.constants';
import { Relationship } from 'src/assets/enums/relationship.enum';

@Component({
  selector: 'app-relative',
  templateUrl: './relative.component.html',
  styleUrls: ['./relative.component.scss']
})
export class RelativeComponent implements OnInit {

  public form!: FormGroup;
  public minDate: Date;
  public maxDate: String | null;
  public title = RELATIVE;
  public messageAccion = CONTINUE_BUTTON;
  public relationships = Relationship;
  public relative!: Relative;
  public button = ADD;
  public messaje = ADD_SUCCESS;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {relative: Relative}, public dialog: MatDialog, public dialogRef: MatDialogRef<RelativeComponent>, private datePipe: DatePipe,
    public patientService: PatientService, private _snackBar: MatSnackBar) { 
      
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 110, 0, 1);
    this.maxDate = this.datePipe.transform((new Date), 'MM/dd/yyyy');
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      relativeName: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      relativeFirstLastName: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      relativeSecondLastName: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      relativeDateOfBirth: new FormControl(null, [Validators.required]),
      relativeOccupation: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      civilStatus: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      relationship: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      observations: new FormControl('', [Validators.required, Validators.maxLength(2000)])
    });

    this.setRelative();
    this.setTexts();
  }

  public close() {
    this.dialogRef.close();
  }

  public save() {
    this.relative = this.form.value;
    this.dialogRef.close(this.relative);
    this.openSnackBar(this.messaje, this.messageAccion);
  }

  public setRelative(): void {
    this.form.patchValue({
      relativeName: this.data.relative.relativeName,
      relativeFirstLastName: this.data.relative.relativeFirstLastName,
      relativeSecondLastName: this.data.relative.relativeSecondLastName,
      relativeDateOfBirth: this.data.relative.relativeDateOfBirth,
      relativeOccupation: this.data.relative.relativeOccupation,
      civilStatus: this.data.relative.civilStatus,
      relationship: this.data.relative.relationship,
      observations: this.data.relative.observations
    })
  }

  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  public setTexts(): void {
    if(this.data.relative) {
      this.button = SAVE;
      this.messaje = UPDATE_SUCCESS;
    }
  }
}
