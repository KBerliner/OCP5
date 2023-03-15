const itemList = document.getElementById('cart__items');
const cart = JSON.parse(localStorage.getItem('id'));
const api = 'http://localhost:3000/api/products/';
const totalQuantityElement = document.getElementById('totalQuantity');
const totalPriceElement = document.getElementById('totalPrice');
let totalQuantity = 0;
let totalPrice = 0;

const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const addressInput = document.getElementById('address');
const cityInput = document.getElementById('city');
const emailInput = document.getElementById('email');
const orderButton = document.getElementById('order');

const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
const addressErrorMsg = document.getElementById('addressErrorMsg');
const cityErrorMsg = document.getElementById('cityErrorMsg');
const emailErrorMsg = document.getElementById('emailErrorMsg');

const lettersOnly = /^[a-zA-Z]+$/;

let contact = {
    'firstName': '',
    'lastName': '',
    'address': '',
    'city': '',
    'email': ''
};
let idList = []
let orderId;

// Get the right product from the API Function

function getProduct(uid) {
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

// Quantity calculation function

function getQuantity() {
    let quantity = 0;
    for (let i = 0; i < cart.length; i++) {
        quantity = quantity + cart[i].amount;
    }
    totalQuantity = quantity;
    totalQuantityElement.textContent = quantity;
}

// Total price calculation function

function getTotalPrice(amount, itemPrice) {
    let price = amount * itemPrice;
    return price;
}

// Loop to access local storage and create the DOM element (This hoists the function below)

async function createProduct() {
    totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        const cartProduct = cart[i];
        const uid = cartProduct.id;
        const amount = cartProduct.amount;
        const color = cartProduct.color;
        const apiProduct = await getProduct(uid);
        const name = apiProduct.name;
        const imageUrl = apiProduct.imageUrl;
        const imageAlt = apiProduct.altTxt;
        const itemPrice = apiProduct.price;
        productFramework(name, uid, imageUrl, imageAlt, color, amount, itemPrice);

        totalPrice = totalPrice + getTotalPrice(amount, itemPrice);
    }
    
    totalPriceElement.textContent = totalPrice;
}

createProduct();
getQuantity();







// DOM Product Creation Framework

function productFramework(name, uid, imageUrl, imageAlt, color, quantity, price) {
    
    // Initial Element Creation

    const cartItem = document.createElement('article');
    const itemImageDiv = document.createElement('div');
    const itemImage = document.createElement('img');
    const itemContent = document.createElement('div');
    const itemDescription = document.createElement('div');
    const itemName = document.createElement('h2');
    const itemColor = document.createElement('p');
    const itemPrice = document.createElement('p');
    const itemContentSettings = document.createElement('div');
    const itemContentSettingsQuantity = document.createElement('div');
    const itemQuantityText = document.createElement('p');
    const itemQuantity = document.createElement('input');
    const itemDeleteDiv = document.createElement('div');
    const itemDelete = document.createElement('p');

    // Adding correct Data

    cartItem.classList.add('cart__item');
    cartItem.setAttribute('data-id', uid);
    cartItem.setAttribute('data-color', color);
    itemImageDiv.classList.add('cart__item__img');
    itemImage.setAttribute('src', imageUrl);
    itemImage.setAttribute('alt', imageAlt);
    itemContent.classList.add('cart__item__content');
    itemDescription.classList.add('cart__item__content__description');
    itemName.textContent = name;
    itemColor.textContent = color;
    itemPrice.textContent = price;
    itemContentSettings.classList.add('cart__item__content__settings');
    itemContentSettingsQuantity.classList.add('cart__item__content__settings__quantity');
    itemQuantityText.textContent= 'Quantity : ';
    itemQuantity.classList.add('itemQuantity');
    itemQuantity.setAttribute('type', 'number');
    itemQuantity.setAttribute('name', 'itemQuantity');
    itemQuantity.setAttribute('min', 1);
    itemQuantity.setAttribute('max', 100);
    itemQuantity.setAttribute('value', quantity);
    itemDeleteDiv.classList.add('cart__item__content__settings__delete');
    itemDelete.classList.add('deleteItem');
    itemDelete.textContent = 'Delete';

    // Nesting

    itemList.appendChild(cartItem);
    cartItem.appendChild(itemImageDiv);
    itemImageDiv.appendChild(itemImage);
    cartItem.appendChild(itemContent);
    itemContent.appendChild(itemDescription);
    itemDescription.appendChild(itemName);
    itemDescription.appendChild(itemColor);
    itemDescription.appendChild(itemPrice);
    itemContent.appendChild(itemContentSettings);
    itemContentSettings.appendChild(itemContentSettingsQuantity);
    itemContentSettingsQuantity.appendChild(itemQuantityText);
    itemContentSettingsQuantity.appendChild(itemQuantity);
    itemContentSettings.appendChild(itemDeleteDiv);
    itemDeleteDiv.appendChild(itemDelete);


        // Function to allow changing the quantity of a product

        

        itemQuantity.onchange = () => {
            let preChangeQuantity = quantity;
            let postChangeQuantity = itemQuantity.value;
            totalPrice = (totalPrice - (preChangeQuantity * price)) + (postChangeQuantity * price);
            totalPriceElement.textContent = totalPrice;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id == uid && cart[i].color == color) {
                    cart[i].amount = parseInt(itemQuantity.value);
                    quantity = cart[i].amount;
                    localStorage.setItem('id', JSON.stringify(cart));
                    getQuantity();

                }

            }

        }

        // Function to allow deleting the product from the cart

        itemDelete.onclick = () => {
            
            totalPrice = totalPrice - (quantity * price)

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id == uid && cart[i].color == color) {
                    cart.splice(i, 1);
                    localStorage.setItem('id', JSON.stringify(cart));
                    itemList.removeChild(cartItem);
                    getQuantity();
                }
            }
            totalPriceElement.textContent = totalPrice;
        }




    // Return Value

    return cartItem;
}




// API order function

function newOrder() {
    let payload = {
        'contact': contact,
        'products': idList
    };
    localStorage.removeItem('id');
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', api + 'order');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(payload));
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200 || request.status === 201) {
                    resolve(JSON.parse(request.response));
                    orderId = JSON.parse(request.response).orderId;
                } else {
                    reject(JSON.parse(request.response));
                }
            }
        }
        
    });
    
}

// Use Regex to check contact inputs

firstNameInput.addEventListener('blur', () => {
    if (lettersOnly.test(firstNameInput.value)) {
        firstNameInput.style.border = '2px solid green';
        firstNameErrorMsg.textContent = '';
    } else {
        firstNameInput.style.border = '2px solid red';
        firstNameErrorMsg.textContent = firstNameInput.value + ' is not an acceptable input, letters only please';
    }
});

lastNameInput.addEventListener('blur', () => {
    if (lettersOnly.test(lastNameInput.value)) {
        lastNameInput.style.border = '2px solid green';
        lastNameErrorMsg.textContent = '';
    } else {
        lastNameInput.style.border = '2px solid red';
        lastNameErrorMsg.textContent = lastNameInput.value + ' is not an acceptable input, letters only please';
    }
});

cityInput.addEventListener('blur', () => {
    if (lettersOnly.test(cityInput.value)) {
        cityInput.style.border = '2px solid green';
        cityErrorMsg.textContent = '';
    } else {
        cityInput.style.border = '2px solid red';
        cityErrorMsg.textContent = cityInput.value + ' is not an acceptable input, letters only please';
    }
});

emailInput.addEventListener('blur', () => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        emailInput.style.border = '2px solid green';
        emailErrorMsg.textContent = '';
    } else {
        emailInput.style.border = '2px solid red';
        emailErrorMsg.textContent = emailInput.value + ' is not an acceptable input, valid email format only please';
    }
});

// Fill in the contact object and bring user to confirmation page

async function orderNumber(page) {
    let order = await newOrder();
    orderId = order.orderId;
    location.href = page + 'confirmation.html?id=' + orderId;
}

orderButton.addEventListener('click', ($event) => {
    $event.preventDefault();
    contact.firstName = firstNameInput.value;
    contact.lastName = lastNameInput.value;
    contact.address = addressInput.value;
    contact.city = cityInput.value;
    contact.email = emailInput.value;
    for (let i = 0; i < cart.length; i++) {
            idList.push(cart[i].id);
    }
    newOrder();
    let page = window.location.href.slice(0, -9);
    orderNumber(page);
    // location.href = page + 'confirmation.html?' + orderId;
});