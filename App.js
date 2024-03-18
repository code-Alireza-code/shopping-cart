//Todo => shopping cart with OOP

//# imports

import { productsData } from "./products.js";

//# Global Vars
let cart = [];
let buttonsDom = [];
//# select elements

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backdrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");
const productsList = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

//# Classes

// 1. get products
class Products {
  static getProduct() {
    return productsData;
  }
}

// 2. show products
class UI {
  displayProducts(products) {
    let result = "";

    products.forEach((product) => {
      result += `<div class="product">
      <div class="img-container">
        <img src=${product.imageUrl} class="product-img" />
      </div>
      <div class="product-desc">
        <p class="product-price">$ ${product.price}</p>
        <p class="product-title">${product.title}</p>
      </div>
      <button class="btn add-to-cart " data-id=${product.id}>
        <i class="fas fa-shopping-cart"></i>
        add to cart
      </button>
    </div>`;
    });
    productsList.innerHTML = result;
  }
  getAddToCartBtns() {
    const buttons = [...document.querySelectorAll(".add-to-cart")];
    buttonsDom = buttons;
    buttons.forEach((btn) => {
      const id = btn.dataset.id;

      // check if this product is in cart?
      const isInCart = cart.find((p) => p.id == id);
      if (isInCart) {
        btn.innerText = "in Cart";
        btn.disabled = true;
      }

      btn.addEventListener("click", (e) => {
        e.target.innerText = "in Cart";
        e.target.disabled = true;

        // get product from products
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };

        // add to cart
        cart = [...cart, addedProduct];
        // save cart to localStorage
        Storage.saveCart(cart);

        // update cart value
        this.setCartValue(cart);

        // add to cart item
        this.addCartItem(addedProduct);
      });
    });
  }
  setCartValue() {
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `total price : ${Number(totalPrice).toFixed(2)}`;
    cartItems.innerText = tempCartItems;
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img class="cart-item-img" src=${cartItem.imageUrl} />
    <div class="cart-item-desc">
      <h4>${cartItem.title}</h4>
      <h5>$ ${cartItem.price}</h5>
    </div>
    <div class="cart-item-conteoller">
      <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
      <p>${cartItem.quantity}</p>
      <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
      </div>
      <i class="far fa-trash-alt" data-id=${cartItem.id}></i>`;
    cartContent.appendChild(div);
  }
  setUpApp() {
    // get cart from Storage:
    cart = Storage.getCart();
    // add cart Item:
    cart.forEach((item) => this.addCartItem(item));
    // set values
    this.setCartValue(cart);
  }
  cartLogic() {
    clearCart.addEventListener("click", () => {
      this.clearCart();
    });

    // cart functionality
    cartContent.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-chevron-up")) {
        const addQuantity = e.target;
        // get item from cart
        const addeditem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addeditem.quantity++;
        // update cart value
        this.setCartValue(cart);
        // save cart
        Storage.saveCart(cart);
        //update cart item in ui
        addQuantity.nextElementSibling.innerText = addeditem.quantity;
      } else if (e.target.classList.contains("fa-chevron-down")) {
        // get item from cart
        const substracteditem = cart.find(
          (cItem) => cItem.id == e.target.dataset.id
        );
        if (substracteditem.quantity == 1) {
          this.removeItem(substracteditem.id);
          cartContent.removeChild(e.target.parentElement.parentElement);
          return;
        }
        substracteditem.quantity--;

        // update cart value
        this.setCartValue(cart);
        // save cart
        Storage.saveCart(cart);
        //update cart item in ui
        e.target.previousElementSibling.innerText = substracteditem.quantity;
      } else if (e.target.classList.contains("fa-trash-alt")) {
        const removedItem = cart.find((c) => c.id == e.target.dataset.id);
        this.removeItem(removedItem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(e.target.parentElement);
        // remove from cart item
        // remove
      }
    });
  }
  removeItem(id) {
    cart = cart.filter((cItem) => cItem.id != id);
    this.setCartValue();
    Storage.saveCart(cart);
    this.getSingleItem(id);
  }
  clearCart() {
    //remove :
    cart.forEach((cItem) => this.removeItem(cItem.id));
    // remove cart content children:
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  getSingleItem(id) {
    const button = buttonsDom.find((btn) => btn.dataset.id == id);
    button.innerText = "add to cart";
    button.disabled = false;
  }
}

// 3. save to localstorage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id == id);
  }
  static saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }
}

//# functions

function showModalFunction() {
  backdrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "30%";
}
function closeModalFunction() {
  backdrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

//# eventListeners

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backdrop.addEventListener("click", closeModalFunction);

document.addEventListener("DOMContentLoaded", () => {
  const productsData = Products.getProduct();
  const ui = new UI();
  // set up App :
  ui.setUpApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});
