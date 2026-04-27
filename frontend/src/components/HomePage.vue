<template>
  <div class="home-page">

    <!-- ── HERO ── -->
    <section class="hero">
      <div class="hero-glow-1"></div>
      <div class="hero-glow-2"></div>
      <div class="container hero-inner">
        <div class="hero-text animate-fade-up">
          <div class="hero-badge"><i class="bi bi-lightning-charge-fill"></i> New Arrivals Every Week</div>
          <h1 class="hero-title">Your <span class="text-gradient">Next-Gen</span><br>Shopping Hub</h1>
          <p class="hero-sub">Discover 100+ premium products — electronics, beauty, and more — delivered to your door at unbeatable prices.</p>
          <div class="hero-actions">
            <router-link to="/products" class="btn-primary-cta"><i class="bi bi-bag-heart"></i> Shop Now</router-link>
            <router-link to="/about" class="btn-secondary-cta"><i class="bi bi-play-circle"></i> Learn More</router-link>
          </div>
          <div class="hero-stats">
            <div class="stat"><span class="stat-val">50K+</span><span class="stat-lbl">Customers</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><span class="stat-val">100+</span><span class="stat-lbl">Products</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><span class="stat-val">4.9★</span><span class="stat-lbl">Rating</span></div>
          </div>
        </div>
        <div class="hero-visual animate-fade-up-delay">
          <div class="hero-card-group">
            <div class="hcard glass-card">
              <div class="hcard-icon-wrap"><i class="bi bi-phone"></i></div>
              <div class="hcard-info">
                <strong>iPhone 15 Pro</strong>
                <span>₹89,999</span>
              </div>
              <span class="badge-sale" style="margin-left:auto">NEW</span>
            </div>
            <div class="hcard glass-card">
              <div class="hcard-icon-wrap" style="background:rgba(245,158,11,0.15)"><i class="bi bi-headphones" style="color:#f59e0b"></i></div>
              <div class="hcard-info">
                <strong>Air Buds Pro</strong>
                <span>₹2,799</span>
              </div>
              <span class="badge-sale" style="margin-left:auto">30% OFF</span>
            </div>
            <div class="hcard glass-card">
              <div class="hcard-icon-wrap" style="background:rgba(34,197,94,0.12)"><i class="bi bi-star-fill" style="color:#22c55e"></i></div>
              <div class="hcard-info">
                <strong>4.9 / 5 Stars</strong>
                <span>12K+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TRUST STRIP ── -->
    <section class="trust-strip">
      <div class="container trust-inner">
        <div class="trust-item" v-for="t in trust" :key="t.icon">
          <i :class="'bi bi-' + t.icon" class="trust-icon"></i>
          <div>
            <div class="trust-title">{{ t.title }}</div>
            <div class="trust-sub">{{ t.sub }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CATEGORIES ── -->
    <section class="section-pad">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">Shop by <span class="text-gradient">Category</span></h2>
          <p class="section-subtitle">Browse our curated product categories crafted for every lifestyle.</p>
        </div>
        <div class="categories-grid">
          <router-link
            v-for="cat in categories"
            :key="cat.name"
            to="/products"
            class="cat-card glass-card"
          >
            <div class="cat-icon-wrap" :style="{ background: cat.bg }">
              <i :class="'bi bi-' + cat.icon" class="cat-icon"></i>
            </div>
            <div class="cat-info">
              <div class="cat-name">{{ cat.name }}</div>
              <div class="cat-count">{{ cat.count }} items</div>
            </div>
            <i class="bi bi-arrow-right cat-arrow"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ── FEATURED PRODUCTS ── -->
    <section class="section-pad" style="padding-top:0">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">Featured <span class="text-gradient">Deals</span></h2>
          <p class="section-subtitle">Hand-picked products with exclusive discounts — updated weekly.</p>
        </div>
        <div class="products-grid">
          <div class="prod-card glass-card" v-for="p in featured" :key="p.name">
            <div class="prod-img-wrap">
              <img :src="p.img" :alt="p.name" class="prod-img" loading="lazy" />
              <span v-if="p.discount" class="badge-sale prod-badge">-{{ p.discount }}%</span>
            </div>
            <div class="prod-body">
              <div class="prod-cat">{{ p.category }}</div>
              <div class="prod-name">{{ p.name }}</div>
              <div class="prod-stars">
                <i v-for="s in 5" :key="s" class="bi" :class="s <= p.rating ? 'bi-star-fill star-filled' : 'bi-star star-empty'"></i>
                <span class="prod-rating-count">({{ p.reviews }})</span>
              </div>
              <div class="prod-price">
                <span class="price-final">₹{{ discounted(p) }}</span>
                <span v-if="p.discount" class="price-orig">₹{{ p.price.toLocaleString() }}</span>
              </div>
            </div>
            <div class="prod-footer">
              <router-link to="/products" class="btn-primary-cta prod-btn"><i class="bi bi-cart-plus"></i> Add to Cart</router-link>
            </div>
          </div>
        </div>
        <div class="text-center mt-5">
          <router-link to="/products" class="btn-secondary-cta">View All Products <i class="bi bi-arrow-right"></i></router-link>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ── -->
    <section class="section-pad how-section">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">How It <span class="text-gradient">Works</span></h2>
          <p class="section-subtitle">From browsing to delivery — a seamless experience in 3 steps.</p>
        </div>
        <div class="how-grid">
          <div class="how-card glass-card" v-for="(h, i) in howItWorks" :key="i">
            <div class="how-step">{{ String(i+1).padStart(2,'0') }}</div>
            <div class="how-icon-wrap"><i :class="'bi bi-' + h.icon" class="how-icon"></i></div>
            <h4 class="how-title">{{ h.title }}</h4>
            <p class="how-desc">{{ h.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TESTIMONIALS ── -->
    <section class="section-pad">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">What Customers <span class="text-gradient">Say</span></h2>
          <p class="section-subtitle">Trusted by 50,000+ happy shoppers across India.</p>
        </div>
        <div class="reviews-grid">
          <div class="review-card glass-card" v-for="r in reviews" :key="r.name">
            <div class="review-stars"><i class="bi bi-star-fill star-filled" v-for="s in 5" :key="s"></i></div>
            <p class="review-text">"{{ r.text }}"</p>
            <div class="review-author">
              <div class="review-avatar">{{ r.name.charAt(0) }}</div>
              <div>
                <div class="review-name">{{ r.name }}</div>
                <div class="review-loc">{{ r.location }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA BANNER ── -->
    <section class="cta-section">
      <div class="container cta-inner glass-card">
        <div class="cta-glow"></div>
        <h2 class="cta-title">Ready to upgrade your lifestyle?</h2>
        <p class="cta-sub">Join 50,000+ smart shoppers and get exclusive deals every week.</p>
        <router-link to="/products" class="btn-primary-cta cta-btn">Start Shopping <i class="bi bi-arrow-right"></i></router-link>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <div class="footer-logo"><i class="bi bi-bag-heart-fill"></i></div>
          <span class="footer-name">ShopVibe</span>
        </div>
        <div class="footer-links">
          <router-link to="/products">Products</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/cart">Cart</router-link>
        </div>
        <div class="footer-copy">© 2026 ShopVibe · All rights reserved</div>
      </div>
    </footer>
  </div>
</template>

<script>
import phoneImg from "@/assets/mob.jpg";
import lapImg from "@/assets/lap.jpg";
import headImg from "@/assets/headphones.jpg";
import tvImg from "@/assets/tv.jpg";

export default {
  name: "HomePage",
  data() {
    return {
      trust: [
        { icon: "truck", title: "Free Delivery", sub: "On orders above ₹999" },
        { icon: "shield-check", title: "Secure Payments", sub: "256-bit encryption" },
        { icon: "arrow-counterclockwise", title: "Easy Returns", sub: "30-day return policy" },
        { icon: "headset", title: "24/7 Support", sub: "Always here to help" },
      ],
      categories: [
        { name: "Smartphones", icon: "phone", count: 24, bg: "rgba(249,115,22,0.12)" },
        { name: "Laptops", icon: "laptop", count: 18, bg: "rgba(6,182,212,0.15)" },
        { name: "Audio", icon: "headphones", count: 15, bg: "rgba(139,92,246,0.15)" },
        { name: "Smart TVs", icon: "display", count: 12, bg: "rgba(16,185,129,0.15)" },
        { name: "Appliances", icon: "snow2", count: 10, bg: "rgba(245,158,11,0.15)" },
        { name: "Beauty", icon: "bag-heart", count: 21, bg: "rgba(244,63,94,0.15)" },
      ],
      featured: [
        { name: "Smartphone Pro", category: "Electronics", price: 19999, discount: 10, rating: 4, reviews: 328, img: phoneImg },
        { name: "UltraBook 15", category: "Laptops", price: 49999, discount: 15, rating: 5, reviews: 214, img: lapImg },
        { name: "NoiseShield Pro", category: "Audio", price: 2999, discount: 0, rating: 4, reviews: 176, img: headImg },
        { name: "Smart TV 42\"", category: "Electronics", price: 27999, discount: 20, rating: 3, reviews: 92, img: tvImg },
      ],
      howItWorks: [
        { icon: "search", title: "Browse & Discover", desc: "Explore 100+ premium products with smart filters, detailed specs and real reviews." },
        { icon: "cart-check", title: "Add & Checkout", desc: "Add items to cart, choose your payment method, and enter your delivery address." },
        { icon: "box-seam", title: "Fast Delivery", desc: "Your order is packed and dispatched within 24 hours, tracked to your doorstep." },
      ],
      reviews: [
        { name: "Priya Sharma", location: "Mumbai, MH", text: "Incredibly smooth shopping experience! Got my laptop in 2 days. Will definitely order again." },
        { name: "Rajan Menon", location: "Bangalore, KA", text: "Best prices I've found online. The headphones sound amazing and packaging was superb." },
        { name: "Sneha Patel", location: "Ahmedabad, GJ", text: "Love the design of this website. Super easy to navigate and checkout was seamless!" },
        { name: "Arjun Raj", location: "Chennai, TN", text: "Ordered a Smart TV — delivered on time with zero damage. 5 stars easily!" },
        { name: "Divya Nair", location: "Kochi, KL", text: "The lipstick set is absolutely gorgeous. Great quality and came beautifully packaged." },
        { name: "Vikram Singh", location: "Delhi, DL", text: "Excellent customer support. Had a query and it was resolved within minutes. Very impressed!" },
      ],
    };
  },
  methods: {
    discounted(p) {
      const d = p.discount ? Math.round(p.price - (p.price * p.discount) / 100) : p.price;
      return d.toLocaleString();
    },
  },
};
</script>

<style scoped>
.home-page { overflow-x: hidden; }

/* HERO */
.hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 80px 0 60px;
}
.hero-glow-1 {
  position: absolute; top: -100px; left: -100px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%);
  border-radius: 50%; pointer-events: none;
}
.hero-glow-2 {
  position: absolute; bottom: -100px; right: -50px;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%);
  border-radius: 50%; pointer-events: none;
}
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(249,115,22,0.12);
  border: 1px solid rgba(249,115,22,0.22);
  color: #fb923c;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 20px;
}
.hero-title {
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.1;
}
.hero-sub {
  font-size: 18px;
  color: #94a3b8;
  max-width: 480px;
  line-height: 1.7;
  margin-bottom: 32px;
}
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
.hero-stats { display: flex; align-items: center; gap: 20px; }
.stat { display: flex; flex-direction: column; }
.stat-val { font-size: 22px; font-weight: 800; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; }
.stat-lbl { font-size: 12px; color: #64748b; font-weight: 500; }
.stat-sep { width: 1px; height: 36px; background: rgba(255,255,255,0.08); }

/* Hero visual — stacked column, no overflow */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 24px;
}
.hero-card-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 280px;
  flex-shrink: 0;
}
.hcard {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  width: 100%;
}
.hcard-icon-wrap {
  width: 38px; height: 38px;
  background: rgba(249,115,22,0.12);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
  color: #f97316;
  flex-shrink: 0;
}
.hcard-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}
.hcard-info strong { color: #fff; font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hcard-info span { color: #22c55e; font-size: 12px; font-weight: 600; }

/* Trust strip */
.trust-strip {
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: rgba(26,28,32,0.4);
  padding: 24px 0;
}
.trust-inner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.trust-icon { font-size: 22px; color: #fb923c; flex-shrink: 0; }
.trust-title { color: #fff; font-weight: 600; font-size: 14px; }
.trust-sub { color: #64748b; font-size: 12px; }

/* Section head */
.section-head { text-align: center; margin-bottom: 48px; }
.section-head .section-subtitle { margin: 8px auto 0; }

/* Categories */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.cat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s ease;
}
.cat-card:hover { transform: translateY(-3px); border-color: rgba(249,115,22,0.32); }
.cat-icon-wrap {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.cat-icon { font-size: 22px; color: #fff; }
.cat-name { color: #fff; font-weight: 600; font-size: 15px; }
.cat-count { color: #64748b; font-size: 12px; }
.cat-arrow { margin-left: auto; color: #475569; font-size: 14px; transition: transform 0.2s; }
.cat-card:hover .cat-arrow { transform: translateX(4px); color: #fb923c; }
.cat-info { flex: 1; }

/* Products grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.prod-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  transition: all 0.3s ease;
}
.prod-card:hover { transform: translateY(-6px); border-color: rgba(249,115,22,0.3); }
.prod-img-wrap { position: relative; height: 200px; background: #fff; overflow: hidden; }
.prod-img { width: 100%; height: 100%; object-fit: contain; padding: 16px; transition: transform 0.4s ease; }
.prod-card:hover .prod-img { transform: scale(1.06); }
.prod-badge { position: absolute; top: 10px; left: 10px; }
.prod-body { padding: 16px 16px 0; flex: 1; }
.prod-cat { color: #f97316; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.prod-name { color: #fff; font-weight: 600; font-size: 15px; line-height: 1.4; margin-bottom: 8px; }
.prod-stars { display: flex; align-items: center; gap: 2px; margin-bottom: 10px; font-size: 12px; }
.prod-rating-count { color: #64748b; font-size: 12px; margin-left: 4px; }
.star-filled { color: #f59e0b; }
.star-empty { color: #334155; }
.prod-price { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
.price-final { font-size: 20px; font-weight: 700; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; }
.price-orig { font-size: 13px; color: #64748b; text-decoration: line-through; }
.prod-footer { padding: 12px 16px 16px; }
.prod-btn { width: 100%; justify-content: center; font-size: 14px; padding: 10px 16px; }

/* How */
.how-section { background: rgba(26,28,32,0.3); }
.how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.how-card { padding: 32px; position: relative; }
.how-step {
  font-size: 48px; font-weight: 800;
  color: rgba(249,115,22,0.12);
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 1;
  margin-bottom: 12px;
}
.how-icon-wrap {
  width: 52px; height: 52px;
  background: rgba(249,115,22,0.10);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.how-icon { font-size: 22px; color: #fb923c; }
.how-title { color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 10px; }
.how-desc { color: #64748b; font-size: 14px; line-height: 1.7; margin: 0; }

/* Reviews */
.reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.review-card { padding: 24px; }
.review-stars { display: flex; gap: 3px; margin-bottom: 14px; }
.review-text { color: #94a3b8; font-size: 14px; line-height: 1.7; margin-bottom: 18px; font-style: italic; }
.review-author { display: flex; align-items: center; gap: 10px; }
.review-avatar {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, #f97316, #f59e0b);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 14px;
}
.review-name { color: #fff; font-weight: 600; font-size: 14px; }
.review-loc { color: #64748b; font-size: 12px; }

/* CTA */
.cta-section { padding: 80px 24px; }
.cta-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 60px 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.cta-glow {
  position: absolute; top: -50%; left: 50%; transform: translateX(-50%);
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%);
  border-radius: 50%; pointer-events: none;
}
.cta-title { font-size: clamp(1.6rem, 3vw, 2.2rem); color: #fff; font-weight: 800; margin-bottom: 12px; font-family: 'Plus Jakarta Sans', sans-serif; }
.cta-sub { color: #94a3b8; font-size: 16px; margin-bottom: 28px; }
.cta-btn { margin: 0 auto; }

/* Footer */
.site-footer {
  border-top: 1px solid rgba(255,255,255,0.05);
  background: rgba(17,18,20,0.5);
  padding: 28px 0;
}
.footer-inner {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}
.footer-brand { display: flex; align-items: center; gap: 10px; }
.footer-logo {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #f97316, #f59e0b);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 14px;
}
.footer-name { color: #fff; font-weight: 700; font-size: 16px; font-family: 'Plus Jakarta Sans', sans-serif; }
.footer-links { display: flex; gap: 20px; }
.footer-links a { color: #64748b; font-size: 14px; font-weight: 500; transition: color 0.2s; }
.footer-links a:hover { color: #fff; }
.footer-copy { color: #334155; font-size: 13px; }

/* Responsive */
@media (max-width: 1024px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .hero-inner { grid-template-columns: 1fr; text-align: center; }
  .hero-actions { justify-content: center; }
  .hero-stats { justify-content: center; }
  .hero-visual { display: none; }
  .trust-inner { grid-template-columns: repeat(2, 1fr); }
  .how-grid { grid-template-columns: 1fr; }
  .reviews-grid { grid-template-columns: 1fr; }
  .footer-inner { flex-direction: column; align-items: center; text-align: center; }
}
@media (max-width: 480px) {
  .products-grid { grid-template-columns: 1fr; }
  .categories-grid { grid-template-columns: 1fr; }
  .trust-inner { grid-template-columns: 1fr; }
  .cta-inner { padding: 32px 24px; }
}
</style>
