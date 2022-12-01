import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Role, User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user$ = new BehaviorSubject<User>({});

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + localStorage.getItem('token')?.toString()||''
   }),
  };

  constructor(private http: HttpClient) { }

  public get isUserLoggedIn(): boolean {
    return !!this.user$.getValue().id;
  }

  public get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user?.role!); // for after signed out, but still subscribed
      })
    );
  }

  public setNext(user: User) {
    this.user$.next(user);
  }
  
  public getToken() {
    return localStorage.getItem('token')|| '{}';
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(
      `${environment.baseApiUrl}users`,
      this.httpOptions
    )
  }

  public addUser(newUser: User): Observable<User> {
    const body=JSON.stringify(newUser);
    return this.http.post<User>(`${environment.baseApiUrl}user`, body, this.httpOptions).pipe(
      catchError(this.handleError<User>('addUser'))
    );
  }

  public deleteUser(userId: string): Observable<User> {
    return this.http.delete<User>(`${environment.baseApiUrl}user/${userId}`, this.httpOptions).pipe(
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  public getUser(userId: string): Observable<User> {
    const url = `${environment.baseApiUrl}user/${userId}`
    return this.http.get<User>(url, this.httpOptions).pipe(
      catchError(this.handleError<User>(`getUserid=${userId}`))
    );
  }

  public updateUser(user: User): Observable<User> {
    const url = `${environment.baseApiUrl}user/${user.email}`
    const body = JSON.stringify(user);
    return this.http.patch<User>(url, body, this.httpOptions).pipe(
      catchError(this.handleError<User>('updateUser'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
