import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserPatch } from 'src/app/models/userPatch.model';
import { UserService } from 'src/app/services/user/user.service';
import { CommonConstants } from 'src/assets/constants/commonConstants.constants';
import { ADD_FAIL, ADD_SUCCESS, CONTINUE_BUTTON, UPDATE_FAIL, UPDATE_SUCCESS } from 'src/assets/constants/generalConstants.constants';
import { UserConstants } from 'src/assets/constants/users/user.constants';
import { UserColumnsConstants } from 'src/assets/constants/users/userColumns.constants';
import { Role } from 'src/assets/enums/role.enum';
import { DialogBoxComponent } from '../../common/dialog-box/dialog-box.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public id!: string;
  public user!: User;
  public editUser!: UserPatch;
  public form!: FormGroup;
  public isCreating: Boolean = false;
  public isEditing: Boolean = false;
  public existReport: Boolean = false;
  public commonConstants = CommonConstants;
  public userConstants = UserConstants;
  public userFieldsConstants = UserColumnsConstants;
  public roles = Role;
  public minDate: Date;
  public maxDate: String | null;

  constructor(public userService: UserService, private route: ActivatedRoute, private datePipe: DatePipe,
      private _snackBar: MatSnackBar, public router: Router, private dialog: MatDialog) { 

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 110, 0, 1);
    this.maxDate = this.datePipe.transform((new Date), 'MM/dd/yyyy');
  }

  ngOnInit(): void {
    this.isCreating = false;
    this.isEditing = false;
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.initializarForm();
    this.getUser(this.id);
  }

  public initializarForm(): void {
    if(this.id) {
      this.form = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        firstLastName: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        secondLastName: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        dateOfBirth: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        password: new FormControl(null, [Validators.maxLength(50)]),
        role: new FormControl(null, [Validators.required]),
      });
    } else {
      this.form = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        firstLastName: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        secondLastName: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        dateOfBirth: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        password: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        role: new FormControl(null, [Validators.required]),
      });
    }
    
  }

  public getUser(id: string): void {
    if(id){
      this.userService.getUser(id)
      .subscribe(
        data => {
          this.user = data;
          this.setForm(this.user);
          this.editUser = data;
        },
        error => {
          {this.openSnackBar(`Error Usuario: ${error}`, CONTINUE_BUTTON)}
        }
      );
      this.existReport = true;
      this.form.disable();
    } else {
      this.existReport = false;
      this.isCreating = true;
    }
  }

  public setForm(user: User): void {
    this.form.patchValue({
      name: user.name,
      firstLastName: user.firstLastName,
      secondLastName: user.secondLastName,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      role: user.role,
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

  public save(): void {
    this.user = this.form.value;
    if(this.id){
      this.update();
    } else {
      this.userService.addUser(this.user).subscribe(
        data => {
          this.openSnackBar(ADD_SUCCESS, CONTINUE_BUTTON);
          this.router.navigate(['users/list']);
        },
        error => {this.openSnackBar(`${ADD_FAIL}: ${error}`, CONTINUE_BUTTON)}
      );
    }
  }

  public async update() {
    if(this.user.password){
      this.updateUserWithPassword();
    } else {
      this.setEditUser();
      this.updateUser();
    }
  }

  public async updateUserWithPassword() {
    try {
      await this.userService.deleteUser(this.id).toPromise();
      await this.userService.addUser(this.user).toPromise();
      this.openSnackBar(UPDATE_SUCCESS, CONTINUE_BUTTON);
    } catch (error) {
      this.openSnackBar(`${UPDATE_FAIL}: ${error}`, CONTINUE_BUTTON);
    } finally {
      this.router.navigate(['users/list']);
    }
  }

  public async updateUser() {
    try {
      await this.userService.updateUser(this.editUser).toPromise();
      this.openSnackBar(UPDATE_SUCCESS, CONTINUE_BUTTON);
    } catch (error) {
      this.openSnackBar(`${UPDATE_FAIL}: ${error}`, CONTINUE_BUTTON);
    } finally {
      this.ngOnInit();
    }
  }

  public setEditUser(): void {
    this.editUser.name = this.user.name;
    this.editUser.firstLastName = this.user.firstLastName;
    this.editUser.secondLastName = this.user.secondLastName;
    this.editUser.dateOfBirth = this.user.dateOfBirth;
    this.editUser.email = this.user.email;
    this.editUser.role = this.user.role;
  }

  public openDeleteDialog(obj:any) {
    obj.action = this.commonConstants.DELETE;
    obj.model = this.commonConstants.USER;
    obj.name = obj.name + ' ' + obj.firstLastName;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event != 'Cancel'){
        this.deleteUser();
      }
    });
  }

  public deleteUser(): void {
    this.userService.deleteUser(this.id).subscribe();
    this.router.navigate(['users/list']);
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

}
