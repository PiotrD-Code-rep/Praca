import { addToCart } from './cart.js';

async function fetchProducts() {
    try {
        const apiEndpoint = 'http://localhost:3000/api/Produkty';
        const response = await fetch(apiEndpoint); 
        if (!response.ok) {
            throw new Error(`Błąd w pobieraniu danych z API ${apiEndpoint} `);
        }
        const products = await response.json();
        console.log('Produkty:', products);
        renderProducts(products);
    } catch (error) {
        console.error('Błąd:', error.message);
    }
};

async function renderProducts(products){
    const container = document.getElementById('product-row');
    container.innerHTML = ''; 

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
                    <button type="button" class="btn btn-dark mt-auto info-btn" >Info</button>
                    <button type="button" class="btn btn-dark mt-2 add-to-cart-btn" >Dodaj do koszyka</button>
                </div>
            </div>
        `;

        const infoButton = productCard.querySelector('.info-btn');
        infoButton.addEventListener('click', () => {
            openWindowProduct(product);
        });
        
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            addToCart(product._id, product.nazwa_produktu, product.cena);
        });

        container.appendChild(productCard);
    });
};

function openWindowProduct(product) {
    document.getElementById('ProductName').innerText = product.nazwa_produktu;
    document.getElementById('ProductDescription').innerText = product.opis_produktu;
    document.getElementById('ProductPrice').innerText =`Cena: `+ product.cena+` zł`;
    document.getElementById('ProductImage').innerHTML = `
        <img src="${product.zdjecia_produktu[0]}" class="img-fluid" alt="${product.nazwa_produktu}" style="max-height: 300px;">
    `;
    

    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();
};


export {fetchProducts};