/* ============================================================
   MUJER COBRA — main.js
   Navegación, idioma ES/EN, reveal on scroll, toast
   ============================================================ */

/* ── i18n strings ──────────────────────────────────────────── */
const I18N = {
  es: {
    nav_collections: "Colecciones",
    nav_shop:        "Tienda",
    nav_legacy:      "Legado",
    nav_sustain:     "Sustentabilidad",
    nav_contact:     "Contacto",
    nav_cart:        "Carrito",
    nav_inventory:   "Inventario",
    hero_eyebrow:    "Santiago · Chile",
    hero_title:      "El Arte de<br><em>Creer y Crear</em>",
    hero_sub:        "Joyería en cobre, textiles y cuadros únicos forjados a mano en Chile.",
    hero_cta1:       "Explorar colección",
    hero_cta2:       "Nuestra historia",
    hero_scroll:     "Scroll",
    phil_eyebrow:    "Nuestra Esencia",
    phil_title:      "Tres hilos que <em>tejen</em> cada pieza",
    phil1_title:     "Patrimonio",
    phil1_text:      "El cobre es memoria de Chile. Cada martillada recupera una tradición que atraviesa siglos, valles y manos.",
    phil2_title:     "Fuerza",
    phil2_text:      "La cobra se alza sin estridencia. Nuestras piezas contienen esa firmeza: silenciosa, elegante, irreductible.",
    phil3_title:     "Sustentabilidad",
    phil3_text:      "Materiales reciclados, talleres locales, procesos lentos. Creer y crear sin deuda con la tierra.",
    col_eyebrow:     "La Colección",
    col_title:       "Piezas que <em>narran</em> historias",
    product_photo_jewelry:   "Foto del producto<br>Joyería en Cobre",
    product_photo_paintings: "Foto del producto<br>Pinturas &amp; Cuadros",
    product_photo_textile:   "Foto del producto<br>Carteras de Lana",
    product_view:            "Ver pieza",
    shop_subtitle:   "Joyería · Textil · Cuadros · Hecho a mano en Chile",
    filter_all:      "Todo",
    filter_jewelry:  "Joyería",
    filter_textile:  "Textil",
    filter_paintings:"Cuadros",
    sort_default:    "Ordenar",
    sort_price_asc:  "Precio: menor a mayor",
    sort_price_desc: "Precio: mayor a menor",
    loading_products:"Cargando productos…",
    qty_label:       "Cant.",
    cart_add:        "Agregar al Carrito",
    cart_subtitle:   "Tu selección de piezas",
    loading_cart:    "Cargando carrito…",
    col1_badge:      "Obras Únicas",
    col1_num:        "I · Pinturas & Cuadros",
    col1_title:      "Los lienzos que cuentan su propia historia",
    col1_desc:       "Piezas de autor, irrepetibles, pensadas para espacios que buscan una voz propia.",
    col1_cta:        "Ver obras",
    col2_num:        "II · Joyería",
    col2_title:      "Colección Cobre",
    col2_desc:       "Aros, pulseras y collares forjados a mano. Cada pieza lleva el pulso del martillo.",
    col2_cta:        "Explorar",
    col3_num:        "III · Textil",
    col3_title:      "Carteras de Lana",
    col3_desc:       "Tejidos con lana natural. Calidez, peso justo, costuras visibles como señas de oficio.",
    col3_cta:        "Explorar",
    legado_eyebrow:  "El Legado",
    legado_title:    "Una mujer, un <em>oficio</em>, una historia chilena",
    legado_p1:       "Mujer Cobra nace de una convicción: que lo hecho a mano, con materiales nobles y tiempo honesto, sigue siendo el lujo verdadero.",
    legado_p2:       "Cada pieza sale de un taller pequeño, con nombre propio, donde el error es rastro y la repetición nunca es idéntica.",
    legado_quote:    '"Golpear el cobre es escuchar lo que la tierra quiso decir mucho antes que nosotros."',
    stat1_label:     "Cobre recuperado",
    stat2_label:     "Talleres locales",
    stat3_label:     "Producción en masa",
    sustain_eyebrow: "Sustentabilidad",
    sustain_title:   "Un oficio que <em>no cobra</em> a la tierra",
    sustain_text:    "Trabajamos con cobre recuperado, lana de productores locales y procesos que respetan el ritmo del material.",
    contact_eyebrow: "Contacto",
    contact_title:   "Conversemos sobre la <em>pieza</em> que busca",
    contact_text:    "Cada encargo comienza con una conversación. Escríbenos sobre un cuadro a medida, una pieza de joyería, un regalo significativo.",
    contact_cta:     "Escribir al atelier",
    contact_email:   "Correo",
    contact_atelier: "Atelier",
    footer_collections: "Colecciones",
    footer_jewelry:     "Joyería en Cobre",
    footer_textiles:    "Carteras de Lana",
    footer_paintings:   "Cuadros & Pinturas",
    footer_info:        "Información",
    footer_about:       "Nuestra Historia",
    footer_sustain:     "Sustentabilidad",
    footer_inventory:   "Inventario",
    footer_contact:     "Contacto",
    footer_legal:       "Legal",
    footer_privacy:     "Privacidad",
    footer_terms:       "Términos",
    footer_shipping:    "Envíos",
    footer_copy:        "© 2026 Mujer Cobra",
    footer_tagline:     "El Arte de Creer y Crear",
  },
  en: {
    nav_collections: "Collections",
    nav_shop:        "Shop",
    nav_legacy:      "Legacy",
    nav_sustain:     "Sustainability",
    nav_contact:     "Contact",
    nav_cart:        "Cart",
    nav_inventory:   "Inventory",
    hero_eyebrow:    "Santiago · Chile",
    hero_title:      "The Art of<br><em>Believing & Creating</em>",
    hero_sub:        "Handcrafted copper jewelry, textiles, and one-of-a-kind artworks forged in Chile.",
    hero_cta1:       "Explore Collection",
    hero_cta2:       "Our Story",
    hero_scroll:     "Scroll",
    phil_eyebrow:    "Our Essence",
    phil_title:      "Three threads that <em>weave</em> every piece",
    phil1_title:     "Heritage",
    phil1_text:      "Copper is Chile's memory. Each hammer strike recovers a tradition spanning centuries, valleys and hands.",
    phil2_title:     "Strength",
    phil2_text:      "The cobra rises without fanfare. Our pieces hold that firmness: silent, elegant, irreducible.",
    phil3_title:     "Sustainability",
    phil3_text:      "Recycled materials, local workshops, slow processes. Believing and creating without debt to the earth.",
    col_eyebrow:     "The Collection",
    col_title:       "Pieces that <em>tell</em> stories",
    product_photo_jewelry:   "Product photo<br>Copper Jewelry",
    product_photo_paintings: "Product photo<br>Paintings &amp; Art",
    product_photo_textile:   "Product photo<br>Wool Bags",
    product_view:            "View piece",
    shop_subtitle:   "Jewelry · Textile · Paintings · Handmade in Chile",
    filter_all:      "All",
    filter_jewelry:  "Jewelry",
    filter_textile:  "Textile",
    filter_paintings:"Paintings",
    sort_default:    "Sort",
    sort_price_asc:  "Price: low to high",
    sort_price_desc: "Price: high to low",
    loading_products:"Loading products…",
    qty_label:       "Qty",
    cart_add:        "Add to Cart",
    cart_subtitle:   "Your selection of pieces",
    loading_cart:    "Loading cart…",
    col1_badge:      "Unique Works",
    col1_num:        "I · Paintings & Art",
    col1_title:      "Canvases that tell their own story",
    col1_desc:       "Author pieces, unrepeatable, designed for spaces that seek their own voice.",
    col1_cta:        "View works",
    col2_num:        "II · Jewelry",
    col2_title:      "Copper Collection",
    col2_desc:       "Earrings, bracelets and necklaces hand-forged. Each piece carries the pulse of the hammer.",
    col2_cta:        "Explore",
    col3_num:        "III · Textile",
    col3_title:      "Wool Bags",
    col3_desc:       "Woven with natural wool. Warmth, just weight, visible seams as marks of craft.",
    col3_cta:        "Explore",
    legado_eyebrow:  "The Legacy",
    legado_title:    "A woman, a <em>craft</em>, a Chilean story",
    legado_p1:       "Mujer Cobra was born from a conviction: that what is made by hand, with noble materials and honest time, remains the true luxury.",
    legado_p2:       "Each piece comes from a small workshop, with a proper name, where error is a trace and repetition is never identical.",
    legado_quote:    '"Striking copper is listening to what the earth wanted to say long before us."',
    stat1_label:     "Recovered copper",
    stat2_label:     "Local workshops",
    stat3_label:     "Mass production",
    sustain_eyebrow: "Sustainability",
    sustain_title:   "A craft that <em>doesn't cost</em> the earth",
    sustain_text:    "We work with recovered copper, wool from local producers and processes that respect the rhythm of the material.",
    contact_eyebrow: "Contact",
    contact_title:   "Let's talk about the <em>piece</em> you seek",
    contact_text:    "Every commission begins with a conversation. Write to us about a custom painting, a jewelry piece, a meaningful gift.",
    contact_cta:     "Write to the atelier",
    contact_email:   "Email",
    contact_atelier: "Atelier",
    footer_collections: "Collections",
    footer_jewelry:     "Copper Jewelry",
    footer_textiles:    "Wool Bags",
    footer_paintings:   "Paintings & Art",
    footer_info:        "Information",
    footer_about:       "Our Story",
    footer_sustain:     "Sustainability",
    footer_inventory:   "Inventory",
    footer_contact:     "Contact",
    footer_legal:       "Legal",
    footer_privacy:     "Privacy",
    footer_terms:       "Terms",
    footer_shipping:    "Shipping",
    footer_copy:        "© 2026 Mujer Cobra",
    footer_tagline:     "The Art of Believing & Creating",
  }
};

/* ── State ─────────────────────────────────────────────────── */
let currentLang = localStorage.getItem('mc-lang') || 'es';

/* ── Apply language ────────────────────────────────────────── */
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('mc-lang', lang);
  const t = I18N[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.documentElement.lang = lang;
}

/* ── Navigation scroll ─────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const hamburger = nav.querySelector('.nav-hamburger');
  const navLinks  = nav.querySelector('.nav-links');
  if (hamburger && navLinks) {
    // En móvil, mover nav-links al body evita el bug de position:fixed anidado
    // (Chrome/Safari tratan backdrop-filter y fixed parents como containing block)
    const mq = window.matchMedia('(max-width: 900px)');
    function relocate(e) {
      if (e.matches) {
        if (navLinks.parentElement !== document.body) document.body.appendChild(navLinks);
      } else {
        if (navLinks.parentElement !== nav) nav.insertBefore(navLinks, hamburger);
      }
    }
    mq.addEventListener('change', relocate);
    relocate(mq);

    let _scrollY = 0;
    function openMenu() {
      _scrollY = window.scrollY;
      navLinks.classList.add('open');
      hamburger.classList.add('open');
      // Bloqueo de scroll compatible con iOS Safari
      document.body.style.top = `-${_scrollY}px`;
      document.body.classList.add('menu-open');
    }
    function closeMenu() {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
      window.scrollTo(0, _scrollY);
    }

    hamburger.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
    const closeBtn = navLinks.querySelector('.nav-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
}

/* ── Reveal on scroll ──────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Toast notification ────────────────────────────────────── */
function showToast(msg, icon = '✓') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon"></span><span class="toast-msg"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-icon').textContent = icon;
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ── Update cart badge ─────────────────────────────────────── */
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('mc-cart') || '[]');
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  applyLang(currentLang);
  updateCartBadge();
});

// Export for other scripts
window.MC = { showToast, updateCartBadge, applyLang, I18N, get lang() { return currentLang; } };
