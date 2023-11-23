import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {

  private apiUrl = 'http://localhost:5240/api/';

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  getUsers(): Observable<User[]>{
    return this.httpClient.get<User[]>(`${this.apiUrl}Users`);
  }

  getUsersById(id: number): Observable<User>{
    return this.httpClient.get<User>(`${this.apiUrl}Users/${id}`);
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

  searchUser(searchTerm: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}Users/search?term=${searchTerm}`);
  }



  logout(){
    localStorage.removeItem('token');
    this.cookieService.delete('token');
    this.cookieService.deleteAll();
  }




}
