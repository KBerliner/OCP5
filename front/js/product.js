const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const colorSelector = document.getElementById('colors');
const quantity = document.getElementById('quantity');
const addToCartButton = document.getElementById('addToCart');
const pageQuery = window.location.search;
const urlParams = new URLSearchParams(pageQuery);
const uid = urlParams.get('id')
const api = 'http://localhost:3000/api/products/';
let product;

// Function to get the Correct Product Info from the API

function getProduct() {
    return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('GET', api + uid);
    request.send();
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            if (request.status === 200 || request.status === 201) {
                // product = JSON.parse(request.response);
                // console.log(product);
                resolve(JSON.parse(request.response));
            } else {
                reject(JSON.parse(request.response));
            }
        }
    }
    
});
}

// Function to insert product info into the DOM

async function addInfo() {
    product = await getProduct();

    title.textContent = product.name;
    price.textContent = product.price;
    description.textContent = product.description;
    for (let i = 0; i < product.colors.length; i++) {
        const colorOption = document.createElement('option');
        colorOption.setAttribute('value', product.colors[i]);
        colorOption.textContent = product.colors[i];
        console.log(i);
        colorSelector.appendChild(colorOption);
    }
}

addInfo();