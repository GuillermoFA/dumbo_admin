import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiUserService } from 'src/app/services/api/api-user.service';
import { User } from 'src/app/services/auth/user';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  users: User[] = [];
  rutSearch: string = '';
  private ngUnsubscribe = new Subject();
  dashboardError: string="";

  constructor(private userApiService: ApiUserService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userApiService.getUsers().pipe(
      takeUntil(this.ngUnsubscribe),
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        return [];
      })
    ).subscribe((data) => {
      this.users = data;
    });
  }



  deleteUser(userId: number) {
    this.userApiService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter(user => user.id !== userId);
      },
      (error) => {
        console.error('Error al eliminar usuario:', error);
        // Puedes agregar lógica adicional para manejar el error aquí
      }
    );
  }

  searchUserByRut(rut: string) {
    // Lógica para buscar usuario por RUT
  }




  ngOnDestroy(): void {
    this.ngUnsubscribe.complete();
  }

}
