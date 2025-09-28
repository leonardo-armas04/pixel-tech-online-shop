const deleteButtons = document.querySelectorAll(".product-item button")

async function deleteProduct(event) {
    console.dir(event)
    const clickedButton = event.target
    const productId = clickedButton.dataset.productid
    const csrfToken = clickedButton.dataset.csrf

    const response = await fetch(`/admin/products/${productId}?_csrf=${csrfToken}`,{
        method: "DELETE"
    })

    if (!response.ok) {
        alert("Something went worng!")
        return
    }

    clickedButton.parentElement.parentElement.parentElement.parentElement.remove()
    const message = await response.json()
    alert(message.message)
}

for (const button of deleteButtons) {
    button.addEventListener("click",deleteProduct)
}