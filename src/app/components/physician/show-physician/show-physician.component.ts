import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Physician } from 'src/app/models/physician.model';
import { PhysicianService } from 'src/app/services/physician/physician.service';
import { CommonConstants } from 'src/assets/constants/commonConstants.constants';
import { CONTINUE_BUTTON, SHOW_PHYSICIAN, UPDATE_FAIL, UPDATE_SUCCESS } from 'src/assets/constants/generalConstants.constants';
import { DialogBoxComponent } from '../../common/dialog-box/dialog-box.component';

@Component({
  selector: 'app-show-physician',
  templateUrl: './show-physician.component.html',
  styleUrls: ['./show-physician.component.scss']
})
export class ShowPhysicianComponent implements OnInit {

  public title = SHOW_PHYSICIAN;
  public id!: string;
  public physician!: Physician;
  public editPhysician!: Physician;
  public form!: FormGroup;
  public messageAccion = CONTINUE_BUTTON;
  public isEditing: Boolean = false;
  public commonConstants = CommonConstants;

  constructor(public physicianService: PhysicianService, private route: ActivatedRoute,
    private _snackBar: MatSnackBar, public router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isEditing = false;
    this.initializarForm();
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.getPhysician(this.id);
    this.form.disable();
  }

  public initializarForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      firstLastName: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      secondLastName: new FormControl('', [Validators.maxLength(500)]),
      hospital: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      phone: new FormControl(null),
    });
  }

  public getPhysician(id: string): void {
    this.physicianService.getPhysician(id)
      .subscribe(
        data => {
          this.physician = data;
          this.setForm(this.physician)
        },
        error => {
          {this.openSnackBar(`Error Médico Aliado: ${error}`, this.messageAccion)}
        });
  }

  public setForm(physician: Physician): void {
    this.form.patchValue({
      name: physician.name,
      firstLastName: physician.firstLastName,
      secondLastName: physician.secondLastName,
      hospital: physician.hospital,
      phone: physician.phone,
    })
  }

  public enableDisableForm(): void {
    if(this.isEditing){
      this.form.disable();
    } else {
      this.form.enable();
    }
    this.isEditing = !this.isEditing
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  public save(): void {
    this.editPhysician = this.form.value;
    if(this.editPhysician.phone){
      this.editPhysician.phone = this.editPhysician.phone.toString();
    }
    this.physicianService.updatePhysician(this.editPhysician, this.id).subscribe(
      data => {this.openSnackBar(UPDATE_SUCCESS, this.messageAccion)},
      error => {this.openSnackBar(`${UPDATE_FAIL}: ${error}`, this.messageAccion)}
    );
    this.ngOnInit();
  }

  public openDeleteDialog(obj:any) {
    obj.action = this.commonConstants.DELETE;
    obj.model = this.commonConstants.PHYSICIAN;
    obj.name = obj.name + ' ' + obj.firstLastName;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event != 'Cancel'){
        this.deletePhysician();
      }
    });
  }

  public deletePhysician(): void {
    this.physicianService.deletePhysician(this.id).subscribe();
    this.router.navigate(['physicians/list']);
  }

  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

}
