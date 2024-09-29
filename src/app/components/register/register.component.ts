import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';

/**
 * @description
 * Componente que permite registrar un nuevo usuario en la aplicación.
 * 
 * @usageNotes
 * 1. Verificar nombre, correo electrónico y contraseña
 * 2. Validar correo electrónico único
 * 3. Validar contraseña
 * 4. Registrar usuario
 * 5. Redirigir a la página de inicio
 **/
 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  miFormulario!: FormGroup;
  formErrors: string[] = [];

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.miFormulario = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailExistsValidator.bind(this)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        this.passwordValidator
      ]]
    });
  }

  /**
   * @description
   * Validador personalizado para la contraseña.
   */
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const errors = [];
    const passwordMinLength = 8;
    const passwordMaxLength = 20;
    const passwordRegex = {
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      digit: /[0-9]/,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/
    };

    if (password.length < passwordMinLength) {
      errors.push(`La contraseña debe tener al menos ${passwordMinLength} caracteres.`);
    }
    if (password.length > passwordMaxLength) {
      errors.push(`La contraseña debe tener un máximo de ${passwordMaxLength} caracteres.`);
    }
    if (!passwordRegex.lowercase.test(password)) {
      errors.push("La contraseña debe tener al menos una letra minúscula.");
    }
    if (!passwordRegex.uppercase.test(password)) {
      errors.push("La contraseña debe tener al menos una letra mayúscula.");
    }
    if (!passwordRegex.digit.test(password)) {
      errors.push("La contraseña debe tener al menos un número.");
    }
    if (!passwordRegex.specialChar.test(password)) {
      errors.push("La contraseña debe tener al menos un carácter especial (ej. !@#$%^&*).");
    }

    return errors.length > 0 ? { passwordInvalid: errors.join('\n') } : null;
  }

  /**
   * @description
   * Validador personalizado para verificar si el correo electrónico ya está registrado.
   */
  emailExistsValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const emailExists = usuarios.some((usuario: any) => usuario.email === email);

    return emailExists ? { emailExists: 'El correo electrónico ya está registrado.' } : null;
  }

  onSubmit() {
    this.formErrors = [];
    const passwordControl = this.miFormulario.get('password');
    if (passwordControl && passwordControl.errors) {
      this.formErrors.push(passwordControl.errors['passwordInvalid']);
    }

    const emailControl = this.miFormulario.get('email');
    if (emailControl && emailControl.errors) {
      if (emailControl.errors['emailExists']) {
        this.formErrors.push(emailControl.errors['emailExists']);
      }
    }

    if (this.miFormulario.invalid) {
      if (this.miFormulario.get('name')?.invalid) {
        this.formErrors.push('El nombre es requerido.');
      }
      if (emailControl?.invalid) {
        if (emailControl.errors?.['required']) {
          this.formErrors.push('El correo electrónico es requerido.');
        }
        if (emailControl.errors?.['email']) {
          this.formErrors.push('El correo electrónico no es válido.');
        }
      }
    }


    if (this.miFormulario.valid) {
      const usuario = { ...this.miFormulario.value, sesion: true };

      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      usuarios.push(usuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      this.router.navigate(['/index']);
    } else {
      console.log('Formulario no válido');
    }

  }
}
