const goToCartButton = document.querySelector(".goToCartButton");
const btn_addToCart = document.querySelectorAll(".cartButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");

const cartId = goToCartButton.getAttribute("id");
goToCartButton.setAttribute("href", `/cart/${cartId}`);

btn_addToCart.forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const eventId = btn.getAttribute("id");
        addToCart(eventId);
    })
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

if(prevButton.getAttribute("href") === "") prevButton.style.visibility = "hidden";
if(nextButton.getAttribute("href") === "") nextButton.style.visibility = "hidden";