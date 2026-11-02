/* ===== CONFIGURAÇÕES CENTRALIZADAS — decolaprint ===== */
const CONFIG = {
  whatsapp: "5588993430217", // (88) 9 9343-0217
  instagram: "https://instagram.com/decolaprint",
  produtos: [
    "Cartão de Visita",
    "Panfletos",
    "Banners & Lonas",
    "Adesivos",
    "Embalagens",
    "Fachadas"
  ]
};
/* ====================================================== */

// Ícones ilustrativos (24x24) com detalhe em magenta (.pop)
const ICONS = {
  "Cartão de Visita": '<rect x="3" y="6" width="18" height="12" rx="1.5"/><path class="pop" d="M6.5 10h5M6.5 13h3"/><circle cx="16.5" cy="11.5" r="1.5"/>',
  "Panfletos": '<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v3h3"/><path class="pop" d="M9 11h6M9 14h6M9 17h4"/>',
  "Banners & Lonas": '<path d="M4 4h16v12H4z"/><path class="pop" d="M8 8h8M8 12h5"/><path d="M8 16v5M16 16v5"/>',
  "Adesivos": '<path d="M5 4h14v10l-6 6H5z"/><path class="pop" d="M19 14h-6v6"/><circle cx="10" cy="9" r="1.5"/>',
  "Embalagens": '<path d="M12 3l8 4v10l-8 4-8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/><path class="pop" d="M8 5l8 4"/>',
  "Fachadas": '<path d="M3 21h18M5 21V9M19 21V9"/><path d="M3 9l1.5-5h15L21 9z"/><path class="pop" d="M9 21v-6h6v6"/>',
  "Brindes": '<rect x="4" y="8" width="16" height="13" rx="1"/><path d="M12 8v13M4 12h16"/><path class="pop" d="M12 8c-2-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3-2-5 1z"/>'
};

const wa = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

// Configura link do Instagram
const igLink = document.getElementById("ig");
if (igLink && CONFIG.instagram) {
  igLink.href = CONFIG.instagram;
}

// Renderiza os cards do Portfólio
const grid = document.getElementById("grid");
CONFIG.produtos.forEach((nome, i) => {
  const card = document.createElement("article");
  card.className = "card";
  card.style.setProperty("--d", (i % 3) * 90 + "ms");
  const svgIcon = ICONS[nome] || ICONS["Cartão de Visita"];
  card.innerHTML = `
    <div class="ph" role="img" aria-label="Ilustração de ${nome}">
      <svg viewBox="0 0 24 24" aria-hidden="true" preserveAspectRatio="xMidYMid meet">${svgIcon}</svg>
    </div>
    <div class="bd">
      <h3>${nome}</h3>
      <a target="_blank" rel="noopener" href="${wa(`Olá! Vi o site da decolaprint e gostaria de um orçamento para ${nome}.`)}">Orçar este material ↗</a>
    </div>`;
  grid.appendChild(card);
});

// Links diretos de WhatsApp (hero e rodapé)
document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = wa(a.dataset.wa);
  a.target = "_blank";
  a.rel = "noopener";
});

// Etiquetas interativas do Hero: selecionam o material no formulário e rolam até lá
const materialSelect = document.getElementById("materialSelect");
document.querySelectorAll(".tags li").forEach((li, i) => {
  li.style.setProperty("--i", i);
  li.addEventListener("click", () => {
    const mat = li.dataset.mat;
    if (materialSelect && mat) {
      materialSelect.value = mat;
    }
    const orcamentoSec = document.getElementById("orcamento");
    if (orcamentoSec) {
      orcamentoSec.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => document.querySelector('input[name="nome"]')?.focus(), 550);
    }
  });
});

// Máscara automática para o campo de WhatsApp no formulário
const whatsInput = document.getElementById("whatsInput");
if (whatsInput) {
  whatsInput.addEventListener("input", e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 7) {
      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    e.target.value = v;
  });
}

// Envio do Formulário -> WhatsApp
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const [nome, whats, material] = ["nome", "whats", "material"].map(k => (f.get(k) || "").trim());
  const err = document.getElementById("err");
  if (!nome || !whats || !material) {
    err.hidden = false;
    return;
  }
  err.hidden = true;
  const btn = e.target.querySelector(".btn");
  const label = btn.firstElementChild;
  const old = label.textContent;
  btn.classList.add("busy");
  label.textContent = "Abrindo WhatsApp…";
  window.open(
    wa(`Olá! Vi o site da decolaprint e gostaria de um orçamento para ${material}.\nNome: ${nome}\nMeu WhatsApp: ${whats}`),
    "_blank",
    "noopener"
  );
  setTimeout(() => {
    btn.classList.remove("busy");
    label.textContent = old;
  }, 2500);
});

// Animação de entrada por rolagem (IntersectionObserver)
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) {
    en.target.classList.add("in");
    io.unobserve(en.target);
  }
}), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll("[data-reveal], .card").forEach(el => io.observe(el));

// Scroll Spy: destaca o link ativo no menu conforme a seção visível
const links = [...document.querySelectorAll(".top nav a")];
const secs = links.map(a => document.querySelector(a.hash));
const spy = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) {
    links.forEach(a => a.classList.toggle("active", a.hash === "#" + en.target.id));
  }
}), { rootMargin: "-45% 0px -50% 0px" });
secs.forEach(s => s && spy.observe(s));

// Header inteligente: recolhe ao descer, reaparece ao subir
const topBar = document.querySelector(".top");
let lastY = scrollY, ticking = false;
addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = Math.max(scrollY, 0), d = y - lastY;
    topBar.classList.toggle("stuck", y > 8);
    if (Math.abs(d) > 6) {
      topBar.classList.toggle("hide", d > 0 && y > 120);
      lastY = y;
    }
    ticking = false;
  });
}, { passive: true });

links.forEach(a => a.addEventListener("click", () => setTimeout(() => topBar.classList.remove("hide"), 50)));
