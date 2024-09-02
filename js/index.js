const path = location.pathname;
let max = 20;
let count = 0;
const searchBar = document.querySelector('#search');
const form = document.querySelector('#searchForm');
const resultsContainer = document.querySelector('.results');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    resultsContainer.innerHTML = '';
        if(searchBar.value.length < 3){
            return;
        }
        
        fetch(`https://dk.openfoodfacts.org/cgi/search.pl?search_terms=${searchBar.value}&search_simple=1&action=process&json=1`)
        .then(response => response.json())
        .then(json => {
    
            count = 0;
            
            for(const product of json.products){
                if(count >= max){
                    return;
                }
                if(!product.product_name || !product.image_front_small_url ){
                    continue;
                }

                console.log(product);
    
                count++;
                const card = document.createElement('div');
                card.innerHTML = `
                      <img class="productImage" <img src="${product.image_front_small_url}" class="" alt="...">
                      <p>${product.product_name}</p>
                      <p>Kcal: ${product.nutriments['energy-kcal_value_100g']}</p>
                      <p>Fedt: ${product.nutriments.fat_100g}</p>
                      <p>Kulhydrat: ${product.nutriments.carbohydrates_100g}</p>
                      <p>Sukker: ${product.nutriments.sugars_100g}</p>
                      <p>Proteiner: ${product.nutriments.proteins_100g}</p>
                      <p>Salt ${product.nutriments.salt_100g}</p>
                `;

                resultsContainer.append(card);
                card.classList.add('cardContainer');
                card.style.width = '18rem';
                card.classList.add('m-1')
            }
        });

})

// ----.---Kode med nutriscore --------
// card.innerHTML = `
// <img class="productImage" <img src="${product.image_front_small_url}" class="" alt="...">
// <p>${product.product_name}</p>
// <p>Kcal: ${product.nutriscore_data.energy}</p>
// <p>Fedt: ${product.nutriscore_data.saturated_fat}</p>
// <p>Kulhydrat: ${product.nutriscore_data.sugars}</p>
// <p>Sukker: ${product.nutriscore_data.sugars}</p>
// <p>Proteiner: ${product.nutriscore_data.proteins}</p>
// <p>Salt ${product.nutriscore_data.sodium}</p>
// `;

// ----------------------------------------Barcode------------------------------------------------

// import {BarcodeDetector} from "https://fastly.jsdelivr.net/npm/barcode-detector@2/dist/es/pure.min.js";
	
// const video = document.querySelector('#video');
// const resultNode = document.querySelector('#result');
// const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}});
// const barcodeDetector = new BarcodeDetector({
//     formats: ["qr_code", "code_128", "code_39", "ean_13"],
// });

// video.srcObject = stream;
// video.onloadedmetadata = () => {
//     video.play();
//     requestAnimationFrame(scanBarcode);
// };

// async function scanBarcode() {
//     const barcodes = await barcodeDetector.detect(video);
//     if(barcodes.length > 0) {
//         resultNode.innerText = `Stregkode fundet: ${barcodes[0].rawValue}`;
//         console.log(barcodes);
        
//         video.pause(); // Stop scanning
//     } else {
//         requestAnimationFrame(scanBarcode);
//     }
// }



// switch(path){
//     case '/pages/barcode.html':
//         console.log('barcode');
//         break;

//     case '/pages/foodFacts.html':
//         console.log('Food facts');
//         break;
// }