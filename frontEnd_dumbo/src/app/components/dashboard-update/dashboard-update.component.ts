import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  errorMessages: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiUserService
  ) {
    this.userForm = this.formBuilder.group({
      rut: ['', [Validators.required, this.validateRut]],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      points: ['', [Validators.required, Validators.min(0)]],  // O agrega validadores según sea necesario
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
    this.userForm.reset();
    console.log('Actualización cancelada. Formulario restablecido.');
    this.router.navigate(['/dashboard']);  // Redirigir a la página principal
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

  onSubmit() {
    if (this.userForm.invalid) {
      this.errorMessages = {};
      for (const control in this.userForm.controls) {
        if (this.userForm.controls.hasOwnProperty(control)) {
          const errors = this.userForm.controls[control].errors;
          if (errors) {
            this.errorMessages[control] = this.getErrorMessages(control, errors);
          }
        }
      }
      console.log(this.errorMessages);
      console.log('Formulario inválido. Revise los mensajes de error.');
      return;
    }

    console.log('Formulario válido. Enviar datos al servidor.');
  }
  private getErrorMessages(control: string, errors: any): string {
    const messages: any = {
      required: `${control.charAt(0).toUpperCase() + control.slice(1)} es obligatorio.`,
      email: 'Ingrese un correo electrónico válido.',
      validateRut: 'Ingrese un RUT válido.',
      min: `${control.charAt(0).toUpperCase() + control.slice(1)} debe ser igual o mayor que 0.`,
      // Otras validaciones según sea necesario
    };

    return messages[Object.keys(errors)[0]];
  }
  private validateRut(control: AbstractControl): { [key: string]: boolean } | null {
    const rut = control.value;
    const rutRegex: RegExp = /^(\d{1,3}(?:\.\d{1,3}){2}-[\dK])$/;
    if (!rutRegex.test(rut)) {
      return { validateRut: true };
    }
    return null;
  }
}
