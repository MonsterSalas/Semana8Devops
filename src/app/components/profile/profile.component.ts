import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';


/**
 * @description
 * Componente que permite visualizar y editar el perfil del usuario activo.
 * 
 * @usageNotes
 * 1. Mostrar datos del usuario activo
 * 2. Cerrar sesión
 * 3. Guardar cambios en el perfil
 * 4. Seleccionar imagen de perfil
 **/


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profileImageSrc = 'assets/img/perfil.png'; // Ruta inicial de la imagen de perfil
  sesionActiva = false;
  usuarioActivo: any; // Variable para almacenar el usuario activo

  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.checkSession();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }


  /**
   * @description
   * Verificar si existe una sesión activa y cargar los datos del usuario activo.
   **/
  checkSession(): void {
    if (typeof localStorage !== 'undefined') {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      this.usuarioActivo = usuarios.find((usuario: any) => usuario.sesion === true);

      if (this.usuarioActivo) {
        this.sesionActiva = true;

        // Llenar el formulario con los datos del usuario activo
        this.profileForm.patchValue({
          name: this.usuarioActivo.name,
          email: this.usuarioActivo.email
        });

        // Cargar la imagen de perfil si existe en localStorage para este usuario
        const profileImage = localStorage.getItem(`profileImage_${this.usuarioActivo.email}`);
        if (profileImage) {
          this.profileImageSrc = profileImage;
        }
      }
    }
  }

  /**
   * @description
   * Cerrar la sesión del usuario activo.
   **/
  cerrarSesion(): void {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioActivo = usuarios.find((usuario: any) => usuario.sesion === true);

    if (usuarioActivo) {
      usuarioActivo.sesion = false;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      this.sesionActiva = false;
      this.router.navigate(['/index']);
    }
  }

  guardarCambios(): void {
    if (this.profileForm.valid) {
      // Actualizar los datos del usuario activo en el localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioActivoIndex = usuarios.findIndex((usuario: any) => usuario.sesion === true);

      if (usuarioActivoIndex !== -1) {
        usuarios[usuarioActivoIndex].name = this.profileForm.value.name; // Actualizar nombre
        usuarios[usuarioActivoIndex].email = this.profileForm.value.email; // Actualizar correo

        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Guardar imagen de perfil en localStorage para este usuario
        localStorage.setItem(`profileImage_${this.usuarioActivo.email}`, this.profileImageSrc);

        alert('Cambios guardados exitosamente.');
      }
    } else {
      alert('Por favor complete el formulario correctamente.');
    }
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageSrc = e.target.result;

        // Guardar imagen de perfil en localStorage para este usuario
        localStorage.setItem(`profileImage_${this.usuarioActivo.email}`, e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

}
