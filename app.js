/* Biduloshop — interactions */
(() => {
  "use strict";

  // Catalogue de démonstration (contenus fictifs).
  const PRODUCTS = [
    { id: "chaussettes-klaxon", name: "Chaussettes Klaxon", emoji: "🧦", cat: "vetements", goof: 4, price: 14.9, bg: "var(--sky)", badge: "Best-seller", rating: 4.9, reviews: 1203, pop: 10,
      desc: "Un « pouet » discret à chaque pas. Coton peigné." },
    { id: "mug-boudeur", name: "Mug Boudeur", emoji: "☕", cat: "maison", goof: 3, price: 16.9, bg: "var(--banana)", rating: 4.7, reviews: 342, pop: 8,
      desc: "Céramique 350 ml, expression grincheuse garantie avant le premier café." },
    { id: "canard-debug", name: "Canard de Debug", emoji: "🦆", cat: "bureau", goof: 2, price: 9.9, bg: "var(--slime)", badge: "Nouveau", rating: 4.8, reviews: 888, pop: 9,
      desc: "Le collègue idéal pour expliquer vos bugs à voix haute." },
    { id: "kit-moustaches", name: "Kit Moustaches Visio", emoji: "🥸", cat: "cadeaux", goof: 4, price: 7.9, bg: "var(--bubblegum)", rating: 4.4, reviews: 97, pop: 4,
      desc: "6 moustaches adhésives réutilisables pour égayer vos réunions." },
    { id: "bob-banane", name: "Bob Banane", emoji: "🍌", cat: "vetements", goof: 3, price: 24.9, old: 29.9, bg: "var(--banana)", badge: "-17 %", rating: 4.6, reviews: 211, pop: 7,
      desc: "100 % coton, protection solaire, style inimitable." },
    { id: "plante-drama", name: "Pot Drama Queen", emoji: "🪴", cat: "maison", goof: 2, price: 19.9, bg: "var(--slime)", rating: 4.5, reviews: 58, pop: 3,
      desc: "Pot en céramique au visage expressif. Plante non incluse." },
    { id: "trombone-xxl", name: "Trombone XXL", emoji: "📎", cat: "bureau", goof: 3, price: 17.9, bg: "var(--sky)", rating: 4.3, reviews: 144, pop: 5,
      desc: "Presse-papier en acier brossé de 30 cm. Tient vraiment les papiers." },
    { id: "boite-mystere", name: "Boîte Mystère", emoji: "📦", cat: "cadeaux", goof: 5, price: 19.9, bg: "var(--grape)", badge: "Culte", rating: 4.7, reviews: 1540, pop: 9.5,
      desc: "Trois objets décalés tirés au sort. Valeur minimale de 30 €." },
    { id: "cape-heros", name: "Cape de Héros Adulte", emoji: "🦸", cat: "vetements", goof: 5, price: 29.9, bg: "var(--tomato)", rating: 4.5, reviews: 76, pop: 4.5,
      desc: "Satin brodé, attache aimantée. Super-pouvoirs non contractuels." },
    { id: "gommes-pizza", name: "Gommes Pizza (lot de 3)", emoji: "🍕", cat: "bureau", goof: 2, price: 4.9, bg: "var(--banana)", rating: 4.2, reviews: 510, pop: 6,
      desc: "Parfum pizza, efficacité très sérieuse." },
    { id: "coussin-farceur", name: "Coussin Farceur", emoji: "💨", cat: "cadeaux", goof: 4, price: 8.9, bg: "var(--bubblegum)", rating: 4.6, reviews: 2020, pop: 8.5,
      desc: "Le classique indémodable, en caoutchouc naturel renforcé." },
    { id: "caillou-compagnie", name: "Caillou de Compagnie", emoji: "🪨", cat: "cadeaux", goof: 5, price: 11.9, bg: "var(--sky)", rating: 4.9, reviews: 666, pop: 7.5,
      desc: "Livré avec certificat d'adoption. Aucun entretien requis." },
  ];
  const CAT_LABELS = { vetements: "Vêtements", maison: "Maison", bureau: "Bureau", cadeaux: "Cadeaux" };
  const GOOF_LABELS = ["Tous", "Un brin décalé", "Franchement drôle", "Très décalé", "Totalement décalé"];
  const FREE_SHIP = 50, SHIP_COST = 4.9, PROMO_CODE = "BIENVENUE", PROMO_RATE = 0.1;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const euro = (n) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = { cat: "all", goof: 1, sort: "popular", cart: load("biduloCart", {}), promo: load("biduloPromo", false) };

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function save() {
    try {
      localStorage.setItem("biduloCart", JSON.stringify(state.cart));
      localStorage.setItem("biduloPromo", JSON.stringify(state.promo));
    } catch { /* stockage indisponible : le panier vit le temps de la page */ }
  }

  /* ---------------- Produits ---------------- */
  const SORTS = {
    popular: (a, b) => b.pop - a.pop,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };
  const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

  function renderProducts() {
    const list = PRODUCTS
      .filter((p) => (state.cat === "all" || p.cat === state.cat) && p.goof >= state.goof)
      .sort(SORTS[state.sort]);

    $("#productGrid").innerHTML = list.map((p, i) => `
      <li class="card" style="--i:${i}">
        <div class="card__visual" style="--bg:${p.bg}">
          ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
          <span class="card__emoji" aria-hidden="true">${p.emoji}</span>
        </div>
        <div class="card__body">
          <p class="card__meta"><span>${CAT_LABELS[p.cat]}</span><span>Fantaisie ${p.goof}/5</span></p>
          <h3 class="card__name">${p.name}</h3>
          <p class="card__desc">${p.desc}</p>
          <p class="card__rating"><span class="stars" aria-hidden="true">${stars(p.rating)}</span>
            <span class="sr-only">Note ${p.rating.toLocaleString("fr-FR")} sur 5,</span> ${p.reviews.toLocaleString("fr-FR")} avis</p>
          <div class="card__foot">
            <span class="card__price">${euro(p.price)}${p.old ? `<s><span class="sr-only">au lieu de </span>${euro(p.old)}</s>` : ""}</span>
            <button class="btn btn--primary" type="button" data-add="${p.id}" aria-label="Ajouter ${p.name} au panier">Ajouter</button>
          </div>
        </div>
      </li>`).join("");

    $("#emptyState").hidden = list.length > 0;
    $("#resultsCount").textContent = list.length ? `${list.length} produit${list.length > 1 ? "s" : ""}` : "";
  }

  /* ---------------- Filtres ---------------- */
  $$(".chip").forEach((chip) => chip.addEventListener("click", () => {
    state.cat = chip.dataset.cat;
    $$(".chip").forEach((c) => {
      c.classList.toggle("is-active", c === chip);
      c.setAttribute("aria-pressed", c === chip);
    });
    renderProducts();
  }));

  const slider = $("#goofSlider");
  function onSlider() {
    state.goof = +slider.value;
    const label = state.goof === 1 ? GOOF_LABELS[0] : `${GOOF_LABELS[state.goof - 1]} et plus`;
    $("#goofLabel").textContent = label;
    slider.setAttribute("aria-valuetext", label);
    renderProducts();
  }
  slider.addEventListener("input", onSlider);
  slider.setAttribute("aria-valuetext", GOOF_LABELS[0]);

  $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderProducts(); });

  $("#resetFilters").addEventListener("click", () => {
    slider.value = 1; onSlider();
    $(".chip[data-cat='all']").click();
  });

  /* ---------------- Panier ---------------- */
  const cartEl = $("#cart"), overlay = $("#overlay"), cartBtn = $("#cartBtn");
  let lastFocus = null;

  function openCart() {
    lastFocus = document.activeElement;
    $("#toasts").replaceChildren(); // le panier montre déjà l'info, et un toast masquerait le total
    cartEl.classList.add("is-open");
    cartEl.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    cartBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    $("#cartClose").focus();
  }
  function closeCart() {
    cartEl.classList.remove("is-open");
    cartEl.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    cartBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    (lastFocus && document.contains(lastFocus) ? lastFocus : cartBtn).focus();
  }
  cartBtn.addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  $("#emptyShop").addEventListener("click", () => { closeCart(); $("#boutique").scrollIntoView(); });

  document.addEventListener("keydown", (e) => {
    if (!cartEl.classList.contains("is-open")) return;
    if (e.key === "Escape") closeCart();
    if (e.key === "Tab") {
      const f = $$("button, input, [href]", cartEl).filter((el) => !el.disabled && el.offsetParent);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function addToCart(id) {
    const p = byId(id);
    state.cart[id] = (state.cart[id] || 0) + 1;
    save(); renderCart();
    toast(p);
    cartBtn.classList.remove("is-bumping"); void cartBtn.offsetWidth; cartBtn.classList.add("is-bumping");
  }

  function setQty(id, qty) {
    if (qty <= 0) delete state.cart[id]; else state.cart[id] = Math.min(qty, 99);
    save(); renderCart();
  }

  function totals() {
    const items = Object.entries(state.cart).map(([id, qty]) => ({ p: byId(id), qty })).filter((e) => e.p);
    const count = items.reduce((s, e) => s + e.qty, 0);
    const subtotal = items.reduce((s, e) => s + e.qty * e.p.price, 0);
    const discount = state.promo ? subtotal * PROMO_RATE : 0;
    const afterDiscount = subtotal - discount;
    const shipping = count === 0 || afterDiscount >= FREE_SHIP ? 0 : SHIP_COST;
    return { items, count, subtotal, discount, afterDiscount, shipping, total: afterDiscount + shipping };
  }

  function renderCart() {
    const t = totals();
    $("#cartCount").textContent = t.count;
    cartEl.classList.toggle("is-empty", t.count === 0);

    $("#cartItems").innerHTML = t.items.map(({ p, qty }) => `
      <li class="cart-item">
        <span class="cart-item__emoji" style="--bg:${p.bg}" aria-hidden="true">${p.emoji}</span>
        <div>
          <p class="cart-item__name">${p.name}</p>
          <p class="cart-item__price">${euro(p.price * qty)}</p>
          <button type="button" class="cart-item__remove" data-remove="${p.id}">Retirer<span class="sr-only"> ${p.name}</span></button>
        </div>
        <div class="qty">
          <button type="button" data-qty="${p.id}" data-d="-1" aria-label="Diminuer la quantité de ${p.name}">−</button>
          <span aria-label="Quantité : ${qty}">${qty}</span>
          <button type="button" data-qty="${p.id}" data-d="1" aria-label="Augmenter la quantité de ${p.name}">+</button>
        </div>
      </li>`).join("");

    $("#subtotal").textContent = euro(t.subtotal);
    $("#discountRow").hidden = !state.promo;
    $("#discount").textContent = "-" + euro(t.discount);
    $("#shipping").textContent = t.shipping ? euro(t.shipping) : "Offerte";
    $("#total").textContent = euro(t.total);

    const left = Math.max(0, FREE_SHIP - t.afterDiscount);
    $("#shipMsg").textContent = left > 0
      ? `Plus que ${euro(left)} pour profiter de la livraison offerte.`
      : "🎉 Bonne nouvelle : la livraison est offerte !";
    $("#shipBar").style.width = Math.min(100, (t.afterDiscount / FREE_SHIP) * 100) + "%";
  }

  $("#cartItems").addEventListener("click", (e) => {
    const q = e.target.closest("[data-qty]");
    if (q) return setQty(q.dataset.qty, (state.cart[q.dataset.qty] || 0) + +q.dataset.d);
    const r = e.target.closest("[data-remove]");
    if (r) { setQty(r.dataset.remove, 0); $("#cartClose").focus(); }
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) addToCart(b.dataset.add);
  });

  $("#promoForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = $("#promo").value.trim().toUpperCase();
    const msg = $("#promoMsg");
    msg.className = "promo__msg";
    if (!code) {
      msg.textContent = "Saisissez un code promo.";
      msg.classList.add("is-error");
    } else if (code === PROMO_CODE) {
      state.promo = true;
      msg.textContent = "Code appliqué : -10 % sur votre commande.";
      msg.classList.add("is-ok");
    } else {
      msg.textContent = "Ce code n'est pas valide. Vérifiez l'orthographe.";
      msg.classList.add("is-error");
    }
    save(); renderCart();
  });

  $("#checkoutBtn").addEventListener("click", () => {
    // Démo : la redirection vers le tunnel de paiement se branchera ici.
    toast(null, "Redirection vers le paiement sécurisé…", "Démo : aucune commande n'est passée.");
  });

  /* ---------------- Toasts ---------------- */
  function toast(product, title, sub) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `
      <span class="toast__emoji" aria-hidden="true">${product ? product.emoji : "🔒"}</span>
      <p class="toast__text"><strong></strong><small></small></p>
      ${product ? '<button type="button" class="toast__action">Voir le panier</button>' : ""}`;
    $("strong", t).textContent = product ? `${product.name} ajouté au panier` : title;
    $("small", t).textContent = product ? euro(product.price) : sub;
    $(".toast__action", t)?.addEventListener("click", () => { t.remove(); openCart(); });
    const box = $("#toasts");
    while (box.children.length >= 2) box.firstElementChild.remove();
    box.appendChild(t);
    setTimeout(() => { t.classList.add("is-leaving"); setTimeout(() => t.remove(), 250); }, 4000);
  }

  /* ---------------- Hero ---------------- */
  const heroEmojis = PRODUCTS.map((p) => p.emoji);
  let heroIdx = 2; // 🦆
  $("#heroProduct").addEventListener("click", (e) => {
    heroIdx = (heroIdx + 1) % heroEmojis.length;
    e.currentTarget.textContent = heroEmojis[heroIdx];
  });

  $("#randomBtn").addEventListener("click", () => {
    if (!$$(".card").length) $("#resetFilters").click();
    const cards = $$(".card");
    const pick = cards[Math.floor(Math.random() * cards.length)];
    pick.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    if (!reduceMotion) pick.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: 500, delay: 450 });
    setTimeout(() => $(".btn", pick).focus({ preventScroll: true }), 500);
  });

  /* ---------------- Newsletter ---------------- */
  $("#clubForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#email"), msg = $("#clubMsg");
    if (!input.value || !input.checkValidity()) {
      input.setAttribute("aria-invalid", "true");
      msg.textContent = "Merci de saisir une adresse e-mail valide.";
      input.focus();
      return;
    }
    input.removeAttribute("aria-invalid");
    msg.textContent = "🦆 Bienvenue au club ! Votre code de -10 % arrive par e-mail.";
    input.value = "";
  });

  renderProducts();
  renderCart();
})();
