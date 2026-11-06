// ========================================
// USTA DÖNERCİ - JAVASCRIPT
// ========================================

const menuItems = [
    { id: 1, name: "Özel Döner Porsiyonu", category: "doner", price: 120, description: "Eliyle marine edilmiş et, özel baharatlarla pişirilmiştir", badge: "Çok Sevileni" },
    { id: 2, name: "Dürüm Döner", category: "durum", price: 85, description: "Taze dürüm ekmeği ile sarılmış özel döner lezzeti", badge: "Popüler" },
    { id: 3, name: "İskender Döner", category: "doner", price: 140, description: "Üzeri erişmiş peynir ve özel sosla servis edilir", badge: "Özel" },
    { id: 4, name: "Taze Lahmacun", category: "lahmacun", price: 45, description: "Eliyle açılmış ince hamur, özel kıyma ile", badge: "Günlük Taze" },
    { id: 5, name: "Ayran", category: "icecek", price: 15, description: "Ev yapımı, soğuk ve taze ayran", badge: "Soğuk" },
    { id: 6, name: "Şalgam Suyu", category: "icecek", price: 18, description: "Turşu suyuyla pişmiş, lezzetli şalgam", badge: "Geleneksel" },
    { id: 7, name: "Ev Yapımı Baklava", category: "tatli", price: 60, description: "Antep fıstıklı, şerbetli ev yapımı baklava", badge: "Tatlı" },
    { id: 8, name: "Kunefe", category: "tatli", price: 55, description: "Taze peynirli, sıcak servis edilen künefe", badge: "Sıcak" }
];

let cart = [];
let cartTotal = 0;

const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const menuGrid = document.getElementById('menu-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
const bars = document.querySelectorAll('.bar');
const header = document.getElementById('header');
const backToTop = document.getElementById('back-to-top');
const mobileOverlay = document.getElementById('mobile-overlay');
const reservationForm = document.getElementById('reservation-form');
const reservationSuccess = document.getElementById('reservation-success');
const loader = document.getElementById('loader');

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initCart();
    initMobileMenu();
    initScrollEffects();
    initReservationForm();
    initBackToTop();
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 500);
    }, 2000);
});
// ========================================
// MENÜ FONKSİYONLARI
// ========================================

function initMenu() {
    renderMenuItems('all');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenuItems(btn.getAttribute('data-filter'));
        });
    });
}

function renderMenuItems(filter) {
    menuGrid.innerHTML = '';
    const filteredItems = filter === 'all' ? menuItems : menuItems.filter(item => item.category === filter);
    filteredItems.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.style.animationDelay = `${index * 0.1}s`;
        menuItem.innerHTML = `
            <div class="menu-item-image"></div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <span class="item-badge">${item.badge}</span>
                </div>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">${item.price} ₺</span>
                    <button class="btn-add-cart" onclick="addToCart(${item.id})">+ Sepete Ekle</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });
}
// ========================================
// SEPET FONKSİYONLARI
// ========================================

function initCart() {
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Sepetiniz boş! Lütfen önce bir öğe ekleyin.');
            return;
        }
        alert(`Siparişiniz alındı! Toplam: ${cartTotal} ₺\nTeşekkür ederiz, afiyet olsun dileriz.`);
        closeCart();
        clearCart();
    });
}

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const existingItem = cart.find(i => i.id === id);
    if (existingItem) { existingItem.qty += 1; } else { cart.push({ ...item, qty: 1 }); }
    updateCartUI();
    openCart();
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Eklendi!';
    btn.style.background = '#27ae60';
    setTimeout(() => { btn.innerHTML = originalText; btn.style.background = ''; }, 1000);
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) { removeFromCart(id); } else { updateCartUI(); }
    }
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    cartTotal = 0;
    let totalItems = 0;
    cart.forEach(item => {
        cartTotal += item.price * item.qty;
        totalItems += item.qty;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image"></div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${item.price} ₺ × ${item.qty}</p>
                <div class="cart-qty">
                    <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="btn-remove" onclick="removeFromCart(${item.id})">✕</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    cartCountEl.textContent = totalItems;
    cartTotalEl.textContent = cartTotal + ' ₺';
}

function clearCart() {
    cart = [];
    updateCartUI();
}
// ========================================
// MOBİL MENÜ
// ========================================

function initMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        const isActive = navLinks.classList.contains('active');
        navLinks.classList.toggle('active');
        mobileOverlay.classList.toggle('open');
        bars.forEach(bar => bar.classList.toggle('active'));
        document.body.style.overflow = isActive ? '' : 'hidden';
    });
    
    mobileOverlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileOverlay.classList.remove('open');
        bars.forEach(bar => bar.classList.remove('active'));
        document.body.style.overflow = '';
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileOverlay.classList.remove('open');
            bars.forEach(bar => bar.classList.remove('active'));
            document.body.style.overflow = '';
        });
    });
}

// ========================================
// SCROLL EFEKTLERİ
// ========================================

function initScrollEffects() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); }
        if (window.scrollY > 300) { backToTop.classList.add('show'); } else { backToTop.classList.remove('show'); }
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.menu-item, .gallery-item, .about-image, .about-text').forEach(el => observer.observe(el));
}

// ========================================
// REZERVASYON FORMU
// ========================================

function initReservationForm() {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        reservationForm.style.display = 'none';
        reservationSuccess.style.display = 'block';
    });
}

function closeReservationSuccess() {
    reservationSuccess.style.display = 'none';
    reservationForm.style.display = 'block';
    reservationForm.reset();
}

// ========================================
// BACK TO TOP
// ========================================

function initBackToTop() {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQty = changeQty;
window.closeReservationSuccess = closeReservationSuccess;