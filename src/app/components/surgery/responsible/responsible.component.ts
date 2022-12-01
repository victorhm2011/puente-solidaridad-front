import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Responsible } from 'src/app/models/responsible.model';
import { SurgeryService } from 'src/app/services/surgery/surgery.service';
import { CommonConstants } from 'src/assets/constants/commonConstants.constants';
import { ADD_FAIL, ADD_SUCCESS, CONTINUE_BUTTON } from 'src/assets/constants/generalConstants.constants';
import { SurgeryConstants } from 'src/assets/constants/surgery/surgery.constants';

@Component({
  selector: 'app-responsible',
  templateUrl: './responsible.component.html',
  styleUrls: ['./responsible.component.scss']
})
export class ResponsibleComponent implements OnInit {

  public form!: FormGroup;
  public responsible!: Responsible;
  public surgeryConstants = SurgeryConstants;
  public commonConstants = CommonConstants;
  
  constructor(public surgeryService: SurgeryService, public dialog: MatDialog, private router: Router,
    public dialogRef: MatDialogRef<ResponsibleComponent>, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      responsibleName: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      institution: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      responsibleAddress: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      responsiblePhone: new FormControl(null, [Validators.maxLength(100)]),
    });
  }

  public close() {
    this.dialogRef.close();
  }

  public save() {
    this.responsible = this.form.value;
    this.surgeryService.addResponsible(this.responsible).subscribe(
      data => {this.openSnackBar(ADD_SUCCESS, CONTINUE_BUTTON)},
      error => {this.openSnackBar(`${ADD_FAIL}: ${error}`, CONTINUE_BUTTON)}
    );
    this.dialogRef.close(this.responsible);
  }

  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }
  
  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
