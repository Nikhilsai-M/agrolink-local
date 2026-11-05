import { leadEndpoint } from './config.js';

document.documentElement.classList.add('js');

const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="/assets/icons.svg#${name}"></use></svg>`;
const products = [
  { id: 'tomatoes', name: 'Tomatoes', price: 40, unit: 'kg', area: 'Doddaballapur area', harvest: 'Friday', description: 'Versatile red tomatoes for everyday curries, chutneys, and salads.' },
  { id: 'onions', name: 'Red onions', price: 36, unit: 'kg', area: 'Chikkaballapur area', harvest: 'Thursday', description: 'Red onions for your everyday cooking, available by the kilogram.' },
  { id: 'spinach', name: 'Spinach', price: 25, unit: 'bunch', area: 'Bengaluru Rural area', harvest: 'Friday', description: 'Leafy spinach for palak, dals, and stir-fries. Bunch weight would be specified in a live listing.' },
  { id: 'potatoes', name: 'Potatoes', price: 32, unit: 'kg', area: 'Chikkaballapur area', harvest: 'Thursday', description: 'A versatile kitchen staple for roasting, sabzis, and comforting meals.' },
  { id: 'carrots', name: 'Carrots', price: 60, unit: 'kg', area: 'Doddaballapur area', harvest: 'Friday', description: 'Orange carrots for a fresh crunch or your next vegetable curry.' },
];
const rupees = (amount) => `₹${amount.toLocaleString('en-IN')}`;
const cart = new Map();
let screen = 'home';
let selectedProduct = products[0];
let delivery = 'Saturday, 8–10 am';
let joinedGroup = false;
let confirmedPreview = false;
const app = document.querySelector('#phone-content');
const announce = document.querySelector('#demo-announcement');

function appHeader(title, description) {
  return `<p class="app-kicker">${icon('pin')} Bengaluru · Demo</p><h3 tabindex="-1">${title}</h3><p class="app-description">${description}</p>`;
}

function productCards(items) {
  return `<div class="product-grid">${items.map((product) => `
    <article class="product-card">
      <button type="button" class="product-open" data-product="${product.id}" aria-label="View ${product.name} details">
        <img src="/assets/${product.id}.webp" alt="" width="126" height="74" loading="lazy">
        <span>${product.name}</span>
      </button>
      <div class="product-price"><p><strong>${rupees(product.price)}</strong> / ${product.unit}</p>
        <button type="button" class="quantity-button" data-add="${product.id}" aria-label="Add one ${product.unit} of ${product.name}">${icon('plus')}</button>
      </div>
    </article>`).join('')}</div>`;
}

function homeScreen() {
  return `${appHeader('Good morning!', 'Your next weekly shop, closer to the farm.')}
    <div class="app-feature"><strong>A little local in every meal.</strong><span>Explore seasonal produce</span><button type="button" class="app-button" data-screen="catalog">Browse produce ${icon('arrow')}</button></div>
    <div class="app-heading-row"><h4>Seasonal picks</h4><button type="button" data-screen="catalog">View all</button></div>
    ${productCards(products.slice(0, 2))}
    <p class="fine-print" style="margin-top: 8px">Illustrative prices and growing areas.</p>`;
}

function detailScreen() {
  const product = selectedProduct;
  return `<button type="button" class="app-button secondary app-back" data-screen="catalog">${icon('back')} All produce</button>
    <img class="detail-photo" src="/assets/${product.id}.webp" alt="${product.name}" width="260" height="128">
    <h3 tabindex="-1">${product.name}</h3><p class="app-description">${rupees(product.price)} / ${product.unit} · sample price</p>
    <div class="detail-meta">
      <div>${icon('sprout')} <span><strong>Example grower listing</strong><br>${product.area}</span></div>
      <div>${icon('calendar')} <span>Expected harvest · ${product.harvest}</span></div>
    </div>
    <p>${product.description}</p>
    <button type="button" class="app-button full-width" data-add="${product.id}" style="margin-top: 10px">${icon('plus')} Add 1 ${product.unit} · ${rupees(product.price)}</button>
    <p class="fine-print" style="margin-top: 7px">Fictional listing. No farmer partnership is represented.</p>`;
}

function cartScreen() {
  if (!cart.size) {
    return `${appHeader('Your demo basket', 'Try adding a vegetable to get started.')}
      <div class="app-empty">${icon('basket')}<h4>A fresh start.</h4><p>Pick a few sample products and try the delivery picker.</p><button type="button" class="app-button" data-screen="catalog">Browse produce ${icon('arrow')}</button></div>`;
  }
  const subtotal = products.reduce((sum, product) => sum + product.price * (cart.get(product.id) || 0), 0);
  return `${appHeader('Your demo basket', 'Sample quantities and delivery windows.')}
    <div class="cart-list">${products.filter((product) => cart.has(product.id)).map((product) => `
      <div class="cart-row">
        <img src="/assets/${product.id}.webp" alt="" width="32" height="32">
        <div class="cart-item"><strong>${product.name}</strong><span>${rupees(product.price)} / ${product.unit}</span></div>
        <div class="cart-quantity">
          <button type="button" class="quantity-button" data-decrease="${product.id}" aria-label="Remove one ${product.unit} of ${product.name}">${icon('minus')}</button>
          <span aria-label="${cart.get(product.id)} ${product.unit}">${cart.get(product.id)}</span>
          <button type="button" class="quantity-button" data-add="${product.id}" aria-label="Add one ${product.unit} of ${product.name}" ${cart.get(product.id) >= 20 ? 'disabled' : ''}>${icon('plus')}</button>
        </div>
      </div>`).join('')}</div>
    <div class="cart-subtotal"><span>Produce subtotal</span><strong>${rupees(subtotal)}</strong></div>
    <p class="fine-print">Delivery fee would be shown separately in a live order.</p>
    <fieldset class="delivery-choices"><legend>Choose a sample window</legend>
      ${['Saturday, 8–10 am', 'Sunday, 8–10 am'].map((slot) => `<label><input type="radio" name="delivery" value="${slot}" ${delivery === slot ? 'checked' : ''}>${slot}</label>`).join('')}
    </fieldset>
    <button type="button" class="app-button full-width" id="preview-order">Preview this demo order ${icon('arrow')}</button>
    ${confirmedPreview ? `<p class="delivery-summary" role="status">${icon('check')} Demo summary · ${rupees(subtotal)} of produce for ${delivery}. This is a preview. No order has been placed.</p>` : ''}`;
}

function renderApp({ focusHeading = false } = {}) {
  const scroll = app.scrollTop;
  const focused = document.activeElement;
  let focusAttribute;
  let focusValue;
  if (app.contains(focused)) {
    focusAttribute = ['data-add', 'data-decrease', 'id'].find((attribute) => focused.hasAttribute(attribute));
    focusValue = focused.getAttribute(focusAttribute);
  }
  const screens = {
    home: homeScreen,
    catalog: () => `${appHeader('The local market', 'Five sample staples for your week.')}<p class="fine-print">Illustrative INR prices · no live availability</p>${productCards(products)}`,
    detail: detailScreen,
    cart: cartScreen,
  };
  app.innerHTML = screens[screen]();
  document.querySelectorAll('.phone-tabs [data-screen]').forEach((button) => {
    if (button.dataset.screen === (screen === 'detail' ? 'catalog' : screen)) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  const badge = document.querySelector('.cart-count');
  badge.textContent = count;
  badge.hidden = count === 0;
  if (focusHeading) {
    app.scrollTop = 0;
    app.querySelector('h3')?.focus({ preventScroll: true });
  } else {
    app.scrollTop = scroll;
    if (focusAttribute && focusValue) {
      const target = app.querySelector(`[${focusAttribute}="${CSS.escape(focusValue)}"]`);
      if (target) target.focus({ preventScroll: true });
      else app.querySelector('h3')?.focus({ preventScroll: true });
    }
  }
}

function changeScreen(next) {
  screen = next;
  renderApp({ focusHeading: true });
}

document.querySelector('.phone').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  if (button.dataset.screen) changeScreen(button.dataset.screen);
  if (button.dataset.product) {
    selectedProduct = products.find((product) => product.id === button.dataset.product);
    changeScreen('detail');
  }
  const id = button.dataset.add || button.dataset.decrease;
  if (id) {
    const quantity = (cart.get(id) || 0) + (button.dataset.add ? 1 : -1);
    if (quantity > 20) {
      announce.textContent = 'The sample basket allows up to 20 units of each item.';
      return;
    }
    if (quantity > 0) cart.set(id, quantity);
    else cart.delete(id);
    confirmedPreview = false;
    renderApp();
    announce.textContent = `${products.find((product) => product.id === id).name} quantity updated to ${quantity}.`;
  }
  if (button.id === 'preview-order') {
    confirmedPreview = true;
    renderApp();
    app.querySelector('.delivery-summary')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
});

app.addEventListener('change', (event) => {
  if (event.target.name !== 'delivery') return;
  delivery = event.target.value;
  confirmedPreview = false;
  app.querySelector('.delivery-summary')?.remove();
});

document.querySelectorAll('[data-shortcut]').forEach((button) => {
  button.addEventListener('click', () => {
    changeScreen(button.dataset.shortcut);
    document.querySelector('.device-stage').scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
});

document.querySelector('#group-toggle').addEventListener('click', (event) => {
  joinedGroup = !joinedGroup;
  const count = joinedGroup ? 13 : 12;
  document.querySelector('#household-count').textContent = count;
  document.querySelector('#group-count').value = count;
  document.querySelector('#group-count').textContent = `${count} of 20`;
  const button = event.currentTarget;
  button.setAttribute('aria-pressed', String(joinedGroup));
  button.innerHTML = joinedGroup ? `${icon('check')} Added in demo · click to undo` : `Try joining the sample order ${icon('arrow')}`;
  document.querySelector('#group-status').textContent = joinedGroup ? 'Sample participation added. No booking or payment has been made.' : 'This example stays in your browser session.';
});

const navigation = document.querySelector('#site-navigation');
const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
function closeMenu() {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  menuToggle.innerHTML = icon('menu');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  if (!open) return closeMenu();
  navigation.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close navigation');
  menuToggle.innerHTML = icon('close');
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.composedPath().includes(header)) closeMenu();
});
matchMedia('(min-width: 916px)').addEventListener('change', closeMenu);

const interest = document.querySelector('#interest');
document.querySelectorAll('[data-interest]').forEach((link) => {
  link.addEventListener('click', () => { interest.value = link.dataset.interest; });
});
document.querySelector('a[href="#privacy"]').addEventListener('click', () => {
  document.querySelector('#privacy').open = true;
});

const form = document.querySelector('#inquiry-form');
const fields = document.querySelector('#inquiry-fields');
const contact = document.querySelector('#contact');
const status = document.querySelector('#form-status');
let sending = false;
let pendingInquiry = null;
contact.addEventListener('input', () => contact.setCustomValidity(''));

if (leadEndpoint) {
  fields.disabled = false;
  document.querySelector('#form-notice').innerHTML = `${icon('shield')} Share your details to be contacted about the proposed Bengaluru pilot.`;
  document.querySelector('#privacy-copy').textContent = 'If you submit an inquiry, your name, contact detail, interest type, locality, optional message, and consent are sent to our configured inquiry service so the venture team can respond about the proposed pilot. Please avoid sensitive information. Submitting does not place an order or reserve a pilot slot. Your form fields are cleared only after the service confirms receipt. This site uses no analytics or advertising cookies. Hosting and inquiry providers may process technical request logs. Contact preferences and deletion requests can be raised when the team responds. The demo basket and sample community order remain in this visit’s memory.';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!leadEndpoint || sending) return;
  const value = contact.value.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const phone = value.replace(/[\s()+-]/g, '');
  const isPhone = /^(?:91)?[6-9]\d{9}$/.test(phone);
  if (!isEmail && !isPhone) {
    contact.setCustomValidity('Enter a valid email address or a 10-digit Indian mobile number, optionally prefixed with +91.');
    contact.reportValidity();
    return;
  }
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  const locality = String(data.get('locality')).trim();
  if (!name || !locality) {
    status.hidden = false;
    status.classList.add('error');
    status.textContent = 'Please include your name and locality.';
    status.focus();
    return;
  }
  const details = { name, contact: value, interest: data.get('interest'), locality, message: String(data.get('message')).trim(), consent: true };
  const key = JSON.stringify(details);
  if (pendingInquiry?.key !== key) pendingInquiry = { key, requestId: crypto.randomUUID() };
  const payload = { ...details, requestId: pendingInquiry.requestId };
  sending = true;
  fields.disabled = true;
  const submit = form.querySelector('[type="submit"]');
  submit.textContent = 'Sending inquiry…';
  status.hidden = true;
  try {
    const response = await fetch(leadEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
      credentials: 'omit',
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Receipt unconfirmed');
    form.reset();
    pendingInquiry = null;
    status.classList.remove('error');
    status.textContent = 'Your inquiry was received. Thank you for your interest in the proposed pilot.';
  } catch {
    status.classList.add('error');
    status.textContent = 'We couldn’t confirm receipt. Your details remain in the form. Please check your connection and try again.';
  } finally {
    sending = false;
    fields.disabled = false;
    submit.innerHTML = `Send pilot inquiry ${icon('arrow')}`;
    status.hidden = false;
    status.focus();
  }
});

renderApp();
