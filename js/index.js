const path = location.pathname;
let max = 20;
let count = 0;
const searchBar = document.querySelector('#search');

searchBar.addEventListener('input', () => {
    
    fetch(`https://dk.openfoodfacts.org/cgi/search.pl?search_terms=${searchBar.value}&search_simple=1&action=process&json=1`)
    .then(response => response.json())
    .then(json => {

        count = 0;
        console.log(json);
        
        for(const product of json){
            if(count >= max){
                return;
            }
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