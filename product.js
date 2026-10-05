const cart = [];
const whatsappNumber = "6281293161515";
const whatsappWidget = document.querySelector(".whatsapp-widget");
if (whatsappWidget) {
  whatsappWidget.querySelector(".floating-whatsapp").addEventListener("click", () => whatsappWidget.classList.toggle("is-open"));
  whatsappWidget.querySelector(".whatsapp-close").addEventListener("click", () => whatsappWidget.classList.remove("is-open"));
}
const progress = document.querySelector(".scroll-progress");
const updateProgress = () => { if (progress) progress.style.width = `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`; };
window.addEventListener("scroll", updateProgress, { passive: true }); updateProgress();
window.addEventListener("pointermove", event => { document.body.style.setProperty("--pointer-x", `${event.clientX}px`); document.body.style.setProperty("--pointer-y", `${event.clientY}px`); });
document.querySelectorAll("a[href$='.html'], a[href^='index.html']").forEach(link => link.addEventListener("click", event => { const url = link.href; if (!url.includes("#") && new URL(url).origin === location.origin) { event.preventDefault(); const curtain = document.querySelector(".page-transition"); gsap.to(curtain, { scaleY: 1, duration: .35, ease: "power2.in", onComplete: () => location.href = url }); } }));
const formatPrice = value => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const extraProducts = [
  ["Saynna Noir", 60000, "woody", "image.png", "Woody amber yang misterius untuk malam yang berkarakter."],
  ["Golden Jasmine", 60000, "floral", "detail-1.jpeg", "Jasmine luminous dengan sentuhan saffron yang elegan."],
  ["Cedar Mist", 60000, "woody", "detail-2.jpeg", "Cedar dan fir resin yang tenang, bersih, dan sophisticated."],
  ["Morning Veil", 60000, "fresh", "image.png", "Fresh floral ringan untuk rutinitas pagi yang effortless."],
  ["Amber Bloom", 60000, "unisex", "detail-1.jpeg", "Amber floral modern dengan jejak hangat yang tahan lama."],
  ["Saynna Mini Duo", 60000, "unisex", "detail-2.jpeg", "Dua aroma signature Saynna dalam ukuran travel-friendly."],
  ["Velvet Saffron", 60000, "floral", "image.png", "Saffron spicy dan amberwood dalam komposisi yang sensual."]
];

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".catalog-hero", { y: 35, opacity: 0, duration: .9, ease: "power2.out" });
  gsap.from(".catalog-toolbar", { y: 25, opacity: 0, duration: .7, delay: .15, ease: "power2.out" });
  gsap.from(".order-panel", { x: 30, opacity: 0, duration: .8, delay: .25, ease: "power2.out" });
  gsap.from(".testimonials-section", { y: 40, opacity: 0, duration: .8, scrollTrigger: { trigger: ".testimonials-section", start: "top 88%", end: "top 58%", scrub: .7 } });
}

function createProductCard([name, price, category, image, description]) {
  const card = document.createElement("article");
  card.className = "product-card reveal-card";
  card.dataset.name = name; card.dataset.price = price; card.dataset.category = category; card.dataset.description = description; card.dataset.image = image;
  card.innerHTML = `<div class="product-visual product-visual-main"><img src="${image}" alt="${name} Saynna Parfum"></div><div class="product-info"><p class="product-type">SIGNATURE COLLECTION</p><h2>${name}</h2><p>${description}</p><div class="product-buy"><strong>${formatPrice(price)}</strong><div><button class="quick-button" type="button">Detail</button><button class="add-button" type="button">Tambah</button></div></div></div>`;
  document.querySelector(".product-grid").appendChild(card);
}
extraProducts.forEach(createProductCard);

function renderCart() {
  const target = document.querySelector("#orderItems");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector("#orderTotal").textContent = formatPrice(total);
  target.innerHTML = cart.length ? cart.map((item, index) => `<div class="order-line"><span>${item.name} × ${item.quantity}<br><small>${formatPrice(item.price * item.quantity)}</small></span><button type="button" data-remove="${index}">Hapus</button></div>`).join("") : '<p class="empty-order">Belum ada produk. Pilih parfum untuk mulai berbelanja.</p>';
  target.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => { cart.splice(Number(button.dataset.remove), 1); renderCart(); }));
}
function addProduct(card) { const existing = cart.find(item => item.name === card.dataset.name); if (existing) existing.quantity += 1; else cart.push({ name: card.dataset.name, price: Number(card.dataset.price), quantity: 1 }); renderCart(); }
function openModal(card) { document.querySelector("#modalImage").src = card.dataset.image; document.querySelector("#modalTitle").textContent = card.dataset.name; document.querySelector("#modalDescription").textContent = card.dataset.description; document.querySelector("#quickModal").classList.add("is-open"); document.querySelector("#quickModal").setAttribute("aria-hidden", "false"); document.querySelector(".modal-add").onclick = () => { addProduct(card); closeModal(); }; }
function closeModal() { document.querySelector("#quickModal").classList.remove("is-open"); document.querySelector("#quickModal").setAttribute("aria-hidden", "true"); }

document.querySelectorAll(".product-card").forEach(card => { card.dataset.category ||= "unisex"; card.querySelector(".add-button").addEventListener("click", () => addProduct(card)); card.querySelector(".quick-button").addEventListener("click", () => openModal(card)); });
document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => { document.querySelectorAll(".filter-button").forEach(item => item.classList.remove("active")); button.classList.add("active"); const filter = button.dataset.filter; document.querySelectorAll(".product-card").forEach(card => { card.hidden = filter !== "all" && !card.dataset.category.split(" ").includes(filter); }); }));
document.querySelector(".modal-close").addEventListener("click", closeModal); document.querySelector("#quickModal").addEventListener("click", event => { if (event.target.id === "quickModal") closeModal(); });
document.querySelector("#checkoutButton").addEventListener("click", () => { if (!cart.length) return alert("Silakan pilih produk terlebih dahulu."); const name = document.querySelector("#customerName").value.trim() || "Belum diisi"; const address = document.querySelector("#customerAddress").value.trim() || "Belum diisi"; const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); const items = cart.map(item => `- ${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`).join("%0A"); const message = `Halo Saynna Parfum, saya ingin memesan:%0A%0A${items}%0A%0ATotal: ${formatPrice(total)}%0ANama: ${encodeURIComponent(name)}%0AAlamat: ${encodeURIComponent(address)}`; window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener"); });
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12 }); document.querySelectorAll(".reveal-card").forEach(card => observer.observe(card));
if (window.gsap && window.ScrollTrigger && window.matchMedia("(max-width: 768px)").matches) {
  gsap.utils.toArray(".product-card").forEach((card, index) => {
    gsap.from(card, { y: 35, opacity: 0, duration: .65, delay: index * .04, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 92%", end: "top 68%", scrub: .65 } });
  });
  ScrollTrigger.refresh();
}
document.querySelectorAll(".product-card").forEach(card => {
  card.style.opacity = "1";
  card.style.visibility = "visible";
});
document.querySelectorAll(".product-card").forEach(card => card.addEventListener("pointermove", event => { const box = card.getBoundingClientRect(); const x = ((event.clientX - box.left) / box.width - .5) * 6; const y = ((event.clientY - box.top) / box.height - .5) * -6; card.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`; }));
document.querySelectorAll(".product-card").forEach(card => card.addEventListener("pointerleave", () => { card.style.transform = ""; }));
renderCart();
