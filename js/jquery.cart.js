// 3 - задание
import data from './harvest.js';
const CART_STORAGE_KEY = 'shoppingCart';
const CART_COUNT_STORAGE_KEY = 'cartItemCount';

function loadCart() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  return storedCart ? JSON.parse(storedCart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

let cart = loadCart();

function formatterCart(priceSum) {
  return priceSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function updateCartDisplay() {
  const cartWrapper = document.querySelector('.jqcart_manage_order');
  const cartCountDisplay = document.querySelector('.open_cart_number');
  if (!cartWrapper) return;

  const cartItems = cart
    .map(
      (item) => `
          <ul class="jqcart_tbody" data-id="${item.code}">
              <li class="jqcart_small_td">
                  <img src="${item.img}" alt="${item.title}">
              </li>
              <li>
                  <div class="jqcart_nd">
                      <a href="${item.link}">${item.title}</a>
                  </div>
              </li>
              <li></li>
              <li class="jqcart_price">${formatterCart(item.price)}</li>
              <li>
                  <div class="jqcart_pm">
                      <button class="jqcart_minus" data-code="${
                        item.code
                      }">-</button>
                      <input type="text" class="jqcart_amount" value="${
                        item.quantity
                      }" readonly>
                      <button class="jqcart_plus" data-code="${
                        item.code
                      }">+</button>
                  </div>
              </li>
              <li class="jqcart_sum">${formatterCart(
                item.price * item.quantity
              )} тг</li>
          </ul>
        `
    )
    .join('');

  cartWrapper.innerHTML = cartItems;

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const subtotalElement = document.querySelector('.jqcart_subtotal strong');
  if (subtotalElement) {
    subtotalElement.textContent = `${formatterCart(totalPrice)} тг`;
  }

  if (cartCountDisplay) {
    cartCountDisplay.textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  document.querySelectorAll('.jqcart_plus').forEach((button) => {
    button.addEventListener('click', function () {
      const productCode = button.dataset.code;
      const product = cart.find((item) => item.code === productCode);
      if (product) {
        product.quantity += 1;
        saveCart(cart);
        updateCartDisplay();
      }
    });
  });

  document.querySelectorAll('.jqcart_minus').forEach((button) => {
    button.addEventListener('click', function () {
      const productCode = button.dataset.code;
      const product = cart.find((item) => item.code === productCode);
      if (product) {
        if (product.quantity === 1) {
          cart = cart.filter((item) => item.code !== productCode);
        } else {
          product.quantity -= 1;
        }
        saveCart(cart);
        updateCartDisplay();
      }
    });
  });
}

function addToCart(product) {
  const existingProduct = cart.find((item) => item.code === product.code);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartDisplay();
  updateCartCount();
}

document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.product_item_price_btn');
  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      console.log('Клик по кнопке:', button.dataset.code);
      const productCode = button.dataset.code;
      const product = data.find((item) => item.code === productCode);
      if (product) {
        addToCart(product);
      }
    });
  });
});

function updateCartCount() {
  const cart = loadCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  localStorage.setItem(CART_COUNT_STORAGE_KEY, totalItems);

  const cartCountElement = document.querySelector('.open_cart_number');

  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

function restoreCartCount() {
  const savedCount = localStorage.getItem(CART_COUNT_STORAGE_KEY);
  const cartCountElement = document.querySelector('.open_cart_number');

  if (cartCountElement) {
    cartCountElement.textContent = savedCount ? savedCount : 0;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  restoreCartCount();
  updateCartCount();
});

document.getElementById('open_cart_btn').addEventListener('click', function () {
  const divElement = document.createElement('div');

  divElement.classList.add('jqcart_layout');

  divElement.innerHTML = `
        <div class="jqcart_content">
            <div class="jqcart_table_wrapper">
            <div class="" style="
    width:100%;
            display: flex;
    align-items: center;
    justify-content: space-between;
">
                <ul class="jqcart_thead">
                        <li></li>
                        <li>ТОВАР</li>
                        <li></li>
                        <li>ЦЕНА</li>
                        <li>КОЛИЧЕСТВО </li>
                        <li>СТОИМОСТЬ</li>
                    </ul>   
                </div>
                <div class="jqcart_manage_order">
                  
                </div>
            </div>
            
            <div class="jqcart_manage_block">
                <div class="jqcart_btn">
                    <button class="jqcart_open_form_btn">Оформить заказ</button>
                    <form class="jqcart_order_form" style="opacity: 0">
                        <input class="jqcart_return_btn" type="reset" value="Продолжить покупки">
                    </form>
                </div>
                <div class="jqcart_subtotal">Итого: <strong>0</strong></div>
            </div>
        </div>
    `;

  document.body.appendChild(divElement);

  divElement.addEventListener('click', function (e) {
    if (e.target === divElement) {
      divElement.remove();
    }
  });
  console.log(cart);

  updateCartDisplay();
});
