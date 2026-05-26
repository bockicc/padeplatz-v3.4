// Cart functionality shared across all pages
// Clear test cart data on load to ensure clean state
localStorage.removeItem('pp_cart_items');
localStorage.removeItem('pp_cart_total');

document.addEventListener("DOMContentLoaded", function() {
  // Update cart count on page load
  updateCartCount();
});

function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    const items = JSON.parse(localStorage.getItem('pp_cart_items') || '[]');
    const count = items.length;
    cartCountEl.textContent = count;
  }
}

function toggleCart() {
  // Toggle cart sidebar or cart page - for now, let's just alert or navigate to cart
  // In a full implementation, this would open a cart sidebar or navigate to a cart page
  alert('Korpa je u razvojnoj fazi. Za sada možete videti stavke u localStorage.');
  // For demonstration, let's show what's in the cart
  const items = JSON.parse(localStorage.getItem('pp_cart_items') || '[]');
  if (items.length === 0) {
    alert('Korpa je prazna.');
  } else {
    let cartSummary = 'Stavke u korpi:\n';
    items.forEach(function(item, index) {
      cartSummary += (index + 1) + '. ' + item.name + ' - ' + item.price + '\n';
    });
    const total = parseFloat(localStorage.getItem('pp_cart_total') || '0');
    cartSummary += '\nUkupno: ' + total.toLocaleString('sr-RS') + ' RSD';
    alert(cartSummary);
  }
}

// Make toggleCart globally accessible
window.toggleCart = toggleCart;