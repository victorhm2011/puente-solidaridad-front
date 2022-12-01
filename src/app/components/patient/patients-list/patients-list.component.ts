import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from 'src/app/services/patient/patient.service';
import { PATIENT_LIST } from 'src/assets/constants/generalConstants.constants';
import { PatientColumnsConstants } from 'src/assets/constants/patients/patientColumns.constants';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PatientsListComponent implements OnInit {

  public title = PATIENT_LIST;
  public paginator!: MatPaginator;
  public columnss = PatientColumnsConstants;
  public updatedColumn = PatientColumnsConstants.MODIFICATION_DATE;
  public valuationReportColumn = PatientColumnsConstants.VALUATION_REPORT;
  public dataSource = new MatTableDataSource<Patient>();
  
  public columns = [
    {
      columnDef: 'patientFirstLastName',
      header: PatientColumnsConstants.FIRSTLASTNAME,
      cell: (element: Patient) => `${element.patientFirstLastName}`,
    },
    {
      columnDef: 'patientSecondLastName',
      header: PatientColumnsConstants.SECONDLASTNAME,
      cell: (element: Patient) => `${element.patientSecondLastName}`,
    },
    {
      columnDef: 'patientName',
      header: PatientColumnsConstants.NAME,
      cell: (element: Patient) => `${element.patientName}`,
    },
    {
      columnDef: 'patientDateOfBirth',
      header: PatientColumnsConstants.DATEBIRTH,
      cell: (element: Patient) => `${Math.floor(Math.abs(Date.now() - new Date(element.patientDateOfBirth).getTime()) / (1000 * 3600 * 24) / 365.25)}`,
    },
    {
      columnDef: 'genderId',
      header: PatientColumnsConstants.GENDER,
      cell: (element: Patient) => `${element.genderId}`,
    },
    {
      columnDef: 'placeOfResidence',
      header: PatientColumnsConstants.CITY,
      cell: (element: Patient) => `${element.placeOfResidence}`,
    }
  ];
  public expandedElement: Patient | null | undefined;
  public displayedColumns: string[] = [ 
    'patientFirstLastName', 
    'patientSecondLastName',
    'patientName',
    'patientDateOfBirth', 
    'genderId', 
    'placeOfResidence', 
    'updated',
    'valuationReportId'
  ];

  public detailHeaders: string[] = [
    PatientColumnsConstants.ADDRESS + ": ", 
    PatientColumnsConstants.CIVILSTATUS + ": ", 
    PatientColumnsConstants.SOCIOECOSITUATION + ": "
  ];

  constructor(public patientService: PatientService, public router: Router) { }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getPatients();
  }

  public getPatients(): void {
    this.patientService.getPatients()
    .subscribe(patients => this.dataSource = new MatTableDataSource<Patient>(patients));
  }

  public showPatient(patient:Patient): void {
    this.router.navigate(['patients/show-patient', patient.patientId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
