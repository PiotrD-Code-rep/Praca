import {fetchProducts} from "./product.js";
import {clearCart, renderCart } from './cart.js';
import { Login } from './login.js';
import { Register } from './register.js';

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();

    const cartIcon = document.querySelector('[data-bs-target="#koszykModal"]');
    cartIcon.addEventListener('click', () => {
        renderCart(); // Renderowanie zawartości koszyka w momencie otwierania modalu
    });

    const clearCartButton = document.getElementById('clearCartButton');
    clearCartButton.addEventListener('click', () => {
        clearCart(); // Wyczyszczenie koszyka
        renderCart(); // Odświeżenie widoku
    });

    Login();
    Register();
});
