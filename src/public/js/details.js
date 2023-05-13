const goToCartButton = document.querySelector(".goToCartButton");
const cartId = goToCartButton.getAttribute("id");
goToCartButton.setAttribute("href", `/cart/${cartId}`);

const btn_addToCart = document.querySelector(".cartButton");

btn_addToCart.addEventListener('click', e => {
    e.preventDefault();
    const eventId = btn_addToCart.getAttribute("id");
    addToCart(eventId);
});

const addToCart = async (pid) => {
    try {
        console.log(pid)
        const url = `/api/carts/${cartId}/product/${pid}`;
        const headers = {
            'Content-Type': 'application/json'
        }
        const method = 'POST';
        
        await fetch(
            url, {
                headers,
                method
            });
    } catch (error) {
        console.log(error);
    }
};