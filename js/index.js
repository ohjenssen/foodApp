const path = location.pathname;
let max = 20;
let count = 0;
const searchBar = document.querySelector('#search');
const searchForm = document.querySelector('#searchForm');
const resultsContainer = document.querySelector('.results');
const barcodeBtn = document.querySelector('#barcodeBtn');
const barcodeScanner = document.querySelector('#barcodeScanner');
const videoCloseBtn = document.querySelector('#videoCloseBtn')
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    barcodeScanner.style.display = 'none';
    resultsContainer.innerHTML = '';
        if(searchBar.value.length < 3){
            return;
        }
        
        fetch(`https://dk.openfoodfacts.org/cgi/search.pl?search_terms=${searchBar.value}&search_simple=1&action=process&json=1`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
    
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
                            <div class="imgContainer">
                                <img class="productImg" src="${product.image_front_small_url}">
                            </div>
                            <div class="productInfo">
                                <h2>${product.product_name}</h2>
                                <button class="seeMoreBtn">Se mer</button>
                            </div>
                `;

                resultsContainer.append(card);
                card.classList.add('customCard');
                card.style.width = '18rem';
            }
        });

})

//-------------------------------- Old card component ----------------------------------------
{/* <img class="productImage" <img src="${product.image_front_small_url}" class="" alt="...">
<p>${product.product_name}</p>
<p>Kcal: ${product.nutriments['energy-kcal_value_100g']}</p>
<p>Fedt: ${product.nutriments.fat_100g}</p>
<p>Kulhydrat: ${product.nutriments.carbohydrates_100g}</p>
<p>Sukker: ${product.nutriments.sugars_100g}</p>
<p>Proteiner: ${product.nutriments.proteins_100g}</p>
<p>Salt ${product.nutriments.salt_100g}</p> */}

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

import {BarcodeDetector} from "https://fastly.jsdelivr.net/npm/barcode-detector@2/dist/es/pure.min.js";

async function searchWithBarCode(barcode) {
    const url = 'https://dk.openfoodfacts.org/api/v0/product/' + barcode + '.json';
    const response = await fetch(url);
    const product = await response.json();
    if(!product.product){
        alert('Oops, prøv igen!')
    }
    console.log(product.product.image_front_small_url);

    const card = document.createElement('div');
    card.innerHTML = `
        <img class="productImage" src="${product.product.image_front_small_url}" alt="...">
        <p>${product.product.product_name}</p>
        <p>Kcal: ${product.product.nutriments['energy-kcal_value_100g']}</p>
        <p>Fedt: ${product.product.nutriments.fat_100g}</p>
        <p>Kulhydrat: ${product.product.nutriments.carbohydrates_100g}</p>
        <p>Sukker: ${product.product.nutriments.sugars_100g}</p>
        <p>Proteiner: ${product.product.nutriments.proteins_100g}</p>
        <p>Salt ${product.product.nutriments.salt_100g}</p>
    `;
    
    resultsContainer.appendChild(card);
}

const video = document.querySelector('#video');
const resultNode = document.querySelector('#result');
const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}});
const barcodeDetector = new BarcodeDetector({
    formats: ["qr_code", "code_128", "code_39", "ean_13"],
});

video.srcObject = stream;
video.onloadedmetadata = () => {
    video.play();
    requestAnimationFrame(scanBarcode);
};

async function scanBarcode() {
    let barcodes = await barcodeDetector.detect(video);
    if(barcodes.length > 0) {
        resultNode.innerText = `Stregkode fundet: ${barcodes[0].rawValue}`;
        resultsContainer.innerHTML = '';
        video.pause(); // Stop scanning
        barcodeScanner.style.display = 'none';
        searchWithBarCode(barcodes[0].rawValue);
    } else {
        requestAnimationFrame(scanBarcode);
    }

    video.play();
    barcodes = '';
}

barcodeBtn.addEventListener('click', () => {
    var barcodeScanner = document.getElementById('barcodeScanner');
    barcodeScanner.style.display = 'flex';
    barcodeScanner.style.justifyContent = 'center';
    barcodeScanner.style.alignItems = 'center';
    barcodeScanner.style.flexDirection = 'column';
    
    scanBarcode();
})


videoCloseBtn.addEventListener('click', () => {
   
    barcodeScanner.style.display = 'none';
    video.pause();
   
})
	



// switch(path){
//     case '/pages/barcode.html':
//         console.log('barcode');
//         break;

//     case '/pages/foodFacts.html':
//         console.log('Food facts');
//         break;
// }