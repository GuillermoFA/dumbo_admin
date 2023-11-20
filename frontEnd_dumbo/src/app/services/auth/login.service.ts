import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User } from './user';



@Injectable({
  providedIn: 'root'
})
export class LoginService {


  private apiUrl = 'http://localhost:5240/api/';
  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<User>{
    return this.http.post<any>(`${this.apiUrl}Auth/login`, credentials).pipe(
      tap((userData: User) => {
        console.log(userData);
      }),
      catchError(this.handleError)
    );
  }







  private handleError(error:HttpErrorResponse){
    if(error.status==0){ //No hay respuesta
      console.error('Se ha producido un error ', error);
    }
    else{
      console.error('BackEnd retorna codigo de estado', error.status, error.error);
    }
    return throwError(()=> new Error('Algo fallo. intentar denuevo'));
  }


}
