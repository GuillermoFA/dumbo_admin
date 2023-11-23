import { Component, OnInit } from '@angular/core';
import { ApiUserService } from '../../services/api/api-user.service';
import { FormGroup, FormBuilder, Form, Validators, AbstractControl } from '@angular/forms';
import { User } from 'src/app/services/api/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-add',
  templateUrl: './dashboard-add.component.html',
  styleUrls: ['./dashboard-add.component.css']
})
export class DashboardAddComponent implements OnInit{
  errorMessages: any = {};
  userForm: FormGroup;
  users: User[] = [];

  constructor(private apiService: ApiUserService, private router: Router, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      rut: ['', [Validators.required, this.validateRut]],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      points: ['', [Validators.required, Validators.min(0)]],  // O agrega validadores según sea necesario
      roleId: [2],
    });
   }

  ngOnInit(): void {
  }
  addUser() {
    const newUser: User = this.userForm.value;
    console.log('Nuevo Usuario:', newUser);
    this.apiService.postUser(newUser).subscribe(
      (createdUser: User) => {
        if (createdUser && createdUser.id) {
          this.users.push(createdUser);
          this.router.navigate(['/dashboard']);
          this.userForm.reset();
        } else {
          console.error('Error al agregar usuario:', createdUser);
        }
      },
      (error) => {
        console.error('Error al agregar usuario:', error);
      }
    );
  }

  cancelUpdate() {
      this.userForm.reset();
      console.log('Insert cancelada. Formulario restablecido.');
      this.router.navigate(['/dashboard']);
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


