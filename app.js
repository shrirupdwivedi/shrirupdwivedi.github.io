/* ═══════════════════════════════════════════════════════════════
   AYURVEDIC LABEL GENERATOR — APP LOGIC
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM refs ─────────────────────────────────────────────────── */
const labelEl      = document.getElementById('labelEl');
const labelWrapper = document.getElementById('labelWrapper');

const $ = (id) => document.getElementById(id);

// Form inputs
const inputs = {
  brandName:     $('brandName'),
  brandTagline:  $('brandTagline'),
  productName:   $('productName'),
  productSub:    $('productSubtitle'),
  netWeight:     $('netWeight'),
  ingredients:   $('ingredients'),
  benefits:      $('benefits'),
  dosage:        $('dosage'),
  warnings:      $('warnings'),
  mfgBy:         $('mfgBy'),
  mfgAddress:    $('mfgAddress'),
  batchNo:       $('batchNo'),
  mfgDate:       $('mfgDate'),
  expDate:       $('expDate'),
  mrp:           $('mrp'),
  licNo:         $('licNo'),
  website:       $('website'),
  labelSize:     $('labelSize'),
  borderStyle:   $('borderStyle'),
};

// Label display elements
const lEl = {
  brand:       $('lBrand'),
  tagline:     $('lTagline'),
  product:     $('lProduct'),
  subtitle:    $('lSubtitle'),
  benefits:    $('lBenefits'),
  ingredients: $('lIngredients'),
  ingredientsBox: $('lIngredientsBox'),
  dosage:      $('lDosage'),
  certs:       $('lCerts'),
  weight:      $('lWeight'),
  batch:       $('lBatch'),
  mfgDate:     $('lMfgDate'),
  expDate:     $('lExpDate'),
  mrp:         $('lMrp'),
  lic:         $('lLic'),
  warnings:    $('lWarnings'),
  mfg:         $('lMfg'),
  website:     $('lWebsite'),
};

/* ── State ────────────────────────────────────────────────────── */
let currentTheme  = 'forest';
let currentZoom   = 1;

/* ── Helpers ──────────────────────────────────────────────────── */
function val(input, fallback = '') {
  return input.value.trim() || fallback;
}

function formatMonth(monthVal) {
  if (!monthVal) return '—';
  const [y, m] = monthVal.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m,10)-1]} ${y}`;
}

function getCheckedCerts() {
  return [...document.querySelectorAll('#certGrid input:checked')].map(cb => cb.value);
}

/* ── Render label ─────────────────────────────────────────────── */
function renderLabel() {
  // Brand
  const brand = val(inputs.brandName, 'Your Brand');
  lEl.brand.textContent = brand;

  // Tagline
  const tagline = val(inputs.brandTagline, '');
  lEl.tagline.textContent = tagline;
  lEl.tagline.style.display = tagline ? '' : 'none';

  // Product
  lEl.product.textContent = val(inputs.productName, 'Product Name');

  // Subtitle
  const sub = val(inputs.productSub, '');
  lEl.subtitle.textContent = sub;
  lEl.subtitle.style.display = sub ? '' : 'none';

  // Benefits
  const ben = val(inputs.benefits, '');
  lEl.benefits.textContent = ben;
  lEl.benefits.style.display = ben ? '' : 'none';

  // Ingredients
  const ingRaw = val(inputs.ingredients, '');
  if (ingRaw) {
    const lines = ingRaw.split('\n').filter(l => l.trim());
    lEl.ingredients.innerHTML = lines.map(l => escHtml(l)).join('<br/>');
    lEl.ingredientsBox.style.display = '';
  } else {
    lEl.ingredientsBox.style.display = 'none';
  }

  // Dosage
  const dos = val(inputs.dosage, '');
  const dosBox = lEl.dosage.parentElement;
  if (dos) {
    lEl.dosage.textContent = dos;
    dosBox.style.display = '';
  } else {
    dosBox.style.display = 'none';
  }

  // Certifications
  const certs = getCheckedCerts();
  lEl.certs.innerHTML = certs.map(c => `<span class="cert-badge">✓ ${certLabel(c)}</span>`).join('');
  lEl.certs.style.display = certs.length ? '' : 'none';

  // Info grid
  lEl.weight.textContent  = val(inputs.netWeight, '—');
  lEl.batch.textContent   = val(inputs.batchNo, '—');
  lEl.mfgDate.textContent = formatMonth(inputs.mfgDate.value);
  lEl.expDate.textContent = formatMonth(inputs.expDate.value);
  lEl.mrp.textContent     = val(inputs.mrp, '—');
  lEl.lic.textContent     = val(inputs.licNo, '—');

  // Warnings
  const warn = val(inputs.warnings, '');
  lEl.warnings.textContent = warn;
  lEl.warnings.style.display = warn ? '' : 'none';

  // Mfg
  const mfgName = val(inputs.mfgBy, '');
  const mfgAddr = val(inputs.mfgAddress, '');
  if (mfgName || mfgAddr) {
    lEl.mfg.innerHTML = `<strong>Mfg. by:</strong> ${escHtml(mfgName)}${mfgAddr ? ', ' + escHtml(mfgAddr) : ''}`;
    lEl.mfg.style.display = '';
  } else {
    lEl.mfg.style.display = 'none';
  }

  // Website
  const web = val(inputs.website, '');
  lEl.website.textContent = web;
  lEl.website.style.display = web ? '' : 'none';

  // Size
  const sizeMap = { small: 'size-small', medium: 'size-medium', large: 'size-large', bottle: 'size-bottle' };
  labelEl.className = labelEl.className.replace(/size-\S+/g, '').trim();
  labelEl.classList.add(sizeMap[inputs.labelSize.value] || 'size-medium');

  // Border
  const borderMap = { floral: 'border-floral', minimal: 'border-minimal', mandala: 'border-mandala', none: '' };
  labelEl.className = labelEl.className.replace(/border-\S+/g, '').trim();
  const bc = borderMap[inputs.borderStyle.value];
  if (bc) labelEl.classList.add(bc);

  // Theme (kept separate)
  applyTheme(currentTheme);
}

function certLabel(v) {
  const map = { organic:'Organic', gmp:'GMP', vegan:'Vegan', halal:'Halal', iso:'ISO', fssai:'FSSAI' };
  return map[v] || v;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── Theme ────────────────────────────────────────────────────── */
function applyTheme(theme) {
  currentTheme = theme;
  labelEl.className = labelEl.className.replace(/theme-\S+/g, '').trim();
  labelEl.classList.add(`theme-${theme}`);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

/* ── Zoom ─────────────────────────────────────────────────────── */
function updateZoom(delta) {
  currentZoom = Math.min(2, Math.max(0.3, currentZoom + delta));
  labelWrapper.style.transform = `scale(${currentZoom})`;
  $('zoomLevel').textContent = `${Math.round(currentZoom * 100)}%`;
}

/* ── Events ───────────────────────────────────────────────────── */

// Live update on any input change
Object.values(inputs).forEach(input => {
  if (!input) return;
  input.addEventListener('input', renderLabel);
  input.addEventListener('change', renderLabel);
});

// Cert checkboxes
document.querySelectorAll('#certGrid input').forEach(cb => {
  cb.addEventListener('change', renderLabel);
});

// Theme buttons
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    applyTheme(btn.dataset.theme);
  });
});

// Zoom
$('zoomIn').addEventListener('click',  () => updateZoom(+0.1));
$('zoomOut').addEventListener('click', () => updateZoom(-0.1));

// Generate button (also triggers render + scroll to preview)
$('generateBtn').addEventListener('click', () => {
  renderLabel();
  document.querySelector('.preview-canvas').scrollIntoView({ behavior: 'smooth' });
});

// Print
$('printBtn').addEventListener('click', () => {
  window.print();
});

/* ── Init ─────────────────────────────────────────────────────── */
renderLabel();
