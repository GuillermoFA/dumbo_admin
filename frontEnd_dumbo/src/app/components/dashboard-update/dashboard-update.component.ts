import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUserService } from 'src/app/services/api/api-user.service';
import { User } from 'src/app/services/api/user';

@Component({
  selector: 'app-dashboard-update',
  templateUrl: './dashboard-update.component.html',
  styleUrls: ['./dashboard-update.component.css']
})
export class DashboardUpdateComponent implements OnInit {
  userForm: FormGroup;
  userId?: number;
  user?: User;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiUserService
  ) {
    this.userForm = this.formBuilder.group({
      rut: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      points: ['', Validators.required],
      roleId: [2],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.params['id'];

  if (idParam) {
    this.userId = +idParam;
    this.apiService.getUsersById(this.userId).subscribe(
      (data) => {
        this.userForm.setValue({
          rut: data.rut,
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          points: data.points,
          roleId: data.roleId,
        });
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  } else {
    console.error('ID del usuario no proporcionado en la ruta.');
  }
  }

  updateUser() {
    const updatedUser: User = this.userForm.value;

    if (this.userId !== undefined) {
      this.apiService.putUser(this.userId, updatedUser).subscribe(
        () => {
          console.log('Usuario actualizado correctamente.');
          this.userForm.reset();
          this.router.navigate(['/dashboard']);  // Redirigir después de la actualización
        },
        (error) => {
          console.error('Error al actualizar usuario:', error);
        }
      );
    } else {
      console.error('ID del usuario no definido al intentar actualizar.');
    }
  }

  cancelUpdate() {
    const confirmCancel = confirm('¿Seguro que quieres cancelar la actualización?');
    if (confirmCancel) {
      // Restablecer el formulario a los valores originales o limpiar cambios no guardados
      this.userForm.reset();
      console.log('Actualización cancelada. Formulario restablecido.');
      this.router.navigate(['/dashboard']);  // Redirigir a la página principal
    }
  }

  sureUpdate() {
    const confirmUpdate = confirm('¿Seguro que quieres actualizar el usuario?');
    if (confirmUpdate) {
      // Restablecer el formulario a los valores originales o limpiar cambios no guardados
      this.userForm.reset();
      console.log('Actualización realizada. Formulario restablecido.');
      this.router.navigate(['/dashboard']);  // Redirigir a la página principal
    }
  }
}
