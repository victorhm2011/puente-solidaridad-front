import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONTINUE_BUTTON, DELETE_SUCCESS } from 'src/assets/constants/generalConstants.constants';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {

  public action:string;
  public local_data:any;
  public model:string;
  public name:any;
  public messageAccion = CONTINUE_BUTTON;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar) {
    this.local_data = {...data};
    this.action = this.local_data.action;
    this.model = this.local_data.model;
    this.name = this.local_data.name;
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
    this.openSnackBar(DELETE_SUCCESS, this.messageAccion);
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
