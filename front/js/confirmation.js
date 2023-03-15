const pageQuery = window.location.search;
const urlParams = new URLSearchParams(pageQuery);
const orderId = urlParams.get('id');
const idDisplay = document.getElementById('orderId');

idDisplay.textContent = orderId;