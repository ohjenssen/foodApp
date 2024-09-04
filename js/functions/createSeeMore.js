export async function createSeeMoreBtn(product, card){
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.className = 'seeMoreBtn';
    seeMoreBtn.textContent = 'Se mer';
    seeMoreBtn.dataset.productId = product.id;

    const productInfoDiv = card.querySelector('.productInfo');
    productInfoDiv.appendChild(seeMoreBtn);

    seeMoreBtn.addEventListener('click', async () => {
        const response = await fetch(`https://dk.openfoodfacts.org/api/v0/product/${product.id}.json`);
        const productData = await response.json();

        const modalTitle = document.querySelector('#productModal .modal-title');
        const modalBody = document.querySelector('#productModal .modal-body');

        modalTitle.textContent = productData.product.product_name;
        modalBody.innerHTML = `
            <p>Brand: ${productData.product.brands}</p>
            <p>Ingredients: ${productData.product.ingredients_text || 'No ingredients listed.'}</p>
            <img src="${productData.product.image_front_url}" alt="${productData.product.product_name}" class="img-fluid">
        `;

        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.show();
    });


    
}