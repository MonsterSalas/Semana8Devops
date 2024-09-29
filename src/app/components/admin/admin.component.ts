import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';

/**
 * @description
 * Componente que permite administrar los productos de la tienda y los usuarios registrados.
 * 
 * @usageNotes
 * 1. Verificar sesión activa
 * 2. Formatear precio a moneda local (CLP)
 * 3. Editar producto
 * 4. Guardar cambios del producto editado
 * 5. Cancelar edición
 * 6. Cerrar sesión
 * 7. Cargar usuarios
 * 8. Eliminar usuario
 * 9. Obtener ruta de la imagen de perfil
**/


interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    brand: string;
    image: string;
}

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})

export class AdminComponent implements OnInit {
    usuarios: any[] = [];
    constructor(private router: Router) { }
    sesionActiva = false;

    products: Product[] = [
        { id: 1, name: 'Club De Nuit Woman', description: 'Armaf EDP 100ml', price: 45000, brand: 'Armaf', image: 'assets/img/cdnWoman.jpg' },
        { id: 2, name: 'Eros Flame', description: 'Versace EDP 100ml', price: 75000, brand: 'Versace', image: 'assets/img/erosFlame.jpg' },
        { id: 3, name: 'Gentleman Intense', description: 'Givenchy EDT 100ml', price: 65000, brand: 'Givenchy', image: 'assets/img/gentleman.jpg' },
        { id: 4, name: 'Scandal Pour Homme', description: 'Jean Paul Gaultier EDT 100ml', price: 80000, brand: 'Jean Paul Gaultier', image: 'assets/img/jpgEscandal.jpg' },
        { id: 5, name: 'Asad', description: 'Lattafa Perfumes EDP 100ml', price: 35000, brand: 'Lattafa', image: 'assets/img/laattafaAsad.jpg' },
        { id: 6, name: 'Halloween Man X', description: 'Halloween EDT 100ml', price: 25000, brand: 'Halloween', image: 'assets/img/manX.jpg' },
        { id: 7, name: 'Phantom', description: 'Paco Rabanne EDT 100ml', price: 75000, brand: 'Paco Rabanne', image: 'assets/img/phantom.jpg' },
        { id: 8, name: 'Toy Boy', description: 'Moschino EDP 100ml', price: 80000, brand: 'Moschino', image: 'assets/img/toyBoy.jpg' },
        { id: 9, name: 'Ultra Male', description: 'Jean Paul Gaultier EDT 75ml', price: 50000, brand: 'Jean Paul Gaultier', image: 'assets/img/jpgUltraMale.jpg' },
        { id: 10, name: 'Turathi Blue', description: 'Afnan EDT 100ml', price: 32000, brand: 'Afnan', image: 'assets/img/afnanTurathiBlue.jpg' },
        { id: 11, name: 'Spicebomb Extreme', description: 'Viktor&Rolf EDP 100ml', price: 120000, brand: 'Viktor&Rolf', image: 'assets/img/spiceBomb.jpg' },
        { id: 12, name: 'The Most Wanted', description: 'Azzaro EDP 100ml', price: 85000, brand: 'Azzaro', image: 'assets/img/theMostWanted.jpg' }
    ];

    selectedProduct: Product | null = null;

    ngOnInit(): void {
        this.checkSession();
        this.loadUsers();
    }

    /**
     * Formatear precio a moneda local (CLP)
     * 
     * @param {number} price - Precio a formatear 
     * @returns {string} - Precio formateado en moneda local
    **/
    formatPrice(price: number): string {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
    }

    /**
     * Selección de producto para editar
     * 
     * @param {Product} product - Producto a editar
     * @returns {void} 
    **/
    editProduct(product: Product): void {
        this.selectedProduct = { ...product }; // Crear una copia del producto para editar
    }

    // Guardar cambios del producto editado
    saveProduct(): void {
        if (this.selectedProduct) {
            const index = this.products.findIndex(p => p.id === this.selectedProduct!.id);
            if (index !== -1) {
                this.products[index] = this.selectedProduct;
                this.selectedProduct = null;
            }
        }
    }

    // Cancelar edición
    cancelEdit(): void {
        this.selectedProduct = null;
    }

    // Verificar sesión
    checkSession(): void {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuarioActivo = usuarios.find((usuario: any) => usuario.sesion === true);

        if (usuarioActivo) {
            this.sesionActiva = true;
        }
    }

    // Cerrar sesión
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

    loadUsers(): void {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        this.usuarios = usuarios;
    }

    eliminarUsuario(index: number): void {
        if (confirm(`¿Estás seguro de eliminar al usuario ${this.usuarios[index].name}?`)) {
            this.usuarios.splice(index, 1);
            localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
            alert('Usuario eliminado correctamente.');
        }
    }

    getProfileImageSrc(email: string): string {
        const profileImage = localStorage.getItem(`profileImage_${email}`);
        return profileImage ? profileImage : 'assets/img/perfil.png'; // Ruta inicial de la imagen de perfil
    }

}
