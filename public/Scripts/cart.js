function renderCart() {
    const cart = getCart();
    const koszykTabela = document.getElementById('koszykTabela');
    const koszykSuma = document.getElementById('koszykSuma');
    
    koszykTabela.innerHTML = ''; // Wyczyszczenie tabeli
    
    let totalSum = 0; // Zmienna do sumowania cen produktów

    cart.forEach(item => {
        const itemSum = item.cena * item.ilosc;
        totalSum += itemSum;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nazwa_produktu}</td>
            <td>${item.cena.toFixed(2)} PLN</td>
            <td>
                <input type="number" class="form-control form-control-sm cart-quantity" style="width: 60px;"
                       value="${item.ilosc}" data-id="${item._id}" min="1">
            </td>
            <td>${itemSum.toFixed(2)} PLN</td>
            <td>
                <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item._id}">Usuń</button>
            </td>
        `;

        koszykTabela.appendChild(row);

        // Obsługa zmiany ilości
        const quantityInput = row.querySelector('.cart-quantity');
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value, 10);
            updateCart(item._id, newQuantity);
            renderCart(); // Odśwież widok koszyka po zmianie
        });

        // Obsługa przycisku "Usuń"
        const removeButton = row.querySelector('.remove-from-cart');
        removeButton.addEventListener('click', () => {
            removeFromCart(item._id);
            renderCart(); // Odśwież widok koszyka po usunięciu produktu
        });
    });

    koszykSuma.innerText = `Łączna suma: ${totalSum.toFixed(2)} PLN`;

    if (cart.length === 0) {
        koszykTabela.innerHTML = '<tr><td colspan="5" class="text-center">Koszyk jest pusty</td></tr>';
        koszykSuma.innerText = 'Łączna suma: 0 PLN';
    }
};



function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

// Funkcja do zapisywania koszyka w localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Funkcja dodawania produktu do koszyka
function addToCart(_id, nazwa_produktu,cena) {
    const cart = getCart();

    // Sprawdzanie, czy produkt jest już w koszyku
    const existingProduct = cart.find(item => item._id === _id);
    if (existingProduct) {
        existingProduct.ilosc += 1;
    } else {
        cart.push({
            _id,
            nazwa_produktu,
            cena,
            ilosc: 1,
        });
    }

    saveCart(cart);
    console.log('Produkt dodany do koszyka:', cart);
}

// Funkcja usuwania produktu z koszyka
function removeFromCart(_id) {
    let cart = getCart();
    cart = cart.filter(item => item._id !== _id);

    saveCart(cart);
    console.log('Produkt usunięty z koszyka:', cart);
}

// Funkcja aktualizacji ilości produktu w koszyku
function updateCart(_id, ilosc) {
    const cart = getCart();
    const product = cart.find(item => item._id === _id);

    if (product) {
        product.ilosc = ilosc;

        if (product.ilosc <= 0) {
            removeFromCart(_id); // Usunięcie produktu z koszyka, jeśli ilość <= 0
        } else {
            saveCart(cart); // Zapisanie zmian w koszyku
        }
    }

    console.log('Koszyk zaktualizowany:', cart);
}

// Funkcja wyczyszczenia koszyka
function clearCart() {
    localStorage.removeItem('cart');
    console.log('Koszyk wyczyszczony');
}

// Eksport funkcji
export { renderCart, getCart, saveCart, addToCart, removeFromCart, updateCart, clearCart };
