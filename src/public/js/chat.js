const socket = io();

const goToCartButton = document.querySelector(".goToCartButton");
const cartId = goToCartButton.getAttribute("id");
goToCartButton.setAttribute("href", `/cart/${cartId}`);

const chatContainer = document.querySelector(".chat-container");
const user = chatContainer.getAttribute("id");
const chatBox = document.querySelector("#chatBox");

socket.emit('retrieveLog');
socket.emit('userConnected', user);

chatBox.addEventListener('keyup', evt => {
    if(evt.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("message", {user, message: chatBox.value});
            chatBox.value = "";
        }
    }
});

socket.on('messageLogs', data => {
    let log = document.querySelector("#messageLogs");
    let messages = "";
    data.forEach(message => {
        messages = messages + `<span>${message.user} dice: </span> ${message.message} </br> `
    });
    log.innerHTML = messages;
});

socket.on("sendLog", data => {
    let log = document.querySelector("#messageLogs");
    let messages = "";
    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message} </br> `
    });
    log.innerHTML = messages;
});

socket.on('showNotification', data => {
    Swal.fire({
        text: `${data} se ha conectado al chat `,
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: "success"
    })
}); 

