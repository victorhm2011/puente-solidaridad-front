import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { SurgeryService } from 'src/app/services/surgery/surgery.service';
import { CommonConstants } from 'src/assets/constants/commonConstants.constants';
import { ADD_FAIL, ADD_SUCCESS, CONTINUE_BUTTON } from 'src/assets/constants/generalConstants.constants';
import { SurgeryConstants } from 'src/assets/constants/surgery/surgery.constants';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss']
})
export class HospitalComponent implements OnInit {

  public form!: FormGroup;
  public hospital!: Hospital;
  public surgeryConstants = SurgeryConstants;
  public commonConstants = CommonConstants;
  
  constructor(public surgeryService: SurgeryService, public dialog: MatDialog, private router: Router,
    public dialogRef: MatDialogRef<HospitalComponent>, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      hospitalName: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      hospitalAddress: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      hospitalPhone: new FormControl(null),
    });
  }

  public close() {
    this.dialogRef.close();
  }

  public save() {
    this.hospital = this.form.value;
    this.surgeryService.addHospital(this.hospital).subscribe(
      data => {this.openSnackBar(ADD_SUCCESS, CONTINUE_BUTTON)},
      error => {this.openSnackBar(`${ADD_FAIL}: ${error}`, CONTINUE_BUTTON)}
    );
    this.dialogRef.close(this.hospital);
  }

  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }
  
  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
