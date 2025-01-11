const productContainer = document.querySelector('.product-container');
const senButton = document.querySelector('.send');
const clearButton = document.querySelector('.clear');
const form = document.querySelector('.product-form');
const formError = document.querySelector('#formError');

const fetchProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/productsBase');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products = await response.json();

        products.forEach(product => {
            createProductCard(product);
        });
    } catch (e) {
        console.error('Error:', e);
    }
}

const crateProduct = async (product) => {
    try {
        const response = await fetch('http://localhost:3000/productsBase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newProduct = await response.json();
        createProductCard(newProduct);
    } catch (e) {
        console.error('Error:', e);
    }
}

const deleteProduct = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/productsBase/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const deletedProduct = await response.json();
        console.log(deletedProduct);
    } catch (e) {
        console.error('Error:', e);
    }
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'card';

    productCard.innerHTML = `
        <div class="card-image">
            <img src="${product.image}">
        </div>
        <div class="card-container--info">
            <p class="card-container--info__name">${product.name}</p>
            <div class="card-container--value">
                <p>$ ${product.price}</p>
                <button class="delete-btn">
                    <img src="./assets/trash-icon.png">
                </button>
            </div>
        </div>
    `;
    const deleteButton = productCard.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => deleteProduct(product.id));
    
    productContainer.appendChild(productCard);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#product-name').value.trim();
    const price = parseFloat(document.querySelector('#product-price').value.trim());
    const image = document.querySelector('#product-image').value.trim();
    let error = ''

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    if (!name) {
        error += 'El nombre del producto es obligatorio.<br>';
    }
    if (!price || price <= 0) {
        error += 'El precio debe ser mayor a 0.<br>';
    }
    if (!image) {
        error += 'La URL de la imagen es obligatoria.<br>';
    } else if (!isValidUrl(image)) {
        error += 'La URL de la imagen no es válida.<br>';
    }

    if (error) {
        formError.innerHTML = error;
        return;
    } else {
        formError.innerHTML = '';

        const newProduct = { image, name, price };
        console.log('Producto creado:', newProduct);
        crateProduct(newProduct);

        form.reset();
    }
})


fetchProducts();