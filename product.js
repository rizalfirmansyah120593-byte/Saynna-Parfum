const cart = [];
const whatsappNumber = "6281293161515";
const formatPrice = value => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

function renderCart() {
  const target = document.querySelector("#orderItems");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector("#orderTotal").textContent = formatPrice(total);
  if (!cart.length) {
    target.innerHTML = '<p class="empty-order">Belum ada produk. Pilih parfum untuk mulai berbelanja.</p>';
    return;
  }
  target.innerHTML = cart.map((item, index) => `<div class="order-line"><span>${item.name} × ${item.quantity}<br><small>${formatPrice(item.price * item.quantity)}</small></span><button type="button" data-remove="${index}" aria-label="Hapus ${item.name}">Hapus</button></div>`).join("");
  target.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => { cart.splice(Number(button.dataset.remove), 1); renderCart(); }));
}

document.querySelectorAll(".product-card").forEach(card => card.querySelector(".add-button").addEventListener("click", () => {
  const existing = cart.find(item => item.name === card.dataset.name);
  if (existing) existing.quantity += 1;
  else cart.push({ name: card.dataset.name, price: Number(card.dataset.price), quantity: 1 });
  renderCart();
}));

document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) return alert("Silakan pilih produk terlebih dahulu.");
  const name = document.querySelector("#customerName").value.trim() || "Belum diisi";
  const address = document.querySelector("#customerAddress").value.trim() || "Belum diisi";
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const items = cart.map(item => `- ${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`).join("%0A");
  const message = `Halo Saynna Parfum, saya ingin memesan:%0A%0A${items}%0A%0ATotal: ${formatPrice(total)}%0ANama: ${encodeURIComponent(name)}%0AAlamat: ${encodeURIComponent(address)}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener");
});

renderCart();
