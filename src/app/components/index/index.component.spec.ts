import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexComponent } from './index.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' })
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.cart = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
  * @description Verificar que el carrito de compras está vacío.
  * @returns {void}
  **/
  it('should have empty cart', () => {
    expect(component.cart.length).toBe(0);
  });

  /**
  * @description Verificar que el carrito de compras se muestra/oculta al activar el toggle.
  * @returns {void}
  **/
  it('should toggle the cart display', () => {
    expect(component.showCart).toBeFalse();
    component.toggleCart();
    expect(component.showCart).toBeTrue();
    component.toggleCart();
    expect(component.showCart).toBeFalse();
  });

  /**
  * @description Verificar que se puede añadir un producto al carrito.
  * @returns {void}
  */
  it('should add a product to the cart', () => {
    const product = component.products[0];
    component.addToCart(product);
    expect(component.cart.length).toBe(1);
    expect(component.cart[0].product).toEqual(product);
    expect(component.cart[0].quantity).toBe(1);
  });

  /**
  * @description Verificar que el filtro por precio funciona correctamente.
  * @returns {void}
  */
  it('should filter products by price', () => {
    component.priceFilter = '0-30000';
    component.applyFilters();
    expect(component.filteredProducts.length).toBeGreaterThan(0);
    component.filteredProducts.forEach(product => {
      expect(product.price).toBeLessThanOrEqual(30000);
    });
  });

});
