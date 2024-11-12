document.addEventListener("DOMContentLoaded", () => {
    pobieranieProduktow();
});


//Pobieranie danych z Endpoint /Produkty GET
function pobieranieProduktow() {
    fetch('http://localhost:3000/Produkty')
        .then(response => response.json())
        .then(products => wyswietlanieProduktow(products))// Dla każdego elementu pobranego będzie wywoływana funkcja wyswietlanieProduktow()
        .catch(error => console.error("Błąd podczas pobierania produktów:", error));
}

function wyswietlanieProduktow(products) {
    const container = document.getElementById('product-row');
  

    products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');

        const imageUrl = product.zdjecia_produktu && product.zdjecia_produktu.length > 0 
            ? product.zdjecia_produktu[0] 
            : 'default-image-url.jpg';

        productCard.innerHTML = `
            <div class="card h-100 text-center m-1">
                <img src="${imageUrl}" class="card-img-top custom-image" alt="${product.nazwa_produktu}">
                <div class="card-body d-flex flex-column">
                    <h4 class="card-title">${product.nazwa_produktu}</h4>
                    <p class="card-text fs-4">${product.cena} zł</p>
                    <button type="button" class="btn btn-dark mt-auto">Dodaj do koszyka</button>
                </div>
            </div>
        `;

        // Dodaj zdarzenie click, aby otworzyć modal z informacjami o produkcie
        productCard.addEventListener('click', () => oknoProduktu(product));

        container.appendChild(productCard);
    });
}

// function oknoProduktu(product) {
//     // Ustawienie danych w modalu
//     document.getElementById('modalProductName').innerText = product.nazwa_produktu;
//     document.getElementById('modalProductDescription').innerText = product.opis_produktu;
//     document.getElementById('modalProductPrice').innerText = product.cena;
//     document.getElementById('modalProductImage').innerHTML = `
//         <img src="${product.zdjecia_produktu[0]}" class="img-fluid" alt="${product.nazwa_produktu}" style="max-height: 300px;">
//     `;

//     // Otwórz modal
//     const productModal = new bootstrap.Modal(document.getElementById('productModal'));
//     productModal.show();
// }
