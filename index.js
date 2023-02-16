import {menuArray} from "/data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const modalContainer = document.getElementById("modal-container")
const payBtn = document.getElementById("pay-btn")
const payForm = document.getElementById("pay-form")
let orderContainer = document.getElementById("order-container")

document.addEventListener("click", function(e){
    if (e.target.dataset.add){
        handleMenuAddBtn(e.target.dataset.add)
    }
    else if (e.target.dataset.remove){
        handleRemoveBtn(e.target.dataset.remove)
    } else if (e.target.className === "complete-order-btn"){
        handlePayModal()
    } else if (e.target.className === "modal-close-btn"){
        handleCloseBtn()
    } else if (e.target.className === "pay-btn"){
        handlePayBtn(e)
    }
})



let orderArray = []
let orderHtml = ""
let initializeOrderHtml = 0
let orderTotal = 0



function handleMenuAddBtn(addBtnId){
    const targetMenuItem = menuArray.filter(function(menuItem){
        return menuItem.id == addBtnId
    })[0]
    
    orderArray.push({
        name: `${targetMenuItem.name}`,
        id: `${targetMenuItem.id}`,
        price: `${targetMenuItem.price}`,
        uuid: uuidv4()
    })
    
    if (!initializeOrderHtml){
        initializeOrderHtml ++
        orderHtml +=`
<div>
    <p class="order-title">Your order</p>
</div>
    <div class="selected-items" id="selected-items">
    </div>
    <hr id="order-hr">
    <div class="total-price">
        <p class="food-order-name" id="total-sum">Total price: </p>
        <p class="food-order-price" id="added-price">$${orderTotal}</p>
    </div>
        <button class="complete-order-btn">Complete order</button>
    </div>   
</div>
`
        orderContainer.innerHTML = orderHtml
        orderHtml = ""
        
        orderArray.forEach(function(orderItem){
            orderHtml +=`
<div class="food-order">
    <p class="food-order-name">${orderItem.name}</p>
    <button class="remove-btn" data-remove="${orderItem.uuid}">remove</button>
    <p class="food-order-price">$${orderItem.price}</p>
</div>
`
    orderTotal = parseInt(orderItem.price)
    })
    } 


    else {
        orderTotal = 0
        initializeOrderHtml ++
        orderArray.forEach(function(orderItem){
            orderHtml +=`
<div class="food-order">
    <p class="food-order-name">${orderItem.name}</p>
    <button class="remove-btn" data-remove="${orderItem.uuid}">remove</button>
    <p class="food-order-price">$${orderItem.price}</p>
</div>
`
    orderTotal += parseInt(orderItem.price)
    })
    }
    
    document.getElementById("selected-items").innerHTML = orderHtml
    orderHtml = ""
    document.getElementById("added-price").innerHTML = `$${orderTotal}`
}




function handleRemoveBtn(removeBtnId){
    let removedItemArray = orderArray.filter(function(orders){
        return orders.uuid != removeBtnId
    })
    initializeOrderHtml --
    orderTotal = 0
    orderArray = removedItemArray
    orderArray.forEach(function(orderItem){
        orderHtml +=`
<div class="food-order">
    <p class="food-order-name">${orderItem.name}</p>
    <button class="remove-btn" data-remove="${orderItem.uuid}">remove</button>
    <p class="food-order-price">$${orderItem.price}</p>
</div>
`
    orderTotal += parseInt(orderItem.price)
    })
    document.getElementById("selected-items").innerHTML = orderHtml
    orderHtml = ""
    document.getElementById("added-price").innerHTML = `$${orderTotal}`
    
    if (initializeOrderHtml === 0){
        orderContainer.innerHTML = ""
    }
}


function handlePayModal(){
    modalContainer.style.display = "block"
}

function handleCloseBtn(){
    modalContainer.style.display = "none"
}

function handlePayBtn(e){
    e.preventDefault()
    const payFormData = new FormData(payForm)
    const payName = payFormData.get("fullName")
    modalContainer.style.display = "none"
    orderContainer.innerHTML = ""
    orderContainer.innerHTML =`
<div class="thanks-box" id="thanks-box">
    <p class="thanks-text" id="thanks-text">Thanks ${payName}! Your order is on its way!</p>
</div>
`
    initializeOrderHtml = 0
    orderArray = []
    payForm.reset()
}




function getMenuHtml(){
    let menuHtml = ""
    
    menuArray.forEach(function(menuItem){
    menuHtml += `
<div class="outside-food-container">
    <div class="food-container">
        <div class="icon-container">
            <i class="food-icon">${menuItem.emoji}</i>
        </div>
        <div>
            <p class="food-name">${menuItem.name}</p>
            <p class="food-ingredients">${menuItem.ingredients}</p>
            <p class="food-price">$${menuItem.price}</p>
        </div>
        <button class="add-btn" data-add="${menuItem.id}">+</button>
    </div>
    <hr>
</div>   
`})
return menuHtml
}

function renderMenu(){
    document.getElementById("order-options").innerHTML = getMenuHtml()
}

renderMenu()