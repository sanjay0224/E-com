<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="about-hero">
      <div class="about-glow"></div>
      <div class="container">
        <div class="hero-badge animate-fade-up"><i class="bi bi-info-circle"></i> About ShopVibe</div>
        <h1 class="about-title animate-fade-up">Built for the <span class="text-gradient">Modern Shopper</span></h1>
        <p class="about-sub animate-fade-up-delay">We believe everyone deserves access to premium products at fair prices. ShopVibe is India's next-gen e-commerce platform — designed with trust, speed, and simplicity at its core.</p>
        <router-link to="/products" class="btn-primary-cta animate-fade-up-delay"><i class="bi bi-bag-heart"></i> Start Shopping</router-link>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats-section">
      <div class="container stats-grid">
        <div class="stat-card glass-card" v-for="s in stats" :key="s.val">
          <div class="stat-val">{{ s.val }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="section-pad">
      <div class="container mission-layout">
        <div class="mission-text">
          <div class="section-eyebrow">Our Mission</div>
          <h2 class="section-title">Shopping should be <span class="text-gradient">joyful</span></h2>
          <p class="mission-para">We started ShopVibe with a simple goal — make online shopping transparent, fast, and enjoyable. No hidden fees, no fake reviews, no confusing return policies.</p>
          <p class="mission-para">Every product on our platform is vetted for quality. Every policy is written to protect you, not us. We're obsessed with making your experience delightful — from browsing to delivery.</p>
          <div class="mission-points">
            <div class="mission-pt" v-for="pt in missionPoints" :key="pt"><i class="bi bi-check-circle-fill"></i> {{ pt }}</div>
          </div>
        </div>
        <div class="mission-visual">
          <div class="visual-card glass-card" v-for="v in visualCards" :key="v.title">
            <div class="vc-icon-wrap" :style="{background: v.bg}"><i :class="'bi bi-' + v.icon" class="vc-icon"></i></div>
            <div class="vc-title">{{ v.title }}</div>
            <div class="vc-desc">{{ v.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="section-pad" style="padding-top:0">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">Meet the <span class="text-gradient">Team</span></h2>
          <p class="section-subtitle">Passionate people building the future of Indian e-commerce.</p>
        </div>
        <div class="team-grid">
          <div class="team-card glass-card" v-for="t in team" :key="t.name">
            <div class="team-avatar" :style="{background: t.bg}">{{ t.name.charAt(0) }}</div>
            <div class="team-name">{{ t.name }}</div>
            <div class="team-role">{{ t.role }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section-pad faq-section">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">Frequently Asked <span class="text-gradient">Questions</span></h2>
        </div>
        <div class="faq-list">
          <div class="faq-item glass-card" v-for="(f, i) in faqs" :key="i" @click="toggleFaq(i)">
            <div class="faq-q">
              {{ f.q }}
              <i class="bi" :class="openFaq === i ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <transition name="faq-slide">
              <div v-if="openFaq === i" class="faq-a">{{ f.a }}</div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Policies strip -->
    <section class="section-pad-sm">
      <div class="container policies-grid">
        <div class="policy-card glass-card" v-for="p in policies" :key="p.title">
          <i :class="'bi bi-' + p.icon" class="policy-icon"></i>
          <div class="policy-title">{{ p.title }}</div>
          <div class="policy-desc">{{ p.desc }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  data() {
    return {
      openFaq: null,
      stats: [
        { val: "50K+", label: "Happy Customers" },
        { val: "100+", label: "Products Listed" },
        { val: "4.9★", label: "Average Rating" },
        { val: "24hr", label: "Avg. Dispatch Time" },
      ],
      missionPoints: [
        "Verified, quality-checked products only",
        "Transparent pricing with no hidden fees",
        "30-day hassle-free return policy",
        "Dedicated 24/7 customer support",
      ],
      visualCards: [
        { icon: "shield-check", title: "Verified Products", desc: "Every product passes our quality check before listing.", bg: "rgba(249,115,22,0.12)" },
        { icon: "truck", title: "Fast Shipping", desc: "Order by 2PM for same-day dispatch from our warehouses.", bg: "rgba(16,185,129,0.15)" },
        { icon: "arrow-counterclockwise", title: "Easy Returns", desc: "Changed your mind? Return within 30 days, no questions asked.", bg: "rgba(245,158,11,0.15)" },
        { icon: "headset", title: "Live Support", desc: "Real humans available 24/7 via chat, call or email.", bg: "rgba(244,63,94,0.15)" },
      ],
      team: [
        { name: "Sanjay Kumar", role: "Founder & CEO", bg: "linear-gradient(135deg,#f97316,#f59e0b)" },
        { name: "Priya Sharma", role: "Head of Product", bg: "linear-gradient(135deg,#f43f5e,#ec4899)" },
        { name: "Arjun Nair", role: "Lead Engineer", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)" },
        { name: "Divya Iyer", role: "Marketing Lead", bg: "linear-gradient(135deg,#10b981,#059669)" },
      ],
      faqs: [
        { q: "How do I track my order?", a: "Once your order is dispatched, you'll receive an email with a tracking link. You can also check your order status from the account section." },
        { q: "What payment methods are accepted?", a: "We accept Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Cash on Delivery for eligible orders." },
        { q: "Can I return a product?", a: "Yes! We offer a 30-day return policy. Products must be unused and in original packaging. Initiate a return from your order history." },
        { q: "Is my payment information secure?", a: "Absolutely. All transactions are encrypted with 256-bit SSL and processed via PCI-DSS certified payment gateways." },
        { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available for select pin codes." },
        { q: "Do you ship pan-India?", a: "Yes, we ship to 19,000+ pin codes across India including remote areas. Delivery timelines may vary for remote locations." },
      ],
      policies: [
        { icon: "file-earmark-text", title: "Privacy Policy", desc: "We never sell your data. Your privacy is our priority." },
        { icon: "file-earmark-check", title: "Terms & Conditions", desc: "Simple, clear terms that protect you as a customer." },
        { icon: "arrow-counterclockwise", title: "Return Policy", desc: "30-day no-questions-asked return guarantee." },
        { icon: "shield-lock", title: "Secure Payments", desc: "All payments are 256-bit encrypted and fully secure." },
      ],
    };
  },
  methods: {
    toggleFaq(i) { this.openFaq = this.openFaq === i ? null : i; },
  },
};
</script>

<style scoped>
.about-page { min-height: 100vh; overflow-x: hidden; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.section-pad { padding: 80px 0; }
.section-pad-sm { padding: 48px 0; }
.section-head { text-align: center; margin-bottom: 48px; }
.section-eyebrow { color: #f97316; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }

/* Hero */
.about-hero { min-height: 60vh; display: flex; align-items: center; position: relative; padding: 100px 0 60px; text-align: center; }
.about-glow { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 700px; height: 500px; background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(249,115,22,0.10); border: 1px solid rgba(249,115,22,0.18); color: #fb923c; font-size: 13px; font-weight: 600; padding: 6px 16px; border-radius: 100px; margin-bottom: 20px; }
.about-title { font-size: clamp(2.2rem, 5vw, 3.5rem); font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #fff; margin-bottom: 20px; }
.about-sub { font-size: 18px; color: #94a3b8; max-width: 560px; margin: 0 auto 32px; line-height: 1.7; }

/* Stats */
.stats-section { padding: 32px 0; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(26,28,32,0.4); }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
.stat-card { text-align: center; padding: 24px; background: transparent; border: none; border-right: 1px solid rgba(255,255,255,0.06); border-radius: 0; box-shadow: none; }
.stat-card:last-child { border-right: none; }
.stat-card:hover { transform: none; }
.stat-val { font-size: 36px; font-weight: 800; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 4px; }
.stat-label { color: #64748b; font-size: 14px; font-weight: 500; }

/* Mission */
.mission-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.mission-para { color: #94a3b8; font-size: 16px; line-height: 1.8; margin-bottom: 14px; }
.mission-points { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.mission-pt { display: flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 15px; }
.mission-pt i { color: #10b981; font-size: 16px; flex-shrink: 0; }
.mission-visual { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.visual-card { padding: 22px; }
.vc-icon-wrap { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.vc-icon { font-size: 20px; color: #fff; }
.vc-title { color: #fff; font-weight: 600; font-size: 14px; margin-bottom: 6px; }
.vc-desc { color: #64748b; font-size: 13px; line-height: 1.6; }

/* Team */
.team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.team-card { text-align: center; padding: 32px 20px; }
.team-avatar { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 28px; font-weight: 700; margin: 0 auto 14px; }
.team-name { color: #fff; font-weight: 600; font-size: 16px; margin-bottom: 4px; }
.team-role { color: #64748b; font-size: 13px; }

/* FAQ */
.faq-section { background: rgba(26,28,32,0.3); }
.faq-list { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
.faq-item { padding: 18px 22px; cursor: pointer; transition: border-color 0.2s; }
.faq-item:hover { border-color: rgba(249,115,22,0.22); }
.faq-q { color: #fff; font-weight: 600; font-size: 15px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.faq-q i { color: #f97316; flex-shrink: 0; }
.faq-a { color: #94a3b8; font-size: 14px; line-height: 1.7; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
.faq-slide-enter-active, .faq-slide-leave-active { transition: all 0.25s ease; overflow: hidden; }
.faq-slide-enter-from, .faq-slide-leave-to { opacity: 0; max-height: 0; margin-top: 0; }
.faq-slide-enter-to, .faq-slide-leave-from { max-height: 200px; }

/* Policies */
.policies-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.policy-card { padding: 24px; text-align: center; }
.policy-icon { font-size: 28px; color: #fb923c; display: block; margin-bottom: 12px; }
.policy-title { color: #fff; font-weight: 600; font-size: 14px; margin-bottom: 6px; }
.policy-desc { color: #64748b; font-size: 13px; }

@media (max-width: 1024px) {
  .team-grid { grid-template-columns: repeat(2, 1fr); }
  .policies-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .stat-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
}
@media (max-width: 768px) {
  .mission-layout { grid-template-columns: 1fr; }
  .mission-visual { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .team-grid { grid-template-columns: 1fr; }
  .policies-grid { grid-template-columns: 1fr; }
}
</style>
