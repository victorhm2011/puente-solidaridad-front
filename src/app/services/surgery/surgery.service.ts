import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Responsible } from 'src/app/models/responsible.model';
import { Surgery } from 'src/app/models/surgery.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurgeryService {

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + localStorage.getItem('token')?.toString()||''
   }),
  };
  
  constructor(private http: HttpClient) { }

  public getSurgeryByPatient(patientId: string): Observable<Surgery> {
    const url = `${environment.baseSurgeryUrl}patient/${patientId}/surgery`
    return this.http.get<Surgery>(url, this.httpOptions).pipe(
      catchError(this.handleError<Surgery>(`getSurgery id=${patientId}`))
      );
  }

  public updateSurgery(surgery: Surgery): Observable<Surgery> {
    const url = `${environment.baseSurgeryUrl}surgery/${surgery.id}`
    const body = JSON.stringify(surgery);
    return this.http.patch<Surgery>(url, body, this.httpOptions).pipe(
      catchError(this.handleError<Surgery>('updateSurgery'))
    );
  }

  public addSurgery(newSurgery: Surgery): Observable<Surgery> {
    const body=JSON.stringify(newSurgery);
    return this.http.post<Surgery>(`${environment.baseSurgeryUrl}surgery`, body, this.httpOptions).pipe(
      catchError(this.handleError<Surgery>('addSurgery'))
    );
  }

  //Responsibles
  public getResponsibles(): Observable<Responsible[]> {
    return this.http.get<Responsible[]>(
      `${environment.baseSurgeryUrl}responsibles`,
      this.httpOptions
    )
  }

  public getResponsible(responsibleId: string): Observable<Responsible> {
    const url = `${environment.baseSurgeryUrl}responsible/${responsibleId}`
    return this.http.get<Responsible>(url, this.httpOptions).pipe(
      catchError(this.handleError<Responsible>(`getResponsible id=${responsibleId}`))
      );
  }

  public updateResponsible(responsible: Responsible, responsibleId: string): Observable<Responsible> {
    const url = `${environment.baseSurgeryUrl}responsible/${responsibleId}`
    const body = JSON.stringify(responsible);
    return this.http.patch<Responsible>(url, body, this.httpOptions).pipe(
      catchError(this.handleError<Responsible>('updateResponsible'))
    );
  }

  public addResponsible(newResponsible: Responsible): Observable<Responsible> {
    const body=JSON.stringify(newResponsible);
    return this.http.post<Responsible>(`${environment.baseSurgeryUrl}responsible`, body, this.httpOptions).pipe(
      catchError(this.handleError<Responsible>('addResponsible'))
    );
  }

   //Hospital
   public getHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(
      `${environment.baseSurgeryUrl}hospitals`,
      this.httpOptions
    )
  }

  public getHospital(hospitalId: string): Observable<Hospital> {
    const url = `${environment.baseSurgeryUrl}hospital/${hospitalId}`
    return this.http.get<Hospital>(url, this.httpOptions).pipe(
      catchError(this.handleError<Hospital>(`getHospital id=${hospitalId}`))
      );
  }

  public updateHospital(hospital: Hospital, hospitalId: string): Observable<Hospital> {
    const url = `${environment.baseSurgeryUrl}hospital/${hospitalId}`
    const body = JSON.stringify(hospital);
    return this.http.patch<Hospital>(url, body, this.httpOptions).pipe(
      catchError(this.handleError<Hospital>('updateHospital'))
    );
  }

  public addHospital(newHospital: Hospital): Observable<Hospital> {
    const body=JSON.stringify(newHospital);
    return this.http.post<Hospital>(`${environment.baseSurgeryUrl}hospital`, body, this.httpOptions).pipe(
      catchError(this.handleError<Hospital>('addHospital'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
