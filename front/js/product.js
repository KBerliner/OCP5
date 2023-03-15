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
        colorSelector.appendChild(colorOption);
    }
}

addInfo();

// Add to Cart Button Function

addToCartButton.addEventListener('click', () => {
    const color = colorSelector.value;
    const amount = parseInt(quantity.value);
    if (color != "") {
        if(localStorage) {
            if (localStorage.getItem('id') == 'null' || localStorage.getItem('id') == null) {
                let cartItems = [{
                    'id': uid,
                    'amount': amount,
                    'color': color,
                }];
                localStorage.setItem('id', JSON.stringify(cartItems));
            } else {
                let cartItems = JSON.parse(localStorage.getItem('id'));
                let sameColor = 0;
                let sameIds = 0;
                for (let i = 0; i < cartItems.length; i++) {
                        if (cartItems[i].color == color && cartItems[i].color == color) {
                            sameColor++;
                            sameIds++
                            cartItems[i].amount = cartItems[i].amount + amount;
                            localStorage.setItem('id', JSON.stringify(cartItems));
                        }
                }
                if (sameIds == 0 && sameColor == 0) {
                    cartItems.push({
                        'id': uid,
                        'amount': amount,
                        'color': color,
                    });
                    localStorage.setItem('id', JSON.stringify(cartItems));
                }
            }
        } else {
            alert('Your browser does not support local storage.');
        }
    } else {
        alert('Please select a color');
    }
});