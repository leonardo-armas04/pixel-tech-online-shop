const addToCardButton = document.querySelector("#product-details button")
const cartBadge = document.querySelector(".nav-items .badge")

async function addToCart() {
    const productId = addToCardButton.dataset.productid
    const csrfToken = addToCardButton.dataset.csrf
    let response
    try {
        response = await fetch("/cart/items",{
            method: "POST",
            body: JSON.stringify({
                productId: productId,
                _csrf: csrfToken
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    } catch (error) {
        alert("something went wrong!")
        console.log(error)
        return
    }

    if (!response.ok) {
        alert("Something went wrong!")
        console.dir(response)
        return
    }

    const responseData = await response.json()
    const newTotalQuantity = responseData.totalItems
    cartBadge.innerText = newTotalQuantity
}

addToCardButton.addEventListener("click",addToCart)