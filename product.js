const cart = [];
let selectedShipping = { name: "Belum dipilih", cost: 0, etd: "" };
const whatsappNumber = "6282298988772";
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
  ["DBL Icon", 60000, "woody", "product-4.jpeg", "Bold modern scent dengan bergamot, lemon, jasmine, violet, cedarwood, amber, dan vanilla."],
  ["Night Passion", 60000, "floral", "product-5.jpeg", "Aroma sensual peach, bergamot, jasmine, rose, lily, vanilla, amber, dan musk."],
  ["Royal Honey", 60000, "floral", "product-6.jpeg", "Sweet warm fragrance dengan honey, peach, bergamot, jasmine, wild rose, vanilla, amber, dan musk."],
  ["Scandalous Secret", 60000, "floral", "product-7.jpeg", "Floral woody dengan jasmine, bergamot, peach, rose, lily, ylang ylang, vanilla, amber, dan sandalwood."],
  ["Dark Rebel", 60000, "woody", "product-8.jpeg", "Karakter smoky woody dari bergamot, black pepper, lavender, geranium, sage, cedarwood, amber, dan musk."],
  ["Honey Scandal", 60000, "floral", "product-9.jpeg", "Aroma honey, jasmine, bergamot, rose, lily, white floral, amber, sandalwood, dan musk."],
  ["Predator Sport", 60000, "fresh unisex", "product-10.jpeg", "Fresh masculine scent dengan bergamot, lemon, black pepper, lavender, geranium, oud wood, amber, dan vanilla."],
  ["Classic Black", 60000, "woody unisex", "product-11.jpeg", "Aroma clean woody dengan bergamot, lemon, black pepper, lavender, geranium, cedarwood, patchouli, amber, dan musk."],
  ["Velvet Ispahan", 60000, "floral", "product-12.jpeg", "Rose dan jasmine yang mewah dengan pink pepper, oud wood, vanilla, dan karakter floral yang intens."],
  ["Signature Black", 60000, "woody unisex", "product-13.jpeg", "Komposisi modern coffee, pear, pink pepper, jasmine, bitter almond, vanilla, patchouli, cedarwood, dan cashmere wood."],
  ["Note Baccarat 540", 60000, "floral woody unisex", "product-14.jpeg", "Signature amber floral dengan saffron, jasmine, amberwood, ambergris, fir resin, dan cedar." ]
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
  document.querySelector("#orderTotal").textContent = formatPrice(total + selectedShipping.cost);
  target.innerHTML = cart.length ? cart.map((item, index) => `<div class="order-line"><span>${item.name} × ${item.quantity}<br><small>${formatPrice(item.price * item.quantity)}</small></span><button type="button" data-remove="${index}">Hapus</button></div>`).join("") : '<p class="empty-order">Belum ada produk. Pilih parfum untuk mulai berbelanja.</p>';
  target.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => { cart.splice(Number(button.dataset.remove), 1); renderCart(); }));
}
function addProduct(card) { const existing = cart.find(item => item.name === card.dataset.name); if (existing) existing.quantity += 1; else cart.push({ name: card.dataset.name, price: Number(card.dataset.price), quantity: 1 }); renderCart(); }
document.querySelector("#shippingButton").addEventListener("click", async () => {
  const destination = document.querySelector("#destinationId").value;
  const courier = document.querySelector("#courierSelect").value;
  const result = document.querySelector("#shippingResult");
  if (!destination) { result.textContent = "Masukkan ID tujuan Komerce terlebih dahulu."; return; }
  result.textContent = "Mengambil tarif ongkir...";
  try {
    const response = await fetch(`api/shipping-cost.php?destination=${encodeURIComponent(destination)}&weight=300&courier=${encodeURIComponent(courier)}`);
    const payload = await response.json();
    if (!response.ok || !payload.data?.length) throw new Error(payload.error || "Tarif tidak tersedia");
    const option = payload.data[0];
    selectedShipping = { name: `${option.name} ${option.service}`, cost: Number(option.cost), etd: option.etd || "" };
    result.textContent = `${selectedShipping.name}: ${formatPrice(selectedShipping.cost)}${selectedShipping.etd ? ` · ETD ${selectedShipping.etd}` : ""}`;
    renderCart();
  } catch (error) { result.textContent = error.message || "Gagal mengambil tarif ongkir."; }
});
function openModal(card) { document.querySelector("#modalImage").src = card.dataset.image; document.querySelector("#modalTitle").textContent = card.dataset.name; document.querySelector("#modalDescription").textContent = card.dataset.description; document.querySelector("#quickModal").classList.add("is-open"); document.querySelector("#quickModal").setAttribute("aria-hidden", "false"); document.querySelector(".modal-add").onclick = () => { addProduct(card); closeModal(); }; }
function closeModal() { document.querySelector("#quickModal").classList.remove("is-open"); document.querySelector("#quickModal").setAttribute("aria-hidden", "true"); }

document.querySelectorAll(".product-card").forEach(card => { card.dataset.category ||= "unisex"; card.querySelector(".add-button").addEventListener("click", () => addProduct(card)); card.querySelector(".quick-button").addEventListener("click", () => openModal(card)); });
document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => { document.querySelectorAll(".filter-button").forEach(item => item.classList.remove("active")); button.classList.add("active"); const filter = button.dataset.filter; document.querySelectorAll(".product-card").forEach(card => { card.hidden = filter !== "all" && !card.dataset.category.split(" ").includes(filter); }); }));
document.querySelector(".modal-close").addEventListener("click", closeModal); document.querySelector("#quickModal").addEventListener("click", event => { if (event.target.id === "quickModal") closeModal(); });
document.querySelector("#checkoutButton").addEventListener("click", () => { if (!cart.length) return alert("Silakan pilih produk terlebih dahulu."); const name = document.querySelector("#customerName").value.trim() || "Belum diisi"; const address = document.querySelector("#customerAddress").value.trim() || "Belum diisi"; const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); const total = subtotal + selectedShipping.cost; const items = cart.map(item => `- ${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`).join("%0A"); const message = `Halo Saynna Parfum, saya ingin memesan:%0A%0A${items}%0AOngkir: ${selectedShipping.name} - ${formatPrice(selectedShipping.cost)}%0ATotal: ${formatPrice(total)}%0ANama: ${encodeURIComponent(name)}%0AAlamat: ${encodeURIComponent(address)}`; window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener"); });
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
