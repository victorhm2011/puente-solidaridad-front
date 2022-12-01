import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Physician } from 'src/app/models/physician.model';
import { PhysicianService } from 'src/app/services/physician/physician.service';
import { CommonConstants } from 'src/assets/constants/commonConstants.constants';
import { ADD_FAIL, ADD_SUCCESS, CONTINUE_BUTTON } from 'src/assets/constants/generalConstants.constants';
import { PhysicianConstants } from 'src/assets/constants/physicians/physician.constants';

@Component({
  selector: 'app-new-physician',
  templateUrl: './new-physician.component.html',
  styleUrls: ['./new-physician.component.scss']
})
export class NewPhysicianComponent implements OnInit {

  public form!: FormGroup;
  public physician!: Physician;
  public physicianConstants = PhysicianConstants;
  public commonConstants = CommonConstants;

  constructor(public physicianService: PhysicianService, public dialog: MatDialog, private router: Router,
    public dialogRef: MatDialogRef<NewPhysicianComponent>, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      firstLastName: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      secondLastName: new FormControl(null, [Validators.maxLength(500)]),
      hospital: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      phone: new FormControl(null),
    });
  }

  public close() {
    this.dialogRef.close();
  }

  public save() {
    this.physician = this.form.value;
    if(this.physician.phone){
      this.physician.phone = this.physician.phone.toString();
    }
    this.physicianService.addPhysician(this.physician).subscribe(
      data => {this.openSnackBar(ADD_SUCCESS, CONTINUE_BUTTON)},
      error => {this.openSnackBar(`${ADD_FAIL}: ${error}`, CONTINUE_BUTTON)}
    );
    this.dialogRef.close(this.physician);
  }

  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
