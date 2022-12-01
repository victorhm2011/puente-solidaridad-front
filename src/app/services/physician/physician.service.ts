import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Physician } from 'src/app/models/physician.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhysicianService {

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + localStorage.getItem('token')?.toString()||''
   }),
  };

  constructor(private http: HttpClient) { }

  public getPhysicians(): Observable<Physician[]> {
    return this.http.get<Physician[]>(
      `${environment.basePhysicianUrl}physicians`,
      this.httpOptions
    )
  }

  public getPhysician(physicianId: string): Observable<Physician> {
    const url = `${environment.basePhysicianUrl}physician/${physicianId}`
    return this.http.get<Physician>(url, this.httpOptions).pipe(
      catchError(this.handleError<Physician>(`getPhysician id=${physicianId}`))
      );
  }

  public updatePhysician(physician: Physician, physicianId: string): Observable<Physician> {
    const url = `${environment.basePhysicianUrl}physician/${physicianId}`
    const body = JSON.stringify(physician);
    return this.http.patch<Physician>(url, body, this.httpOptions).pipe(
      catchError(this.handleError<Physician>('updatePhysician'))
    );
  }

  public addPhysician(newPhysician: Physician): Observable<Physician> {
    const body=JSON.stringify(newPhysician);
    return this.http.post<Physician>(`${environment.basePhysicianUrl}physician`, body, this.httpOptions).pipe(
      catchError(this.handleError<Physician>('addPhysician'))
    );
  }

  public deletePhysician(physicianId: string): Observable<Physician> {
    return this.http.delete<Physician>(`${environment.basePhysicianUrl}physician/${physicianId}`, this.httpOptions).pipe(
      catchError(this.handleError<Physician>('deletePhysician'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
