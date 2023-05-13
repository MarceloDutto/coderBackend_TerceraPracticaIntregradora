const form = document.querySelector("#loginForm");

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    const url = '/api/auth';
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
        if(data.status !== 'error') {
            window.location.href = '/products'
        }
    })
    .catch(error => console.log(error))
});