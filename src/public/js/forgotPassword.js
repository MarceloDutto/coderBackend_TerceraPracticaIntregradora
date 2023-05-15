const form = document.querySelector('#recoverPassword');
const notification = document.querySelector('#notif');

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    const url = '/api/auth/forgotPassword';
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
        notification.innerHTML = `<p class="p-notification" id="notification-text">${data.message? data.message : data.error}</p>`
        notification.style.visibility = 'visible';
    })
    .catch(error => console.log(error))
});