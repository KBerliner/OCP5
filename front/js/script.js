let productArray;
let productId;
let productImageUrl;
let productAltText;
const products = document.getElementById('items');
const productName = document.getElementsByClassName('productName');
const productDescription = document.getElementsByClassName('productDescription');
const api = 'http://localhost:3000/api';

// Get the Product Array

function getProductArray() {
        return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', api + '/products');
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status === 200 || request.status === 201) {
                    productArray = Promise.all(JSON.parse(request.response));
                    console.log(JSON.parse(request.response)[1]);
                    resolve(JSON.parse(request.response));
                } else {
                    reject(JSON.parse(request.response));
                }
            }
        }
        
    });
}

// Creating the Product Card Function

function productCardFramework(name, description, uid, imageUrl, imageAlt) {
    let newCardLink = document.createElement('a');
    let newCard = document.createElement('article');
    let newImage = document.createElement('img');
    let newName = document.createElement('h3');
    let newDescription = document.createElement('p');

    newCardLink.setAttribute('href', `./product.html?id=${uid}`)
    newImage.setAttribute('src', imageUrl);
    newImage.setAttribute('alt', imageAlt);
    newName.classList.add('productName');
    newDescription.classList.add('productDescription')

    newCardLink.appendChild(newCard);
    newCard.appendChild(newImage);
    newCard.appendChild(newName);
    newCard.appendChild(newDescription);

    newName.textContent = name;
    newDescription.textContent = description;

    return newCardLink;
}

async function createProductCard() {
    productArray = await getProductArray();
    for (let i = 0; i < productArray.length; i++) {
        console.log(productArray[i]._id);
        const uid = productArray[i]._id;
        const imageUrl = productArray[i].imageUrl;
        const imageAlt = productArray[i].altTxt;
        const name = productArray[i].name;
        const description = productArray[i].description;
        products.appendChild(productCardFramework(name, description, uid, imageUrl, imageAlt));
    } 
}

createProductCard();