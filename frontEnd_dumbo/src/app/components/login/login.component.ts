import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/auth/login.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from 'src/app/services/auth/loginRequest';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{


  constructor(
    public loginService: LoginService,
    private formBuilder: FormBuilder,
    private cookiesService: CookieService,
    private router: Router
    ) { }

  ngOnInit(): void {

  }
  loginForm=this.formBuilder.group({
    email: [
      '',
    [Validators.required, Validators.email]],
    password:[
      '',
    [Validators.required]],
  })
  loginError: string="";

  login(){
    if(this.loginForm.valid){
      const credentials = this.loginForm.value as LoginRequest;

      this.loginService.login(credentials).subscribe({
        next: (userData) => {
          if(userData.roleId==1){
            console.log(userData);
            this.cookiesService.set('token', userData.token);
            this.router.navigateByUrl('/dashboard');
            this.loginForm.reset();
          } else {
            this.loginError = 'Usuario no autorizado.';
          }
        },
        error:(errorData) => {
          console.error(errorData);
          this.loginError = errorData;
          if (errorData instanceof HttpErrorResponse && errorData.status === 401) {
            this.loginError = 'Credenciales incorrectas.';
          } else {
            this.loginError = 'Error desconocido al iniciar sesión.';
          }
        },
        complete: () => {
          console.log('Completed login');
        }
      })
    }
    else{
      this.loginForm.markAllAsTouched();
      console.log("Error en un campo");
    }
  }

  get email(){
    return this.loginForm.controls.email;
  }
  get password(){
    return this.loginForm.controls.password;
  }

}
