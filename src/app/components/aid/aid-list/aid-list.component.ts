import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Aid } from 'src/app/models/aid.model';
import { AidService } from 'src/app/services/aid/aid.service';
import { AidConstants } from 'src/assets/constants/aids/aid.constants';
import { AidColumnsConstants } from 'src/assets/constants/aids/aidColumns.contants';
import { AidComponent } from '../aid/aid.component';

@Component({
  selector: 'app-aid-list',
  templateUrl: './aid-list.component.html',
  styleUrls: ['./aid-list.component.scss']
})
export class AidListComponent implements OnInit {

  public dataSource = new MatTableDataSource<Aid>();
  public paginator!: MatPaginator;
  public aidConstants = AidConstants;
  public id!: string;

  public columns = [
    {
      columnDef: 'reference',
      header: AidColumnsConstants.REFERENCE,
      cell: (element: Aid) => `${element.reference}`,
    },
    {
      columnDef: 'diagnosis',
      header: AidColumnsConstants.DIAGNOSIS,
      cell: (element: Aid) => `${element.diagnosis}`,
    },
    {
      columnDef: 'treatment',
      header: AidColumnsConstants.TREATMENT,
      cell: (element: Aid) => `${element.treatment}`,
    },
    {
      columnDef: 'aidDate',
      header: AidColumnsConstants.AIDDATE,
      cell: (element: Aid) => `${element.aidDate}`,
    },
    {
      columnDef: 'hospital',
      header: AidColumnsConstants.HOSPITAL,
      cell: (element: Aid) => `${element.hospital}`,
    },
    {
      columnDef: 'input',
      header: AidColumnsConstants.INPUT,
      cell: (element: Aid) => `${element.input}`,
    },
    {
      columnDef: 'aidType',
      header: AidColumnsConstants.TYPE,
      cell: (element: Aid) => `${element.aidType}`,
    }
  ];

  public displayedColumns = this.columns.map(c => c.columnDef);

  constructor(public aidService: AidService, private dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef,
    public router: Router, private route: ActivatedRoute) { }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.getAids();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
  }

  public getAids(): void {
    this.aidService.getAids(this.id)
    .subscribe(aids => {
      this.dataSource = new MatTableDataSource<Aid>(aids);
      this.changeDetectorRefs.detectChanges();
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public showAid(aid: Aid): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(AidComponent, {
      disableClose: true,
      autoFocus: true,
      data: {
        patientId: this.id,
        aid: aid
      }
    } );
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.ngOnInit();
      }
    });
  }

  public addAid() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(AidComponent, {
      disableClose: true,
      autoFocus: true,
      data: {
        patientId: this.id
      }
    } );
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.ngOnInit();
      }
    });
  }
  
}
