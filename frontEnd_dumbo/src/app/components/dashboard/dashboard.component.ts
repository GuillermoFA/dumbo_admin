import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiUserService } from 'src/app/services/api/api-user.service';
import { User } from 'src/app/services/auth/user';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';



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
  filteredUsers: User[] = [];
  searchForm: FormGroup;

  constructor(private userApiService: ApiUserService, private formBuilder: FormBuilder, private router: Router) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
    });
    this.filteredUsers = [];
  }

  ngOnInit(): void {
    this.getUsers();
  }

  onClickOut(){
    this.userApiService.logout();
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
      this.filteredUsers = this.users;
      console.log(this.filteredUsers)

    });
  }

  search() {
    const searchTerm = this.searchForm.get('searchTerm')?.value.trim().toLowerCase();

    if (searchTerm === '') {
      // Si el campo de búsqueda está vacío, mostrar todos los usuarios
      this.filteredUsers = this.users;
    } else {
      // Realizar la búsqueda y actualizar los resultados
      this.userApiService.searchUser(searchTerm).subscribe(
        (result) => {
          this.filteredUsers = result;
        },
        (error) => {
          console.error('Error al buscar usuarios:', error);
        }
      );
    }
  }



  deleteUser(userId: number) {
    const confirmDelete = confirm('¿Seguro que quieres eliminar este usuario?');
    if (confirmDelete) {
      this.userApiService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter(user => user.id !== userId);
          this.filteredUsers = this.filteredUsers.filter(user => user.id !== userId);
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
          // Puedes agregar lógica adicional para manejar el error aquí
        }
      );
    }

  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.complete();
  }

}
