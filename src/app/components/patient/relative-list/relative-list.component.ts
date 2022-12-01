import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Relative } from 'src/app/models/relative.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RelativeColumnsConstants } from 'src/assets/constants/relatives/relativeColumns.constants';
import { DialogBoxComponent } from '../../common/dialog-box/dialog-box.component';
import { RelativeComponent } from '../relative/relative.component';
import { NO_RELATIVES } from 'src/assets/constants/generalConstants.constants';

@Component({
  selector: 'app-relative-list',
  templateUrl: './relative-list.component.html',
  styleUrls: ['./relative-list.component.scss'],
})
export class RelativeListComponent {

  @Input() public relativesList: Relative[] = [];
  @Input() public update!: Boolean;
  @ViewChild(MatTable) table!: MatTable<Relative>;
  public noRelatives = NO_RELATIVES;

  public columns = [
    {
      columnDef: 'first_last_name',
      header: RelativeColumnsConstants.FIRSTLASTNAME,
      cell: (element: Relative) => `${element.relativeFirstLastName}`,
    },
    {
      columnDef: 'second_last_name',
      header: RelativeColumnsConstants.SECONDLASTNAME,
      cell: (element: Relative) => `${element.relativeSecondLastName}`,
    },
    {
      columnDef: 'name',
      header: RelativeColumnsConstants.NAME,
      cell: (element: Relative) => `${element.relativeName}`,
    },
    {
      columnDef: 'age',
      header: RelativeColumnsConstants.AGE,
      cell: (element: Relative) => `${ Math.floor(Math.abs(Date.now() - new Date(element.relativeDateOfBirth).getTime()) / (1000 * 3600 * 24) / 365.25)}`,
    },
    {
      columnDef: 'relationship',
      header: RelativeColumnsConstants.RELATIONSHIP,
      cell: (element: Relative) => `${element.relationship}`,
    },
    {
      columnDef: 'civil_status',
      header: RelativeColumnsConstants.CIVILSTATUS,
      cell: (element: Relative) => `${element.civilStatus}`,
    },
    {
      columnDef: 'occupation',
      header: RelativeColumnsConstants.OCCUPATION,
      cell: (element: Relative) => `${element.relativeOccupation}`,
    },
    {
      columnDef: 'observations',
      header: RelativeColumnsConstants.OBSERVATIONS,
      cell: (element: Relative) => `${element.observations}`,
    }
  ];
  public displayedColumns: string[] = ['first_last_name', 'second_last_name', 'name', 'age', 'relationship', 'civil_status', 'occupation', 'observations', 'action'];

  constructor(public dialog: MatDialog) { }

  public showRelative(relative:Relative): void {
    const relativeIndex: number = this.getRelativeIndex(relative);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(RelativeComponent, {
      disableClose: true,
      autoFocus: true,
      data: {
        relative: relative
      }
    } );
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.relativesList[relativeIndex] = result;
        this.update = !this.update
      }
      this.table.renderRows();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.table.renderRows();
  }

  public openDialog(obj:any) {
    obj.action = 'Eliminar';
    obj.model = 'Familiar';
    obj.name = obj.relativeName + ' ' + obj.relativeFirstLastName;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this.deleteRowData(result.data);
    });
  }

  public deleteRowData(row_obj:any){
    this.relativesList.forEach((element, index)=>{
      if(element.relativeName === row_obj.relativeName && element.relativeFirstLastName === row_obj.relativeFirstLastName){
        this.relativesList.splice(index,1);
      }
    });
    if(!this.relativesList){
      this.relativesList = [];
    }
    this.table.renderRows();
  }

  public getRelativeIndex(relative:Relative): number{
    let resp: number = -1;
    this.relativesList.forEach((element, index)=>{
      if(element.relativeName === relative.relativeName && element.relativeFirstLastName === relative.relativeFirstLastName){
        resp = index;
      }
    });
    return resp;
  }

}