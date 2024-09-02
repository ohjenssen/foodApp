const path = location.pathname;
let max = 20;
let count = 0;
const searchBar = document.querySelector('#search');
const resultsContainer = document.querySelector('.results');

searchBar.addEventListener('input', () => {
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
            if(!product.product_name){
                continue;
            }
            
            count++;

            const name = document.createElement('p');
            const image = document.createElement('img');
            image.src = product.image_front_small_url;
            name.textContent = product.product_name;
            resultsContainer.append(name);
            resultsContainer.append(image);

        }
    });

})

// switch(path){
//     case '/pages/barcode.html':
//         console.log('barcode');
//         break;

//     case '/pages/foodFacts.html':
//         console.log('Food facts');
//         break;
// }