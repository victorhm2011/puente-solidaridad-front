import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Physician } from 'src/app/models/physician.model';
import { PhysicianService } from 'src/app/services/physician/physician.service';
import { PHYSICIAN_LIST } from 'src/assets/constants/generalConstants.constants';
import { PhysicianConstants } from 'src/assets/constants/physicians/physician.constants';
import { PhysicianColumnsConstants } from 'src/assets/constants/physicians/physicianColumns.constants';
import { NewPhysicianComponent } from '../new-physician/new-physician.component';

@Component({
  selector: 'app-physician-list',
  templateUrl: './physician-list.component.html',
  styleUrls: ['./physician-list.component.scss']
})
export class PhysicianListComponent implements OnInit {

  public title = PHYSICIAN_LIST;
  public dataSource = new MatTableDataSource<Physician>();
  public paginator!: MatPaginator;
  public physicianConstants = PhysicianConstants;

  public columns = [
    {
      columnDef: 'name',
      header: PhysicianColumnsConstants.NAME,
      cell: (element: Physician) => `${element.name}`,
    },
    {
      columnDef: 'firstLastName',
      header: PhysicianColumnsConstants.FIRSTLASTNAME,
      cell: (element: Physician) => `${element.firstLastName}`,
    },
    {
      columnDef: 'secondLastName',
      header: PhysicianColumnsConstants.SECONDLASTNAME,
      cell: (element: Physician) => `${element.secondLastName}`,
    },
    {
      columnDef: 'hospital',
      header: PhysicianColumnsConstants.HOSPITAL,
      cell: (element: Physician) => `${element.hospital}`,
    },
    {
      columnDef: 'phone',
      header: PhysicianColumnsConstants.PHONE,
      cell: (element: Physician) => `${element.phone}`,
    },
  ];

  public displayedColumns = this.columns.map(c => c.columnDef);

  constructor(public physicianService: PhysicianService, private dialog: MatDialog,
    public router: Router) { }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  
  ngOnInit(): void {
    this.getPhysicians();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
  }

  public getPhysicians(): void {
    this.physicianService.getPhysicians()
    .subscribe(physicians => this.dataSource = new MatTableDataSource<Physician>(physicians));
  }

  public showPhysician(physician: Physician): void {
    this.router.navigate(['physicians/show-physician', physician.id]);
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public addPhysician() {
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

}
