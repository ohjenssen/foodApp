export async function createSeeMoreBtn(product, card){
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.className = 'seeMoreBtn';
    seeMoreBtn.textContent = 'Se mer';

    const productInfoDiv = card.querySelector('.productInfo');
    productInfoDiv.appendChild(seeMoreBtn);

    seeMoreBtn.addEventListener('click', () => {
        seeMoreBtn.innerHTML = `<div class="dotLoader"></div>`;
        seeMoreBtn.innerHTML = `Se mer`;

        console.log(product);

        const modalTitle = document.querySelector('#productModal .modal-title');
        const modalBody = document.querySelector('#productModal .modal-body');
        modalTitle.textContent = product.product_name;

          modalBody.innerHTML = `
            <div class="modalImgContainer">
                <img src="${product.image_front_url}" alt="${product.product_name}" class="modalImg">
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
                    <p>${product.nutriscore_data ? product.nutriscore_data.energy : "Ingen information"}</p>
                    <p>${product.nutriscore_data ? product.nutriscore_data.saturated_fat : "Ingen information"}</p>
                    <p>${product.nutriscore_data ? product.nutriscore_data.sugars : "Ingen information"}</p>
                    <p>${product.nutriscore_data ? product.nutriscore_data.sugars : "Ingen information"}</p>
                    <p>${product.nutriscore_data ? product.nutriscore_data.proteins : "Ingen information"}</p>
                    <p>${product.nutriscore_data ? product.nutriscore_data.sodium : "Ingen information"}</p>
                </div>
            </div>
        `;

        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.show();
    });


    
}