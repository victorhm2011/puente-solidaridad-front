import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { City } from 'src/app/models/city.model';
import { CivilStatus } from 'src/app/models/civilStatus.model';
import { Gender } from 'src/app/models/gender.model';
import { NewPatient } from 'src/app/models/newPatient.model';
import { Patient } from 'src/app/models/patient.model';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Physician } from 'src/app/models/physician.model';
import { NewSocioEcoSituation } from 'src/app/models/newSocioEcoSituation.model';
import { SocioEcoSituation } from 'src/app/models/socioEcoSituation.model';
import { NewRelative } from 'src/app/models/newRelative.model';
import { Relative } from 'src/app/models/relative.model';
import { SocialReport } from 'src/app/models/socialReport.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + localStorage.getItem('token')?.toString()||''
   }),
  };

  constructor(private http: HttpClient) { }

  public getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(
      `${environment.basePatientUrl}patients`,
      this.httpOptions
    )
  }

  public getPatient(patientId: string): Observable<Patient> {
    const url = `${environment.basePatientUrl}patient/${patientId}`
    return this.http.get<Patient>(url, this.httpOptions).pipe(
      catchError(this.handleError<Patient>(`getPatient id=${patientId}`))
      );
  }

  public getGenders(): Observable<Gender[]> {
    return this.http.get<Gender[]>(
      `${environment.basePatientUrl}genders`,
      this.httpOptions
    )
  }

  public getCivilStatus(): Observable<CivilStatus[]> {
    return this.http.get<CivilStatus[]>(
      `${environment.basePatientUrl}civilStatuses`,
      this.httpOptions
    )
  }

  public getCities(): Observable<City[]> {
    return this.http.get<City[]>(
      `${environment.basePatientUrl}cities`,
      this.httpOptions
    )
  }

  public getPhysicians(): Observable<Physician[]> {
    return this.http.get<Physician[]>(
      `${environment.basePhysicianUrl}physicians`,
      this.httpOptions
    )
  }

  public addPatient(newPatient: NewPatient): Observable<Patient> {
    const body=JSON.stringify(newPatient);
    return this.http.post<Patient>(`${environment.basePatientUrl}patient`, body, this.httpOptions).pipe(
      catchError(this.handleError<Patient>('addPatient'))
    );
  }

  public updatePatient(patient: Patient, patientId: string): Observable<Patient> {
    const url = `${environment.basePatientUrl}patient/${patientId}`
    const body = JSON.stringify(patient);
    return this.http.patch<Patient>(url, body, this.httpOptions).pipe(
      catchError(this.handleError<Patient>('updatePatient'))
    );
  }

  public addSocioEcoSituation(newSocioEcoSituation: NewSocioEcoSituation, patientId: string): Observable<SocioEcoSituation> {
    const body=JSON.stringify(newSocioEcoSituation);
    return this.http.post<any>(`${environment.basePatientUrl}patient/${patientId}/situation`, body, this.httpOptions).pipe(
      catchError(this.handleError<SocioEcoSituation>('addSocioEcoSituation'))
    );
  }

  public getSocioEcoSituation(patientId: string): Observable<SocioEcoSituation> {
    const url = `${environment.basePatientUrl}patient/${patientId}/situation`
    return this.http.get<SocioEcoSituation>(url, this.httpOptions).pipe(
      catchError(this.handleError<SocioEcoSituation>(`getSocioEcoSituation id=${patientId}`))
      );
  }

  public updateSocioEcoSituation(socioEcoSituation: SocioEcoSituation, patientId: string): Observable<SocioEcoSituation> {
    const url = `${environment.basePatientUrl}patient/${patientId}/situation`
    const body = JSON.stringify(socioEcoSituation);
    return this.http.patch<SocioEcoSituation>(url, body, this.httpOptions).pipe(
      catchError(this.handleError<SocioEcoSituation>('updateSocioEcoSituation'))
    );
  }

  public addRelative(newRelative: NewRelative): Observable<Relative> {
    const body=JSON.stringify(newRelative);
    return this.http.post<Relative>(`${environment.basePatientUrl}relative`, body, this.httpOptions).pipe(
      catchError(this.handleError<Relative>('addRelative'))
    );
  }

  public deleteRelatives(patientId: string): Observable<Relative> {
    return this.http.delete<Relative>(`${environment.basePatientUrl}patient/${patientId}/relatives`, this.httpOptions).pipe(
      catchError(this.handleError<Relative>('deleteRelative'))
    );
  }

  public addRelativeList(relatives: NewRelative[], patientId: string): Observable<Relative>[] {
    let resp: Observable<Relative>[] = [];
    for(let i=0; i < relatives.length; i++){
      relatives[i].patientId = patientId;
      resp[i] = this.addRelative(relatives[i]);
    }
    return resp;
  }

  public getRelatives(patientId: string): Observable<Relative[]> {
    return this.http.get<Relative[]>(
      `${environment.basePatientUrl}patient/${patientId}/relatives`,
      this.httpOptions
    )
  }

  public updateRelative(relative: Relative, patientId: string): Observable<Relative> {
    const url = `${environment.basePatientUrl}relative/${patientId}`
    const body = JSON.stringify(relative);
    return this.http.patch<Relative>(url, body, this.httpOptions).pipe(
      catchError(this.handleError<Relative>('updateRelative'))
    );
  }

  public deletePatient(patientId: string): Observable<Patient> {
    return this.http.delete<Patient>(`${environment.basePatientUrl}patient/${patientId}`, this.httpOptions).pipe(
      catchError(this.handleError<Patient>('deletePatient'))
    );
  }

  public addSocialReport(newSocialReport: SocialReport, patientId: string): Observable<SocialReport> {
    const body=JSON.stringify(newSocialReport);
    return this.http.post<any>(`${environment.basePatientUrl}patient/${patientId}/valuation`, body, this.httpOptions).pipe(
      catchError(this.handleError<SocialReport>('addSocialReport'))
    );
  }

  public getSocialReport(patientId: string): Observable<SocialReport> {
    const url = `${environment.basePatientUrl}patient/${patientId}/valuation`
    return this.http.get<SocialReport>(url, this.httpOptions).pipe(
      catchError(this.handleError<SocialReport>(`getSocialReport id=${patientId}`))
      );
  }

  public updateSocialReport(socialReport: SocialReport, patientId: string): Observable<SocialReport> {
    const url = `${environment.basePatientUrl}patient/${patientId}/valuation`
    const body = JSON.stringify(socialReport);
    return this.http.patch<SocialReport>(url, body, this.httpOptions).pipe(
      catchError(this.handleError<SocialReport>('updateSocialReport'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
