import { Component, OnInit } from '@angular/core';
import { ApiUserService } from '../../services/api/api-user.service';
import { FormGroup, FormBuilder, Form, Validators } from '@angular/forms';
import { User } from 'src/app/services/api/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-add',
  templateUrl: './dashboard-add.component.html',
  styleUrls: ['./dashboard-add.component.css']
})
export class DashboardAddComponent implements OnInit{
  dashboardError: string="";
  userForm: FormGroup;
  users: User[] = [];

  constructor(private apiService: ApiUserService, private router: Router, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      rut: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      points: [''],  // O agrega validadores según sea necesario
      roleId: [2],
    });
   }

  ngOnInit(): void {
  }

  addUser() {
    const newUser: User = this.userForm.value;
    console.log('Nuevo Usuario:', newUser);
    this.apiService.postUser(newUser).subscribe(
      (createdUser: User) => {  // El tipo de respuesta debe ser User
        // Verificar si la respuesta contiene un usuario
        if (createdUser && createdUser.id) {
          // Usuario creado exitosamente
          this.users.push(createdUser);
          this.router.navigate(['/dashboard']);
          this.userForm.reset();
        } else {
          // Manejar el caso de éxito, pero sin un usuario válido
          console.error('Error al agregar usuario:', createdUser);
        }
      },
      (error) => {
        // Manejar el caso de error
        console.error('Error al agregar usuario:', error);
      }
    );
  }

  cancelUpdate() {

      // Restablecer el formulario a los valores originales o limpiar cambios no guardados
      this.userForm.reset();
      console.log('Insert cancelada. Formulario restablecido.');
      this.router.navigate(['/dashboard']);  // Redirigir a la página principal
  }

}


