import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public email!: string;
  public password!: string;
  public form!: FormGroup;
  public hide = true;
  public isLoginFailed = false;
  public showErrorMessage = false;
  public isLoggedIn = false;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.loginService.logout();
  }

  public login() {
    return this.loginService.login(this.form.value.email, this.form.value.password).subscribe(data => {
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.router.navigateByUrl('/home');
    },
      err => {
        this.isLoginFailed = true;
        this.showErrorMessage = true;
      }
    );
  }

  public hasError = (controlName:string, errorName:string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  hideErrorMessage(): void {
    if(this.showErrorMessage){
    this.showErrorMessage = false;
    }
  }
}
