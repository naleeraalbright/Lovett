/**
 * LOVETT ARTISAN BOTANICALS - E-COMMERCE CORE SCRIPT
 * Manages cart state, localStorage, WhatsApp integration, modals, and quizzes.
 */

(function () {
  'use strict';

  // --- Product Catalog Master Data ---
  const PRODUCTS = {
    'aloe-vera': {
      id: 'aloe-vera',
      name: 'Love it Aloe vera soap',
      price: 5000,
      weight: '100g',
      thumbClass: 'thumb-aloe',
      image: 'images/aloe-vera-soap.jpg',
      tagline: 'Hydrating & Soothing Daily Bath Bar',
      badge: 'Daily Essential',
      badgeType: 'badge-green',
      icon: '🌿',
      description: 'Made of the nature leaves. Good for your everyday bathing routine, helps your skin feel comfortable and deeply moisturized.',
      ingredients: 'Fresh Aloe Vera Leaf Gel, Saponified Olive & Coconut Oils, Shea Butter, Plant-derived Glycerin, Spring Water.',
      usage: 'Lather between wet palms or a washcloth, gently massage over skin during your daily shower, and rinse with lukewarm water.',
      suitability: 'Normal, dry, sensitive, and sun-exposed skin types. Excellent for whole-family daily bathing.',
      caution: null
    },
    'turmeric': {
      id: 'turmeric',
      name: 'Love it Turmeric soap',
      price: 7000,
      weight: '100g',
      thumbClass: 'thumb-turmeric',
      image: 'images/turmeric-soap.jpg',
      tagline: 'Brightening & Skin Toning Herbal Bar',
      badge: 'Radiance & Tone',
      badgeType: 'badge-yellow',
      icon: '✨',
      description: 'Made with turmeric roots for brightening and toning skin. A good choice to add up in your bathing routine for an even, radiant complexion.',
      ingredients: 'Organic Ugandan Turmeric Root Extract, Curcumin Infusion, Cold-Pressed Palm Kernel Oil, Sweet Almond Oil, Natural Vitamin E.',
      usage: 'Work into a golden lather. Massage onto damp skin focusing on areas with dark marks or hyperpigmentation. Leave for 1 minute before rinsing thoroughly.',
      suitability: 'Normal to oily skin, uneven skin tone, sun spots, and dull skin looking for everyday natural brightening.',
      caution: null
    },
    'black-soap': {
      id: 'black-soap',
      name: 'Love it African Black soap',
      price: 10000,
      weight: '100g',
      thumbClass: 'thumb-black',
      image: 'images/african-black-soap.jpg',
      tagline: 'Traditional Deep Cleansing & Clarifying Bar',
      badge: 'Deep Purifier',
      badgeType: 'badge-dark',
      icon: '🌍',
      description: 'Made with traditional ingredients for cleansing, removes oils and dirt leaving the skin feeling fresh and thoroughly clarified.',
      ingredients: 'Roasted Cocoa Pod Ash, Plantain Skin Potash, Unrefined Virgin Palm Kernel Oil, Raw Shea Butter, Purified Mountain Water.',
      usage: 'Lather between hands to create a rich dark foam. Gently cleanse the face and body. Rinse immediately with cool water and follow up with a rich moisturizer.',
      suitability: 'Oily skin, combination skin, blemishes, back acne, and congested pores.',
      caution: '*Note* Not good for dry skins. The natural potash ash deeply breaks down oils, which can cause excessive tightness on naturally dry skin.'
    },
    'trio-bundle': {
      id: 'trio-bundle',
      name: 'The Complete Lovett Trio Bundle (All 3 Bars)',
      price: 20000,
      weight: '300g (3 x 100g)',
      thumbClass: 'thumb-aloe',
      image: 'images/lovett-trio-soaps.jpg',
      tagline: 'Aloe Vera + Turmeric + African Black Soap',
      badge: 'Bundle Special',
      badgeType: 'badge-yellow',
      icon: '🎁',
      description: 'The ultimate 3-step botanical bath set: Aloe Vera for morning comfort, Turmeric for daytime radiance, and African Black Soap for weekend deep cleansing.',
      ingredients: 'Contains 1x Love it Aloe Vera (100g), 1x Love it Turmeric (100g), 1x Love it African Black Soap (100g).',
      usage: 'Use Aloe Vera daily, Turmeric 3-4 times a week for tone, and African Black Soap weekly for deep clarifying detox.',
      suitability: 'The versatile household combination covering every skin need.',
      caution: 'Observe Black Soap caution: do not use on dry skin zones.'
    }
  };

  // --- Configuration ---
  const WHATSAPP_NUMBER = '256761506828'; // Lovett official WhatsApp number (0761506828)
  const FREE_SHIPPING_THRESHOLD = 35000;  // UGX

  // --- State ---
  let cart = [];
  let discountPercent = 0; // percentage
  let activePromoCode = '';

  // --- DOM Elements ---
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const drawerItemCount = document.getElementById('drawerItemCount');
  const cartSubtotalText = document.getElementById('cartSubtotalText');
  const cartDeliveryText = document.getElementById('cartDeliveryText');
  const cartGrandTotalText = document.getElementById('cartGrandTotalText');
  const discountLine = document.getElementById('discountLine');
  const discountPercentText = document.getElementById('discountPercentText');
  const cartDiscountText = document.getElementById('cartDiscountText');
  const deliveryZoneSelect = document.getElementById('deliveryZoneSelect');
  const shippingProgressBar = document.getElementById('shippingProgressBar');
  const shippingProgressText = document.getElementById('shippingProgressText');
  const promoInput = document.getElementById('promoInput');
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const promoMessage = document.getElementById('promoMessage');
  const orderViaWhatsAppBtn = document.getElementById('orderViaWhatsAppBtn');
  const openCheckoutModalBtn = document.getElementById('openCheckoutModalBtn');

  // Checkout Dialog
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckoutModalBtn = document.getElementById('closeCheckoutModalBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutItemCount = document.getElementById('checkoutItemCount');
  const checkoutPayableTotal = document.getElementById('checkoutPayableTotal');
  const checkoutWhatsappAlternativeBtn = document.getElementById('checkoutWhatsappAlternativeBtn');

  // Quick View Dialog
  const quickViewModal = document.getElementById('quickViewModal');
  const closeQuickViewBtn = document.getElementById('closeQuickViewBtn');
  const quickViewBody = document.getElementById('quickViewBody');

  // Mobile Nav
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavMenu = document.getElementById('mobileNavMenu');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // --- Storage Helpers ---
  function loadCart() {
    try {
      const saved = localStorage.getItem('lovett_cart_v1');
      if (saved) {
        cart = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Unable to read cart from localStorage', e);
      cart = [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem('lovett_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.warn('Unable to save cart to localStorage', e);
    }
  }

  // --- Currency Formatter ---
  function formatUGX(num) {
    return new Intl.NumberFormat('en-UG').format(num) + ' UGX';
  }

  // --- Toast Feedback ---
  function showToast(message, icon = '🌿') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // --- Cart Calculations ---
  function getSubtotal() {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  function getDeliveryFee() {
    const subtotal = getSubtotal();
    const baseFee = parseInt(deliveryZoneSelect ? deliveryZoneSelect.value : 3000, 10);
    // If subtotal qualifies for free local delivery and baseFee is standard local (<= 5000)
    if (subtotal >= FREE_SHIPPING_THRESHOLD && baseFee <= 5000 && baseFee > 0) {
      return 0; // Free delivery incentive!
    }
    return isNaN(baseFee) ? 3000 : baseFee;
  }

  function getDiscountAmount() {
    if (discountPercent <= 0) return 0;
    const subtotal = getSubtotal();
    return Math.round(subtotal * (discountPercent / 100));
  }

  function getGrandTotal() {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    const discount = getDiscountAmount();
    const delivery = getDeliveryFee();
    return Math.max(0, subtotal - discount + delivery);
  }

  // --- Render Cart Drawer ---
  function renderCart() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const delivery = getDeliveryFee();
    const grandTotal = getGrandTotal();

    // Badges & Counters
    if (cartCountBadge) cartCountBadge.textContent = totalItems;
    if (drawerItemCount) drawerItemCount.textContent = `(${totalItems} ${totalItems === 1 ? 'bar' : 'bars'})`;

    // Free delivery progress calculation
    if (shippingProgressBar && shippingProgressText) {
      if (subtotal === 0) {
        shippingProgressBar.style.width = '0%';
        shippingProgressText.textContent = `Add ${formatUGX(FREE_SHIPPING_THRESHOLD)} for Free Delivery`;
      } else if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingProgressBar.style.width = '100%';
        shippingProgressText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked Free Kampala Delivery!`;
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        shippingProgressBar.style.width = `${percent}%`;
        shippingProgressText.textContent = `Add ${formatUGX(remaining)} more for Free Kampala Delivery!`;
      }
    }

    // Render items list
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-cart-icon">🧺</div>
          <h4>Your Lovett Basket is Empty</h4>
          <p>Treat your skin to our fresh Aloe Vera, Turmeric, or African Black soap bars.</p>
          <button class="btn btn-primary btn-sm" id="emptyCartShopBtn">Explore Soaps</button>
        </div>
      `;
      const emptyBtn = document.getElementById('emptyCartShopBtn');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => {
          closeCart();
          const target = document.getElementById('products');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
      }
    } else {
      cartItemsContainer.innerHTML = cart.map(item => {
        const lineTotal = item.price * item.quantity;
        return `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-thumb ${item.thumbClass || 'thumb-aloe'}">
              ${item.image ? `<img src="${item.image}" alt="${item.name}" class="cart-item-img">` : `<span>${item.icon || '🧼'}</span>`}
            </div>
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <div class="cart-item-unit-price">${formatUGX(item.price)} • ${item.weight || '100g'}</div>
              <div class="cart-item-qty-row">
                <button type="button" class="cart-qty-btn cart-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="cart-qty-val">${item.quantity}</span>
                <button type="button" class="cart-qty-btn cart-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div class="cart-item-total-col">
              <span class="cart-item-line-total">${formatUGX(lineTotal)}</span>
              <button type="button" class="cart-item-remove-btn" data-id="${item.id}">Remove</button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Update Totals
    if (cartSubtotalText) cartSubtotalText.textContent = formatUGX(subtotal);

    if (discountLine && cartDiscountText) {
      if (discount > 0) {
        discountLine.hidden = false;
        if (discountPercentText) discountPercentText.textContent = `${discountPercent}%`;
        cartDiscountText.textContent = `-${formatUGX(discount)}`;
      } else {
        discountLine.hidden = true;
      }
    }

    if (cartDeliveryText) {
      if (subtotal === 0) {
        cartDeliveryText.textContent = '0 UGX';
      } else if (delivery === 0) {
        cartDeliveryText.innerHTML = '<span style="color: var(--green-primary); font-weight:700;">FREE Delivery!</span>';
      } else {
        cartDeliveryText.textContent = formatUGX(delivery);
      }
    }

    if (cartGrandTotalText) {
      cartGrandTotalText.textContent = formatUGX(grandTotal);
    }
  }

  // --- Cart Modification Logic ---
  function addToCart(productId, quantity = 1) {
    const product = PRODUCTS[productId];
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        icon: product.icon,
        image: product.image,
        thumbClass: product.thumbClass,
        quantity: quantity
      });
    }

    saveCart();
    renderCart();
    showToast(`Added ${quantity}x ${product.name} to your cart!`, product.icon);
    openCart();
  }

  function updateCartQuantity(productId, delta) {
    const index = cart.findIndex(item => item.id === productId);
    if (index === -1) return;

    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    saveCart();
    renderCart();
  }

  function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    renderCart();
    if (item) {
      showToast(`Removed ${item.name} from cart`, '🗑️');
    }
  }

  // --- Cart Drawer Open/Close ---
  function openCart() {
    if (!cartDrawer || !cartDrawerBackdrop) return;
    cartDrawer.classList.add('open');
    cartDrawerBackdrop.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartDrawerBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (!cartDrawer || !cartDrawerBackdrop) return;
    cartDrawer.classList.remove('open');
    cartDrawerBackdrop.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartDrawerBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // --- Promo Code System ---
  function applyPromo(code) {
    const cleaned = code.trim().toUpperCase();
    if (!cleaned) {
      showPromoMessage('Please enter a promo code.', 'error');
      return;
    }

    if (cleaned === 'LOVETT10' || cleaned === 'NATURAL10') {
      discountPercent = 10;
      activePromoCode = cleaned;
      showPromoMessage('✓ 10% discount applied to your order!', 'success');
      renderCart();
    } else if (cleaned === 'FREESHIP') {
      discountPercent = 5;
      activePromoCode = cleaned;
      showPromoMessage('✓ Special discount applied!', 'success');
      renderCart();
    } else {
      showPromoMessage('Invalid or expired promo code.', 'error');
    }
  }

  function showPromoMessage(msg, type) {
    if (!promoMessage) return;
    promoMessage.hidden = false;
    promoMessage.textContent = msg;
    promoMessage.className = `promo-message ${type}`;
  }

  // --- WhatsApp Order Link Generator ---
  function buildWhatsAppOrderMessage(customerDetails = null) {
    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const delivery = getDeliveryFee();
    const grandTotal = getGrandTotal();
    const selectedZoneText = deliveryZoneSelect ? deliveryZoneSelect.options[deliveryZoneSelect.selectedIndex].text : 'Kampala';

    let lines = [];
    lines.push('🌿 *NEW ORDER - LOVETT BOTANICALS* 🌿');
    lines.push('----------------------------------------');

    if (cart.length === 0) {
      lines.push('I would like to inquire about purchasing Lovett natural soaps.');
    } else {
      lines.push('*Selected Soaps:*');
      cart.forEach((item, idx) => {
        lines.push(`${idx + 1}. ${item.name} (${item.weight})`);
        lines.push(`   Qty: ${item.quantity} × ${formatUGX(item.price)} = *${formatUGX(item.price * item.quantity)}*`);
      });
      lines.push('----------------------------------------');
      lines.push(`• Subtotal: ${formatUGX(subtotal)}`);
      if (discount > 0) {
        lines.push(`• Discount (${discountPercent}%): -${formatUGX(discount)} [Code: ${activePromoCode}]`);
      }
      lines.push(`• Delivery: ${formatUGX(delivery)} (${selectedZoneText})`);
      lines.push(`• *Total Payable: ${formatUGX(grandTotal)}*`);
      lines.push(`• *MTN MoMo Merchant Code:* 41977046 (Dial *165*3#)`);
    }

    if (customerDetails) {
      lines.push('----------------------------------------');
      lines.push('*Customer Details:*');
      lines.push(`• Name: ${customerDetails.name}`);
      lines.push(`• Phone: ${customerDetails.phone}`);
      lines.push(`• Delivery Address: ${customerDetails.address}`);
      lines.push(`• Payment Method: ${customerDetails.payment}`);
      if (customerDetails.payment && customerDetails.payment.includes('MTN')) {
        lines.push(`• MTN Merchant Code: *41977046*`);
      }
      if (customerDetails.notes) {
        lines.push(`• Notes: ${customerDetails.notes}`);
      }
    }

    lines.push('----------------------------------------');
    lines.push('Please confirm availability and dispatch schedule. Thank you!');

    return lines.join('\n');
  }

  function openWhatsAppOrder(customerDetails = null) {
    if (cart.length === 0) {
      showToast('Please add at least one soap to your cart first!', '⚠️');
      return;
    }
    const message = buildWhatsAppOrderMessage(customerDetails);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // --- Direct WhatsApp Buy for single product ---
  function directWhatsAppBuySingle(productId, qty = 1) {
    const product = PRODUCTS[productId];
    if (!product) return;

    const total = product.price * qty;
    const msg = [
      '🌿 *QUICK ORDER - LOVETT BOTANICALS* 🌿',
      `I would like to order:`,
      `• *${product.name}* (${product.weight})`,
      `• Quantity: ${qty}`,
      `• Total: *${formatUGX(total)}*`,
      '',
      'Please let me know how soon you can deliver in Kampala/Uganda. Thank you!'
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // --- Quick View Modal Generator ---
  function openQuickView(productId) {
    const product = PRODUCTS[productId];
    if (!product || !quickViewModal || !quickViewBody) return;

    let cautionHtml = '';
    if (product.caution) {
      cautionHtml = `
        <div class="product-caution-notice" style="margin: 1rem 0;">
          <div class="caution-header">
            <span class="caution-icon">⚠️</span>
            <strong>Important Skin Precaution:</strong>
          </div>
          <p>${product.caution}</p>
        </div>
      `;
    }

    quickViewBody.innerHTML = `
      <div class="quick-view-visual-wrap">
        ${product.image ? `<img src="${product.image}" alt="${product.name}" class="quick-view-real-img">` : `
        <div class="soap-visual ${product.thumbClass === 'thumb-aloe' ? 'soap-visual-aloe' : product.thumbClass === 'thumb-turmeric' ? 'soap-visual-turmeric' : 'soap-visual-black'}">
          <div class="soap-emboss">
            <span class="emboss-brand">LOVE IT</span>
            <span class="emboss-type">${product.name.replace('Love it ', '').toUpperCase()}</span>
            <span class="emboss-leaf">${product.icon}</span>
          </div>
        </div>`}
      </div>
      <div class="quick-view-info">
        <span class="product-badge ${product.badgeType}">${product.badge}</span>
        <h2 id="quickViewTitle">${product.name}</h2>
        <div class="quick-view-tagline">${product.tagline}</div>
        <div class="quick-view-price">${formatUGX(product.price)} <small style="font-size:0.9rem; font-weight:normal; color:var(--text-muted);">/ ${product.weight}</small></div>
        
        <p class="quick-view-details">${product.description}</p>
        ${cautionHtml}

        <div style="margin-bottom: 1rem; font-size: 0.875rem;">
          <strong>Key Botanical Ingredients:</strong>
          <p style="color: var(--text-secondary); margin-top: 0.2rem;">${product.ingredients}</p>
        </div>

        <div style="margin-bottom: 1.5rem; font-size: 0.875rem;">
          <strong>How to Use in Bathing:</strong>
          <p style="color: var(--text-secondary); margin-top: 0.2rem;">${product.usage}</p>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-primary" id="quickViewAddBtn" data-id="${product.id}">
            Add to Cart (${formatUGX(product.price)})
          </button>
          <button class="btn btn-whatsapp-direct" id="quickViewWaBtn" data-id="${product.id}">
            Buy via WhatsApp
          </button>
        </div>
      </div>
    `;

    // Bind Quick View Buttons
    const addBtn = document.getElementById('quickViewAddBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addToCart(product.id, 1);
        quickViewModal.close();
      });
    }

    const waBtn = document.getElementById('quickViewWaBtn');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        directWhatsAppBuySingle(product.id, 1);
        quickViewModal.close();
      });
    }

    quickViewModal.showModal();
  }

  // --- Routine Matcher Quiz Logic ---
  function runRoutineQuiz() {
    const skinTypeEl = document.getElementById('quizSkinType');
    const goalEl = document.getElementById('quizGoal');
    const resultBox = document.getElementById('quizResultBox');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const resultAddBtn = document.getElementById('resultAddBtn');

    if (!skinTypeEl || !goalEl || !resultBox) return;

    const skin = skinTypeEl.value;
    const goal = goalEl.value;

    let match = {
      productId: 'aloe-vera',
      title: 'Love it Aloe Vera Soap (5,000 UGX)',
      explanation: 'Based on your skin profile, gentle comfort and cellular hydration are essential. Made of whole aloe vera leaves, this bar restores moisture barriers without stripping delicate oils.'
    };

    if (skin === 'dry') {
      // African black soap must NEVER be recommended for dry skin
      if (goal === 'brighten') {
        match = {
          productId: 'turmeric',
          title: 'Love it Turmeric Soap (7,000 UGX)',
          explanation: 'Turmeric roots provide gentle skin toning and radiance. We recommend pairing it with a rich moisturizer because your skin is on the drier side.'
        };
      } else {
        match = {
          productId: 'aloe-vera',
          title: 'Love it Aloe Vera Soap (5,000 UGX)',
          explanation: 'Your skin is dry or sensitive. The soothing botanical aloe leaves help your skin feel deeply moisturized, supple, and comfortable after every daily wash.'
        };
      }
    } else if (skin === 'oily') {
      if (goal === 'deep-cleanse') {
        match = {
          productId: 'black-soap',
          title: 'Love it African Black Soap (10,000 UGX)',
          explanation: 'A perfect match! Your oily skin will thrive with traditional plantain ash and cocoa pod clarifying power, removing excess grease, daily grime, and clogged pores.'
        };
      } else if (goal === 'brighten') {
        match = {
          productId: 'turmeric',
          title: 'Love it Turmeric Soap (7,000 UGX)',
          explanation: 'Turmeric root helps balance oiliness while visibly fading dark marks and boosting natural clarity.'
        };
      } else {
        match = {
          productId: 'aloe-vera',
          title: 'Love it Aloe Vera Soap (5,000 UGX)',
          explanation: 'A balanced gentle everyday choice that hydrates without adding heavy oils.'
        };
      }
    } else if (skin === 'dull' || goal === 'brighten') {
      match = {
        productId: 'turmeric',
        title: 'Love it Turmeric Soap (7,000 UGX)',
        explanation: 'Enriched with authentic turmeric roots known for evening skin tone and awakening dull, sun-tired complexions.'
      };
    } else if (goal === 'deep-cleanse') {
      // Combination
      match = {
        productId: 'black-soap',
        title: 'Love it African Black Soap (10,000 UGX)',
        explanation: 'Ideal for purifying T-zone oiliness and deep dirt. Note: Apply primarily to oily zones and rinse promptly to preserve dry zones.'
      };
    }

    resultTitle.textContent = match.title;
    resultText.textContent = match.explanation;
    resultBox.hidden = false;

    if (resultAddBtn) {
      resultAddBtn.onclick = function () {
        addToCart(match.productId, 1);
      };
    }

    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // --- Direct Checkout Modal Handler ---
  function openCheckout() {
    if (cart.length === 0) {
      showToast('Your cart is empty. Please add soaps first!', '⚠️');
      return;
    }
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const grandTotal = getGrandTotal();

    if (checkoutItemCount) checkoutItemCount.textContent = `${totalItems} bars`;
    if (checkoutPayableTotal) checkoutPayableTotal.textContent = formatUGX(grandTotal);

    closeCart();
    if (checkoutModal) checkoutModal.showModal();
  }

  // --- Attach Global Event Listeners ---
  function initEvents() {
    // Open & Close Cart Drawer
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartDrawerBackdrop) cartDrawerBackdrop.addEventListener('click', closeCart);

    // ESC key closes modals & drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (cartDrawer && cartDrawer.classList.contains('open')) closeCart();
        if (checkoutModal && checkoutModal.open) checkoutModal.close();
        if (quickViewModal && quickViewModal.open) quickViewModal.close();
      }
    });

    // Delegated Cart Item Actions (Plus, Minus, Remove)
    if (cartItemsContainer) {
      cartItemsContainer.addEventListener('click', (e) => {
        const plusBtn = e.target.closest('.cart-plus');
        const minusBtn = e.target.closest('.cart-minus');
        const removeBtn = e.target.closest('.cart-item-remove-btn');

        if (plusBtn) {
          const id = plusBtn.getAttribute('data-id');
          updateCartQuantity(id, 1);
        } else if (minusBtn) {
          const id = minusBtn.getAttribute('data-id');
          updateCartQuantity(id, -1);
        } else if (removeBtn) {
          const id = removeBtn.getAttribute('data-id');
          removeFromCart(id);
        }
      });
    }

    // Product Card Quantity Selectors (+ / - buttons on cards)
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;

        let currentVal = parseInt(input.value, 10) || 1;
        if (btn.classList.contains('qty-plus')) {
          input.value = Math.min(50, currentVal + 1);
        } else if (btn.classList.contains('qty-minus')) {
          input.value = Math.max(1, currentVal - 1);
        }
      });
    });

    // Add to Cart buttons on product cards
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        let qty = 1;
        if (id === 'aloe-vera') {
          const input = document.getElementById('qty-aloe');
          if (input) qty = parseInt(input.value, 10) || 1;
        } else if (id === 'turmeric') {
          const input = document.getElementById('qty-turmeric');
          if (input) qty = parseInt(input.value, 10) || 1;
        } else if (id === 'black-soap') {
          const input = document.getElementById('qty-black');
          if (input) qty = parseInt(input.value, 10) || 1;
        }
        addToCart(id, qty);
      });
    });

    // WhatsApp Direct Buy buttons on cards
    document.querySelectorAll('.btn-whatsapp-direct').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        let qty = 1;
        if (id === 'aloe-vera') {
          const input = document.getElementById('qty-aloe');
          if (input) qty = parseInt(input.value, 10) || 1;
        } else if (id === 'turmeric') {
          const input = document.getElementById('qty-turmeric');
          if (input) qty = parseInt(input.value, 10) || 1;
        } else if (id === 'black-soap') {
          const input = document.getElementById('qty-black');
          if (input) qty = parseInt(input.value, 10) || 1;
        }
        directWhatsAppBuySingle(id, qty);
      });
    });

    // Bundle Add to Cart button
    const addBundleBtn = document.getElementById('addBundleBtn');
    if (addBundleBtn) {
      addBundleBtn.addEventListener('click', () => {
        addToCart('trio-bundle', 1);
      });
    }

    // Quick View Overlay Buttons on Cards
    document.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-product-id');
        openQuickView(id);
      });
    });

    // Close Modals
    if (closeCheckoutModalBtn && checkoutModal) {
      closeCheckoutModalBtn.addEventListener('click', () => checkoutModal.close());
    }
    if (closeQuickViewBtn && quickViewModal) {
      closeQuickViewBtn.addEventListener('click', () => quickViewModal.close());
    }

    // Apply Promo Code
    if (applyPromoBtn && promoInput) {
      applyPromoBtn.addEventListener('click', () => {
        applyPromo(promoInput.value);
      });
      promoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyPromo(promoInput.value);
        }
      });
    }

    // Delivery Zone Select Change
    if (deliveryZoneSelect) {
      deliveryZoneSelect.addEventListener('change', () => {
        renderCart();
      });
    }

    // Order via WhatsApp from Drawer
    if (orderViaWhatsAppBtn) {
      orderViaWhatsAppBtn.addEventListener('click', () => {
        openWhatsAppOrder();
      });
    }

    // Open Checkout Modal from Drawer
    if (openCheckoutModalBtn) {
      openCheckoutModalBtn.addEventListener('click', () => {
        openCheckout();
      });
    }

    // Copy MTN MoMo Merchant Code
    const copyMomoBtn = document.getElementById('copyMomoBtn');
    if (copyMomoBtn) {
      copyMomoBtn.addEventListener('click', () => {
        const code = '41977046';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(() => {
            showToast('MTN MoMo Merchant Code 41977046 copied!', '📋');
            copyMomoBtn.innerHTML = '<span>✓ Copied!</span>';
            setTimeout(() => {
              copyMomoBtn.innerHTML = '<span>📋 Copy Code</span>';
            }, 2500);
          }).catch(() => {
            showToast(`Merchant Code: ${code}`, '💛');
          });
        } else {
          showToast(`Merchant Code: ${code}`, '💛');
        }
      });
    }

    // Toggle MTN MoMo payment instructions box
    const checkoutPayment = document.getElementById('checkoutPayment');
    const momoPaymentInfo = document.getElementById('momoPaymentInfo');
    if (checkoutPayment && momoPaymentInfo) {
      checkoutPayment.addEventListener('change', () => {
        if (checkoutPayment.value.includes('MTN')) {
          momoPaymentInfo.style.display = 'block';
        } else {
          momoPaymentInfo.style.display = 'none';
        }
      });
    }

    // Checkout Form Submission
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const details = {
          name: document.getElementById('checkoutName').value.trim(),
          phone: document.getElementById('checkoutPhone').value.trim(),
          address: document.getElementById('checkoutAddress').value.trim(),
          payment: document.getElementById('checkoutPayment').value,
          notes: document.getElementById('checkoutInstructions') ? document.getElementById('checkoutInstructions').value.trim() : ''
        };

        // Complete the order
        if (checkoutModal) checkoutModal.close();
        showToast(`Thank you, ${details.name}! Your order has been placed.`, '🎉');

        // Offer instant WhatsApp dispatch confirmation
        setTimeout(() => {
          if (confirm('Would you like to send this order to Lovett WhatsApp for instant dispatch tracking?')) {
            openWhatsAppOrder(details);
          }
          // Clear cart
          cart = [];
          saveCart();
          renderCart();
        }, 600);
      });
    }

    // Send order via WhatsApp Alternative from Checkout Dialog
    if (checkoutWhatsappAlternativeBtn) {
      checkoutWhatsappAlternativeBtn.addEventListener('click', () => {
        const details = {
          name: document.getElementById('checkoutName').value.trim() || 'Valued Customer',
          phone: document.getElementById('checkoutPhone').value.trim() || 'Via WhatsApp',
          address: document.getElementById('checkoutAddress').value.trim() || 'Kampala',
          payment: document.getElementById('checkoutPayment').value,
          notes: document.getElementById('checkoutInstructions') ? document.getElementById('checkoutInstructions').value.trim() : ''
        };
        if (checkoutModal) checkoutModal.close();
        openWhatsAppOrder(details);
      });
    }

    // Routine Matcher Quiz Button
    const findMatchBtn = document.getElementById('findMatchBtn');
    if (findMatchBtn) {
      findMatchBtn.addEventListener('click', runRoutineQuiz);
    }

    // Product Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');
        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Mobile Navigation Toggle
    if (mobileNavToggle && mobileNavMenu) {
      mobileNavToggle.addEventListener('click', () => {
        const isOpen = !mobileNavMenu.hidden;
        mobileNavMenu.hidden = isOpen;
        mobileNavToggle.setAttribute('aria-expanded', String(!isOpen));
      });

      // Close menu when clicking link
      document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileNavMenu.hidden = true;
          mobileNavToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');
    if (newsletterForm && newsletterSuccess) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        newsletterSuccess.hidden = false;
        newsletterForm.reset();
      });
    }

    // Header scroll elevation
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        if (header) header.classList.add('scrolled');
      } else {
        if (header) header.classList.remove('scrolled');
      }
    }, { passive: true });

    // Dynamic Current Year in footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear();
    }
  }

  // --- Initializer ---
  document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderCart();
    initEvents();
  });

})();
