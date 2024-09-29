import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';


/**
 * @description
 * Componente que permite iniciar sesión en la aplicación.
 * 
 * @usageNotes
 * 1. Iniciar sesión
 * 2. Validar formulario
 * 3. Mostrar errores de validación
 * 4. Redirigir a la página de inicio
 * 5. Redirigir a la página de administrador
 * 6. Guardar estado de la sesión
 * 7. Mostrar mensaje de error
**/

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  miFormulario: FormGroup;
  formErrors: string[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.miFormulario = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * @description
   * Método para iniciar sesión en la aplicación.
   **/
  submitForm() {
    this.formErrors = [];

    if (this.miFormulario.invalid) {
      return;
    }

    const email = this.miFormulario.value.email;
    const password = this.miFormulario.value.password;

    // Obtener usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    // Buscar si existe un usuario con el email y contraseña proporcionados
    const usuario = usuarios.find((u: any) => u.email === email && u.password === password);

    if (usuario) {
      // Actualizar el estado de la sesión del usuario
      usuario.sesion = true;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      if (email === 'admin@admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/index']);
      }
    } else {
      this.formErrors.push('Correo electrónico o contraseña incorrectos.');
    }
  }
  

}