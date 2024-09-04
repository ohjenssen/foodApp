import { createSeeMoreBtn } from "./functions/createSeeMore.js";
let max = 20;
let count = 0;
const searchBar = document.querySelector('#search');
const searchForm = document.querySelector('#searchForm');
const resultsContainer = document.querySelector('.results');
const barcodeBtn = document.querySelector('#barcodeBtn');
const barcodeScanner = document.querySelector('#barcodeScanner');
const videoCloseBtn = document.querySelector('#videoCloseBtn')
const loader = document.querySelector('.loader');
const welcomeMessage = document.querySelector('.welcomeMessage');
const searchResultsTitle = document.querySelector('.searchResultsHeader');



searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(searchBar.value.length < 2){
        welcomeMessage.textContent = 'Obs, prøv med mer enn en bogstav';
        return;
    }

    welcomeMessage.textContent = 'Søger...';
    loader.style.display = 'grid';
    resultsContainer.innerHTML = '';
        
    fetch(`https://dk.openfoodfacts.org/cgi/search.pl?search_terms=${searchBar.value}&search_simple=1&action=process&json=1`)
    .then(response => {
        if(response.ok){
            loader.style.display = 'none';
            return response.json();
        } else if(!response.ok){
            loader.style.display = 'none';
            console.log(response);
        }
    })
    .then(json => {
        count = 0;

        if(json.products.length === 0){
            console.log(json.products);
            welcomeMessage.style.display = 'block';
            welcomeMessage.textContent = 'Ingen resultater';
            searchResultsTitle.style.display = 'none';
            return;

        } else {
            for(const product of json.products){
                if(count >= max){
                    return;
                }
                if(!product.product_name || !product.image_front_small_url ){
                    continue;
                }
    
                count++;
                const card = document.createElement('div');
                card.innerHTML = `
                    <div class="imgContainer">
                        <img class="productImg" src="${product.image_front_small_url}">
                    </div>
                    <div class="productInfo">
                        <h2>${product.product_name}</h2>
                    </div>
                `;
    
                createSeeMoreBtn(product, card);
                resultsContainer.append(card);
                card.classList.add('customCard');
                card.style.width = '18rem';
                welcomeMessage.style.display = 'none';
                searchResultsTitle.style.display = 'block';
            }
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
    loader.style.display = 'grid';
    video.pause(); // Stop scanning
    const url = 'https://dk.openfoodfacts.org/api/v0/product/' + barcode + '.json';
    const response = await fetch(url);
    const product = await response.json();
    welcomeMessage.textContent = 'Søger...';

    if(!product.product){
        loader.style.display = 'none';
        alert('Oops, prøv igen!')
        return;
    };

    if(response.ok){
            loader.style.display = 'none';
    };

    const card = document.createElement('div');
    card.innerHTML = `
        <div class="imgContainer">
            <img class="productImg" src="${product.product.image_front_small_url}">
            </div>
            <div class="productInfo">
            <h2>${product.product.product_name}</h2>
        </div>
    `;
    
    createSeeMoreBtn(product.product, card);
    resultsContainer.appendChild(card);
    card.classList.add('customCard');
    card.style.width = '18rem';
    welcomeMessage.style.display = 'none';
    searchResultsTitle.style.display = 'block';
};

const video = document.querySelector('#video');
const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}});
const barcodeDetector = new BarcodeDetector({
    formats: ["qr_code", "code_128", "code_39", "ean_13"],
});

video.srcObject = stream;
// Kommentert ut, scanneren fungerer stadig, spurte chat som mente at det... 
// ...fint kan slettes fordi vi kaller scanBarcode i eventlistener 
// video.onloadedmetadata = () => {
//     video.play();
//     requestAnimationFrame(scanBarcode);
// };

async function scanBarcode() {
    let barcodes = await barcodeDetector.detect(video);
    if(barcodes.length > 0) {
        resultsContainer.innerHTML = '';
        barcodeScanner.style.display = 'none';
        searchWithBarCode(barcodes[0].rawValue);
    } else {
        requestAnimationFrame(scanBarcode);
    };

    video.play();
    barcodes = '';
};

barcodeBtn.addEventListener('click', () => {
    var barcodeScanner = document.getElementById('barcodeScanner');
    barcodeScanner.style.display = 'flex';
    barcodeScanner.style.justifyContent = 'center';
    barcodeScanner.style.alignItems = 'center';
    barcodeScanner.style.flexDirection = 'column';
    
    scanBarcode();

});


videoCloseBtn.addEventListener('click', () => {
   
    barcodeScanner.style.display = 'none';
    video.pause();
   
});