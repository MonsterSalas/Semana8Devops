import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';

/**
 * @description
 * Componente que permite visualizar los productos de la tienda y añadirlos al carrito de compras.
 * 
 * @usageNotes
 * 1. Verificar sesión activa
 * 2. Añadir producto al carrito
 * 3. Eliminar producto del carrito
 * 4. Actualizar el conteo de ítems en el carrito
 * 5. Actualizar el total del carrito
 * 6. Mostrar/ocultar carrito
 * 7. Cerrar carrito
 * 8. Filtrar productos
 * 9. Inicializar productos filtrados
 * 10. Filtrar productos por precio y marca
 * 11. Filtrar productos por marca
 * 12. Aplicar filtros
 * 13. Verificar filtro de precio
 * 14. Formatear precio a moneda chilena
 * 15. Verificar sesión
 * 16. Cerrar sesión
**/

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    brand: string;
    image: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

@Component({
    selector: 'app-index',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink],
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})



export class IndexComponent implements OnInit {

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

    // Carrito de compras
    cart: CartItem[] = [];
    cartItemCount: number = 0;
    cartTotal: number = 0;
    showCart: boolean = false;

    /**
     * Añadir producto al carrito
     * 
     * @param {Product} product - Producto a añadir al carrito
     * @returns {void}
     **/
    addToCart(product: Product): void {
        const existingItem = this.cart.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ product, quantity: 1 });
        }
        this.updateCartItemCount();
        this.updateCartTotal();
        this.saveCartToLocalStorage();
    }

    /**
     * Quita un producto del carrito
     * 
     * @param {Product} product - Producto a quitar del carrito
     * @returns {void}
     **/
    removeFromCart(product: Product): void {
        const existingItem = this.cart.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity -= 1;
            if (existingItem.quantity === 0) {
                this.cart = this.cart.filter(item => item.product.id !== product.id);
            }
        }
        this.updateCartItemCount();
        this.updateCartTotal();
        this.saveCartToLocalStorage();
    }

    // Actualizar el conteo de ítems en el carrito
    updateCartItemCount(): void {
        this.cartItemCount = this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Actualizar el total del carrito
    updateCartTotal(): void {
        this.cartTotal = this.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    // Mostrar/ocultar carrito
    toggleCart(): void {
        this.showCart = !this.showCart;
    }

    // Cerrar carrito
    closeCart(): void {
        this.showCart = false;
    }

    //Filtrar productos
    filteredProducts: Product[] = [];
    priceFilter: string = 'all';
    brandFilter: string = 'all';

    //Inicializar productos filtrados
    ngOnInit(): void {
        this.filteredProducts = this.products;
        this.checkSession();
        this.loadCartFromLocalStorage();
    }

    //Filtrar productos por precio y marca
    onPriceFilterChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.priceFilter = target.value;
        this.applyFilters();
    }

    //Filtrar productos por marca
    onBrandFilterChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.brandFilter = target.value;
        this.applyFilters();
    }

    //Aplicar filtros
    applyFilters(): void {
        this.filteredProducts = this.products.filter(product => {
            const matchesPrice = this.priceFilter === 'all' || this.checkPriceFilter(product.price);
            const matchesBrand = this.brandFilter === 'all' || product.brand === this.brandFilter;
            return matchesPrice && matchesBrand;
        });
    }

    //Verificar filtro de precio
    checkPriceFilter(price: number): boolean {
        if (this.priceFilter === 'all') return true;
        const [min, max] = this.priceFilter.split('-').map(Number);
        return (min <= price && (max ? price <= max : true));
    }

    //Formatear precio a moneda chilena
    formatPrice(price: number): string {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
    }

    // Verificar sesión
    checkSession(): void {
        if (this.isLocalStorageAvailable()) {
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const usuarioActivo = usuarios.find((usuario: any) => usuario.sesion === true);
            this.sesionActiva = usuarioActivo ? true : false;
        }
    }

    // Cerrar sesión
    cerrarSesion(): void {
        if (this.isLocalStorageAvailable()) {
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const usuarioActivo = usuarios.find((usuario: any) => usuario.sesion === true);

            if (usuarioActivo) {
                usuarioActivo.sesion = false;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                this.sesionActiva = false;
                this.router.navigate(['/index']);
            }
        }
    }

     saveCartToLocalStorage(): void {
        if (this.isLocalStorageAvailable()) {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        }
    }

    loadCartFromLocalStorage(): void {
        if (this.isLocalStorageAvailable()) {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                this.updateCartItemCount();
                this.updateCartTotal();
            }
        }
    }

    private isLocalStorageAvailable(): boolean {
        try {
            const testKey = 'test';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
}
