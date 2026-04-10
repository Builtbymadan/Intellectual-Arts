// Cart stored in localStorage key: 'ia_cart'
const CART_KEY = 'ia_cart';

// Call updateCartCount() on every page load
document.addEventListener('DOMContentLoaded', updateCartCount);

function getCart() {
  const cartData = localStorage.getItem(CART_KEY);
  return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id, name, price, image) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  
  saveCart(cart);
  updateCartCount();
  
  // Optional: show a quick success toast or alert
  alert(name + " added to cart!");
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartCount();
  renderCart(); // re-render if we are on the cart page
}

function updateQty(id, delta) {
  const cart = getCart();
  const item = cart.find(item => item.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart(cart);
    updateCartCount();
    renderCart(); // re-render
  }
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.innerText = count;
  }
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  renderCart();
}

function renderCart() {
  // Only execute if we are on the cart page
  const cartBody = document.getElementById('cartBody');
  if (!cartBody) return;
  
  const cart = getCart();
  const subtotalElem = document.getElementById('cartSubtotal');
  const deliveryElem = document.getElementById('cartDelivery');
  const totalElem = document.getElementById('cartTotal');
  const emptyMsg = document.getElementById('emptyCartMsg');
  const cartContent = document.getElementById('cartContentWrap');
  
  if (cart.length === 0) {
    emptyMsg.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }
  
  emptyMsg.style.display = 'none';
  cartContent.style.display = 'flex';
  
  cartBody.innerHTML = '';
  
  cart.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="cart-item-info-td">
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <span class="cart-item-name">${item.name}</span>
        </div>
      </td>
      <td>₹${item.price.toLocaleString('en-IN')}</td>
      <td>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
        </div>
      </td>
      <td><strong>₹${(item.price * item.qty).toLocaleString('en-IN')}</strong></td>
      <td>
        <button class="rm-btn" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash"></i></button>
      </td>
    `;
    cartBody.appendChild(tr);
  });
  
  // Calculations
  const subtotal = getCartTotal();
  const delivery = subtotal > 499 ? 0 : 49;
  const total = subtotal + delivery;
  
  subtotalElem.innerText = '₹' + subtotal.toLocaleString('en-IN');
  deliveryElem.innerText = delivery === 0 ? 'FREE' : '₹' + delivery;
  totalElem.innerText = '₹' + total.toLocaleString('en-IN');
}

function buildWhatsAppMessage() {
  const cart = getCart();
  if (cart.length === 0) return;
  
  let msg = "Hi Intellectual Arts! I'd like to order the following:\n\n";
  
  cart.forEach(item => {
    msg += `${item.name} × ${item.qty} = ₹${(item.price * item.qty).toLocaleString('en-IN')}\n`;
  });
  
  const subtotal = getCartTotal();
  const delivery = subtotal > 499 ? 0 : 49;
  const total = subtotal + delivery;
  
  msg += `\nSubtotal: ₹${subtotal.toLocaleString('en-IN')}\n`;
  msg += `Delivery: ₹${delivery}\n`;
  msg += `Total: ₹${total.toLocaleString('en-IN')}\n\n`;
  msg += `Please confirm availability and share payment details. Thank you!`;
  
  // Encode and open link
  const encoded = encodeURIComponent(msg);
  const waLink = `https://wa.me/919080496866?text=${encoded}`; // Phone number placeholder from prompt: 91XXXXXXXXXX
  window.open(waLink, '_blank');
}

// Call renderCart directly just in case the DOM is already ready
if(document.readyState === 'interactive' || document.readyState === 'complete'){
    renderCart();
} else {
    document.addEventListener('DOMContentLoaded', renderCart);
}
