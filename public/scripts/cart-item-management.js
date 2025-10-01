const cartItemUpdateForms = document.querySelectorAll(".cart-item-management")

async function updateCartItem(event) {
    event.preventDefault()

    const form = event.target
    const productId = form.dataset.productid
    const csrfToken = form.dataset.csrf
    const quantity = form.firstElementChild.value

    let response
    try {
        response = await fetch("/cart/items",{
            method: "PATCH",
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                _csrf: csrfToken
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    } catch (error) {
        console.log(error)
        alert("Something went wrong!")
        return
    }

    if (!response.ok) {
        alert("Something went wrong!")
        return
    }

    const responseData = await response.json()

    if (responseData.updatedCartData.updatedItemQuantity === 0) {
        form.parentElement.parentElement.remove()
    } else {
        const cartItemQuantitySpan = form.parentElement.querySelector(".cart-item-quantity")
        cartItemQuantitySpan.innerText = responseData.updatedCartData.updatedItemQuantity
    
        const cartItemPriceSpan = form.parentElement.querySelector(".cart-item-price")
        cartItemPriceSpan.innerText = responseData.updatedCartData.updatedItemPrice
    }
    
    const cartTotalPriceSpan = document.querySelector("#cart-total span")
    cartTotalPriceSpan.innerText = responseData.updatedCartData.newTotalPrice

    const cartBadgeElements = document.querySelectorAll(".nav-items .badge")
    for (const cartBadge of cartBadgeElements) {
        cartBadge.innerText = responseData.updatedCartData.newTotalQuantity
    }

    console.log(responseData)
}

for (const updateForm of cartItemUpdateForms) {
    updateForm.addEventListener("submit",updateCartItem)
}