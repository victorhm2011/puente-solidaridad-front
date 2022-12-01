import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { switchMap, take, tap } from 'rxjs/operators';
import { UserResponse } from 'src/app/models/userResponse.model';
import jwt_decode from 'jwt-decode';
import { Role, User } from 'src/app/models/user.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  public login( email: string, password: string): Observable<{ token: string }> {
    return this.http
    .post<{ token: string }>(
      `${environment.baseApiUrl}login`,
      { email, password },
      this.httpOptions
    )
    .pipe(
      take(1),
      tap((response: { token: string }) => {
        localStorage.setItem(
          'token',
          response.token
        );
        const decodedToken: UserResponse = jwt_decode(response.token);
        this.userService.setNext(decodedToken.user);
      })
    );
  }

  public logout() {
    localStorage.removeItem('token');
  }
}
