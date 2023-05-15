const form = document.querySelector('#resetPassword');
const notification = document.querySelector('#notif');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('token');


form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    obj.token = token;

    const url = '/api/auth/resetPassword';
    const headers = {
        'Content-Type': 'application/json'
    }
    const method = 'POST'; 
    const body = JSON.stringify(obj);

    fetch(url, {
        headers,
        method,
        body
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.status !== 'success') {
            notification.innerHTML = `<p class="p-notification" id="notification-text">${data.message? data.message : data.error}</p>`
            notification.style.visibility = 'visible';
        } else {
            notification.innerHTML = `<p class="p-notification" id="notification-text">${data.message} <br> Click <a href="/login"> aqui</a>.</p>`
            notification.style.visibility = 'visible';
        }
    })
    .catch(error => console.log(error))
});