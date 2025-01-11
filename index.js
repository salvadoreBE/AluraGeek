const productContainer = document.querySelector('.product-container');
const senButton = document.querySelector('.send');
const clearButton = document.querySelector('.clear');
const form = document.querySelector('.product-form');
const formError = document.querySelector('#formError');

const fetchProducts = async () => {
    try {
        const response = await fetch('https://678225fbc51d092c3dce634a.mockapi.io/api/products/Products');
        
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
        const response = await fetch('https://678225fbc51d092c3dce634a.mockapi.io/api/products/Products', {
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
        const response = await fetch(`https://678225fbc51d092c3dce634a.mockapi.io/api/products/Products/${id}`, {
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

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    };

    productCard.innerHTML = `
        <div class="card-image">
            <img src="${product.image}">
        </div>
        <div class="card-container--info">
            <p class="card-container--info__name">${truncateText(product.name, 16)}</p>
            <div class="card-container--value">
                <p>$ ${product.price}</p>
                <button class="delete-btn">
                    <img src="./assets/trash-icon.png">
                </button>
            </div>
        </div>
    `;
    const deleteButton = productCard.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        deleteProduct(product.id);
        productCard.remove();
    });
    
    productContainer.appendChild(productCard);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#product-name').value.trim();
    const price = document.querySelector('#product-price').value.trim();
    const image = document.querySelector('#product-image').value.trim();
    let error = ''

    const isValidHttpsUrl = (url) => {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.protocol === "https:";
        } catch (error) {
            return false;
        }
    };
    
    if (!name) {
        error += 'El nombre del producto es obligatorio.<br>';
    }
    if (!price || price <= 0) {
        error += 'El precio debe ser mayor a 0.<br>';
    }
    if (!image) {
        error += 'La URL de la imagen es obligatoria.<br>';
    } else if (!isValidHttpsUrl(image)) {
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