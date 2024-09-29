import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterOutlet, RouterLink } from '@angular/router';

/**
 * @description
 * Componente que permite recuperar la contraseña de un usuario registrado.
 * 
 * @usageNotes
 * 1. Verificar correo electrónico
 * 2. Enviar correo de recuperación
 * 3. Mostrar mensaje de éxito o error
 **/

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink],
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent {
  recoveryForm: FormGroup;
  recoveryErrorMessages: string[] = [];
  recoveryMessages: string[] = [];

  constructor(private fb: FormBuilder) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * @description
   * Verificar si el correo electrónico ingresado está registrado y mostrar un mensaje de recuperación.
   */
  submitForm() {
    this.recoveryErrorMessages = [];
    this.recoveryMessages = [];

    if (this.recoveryForm.invalid) {
      this.recoveryErrorMessages.push('Por favor ingrese un correo electrónico válido.');
      return;
    }

    const email = this.recoveryForm.value.email;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) => u.email === email);

    if (usuario) {
      this.recoveryMessages.push(`Se enviará un correo de recuperación a ${email}`);
      this.recoveryMessages.push(`Tu contraseña es: ${usuario.password}`);
    } else {
      this.recoveryErrorMessages.push('El correo electrónico no está registrado.');
    }
  }
}
