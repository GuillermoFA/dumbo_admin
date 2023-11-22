import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiUserService } from 'src/app/services/api/api-user.service';
import { User } from 'src/app/services/auth/user';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  users: User[] = [];
  userForm: FormGroup;
  rutSearch: string = '';
  private ngUnsubscribe = new Subject();

  constructor(private userApiService: ApiUserService, private fb: FormBuilder, private modalService: NgbModal) {
    this.userForm = this.fb.group({
      rut: [''],
      name: [''],
      lastName: [''],
      email: [''],
      password: [''],
      points: [''],
      roleId: ['']
    });
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

  addUser(){
    const newUser: User = this.userForm.value;
    this.userApiService.postUser(newUser).subscribe(
    (createdUser)=>{
      this.users.push(createdUser);
      this.userForm.reset();
    },
    (error)=>{
      console.error('Error al agregar usuario:', error);
    }
    );
  }

  openDeleteConfirmationModal(userId: number, content: any) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'Ok click') {
          this.deleteUser(userId);
        }
      },
      (reason) => {
        // Se ejecuta cuando se cierra el modal sin hacer clic en OK
        console.log(`Dismissed with reason: ${reason}`);
      }
    );
  }

  updateUser(id: number){
    if(id !== null){
      const updatedUser: User = this.userForm.value;
      this.userApiService.putUser(id, updatedUser).subscribe(
        (updatedUser)=>{
          const index = this.users.findIndex((user)=>user.id === id);
          if (index !== -1){
            this.users[index] = updatedUser;
            this.userForm.reset();
            id = 0;
          }
        },
        (error)=>{
          console.error('Error al actualizar usuario:', error);
        }
        );
    }
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
