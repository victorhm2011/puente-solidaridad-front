import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Aid } from 'src/app/models/aid.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AidService {

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + localStorage.getItem('token')?.toString()||''
   }),
  };

  constructor(private http: HttpClient) { }

  public getAids(patientId: string): Observable<Aid[]> {
    return this.http.get<Aid[]>(
      `${environment.baseAidUrl}patient/${patientId}/aid`,
      this.httpOptions
    )
  }

  public addAid(newAid: Aid): Observable<Aid> {
    const body=JSON.stringify(newAid);
    return this.http.post<Aid>(`${environment.baseAidUrl}aid`, body, this.httpOptions).pipe(
      catchError(this.handleError<Aid>('addAid'))
    );
  }

  public getAid(aidId: string): Observable<Aid> {
    const url = `${environment.baseAidUrl}aid/${aidId}`
    return this.http.get<Aid>(url, this.httpOptions).pipe(
      catchError(this.handleError<Aid>(`getAid id=${aidId}`))
    );
  }

  public updateAid(aid: Aid): Observable<Aid> {
    const url = `${environment.baseAidUrl}aid/${aid.id}`
    const body = JSON.stringify(aid);
    return this.http.patch<Aid>(url, body, this.httpOptions).pipe(
      catchError(this.handleError<Aid>('updateAid'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
