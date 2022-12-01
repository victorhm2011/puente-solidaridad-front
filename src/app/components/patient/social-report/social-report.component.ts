import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { City } from 'src/app/models/city.model';
import { SocialReport } from 'src/app/models/socialReport.model';
import { PatientService } from 'src/app/services/patient/patient.service';
import { ADD_FAIL, ADD_SUCCESS, CONTINUE_BUTTON, UPDATE_FAIL, UPDATE_SUCCESS } from 'src/assets/constants/generalConstants.constants';
import { SocialReportConstants } from 'src/assets/constants/patients/socialReport.constants';
import { Classification } from 'src/assets/enums/classification.enum';
import { Program } from 'src/assets/enums/program.enum';

@Component({
  selector: 'app-social-report',
  templateUrl: './social-report.component.html',
  styleUrls: ['./social-report.component.scss']
})
export class SocialReportComponent implements OnInit {

  public id!: string;
  public reportConstants = SocialReportConstants;
  public isCreating: Boolean = false;
  public isEditing: Boolean = false;
  public existReport: Boolean = false;
  public socialReport!: SocialReport;
  public form!: FormGroup;
  public classifications = Classification;
  public programs = Program;
  public cities: City[] = [];
  public newSocialReport!: SocialReport;
  public editSocialReport!: SocialReport;
  public reportId!: string;

  constructor(public patientService: PatientService, private route: ActivatedRoute,
    public router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isCreating = false;
    this.isEditing = false;
    this.initializarForm();
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.getValuationReport();
    this.getCities();
  }

  public getValuationReport(): void {
    this.patientService.getSocialReport(this.route.snapshot.paramMap.get('id') as string)
    .subscribe(socialReport => {
      if(socialReport){
        this.socialReport = socialReport;
        this.setForm(this.socialReport);
        this.existReport = true;
        this.form.disable();
      } else {
        this.existReport = false;
      }
    });
  }

  public initializarForm(): void {
    this.form = new FormGroup({
      authorName: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      socialWorker: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      generalReferences: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      treatment: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      currentSituation: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      testimony: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      socioEcoData: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      socialConcept: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      classification: new FormControl(null, [Validators.required, Validators.maxLength(1)]),
      patientCellPhoneRef: new FormControl(null),
      medicalDiagnostic: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      referenceAddress: new FormControl(null, [Validators.maxLength(1000)]),
      descriptionFamilyHome: new FormControl(null, [Validators.required, Validators.maxLength(2000)]),
      program: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
    });
  }

  public setForm(socialReport: SocialReport): void {
    this.form.patchValue({
      authorName: socialReport.authorName,
      socialWorker: socialReport.socialWorker,
      generalReferences: socialReport.generalReferences,
      treatment: socialReport.treatment,
      currentSituation: socialReport.currentSituation,
      testimony: socialReport.testimony,
      socioEcoData: socialReport.socioEcoData,
      socialConcept: socialReport.socialConcept,
      classification: socialReport.classification,
      patientCellPhoneRef: socialReport.patientCellPhoneRef,
      medicalDiagnostic: socialReport.medicalDiagnostic,
      referenceAddress: socialReport.referenceAddress,
      descriptionFamilyHome: socialReport.descriptionFamilyHome,
      program: socialReport.program,
    });
  }

  public getCities(): void {
    this.patientService.getCities()
    .subscribe(cities => this.cities = cities);
  }

  public enableDisableForm(): void {
    if(this.isEditing){
      this.form.disable();
    } else {
      this.form.enable();
    }
    this.isEditing = !this.isEditing
  }
  
  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  public save(): void {
    if(!this.existReport){
      this.newSocialReport = this.form.value;
      this.patientService.addSocialReport(this.newSocialReport, this.id).subscribe(
        data => {this.openSnackBar(ADD_SUCCESS, CONTINUE_BUTTON)},
        error => {this.openSnackBar(`${ADD_FAIL}: ${error}`, CONTINUE_BUTTON)}
      );
      
    } else {
      this.editSocialReport = this.form.value;
      this.patientService.updateSocialReport(this.editSocialReport, this.id).subscribe(
        data => {this.openSnackBar(UPDATE_SUCCESS, CONTINUE_BUTTON)},
        error => {this.openSnackBar(`${UPDATE_FAIL}: ${error}`, CONTINUE_BUTTON)}
      );
    }
    this.ngOnInit();
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
