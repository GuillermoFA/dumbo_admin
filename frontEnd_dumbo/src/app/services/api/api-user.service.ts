import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {

  private apiUrl = 'http://localhost:5240/api/';

  constructor(private httpClient: HttpClient) { }

  getUsers(): Observable<User[]>{
    return this.httpClient.get<User[]>(`${this.apiUrl}Users`);
  }

  postUser(user: User): Observable<User>{
    return this.httpClient.post<User>(`${this.apiUrl}Users`, user);
  }

  putUser(id: number, user: User): Observable<User>{
    return this.httpClient.put<User>(`${this.apiUrl}Users/${id}`, user);
  }

  deleteUser(id: number): Observable<any>{
    return this.httpClient.delete(`${this.apiUrl}Users/${id}`);
  }


}