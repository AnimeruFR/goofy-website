/* BIDULOSHOP™ — interactions */
(() => {
  "use strict";

  const PRODUCTS = [
    { id: "chaussette-klaxon", name: "Chaussette-Klaxon™", emoji: "🧦", cat: "fringues", goof: 4, price: 14.99, old: 19.99, bg: "var(--sky)", badge: "Best-seller", ducks: 5, reviews: 1203,
      desc: "Chaque pas fait POUET. Taille unique, bruit unique." },
    { id: "tasse-boudeuse", name: "La Tasse qui Boude", emoji: "☕", cat: "maison", goof: 3, price: 12.99, bg: "var(--banana)", ducks: 4, reviews: 342,
      desc: "Elle refuse ton café le lundi. Compréhensible." },
    { id: "canard-philosophe", name: "Canard Philosophe", emoji: "🦆", cat: "bureau", goof: 2, price: 9.99, bg: "var(--slime)", badge: "Pensif", ducks: 5, reviews: 888,
      desc: "Explique-lui ton bug. Il te répondra « coin ? »." },
    { id: "moustache-urgence", name: "Moustache d'Urgence", emoji: "🥸", cat: "mystere", goof: 4, price: 6.49, bg: "var(--bubblegum)", ducks: 4, reviews: 97,
      desc: "Pour les réunions où tu ne veux pas être reconnu." },
    { id: "bob-banane", name: "Bob Banane", emoji: "🍌", cat: "fringues", goof: 3, price: 24.99, old: 29.99, bg: "var(--banana)", badge: "Été", ducks: 4, reviews: 211,
      desc: "Un bob. En forme de banane. Protège du soleil et de la dignité." },
    { id: "plante-dramatique", name: "Plante Dramatique", emoji: "🪴", cat: "maison", goof: 2, price: 19.99, bg: "var(--slime)", ducks: 3, reviews: 58,
      desc: "Soupire bruyamment quand tu oublies de l'arroser." },
    { id: "trombone-geant", name: "Trombone XXL", emoji: "📎", cat: "bureau", goof: 3, price: 17.99, bg: "var(--sky)", ducks: 4, reviews: 144,
      desc: "Pour attacher des dossiers de 3 kg. Ou ton ex." },
    { id: "boite-rien", name: "Boîte de Rien™", emoji: "📦", cat: "mystere", goof: 5, price: 4.99, bg: "var(--grape)", badge: "Culte", ducks: 5, reviews: 4242,
      desc: "Contient exactement rien. Emballage premium." },
    { id: "slip-cape", name: "Slip-Cape", emoji: "🦸", cat: "fringues", goof: 5, price: 21.99, bg: "var(--tomato)", ducks: 4, reviews: 76,
      desc: "Se porte sur le pantalon. Pouvoirs non garantis." },
    { id: "gomme-pizza", name: "Gomme Parfum Pizza", emoji: "🍕", cat: "bureau", goof: 2, price: 2.99, bg: "var(--banana)", ducks: 3, reviews: 510,
      desc: "Efface tes erreurs. Donne faim. Ne pas manger." },
    { id: "coussin-prout", name: "Coussin Prout Deluxe", emoji: "💨", cat: "maison", goof: 4, price: 8.99, bg: "var(--bubblegum)", badge: "Classique", ducks: 5, reviews: 2020,
      desc: "Version silencieuse disponible (c'est un coussin)." },
    { id: "caillou-compagnie", name: "Caillou de Compagnie", emoji: "🪨", cat: "mystere", goof: 5, price: 11.99, bg: "var(--sky)", ducks: 5, reviews: 666,
      desc: "Aucun entretien. Très bon auditeur. Livré avec certificat d'adoption." },
  ];

  const GOOF_LABELS = ["Tout me va", "Un peu bizarre", "Franchement goofy", "Débile assumé", "Chaos total"];
  const ADD_MESSAGES = [
    "Excellent choix. Enfin… choix.",
    "Ton banquier a senti une perturbation.",
    "Coin coin ! (ça veut dire bravo)",
    "Ajouté ! Ta mère serait… perplexe.",
    "Le panier a fait un petit bruit de joie.",
    "Une bêtise de plus, une tristesse de moins.",
  ];
  const FREE_SHIP = 42;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const euro = (n) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  /* ---------------- State ---------------- */
  const state = { cat: "all", goof: 1, cart: loadCart(), promo: false };

  function loadCart() {
    try { return JSON.parse(localStorage.getItem("biduloCart")) || {}; } catch { return {}; }
  }
  function saveCart() {
    try { localStorage.setItem("biduloCart", JSON.stringify(state.cart)); } catch { /* mode privé : tant pis */ }
  }

  /* ---------------- Son (klaxon WebAudio, aucun fichier) ---------------- */
  let audioCtx;
  function honk(freq = 380) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(freq, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(freq * 0.7, audioCtx.currentTime + 0.18);
      g.gain.setValueAtTime(0.06, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
      o.connect(g).connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.23);
    } catch { /* pas de son, pas de drame */ }
  }

  /* ---------------- Rendu produits ---------------- */
  const grid = $("#productGrid");
  function renderProducts() {
    const list = PRODUCTS.filter((p) => (state.cat === "all" || p.cat === state.cat) && p.goof >= state.goof);
    grid.innerHTML = list.map((p, i) => `
      <li class="card" style="--i:${i};--tilt:${i % 2 ? 1.2 : -1.2}deg">
        <div class="card__visual" style="--bg:${p.bg}">
          ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
          <span class="card__goof" title="Niveau de goofitude">${"🤪".repeat(p.goof)}<span class="sr-only"> goofitude ${p.goof} sur 5</span></span>
          <span class="card__emoji" aria-hidden="true">${p.emoji}</span>
        </div>
        <div class="card__body">
          <h3 class="card__name">${p.name}</h3>
          <p class="card__desc">${p.desc}</p>
          <p class="card__rating"><span aria-hidden="true">${"🦆".repeat(p.ducks)}</span><span class="sr-only">${p.ducks} canards sur 5</span> · ${p.reviews.toLocaleString("fr-FR")} avis</p>
          <div class="card__foot">
            <span class="card__price">${euro(p.price)}${p.old ? `<s aria-label="au lieu de ${euro(p.old)}">${euro(p.old)}</s>` : ""}</span>
            <button class="btn btn--primary" type="button" data-add="${p.id}" aria-label="Ajouter ${p.name} au panier">+ Panier</button>
          </div>
        </div>
      </li>`).join("");

    $("#emptyState").hidden = list.length > 0;
    $("#resultsCount").textContent = list.length
      ? `${list.length} bêtise${list.length > 1 ? "s" : ""} trouvée${list.length > 1 ? "s" : ""}`
      : "";
  }

  /* ---------------- Filtres ---------------- */
  $$(".chip").forEach((chip) => chip.addEventListener("click", () => {
    state.cat = chip.dataset.cat;
    $$(".chip").forEach((c) => {
      const on = c === chip;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", on);
    });
    renderProducts();
  }));

  const slider = $("#goofSlider");
  slider.addEventListener("input", () => {
    state.goof = +slider.value;
    const label = GOOF_LABELS[state.goof - 1];
    $("#goofLabel").textContent = label;
    slider.setAttribute("aria-valuetext", label);
    renderProducts();
  });
  slider.setAttribute("aria-valuetext", GOOF_LABELS[0]);

  $("#resetFilters").addEventListener("click", () => {
    slider.value = 1; slider.dispatchEvent(new Event("input"));
    $(".chip[data-cat='all']").click();
  });

  /* ---------------- Panier ---------------- */
  const cartEl = $("#cart"), overlay = $("#overlay"), cartBtn = $("#cartBtn");
  let lastFocus = null;

  function openCart() {
    lastFocus = document.activeElement;
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
    (lastFocus || cartBtn).focus();
  }
  cartBtn.addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (!cartEl.classList.contains("is-open")) return;
    if (e.key === "Escape") closeCart();
    if (e.key === "Tab") { // piège à focus
      const f = $$("button, input, [href]", cartEl).filter((el) => !el.disabled && el.offsetParent);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function addToCart(id, originEl) {
    state.cart[id] = (state.cart[id] || 0) + 1;
    saveCart(); renderCart();
    const p = PRODUCTS.find((x) => x.id === id);
    toast(`${p.emoji} ${ADD_MESSAGES[Math.floor(Math.random() * ADD_MESSAGES.length)]}`);
    honk(300 + Math.random() * 200);
    confetti(originEl, p.emoji);
    cartBtn.classList.remove("is-bumping"); void cartBtn.offsetWidth; cartBtn.classList.add("is-bumping");
  }

  function setQty(id, qty) {
    if (qty <= 0) delete state.cart[id]; else state.cart[id] = qty;
    saveCart(); renderCart();
  }

  function renderCart() {
    const entries = Object.entries(state.cart).map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id), qty })).filter((e) => e.p);
    const count = entries.reduce((s, e) => s + e.qty, 0);
    const subtotal = entries.reduce((s, e) => s + e.qty * e.p.price, 0);
    const discount = state.promo ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    $("#cartCount").textContent = count;
    cartEl.classList.toggle("is-empty", count === 0);
    $("#checkoutBtn").disabled = count === 0;

    $("#cartItems").innerHTML = entries.map(({ p, qty }) => `
      <li class="cart-item">
        <span class="cart-item__emoji" style="--bg:${p.bg}" aria-hidden="true">${p.emoji}</span>
        <div>
          <p class="cart-item__name">${p.name}</p>
          <p class="cart-item__price">${euro(p.price)} × ${qty}</p>
        </div>
        <div class="qty">
          <button type="button" data-qty="${p.id}" data-d="-1" aria-label="Retirer un ${p.name}">−</button>
          <span aria-label="Quantité">${qty}</span>
          <button type="button" data-qty="${p.id}" data-d="1" aria-label="Ajouter un ${p.name}">+</button>
        </div>
      </li>`).join("");

    $("#subtotal").textContent = euro(subtotal);
    $("#discountRow").hidden = !state.promo;
    $("#discount").textContent = "-" + euro(discount);
    $("#total").textContent = euro(total);

    const left = Math.max(0, FREE_SHIP - total);
    $("#shipMsg").textContent = left > 0
      ? `Plus que ${euro(left)} pour la livraison offerte 🚚`
      : "Livraison offerte ! Le pigeon voyageur est prévenu 🕊️";
    $("#shipBar").style.width = Math.min(100, (total / FREE_SHIP) * 100) + "%";
  }

  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("[data-qty]");
    if (b) setQty(b.dataset.qty, (state.cart[b.dataset.qty] || 0) + +b.dataset.d);
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) addToCart(b.dataset.add, b);
  });

  $("#promoForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = $("#promo").value.trim().toUpperCase();
    const msg = $("#promoMsg");
    if (code === "BANANE" || code === "🍌") {
      state.promo = true; msg.textContent = "🍌 -10 % appliqués. La banane est avec toi.";
      confetti($("#promo"), "🍌");
    } else if (code === "") {
      msg.textContent = "Tu as tapé… rien. Audacieux.";
    } else {
      state.promo = false; msg.textContent = `« ${code} » ? Jamais entendu parler. Essaie un fruit jaune.`;
    }
    renderCart();
  });

  $("#checkoutBtn").addEventListener("click", () => {
    toast("🚀 Commande envoyée ! (C'est une démo : ton caillou reste imaginaire.)");
    confetti($("#checkoutBtn"), "🎉", 30);
    state.cart = {}; state.promo = false; saveCart(); renderCart();
    $("#promo").value = ""; $("#promoMsg").textContent = "";
  });

  /* ---------------- Toasts ---------------- */
  function toast(text) {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = text;
    $("#toasts").appendChild(t);
    setTimeout(() => { t.classList.add("is-leaving"); setTimeout(() => t.remove(), 300); }, 2600);
  }

  /* ---------------- Confettis ---------------- */
  function confetti(originEl, emoji = "🎉", n = 14) {
    if (reduceMotion) return;
    const r = originEl ? originEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const pool = [emoji, "✨", "⭐", "🎉", emoji];
    for (let i = 0; i < n; i++) {
      const c = document.createElement("span");
      c.className = "confetti"; c.textContent = pool[i % pool.length];
      c.style.left = r.left + r.width / 2 + "px"; c.style.top = r.top + r.height / 2 + "px";
      document.body.appendChild(c);
      const angle = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 120;
      c.animate([
        { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist + 80}px)) rotate(${Math.random() * 720 - 360}deg) scale(1)`, opacity: 0 },
      ], { duration: 800 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => c.remove();
    }
  }

  /* ---------------- Hero : clic sur la star ---------------- */
  const heroEmojis = PRODUCTS.map((p) => p.emoji);
  let heroIdx = 0;
  $("#heroProduct").addEventListener("click", (e) => {
    heroIdx = (heroIdx + 1) % heroEmojis.length;
    e.currentTarget.textContent = heroEmojis[heroIdx];
    honk(520); confetti(e.currentTarget, heroEmojis[heroIdx], 8);
  });

  $("#randomBtn").addEventListener("click", () => {
    const cards = $$(".card");
    if (!cards.length) $("#resetFilters").click();
    const all = $$(".card");
    const pick = all[Math.floor(Math.random() * all.length)];
    pick.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    pick.animate?.([{ transform: "scale(1)" }, { transform: "scale(1.08) rotate(3deg)" }, { transform: "scale(1)" }], { duration: 600, delay: 400 });
    setTimeout(() => $(".btn", pick).focus({ preventScroll: true }), 500);
  });

  /* ---------------- Mode chaos ---------------- */
  const chaosBtn = $("#chaosToggle");
  let lastTrail = 0;
  function onMove(e) {
    const now = performance.now();
    if (now - lastTrail < 40) return;
    lastTrail = now;
    const t = document.createElement("span");
    t.className = "trail"; t.textContent = ["✨", "🍌", "🦆", "⭐"][Math.floor(Math.random() * 4)];
    t.style.left = e.clientX + "px"; t.style.top = e.clientY + "px";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 800);
  }
  chaosBtn.addEventListener("click", () => {
    const on = document.body.classList.toggle("chaos");
    chaosBtn.setAttribute("aria-pressed", on);
    if (on && !reduceMotion) document.addEventListener("pointermove", onMove);
    else document.removeEventListener("pointermove", onMove);
    toast(on ? "🌀 Mode chaos activé. Bonne chance." : "😌 Retour au calme (relatif).");
    honk(on ? 200 : 600);
  });

  /* ---------------- Newsletter ---------------- */
  $("#clubForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#email"), msg = $("#clubMsg");
    if (!input.checkValidity() || !input.value) {
      input.setAttribute("aria-invalid", "true");
      msg.textContent = "🤔 Même un canard sait écrire un e-mail valide. Réessaie !";
      input.focus();
      return;
    }
    input.removeAttribute("aria-invalid");
    msg.textContent = "🦆 Bienvenue au club ! Ton premier coin-coin arrive bientôt.";
    input.value = "";
    confetti(e.submitter, "🦆", 18);
  });

  /* ---------------- Konami ---------------- */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let k = 0;
  document.addEventListener("keydown", (e) => {
    k = e.key.toLowerCase() === KONAMI[k].toLowerCase() ? k + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (k === KONAMI.length) {
      k = 0;
      document.body.classList.toggle("upside-down");
      toast("🙃 Tu as retourné le site. Ré-appuie pour le remettre.");
    }
  });

  renderProducts();
  renderCart();
})();
