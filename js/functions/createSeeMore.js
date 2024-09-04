export async function createSeeMoreBtn(product, card){
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.className = 'seeMoreBtn';
    seeMoreBtn.textContent = 'Se mer';
    seeMoreBtn.dataset.productId = product.id;

    const productInfoDiv = card.querySelector('.productInfo');
    productInfoDiv.appendChild(seeMoreBtn);

    seeMoreBtn.addEventListener('click', async () => {
        seeMoreBtn.innerHTML = `<div class="dotLoader"></div>`;
        const response = await fetch(`https://dk.openfoodfacts.org/api/v0/product/${product.id}.json`);
        const productData = await response.json();
        seeMoreBtn.innerHTML = `Se mer`;

        console.log(productData.product);
        const modalTitle = document.querySelector('#productModal .modal-title');
        const modalBody = document.querySelector('#productModal .modal-body');

        modalTitle.textContent = productData.product.product_name;

        modalBody.innerHTML = `
            <div class="modalImgContainer">
                <img src="${productData.product.image_front_url}" alt="${productData.product.product_name}" class="modalImg">
            </div>
            <div class="nutriments">
                <div class="nutrimentCategories">
                    <p>Kcal:</p>
                    <p>Fedt:</p>
                    <p>Kulhydrat:</p>
                    <p>Sukker:</p>
                    <p>Proteiner:</p>
                    <p>Salt: </p>
                </div>
                <div class="nutrimentValues">
                    <p>${productData.product.nutriscore_data.energy}</p>
                    <p>${productData.product.nutriscore_data.saturated_fat}</p>
                    <p>${productData.product.nutriscore_data.sugars}</p>
                    <p>${productData.product.nutriscore_data.sugars}</p>
                    <p>${productData.product.nutriscore_data.proteins}</p>
                    <p>${productData.product.nutriscore_data.sodium}</p>
                </div>
            </div>
        `;

        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.show();
    });


    
}