import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/auth/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from 'src/app/services/auth/loginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{


  constructor(
    public loginService: LoginService,
    private formBuilder: FormBuilder
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
          console.log(userData);
          this.loginForm.reset();
        },
        error:(errorData) => {
          console.error(errorData);
          this.loginError = errorData;
        },
        complete: () => {
          console.log('completado');
        }
      })
    }

  }

}
