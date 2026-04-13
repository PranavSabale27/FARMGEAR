/* ================================================
   FarmGear Connect — script.js
   All application logic: data, routing, rendering,
   cart management, filtering, and form handling.
   ================================================ */

/* ---------- SVG Icons (inline, no emoji) ---------- */
const ICONS = {
  tractor: `<svg viewBox="0 0 80 80" fill="none" stroke="#357a3b" stroke-width="2.5" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="28" width="36" height="22" rx="3"/>
    <rect x="46" y="34" width="24" height="16" rx="3"/>
    <circle cx="24" cy="54" r="12"/>
    <circle cx="24" cy="54" r="5"/>
    <circle cx="60" cy="56" r="8"/>
    <circle cx="60" cy="56" r="3"/>
    <rect x="30" y="18" width="16" height="14" rx="2"/>
    <line x1="10" y1="42" x2="46" y2="42"/>
  </svg>`,

  harvester: `<svg viewBox="0 0 80 80" fill="none" stroke="#5a7c2e" stroke-width="2.5" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="26" width="42" height="26" rx="3"/>
    <rect x="50" y="32" width="22" height="14" rx="3"/>
    <circle cx="20" cy="56" r="10"/>
    <circle cx="20" cy="56" r="4"/>
    <circle cx="60" cy="56" r="7"/>
    <circle cx="60" cy="56" r="2.5"/>
    <rect x="8" y="14" width="8" height="16"/>
    <rect x="5" y="12" width="14" height="6" rx="2"/>
    <line x1="8" y1="30" x2="50" y2="30"/>
    <line x1="50" y1="32" x2="50" y2="46"/>
  </svg>`,

  drone: `<svg viewBox="0 0 80 80" fill="none" stroke="#2a6878" stroke-width="2.5" xmlns="http://www.w3.org/2000/svg">
    <rect x="28" y="30" width="24" height="20" rx="4"/>
    <line x1="28" y1="30" x2="14" y2="22"/>
    <line x1="52" y1="30" x2="66" y2="22"/>
    <line x1="28" y1="50" x2="14" y2="58"/>
    <line x1="52" y1="50" x2="66" y2="58"/>
    <ellipse cx="14" cy="22" rx="9" ry="4"/>
    <ellipse cx="66" cy="22" rx="9" ry="4"/>
    <ellipse cx="14" cy="58" rx="9" ry="4"/>
    <ellipse cx="66" cy="58" rx="9" ry="4"/>
    <circle cx="40" cy="40" r="6"/>
    <line x1="40" y1="50" x2="40" y2="58"/>
    <line x1="35" y1="58" x2="45" y2="58"/>
  </svg>`
};

/* ---------- Equipment Data ---------- */
const equipmentData = [
  {
    id: 1,
    name: "Power Tractor 75HP",
    type: "tractor",
    status: "available",
    ratePerDay: 2200,
    description: "A high-performance 75 HP tractor built for all soil types. Features power steering, hydraulic lift, and dual-speed PTO. Fuel efficient and suitable for ploughing, sowing, and general field operations.",
    features: ["75 HP Engine", "Power Steering", "Hydraulic Lift", "Dual PTO", "Fuel Efficient"]
  },
  {
    id: 2,
    name: "Compact Tractor 40HP",
    type: "tractor",
    status: "available",
    ratePerDay: 1400,
    description: "A compact 40 HP tractor designed for small to medium farms and horticulture. Excellent maneuverability with front loader compatibility and rotary tiller support.",
    features: ["40 HP Engine", "Compact Build", "Front Loader Ready", "Horticulture Use"]
  },
  {
    id: 3,
    name: "Combine Harvester Pro",
    type: "harvester",
    status: "available",
    ratePerDay: 5500,
    description: "A state-of-the-art combine harvester capable of cutting, threshing, and cleaning grain in a single pass. Covers up to 5 acres per hour. Compatible with wheat, rice, and soybean crops.",
    features: ["5 Acres/hr", "Multi-Crop", "GPS Guided", "Auto Threshing"]
  },
  {
    id: 4,
    name: "Walk-Behind Reaper",
    type: "harvester",
    status: "unavailable",
    ratePerDay: 2600,
    description: "A lightweight walk-behind harvester ideal for paddy and small-plot harvesting. Easy to operate and transport between fields. Best suited for plots under 2 acres.",
    features: ["Paddy Specialist", "Lightweight", "Easy Transport", "Low Fuel Use"]
  },
  {
    id: 5,
    name: "Agri Spray Drone X200",
    type: "drone",
    status: "available",
    ratePerDay: 3000,
    description: "A precision agriculture drone with a 20-litre tank for pesticide and fertilizer spraying. Covers 1 acre in 10 minutes with uniform distribution. Includes 4K crop monitoring camera and auto-navigation.",
    features: ["20L Tank", "1 Acre / 10 min", "4K Camera", "Auto Navigation"]
  },
  {
    id: 6,
    name: "Survey Mapping Drone",
    type: "drone",
    status: "available",
    ratePerDay: 2000,
    description: "A lightweight survey drone for field mapping and crop health monitoring. Generates detailed NDVI maps to identify areas requiring attention. Easy to fly with a 40-minute battery life.",
    features: ["NDVI Mapping", "40 min Flight", "Obstacle Avoidance", "Lightweight"]
  }
];

/* ---------- App State ---------- */
let cart = [];         // Array of cart items
let selectedItem = null;  // Currently viewed equipment item

/* ================================================
   PAGE ROUTING
   ================================================ */

/**
 * Show a specific page and update the active nav link.
 * @param {string} pageId - One of: home, equip, detail, cart, payment, confirm, contact
 */
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  // Update active nav link
  document.querySelectorAll('.nav-item').forEach(a => a.classList.remove('active'));
  const navMap = { home: 'nav-home', equip: 'nav-equip', cart: 'nav-cart', contact: 'nav-contact' };
  if (navMap[pageId]) {
    const navEl = document.getElementById(navMap[pageId]);
    if (navEl) navEl.classList.add('active');
  }

  // Scroll to top on page change
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');

  // Trigger page-specific rendering
  if (pageId === 'equip')    renderEquipmentGrid(equipmentData);
  if (pageId === 'cart')     renderCart();
  if (pageId === 'payment')  renderPaymentSummary();
}

/* ================================================
   EQUIPMENT LISTING
   ================================================ */

/**
 * Renders the equipment cards into the grid.
 * @param {Array} list - Array of equipment objects to display
 */
function renderEquipmentGrid(list) {
  const grid    = document.getElementById('equipGrid');
  const noRes   = document.getElementById('noResults');
  const counter = document.getElementById('resultCount');

  counter.textContent = list.length + (list.length === 1 ? ' item' : ' items') + ' found';

  if (list.length === 0) {
    grid.innerHTML = '';
    noRes.style.display = 'block';
    return;
  }

  noRes.style.display = 'none';
  grid.innerHTML = list.map((item, index) => `
    <div class="equip-card" style="animation-delay: ${index * 0.06}s" onclick="viewDetail(${item.id})">
      <div class="card-visual type-${item.type}" aria-hidden="true">
        ${ICONS[item.type] || ''}
      </div>
      <div class="card-body">
        <div class="card-top">
          <span class="card-type">${capitalize(item.type)}</span>
          <span class="avail-badge ${item.status}">${item.status === 'available' ? 'Available' : 'Not Available'}</span>
        </div>
        <div class="card-name">${item.name}</div>
        <div class="card-price">Rs. ${item.ratePerDay.toLocaleString('en-IN')} <span>/ day</span></div>
        <button class="btn btn-primary" onclick="event.stopPropagation(); viewDetail(${item.id})">View Details</button>
      </div>
    </div>
  `).join('');
}

/* ---------- Filter Logic ---------- */

/**
 * Reads search input and filter dropdowns, filters equipment, re-renders grid.
 */
function filterEquipment() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const type  = document.getElementById('typeFilter').value;
  const avail = document.getElementById('availFilter').value;

  const filtered = equipmentData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(query) ||
                          item.type.toLowerCase().includes(query) ||
                          item.description.toLowerCase().includes(query);
    const matchesType  = !type  || item.type   === type;
    const matchesAvail = !avail || item.status  === avail;
    return matchesSearch && matchesType && matchesAvail;
  });

  renderEquipmentGrid(filtered);
}

/**
 * Resets all filters and re-renders the full grid.
 */
function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('typeFilter').value  = '';
  document.getElementById('availFilter').value = '';
  renderEquipmentGrid(equipmentData);
}

/* ================================================
   EQUIPMENT DETAIL
   ================================================ */

/**
 * Loads the detail page for a given equipment ID.
 * @param {number} id - Equipment ID
 */
function viewDetail(id) {
  selectedItem = equipmentData.find(e => e.id === id);
  if (!selectedItem) return;

  const isAvailable = selectedItem.status === 'available';

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-visual type-${selectedItem.type}" aria-hidden="true">
      ${ICONS[selectedItem.type] || ''}
    </div>
    <div class="detail-info">
      <div class="detail-type">${capitalize(selectedItem.type)}</div>
      <h1 class="detail-name">${selectedItem.name}</h1>
      <div class="detail-badge">
        <span class="avail-badge ${selectedItem.status}">
          ${isAvailable ? 'Available for Rent' : 'Currently Not Available'}
        </span>
      </div>
      <p class="detail-desc">${selectedItem.description}</p>
      <div class="detail-features">
        ${selectedItem.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
      </div>

      <div class="rental-box">
        <h4>Rental Duration</h4>
        <div class="rental-row">
          <label for="rentalDays">Number of Days</label>
          <input
            type="number"
            id="rentalDays"
            value="1"
            min="1"
            max="365"
            oninput="updateCostDisplay()"
            ${!isAvailable ? 'disabled' : ''}
          />
        </div>
        <div class="cost-summary">
          <span class="cost-label">Estimated Cost</span>
          <span class="cost-amount" id="totalCostDisplay">Rs. ${selectedItem.ratePerDay.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <button
        class="btn btn-primary"
        style="width: 100%; justify-content: center;"
        onclick="addToCart()"
        ${!isAvailable ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}
      >
        ${isAvailable ? 'Add to Cart' : 'Not Available for Booking'}
      </button>
    </div>
  `;

  showPage('detail');
}

/**
 * Recalculates and displays rental cost when days input changes.
 */
function updateCostDisplay() {
  if (!selectedItem) return;
  const days  = parseInt(document.getElementById('rentalDays').value, 10) || 1;
  const total = days * selectedItem.ratePerDay;
  document.getElementById('totalCostDisplay').textContent = 'Rs. ' + total.toLocaleString('en-IN');
}

/* ================================================
   CART MANAGEMENT
   ================================================ */

/**
 * Adds the currently viewed equipment item to the cart.
 */
function addToCart() {
  if (!selectedItem || selectedItem.status !== 'available') return;

  const days  = parseInt(document.getElementById('rentalDays').value, 10) || 1;
  const total = days * selectedItem.ratePerDay;

  // If item already in cart, update it instead of adding a duplicate
  const existing = cart.find(c => c.id === selectedItem.id);
  if (existing) {
    existing.days  = days;
    existing.total = total;
  } else {
    cart.push({
      id:    selectedItem.id,
      name:  selectedItem.name,
      type:  selectedItem.type,
      days:  days,
      rate:  selectedItem.ratePerDay,
      total: total
    });
  }

  updateCartBadge();
  showToast(selectedItem.name + ' added to cart.');
  showPage('equip');
}

/**
 * Removes an item from the cart by equipment ID.
 * @param {number} id - Equipment ID to remove
 */
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartBadge();
  renderCart();
  showToast('Item removed from cart.');
}

/**
 * Updates the cart count badge in the navbar.
 */
function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  badge.textContent = cart.length;
}

/**
 * Renders the cart page content based on current cart state.
 */
function renderCart() {
  const container = document.getElementById('cartContent');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is empty</h3>
        <p>Browse our equipment catalog and add items to get started.</p>
        <button class="btn btn-primary" onclick="showPage('equip')">Browse Equipment</button>
      </div>
    `;
    return;
  }

  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const advance    = Math.round(grandTotal * 0.2);

  const itemsHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-visual type-${item.type}" aria-hidden="true">
        ${ICONS[item.type] || ''}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">${item.days} day${item.days > 1 ? 's' : ''} &times; Rs. ${item.rate.toLocaleString('en-IN')}/day</div>
      </div>
      <div class="cart-item-price">Rs. ${item.total.toLocaleString('en-IN')}</div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove item" aria-label="Remove ${item.name}">&times;</button>
    </div>
  `).join('');

  const summaryLinesHTML = cart.map(item => `
    <div class="summary-line">
      <span>${item.name} (${item.days}d)</span>
      <span>Rs. ${item.total.toLocaleString('en-IN')}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items-col">
        ${itemsHTML}
      </div>
      <div>
        <div class="cart-summary">
          <h3>Order Summary</h3>
          ${summaryLinesHTML}
          <div class="summary-total">
            <span>Total</span>
            <span>Rs. ${grandTotal.toLocaleString('en-IN')}</span>
          </div>
          <div class="summary-advance">
            <span>Advance Due (20%)</span>
            <span>Rs. ${advance.toLocaleString('en-IN')}</span>
          </div>
          <p class="summary-note">Remaining balance to be paid at the time of delivery.</p>
          <button class="btn btn-primary" style="width:100%; justify-content:center;" onclick="showPage('payment')">
            Proceed to Payment
          </button>
          <button class="btn btn-ghost" style="width:100%; justify-content:center; margin-top:0.6rem;" onclick="showPage('equip')">
            Add More Equipment
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ================================================
   PAYMENT
   ================================================ */

/**
 * Renders the payment page summary panel from cart data.
 */
function renderPaymentSummary() {
  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const advance    = Math.round(grandTotal * 0.2);

  const linesHTML = cart.map(item => `
    <div class="summary-line">
      <span>${item.name} (${item.days}d)</span>
      <span>Rs. ${item.total.toLocaleString('en-IN')}</span>
    </div>
  `).join('');

  document.getElementById('paymentSummary').innerHTML = `
    ${linesHTML}
    <div class="summary-total">
      <span>Grand Total</span>
      <span>Rs. ${grandTotal.toLocaleString('en-IN')}</span>
    </div>
    <div class="advance-highlight" style="margin-top:1rem;">
      <div class="adv-label">Advance Payment Required (20%)</div>
      <div class="adv-amount">Rs. ${advance.toLocaleString('en-IN')}</div>
      <div class="adv-note">Remaining Rs. ${(grandTotal - advance).toLocaleString('en-IN')} due at delivery.</div>
    </div>
  `;
}

/**
 * Validates payment form and on success shows the confirmation page.
 */
function processPayment() {
  const name    = document.getElementById('payName').value.trim();
  const phone   = document.getElementById('payPhone').value.trim();
  const address = document.getElementById('payAddress').value.trim();
  let valid     = true;

  // Helper: set an error message and flag invalid
  const setError = (fieldId, errId, msg) => {
    document.getElementById(errId).textContent = msg;
    document.getElementById(fieldId).classList.add('is-error');
    valid = false;
  };

  // Helper: clear an error
  const clearError = (fieldId, errId) => {
    document.getElementById(errId).textContent = '';
    document.getElementById(fieldId).classList.remove('is-error');
  };

  // Validate Name
  if (!name || name.length < 2) {
    setError('payName', 'err-name', 'Please enter your full name.');
  } else {
    clearError('payName', 'err-name');
  }

  // Validate Phone (10-digit Indian mobile number)
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    setError('payPhone', 'err-phone', 'Enter a valid 10-digit mobile number starting with 6-9.');
  } else {
    clearError('payPhone', 'err-phone');
  }

  // Validate Address
  if (!address || address.length < 8) {
    setError('payAddress', 'err-address', 'Please enter your complete farm address.');
  } else {
    clearError('payAddress', 'err-address');
  }

  if (!valid) return;

  // Calculate advance
  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const advance    = Math.round(grandTotal * 0.2);

  // Generate reference ID
  const refId = 'FGC' + Date.now().toString().slice(-6).toUpperCase();

  // Populate confirmation page
  document.getElementById('confirmedName').textContent = name;
  document.getElementById('confirmedAmt').textContent  = 'Rs. ' + advance.toLocaleString('en-IN');
  document.getElementById('refId').textContent         = refId;

  // Reset cart and form
  cart = [];
  updateCartBadge();
  document.getElementById('payName').value    = '';
  document.getElementById('payPhone').value   = '';
  document.getElementById('payAddress').value = '';

  showPage('confirm');
}

/**
 * Returns to home page from confirmation screen.
 */
function goHome() {
  showPage('home');
}

/* ================================================
   CONTACT FORM
   ================================================ */

/**
 * Validates and "sends" the contact form message.
 */
function sendContactMsg() {
  const name  = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const msg   = document.getElementById('cMsg').value.trim();

  if (!name || !phone || !msg) {
    showToast('Please fill in all fields before submitting.');
    return;
  }

  // Clear the form
  document.getElementById('cName').value  = '';
  document.getElementById('cPhone').value = '';
  document.getElementById('cMsg').value   = '';

  // Show success message
  const success = document.getElementById('contactSuccess');
  success.style.display = 'block';
  setTimeout(() => { success.style.display = 'none'; }, 5000);
}

/* ================================================
   TOAST NOTIFICATIONS
   ================================================ */
let toastTimeout;

/**
 * Shows a brief notification toast at the bottom of the screen.
 * @param {string} message - The text to display
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3000);
}

/* ================================================
   MOBILE MENU
   ================================================ */

/**
 * Toggles the mobile navigation menu open/closed.
 */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

/* ================================================
   UTILITIES
   ================================================ */

/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ================================================
   INITIALIZATION
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Wire up hamburger toggle
  const hamburger = document.getElementById('hamburger');
  if (hamburger) hamburger.addEventListener('click', toggleMenu);

  // Render initial equipment grid
  renderEquipmentGrid(equipmentData);

  // Set today's minimum date for the payment date field (if it exists)
  const payDate = document.getElementById('payDate');
  if (payDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    payDate.min = tomorrow.toISOString().split('T')[0];
  }
});