<template>
  <div class="ai-chat">
    <!-- Floating Button -->
    <button class="chat-fab" @click="isOpen = !isOpen" :class="{open: isOpen}" title="AI Shopping Assistant">
      <i class="bi" :class="isOpen ? 'bi-x-lg' : 'bi-robot'"></i>
      <span v-if="!isOpen && unread > 0" class="fab-badge">{{ unread }}</span>
    </button>

    <!-- Chat Panel -->
    <transition name="chat-panel">
      <div v-if="isOpen" class="chat-panel">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-avatar"><i class="bi bi-robot"></i></div>
          <div class="chat-header-info">
            <div class="chat-name">ShopVibe AI</div>
            <div class="chat-status"><span class="status-dot"></span> Online</div>
          </div>
          <button class="chat-close" @click="isOpen=false"><i class="bi bi-x-lg"></i></button>
        </div>

        <!-- Messages -->
        <div class="chat-messages" ref="msgContainer">
          <div v-for="(msg, i) in messages" :key="i" class="msg-row" :class="msg.from">
            <div v-if="msg.from==='bot'" class="msg-avatar"><i class="bi bi-robot"></i></div>
            <div class="msg-bubble" :class="msg.from">
              <span v-html="msg.text"></span>
              <div class="msg-time">{{ msg.time }}</div>
            </div>
          </div>
          <div v-if="typing" class="msg-row bot">
            <div class="msg-avatar"><i class="bi bi-robot"></i></div>
            <div class="msg-bubble bot typing-bubble">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>
        </div>

        <!-- Quick Replies -->
        <div class="quick-replies">
          <button v-for="q in quickReplies" :key="q" class="quick-btn" @click="sendMessage(q)">{{ q }}</button>
        </div>

        <!-- Input -->
        <div class="chat-input-row">
          <input
            v-model="input"
            @keyup.enter="sendMessage()"
            placeholder="Ask me anything..."
            class="chat-input"
            ref="inputRef"
          />
          <button class="send-btn" @click="sendMessage()" :disabled="!input.trim()">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const BOT_RESPONSES = {
  keywords: {
    laptop: "💻 We have great laptops! Check out our <b>UltraBook Pro 15</b> (₹42,499 after 15% off) and <b>Gaming Laptop RTX 4060</b> (₹65,999). Both include free delivery!",
    phone: "📱 Our top smartphones include the <b>Smartphone X12 Pro</b> at ₹17,999 and <b>Galaxy Tab S9 Ultra</b> at ₹78,199. Both have excellent cameras!",
    headphone: "🎧 The <b>NoiseShield Pro X</b> at ₹2,999 features ANC and 30hr battery. Perfect for work and travel!",
    tv: "📺 We have the <b>SmartVision 42\" 4K</b> at ₹22,399 and the <b>OLED 55\" Smart TV</b> at ₹50,999 — both with streaming apps built in.",
    ac: "❄️ Our <b>ArcticCool 1.5T Split AC</b> at ₹35,999 has a 5-star rating and Wi-Fi control. Perfect for Indian summers!",
    beauty: "💄 Our beauty range includes the <b>Velvet Matte Lipstick Set</b> at ₹569 and <b>Glow Serum Kit</b> at ₹1,299. Great value!",
    delivery: "🚚 We offer FREE delivery on orders above ₹999. Standard delivery takes 3–5 days; express 1–2 days for select pin codes.",
    return: "↩️ We have a <b>30-day hassle-free return policy</b>. Just initiate a return from your order history — no questions asked!",
    payment: "💳 We accept Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Cash on Delivery.",
    offer: "🔥 Current offers: Up to 20% off Smart TVs, 15% off Laptops, and 10% off Smartphones. Limited time!",
    discount: "🏷️ Check our Products page and filter by 'Most Discounted' to see all active deals — some up to 20% off!",
    cheap: "💰 Looking for budget picks? Try <b>Velvet Lipstick Set</b> (₹569), <b>NoiseShield Headphones</b> (₹2,999), or <b>Smartphone X12</b> (₹17,999)!",
    cart: "🛒 You can view your cart anytime by clicking the cart icon in the top navigation. Ready to checkout?",
    help: "I can help you find products, check deals, learn about delivery/returns, or answer any shopping queries. What do you need?",
  },
  default: [
    "I'm here to help! Try asking about products, deals, delivery, or returns. 😊",
    "Great question! Let me check that for you... Could you be more specific about what you're looking for?",
    "I'd love to help you find the perfect product! Tell me your budget or category.",
  ],
};

import { STATIC_PRODUCTS } from "../data/products";

function getTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default {
  name: "AiChatWidget",
  data() {
    return {
      isOpen: false,
      input: "",
      typing: false,
      unread: 1,
      products: STATIC_PRODUCTS, // Use static as initial state/fallback
      messages: [
        { from: "bot", text: "👋 Hi! I'm your <b>ShopVibe AI Assistant</b>. I can help you find products, check offers, and answer any shopping questions!", time: getTime() },
      ],
      quickReplies: ["Best deals?", "Laptop under ₹50K", "Return policy", "Payment options"],
    };
  },
  async mounted() {
    try {
      const resp = await fetch('http://localhost:5000/api/products');
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.length) this.products = data;
      }
    } catch (e) {
      console.warn("AI Chat: Could not fetch products, using offline mode.");
    }
  },
  watch: {
    isOpen(val) { if (val) { this.unread = 0; this.$nextTick(() => this.scrollToBottom()); } },
  },
  methods: {
    async sendMessage(text) {
      const msg = (text || this.input).trim();
      if (!msg) return;
      this.input = "";
      this.messages.push({ from: "user", text: msg, time: getTime() });
      this.scrollToBottom();
      this.typing = true;
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
      this.typing = false;
      const response = this.generateResponse(msg);
      this.messages.push({ from: "bot", text: response, time: getTime() });
      this.scrollToBottom();
    },
    generateResponse(msg) {
      const lower = msg.toLowerCase();
      
      // 1. Check for specific keywords first (like returns, delivery)
      for (const [key, resp] of Object.entries(BOT_RESPONSES.keywords)) {
        if (lower.includes(key) && !['laptop','phone','headphone','tv','ac','beauty','cheap'].includes(key)) {
          return resp;
        }
      }

      // 2. Budget & Product Logic
      const products = this.products;
      const budgetMatch = lower.match(/under\s?₹?\s?(\d+)/) || 
                          lower.match(/below\s?₹?\s?(\d+)/) ||
                          lower.match(/(\d+)\s?under/) ||
                          lower.match(/^(\d+)$/); // Also catch just a number
      const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : null;

      // Filter by category if mentioned
      let filtered = products;
      if (lower.includes('laptop')) filtered = filtered.filter(p => p.category.toLowerCase().includes('laptop'));
      else if (lower.includes('phone') || lower.includes('mobile')) filtered = filtered.filter(p => p.category.toLowerCase().includes('phone') || p.category.toLowerCase().includes('smartphone'));
      else if (lower.includes('tv')) filtered = filtered.filter(p => p.category.toLowerCase().includes('tv'));
      else if (lower.includes('audio') || lower.includes('headphone')) filtered = filtered.filter(p => p.category.toLowerCase().includes('audio'));
      else if (lower.includes('appliance') || lower.includes('ac')) filtered = filtered.filter(p => p.category.toLowerCase().includes('appliance'));

      // Filter by budget
      if (budget) {
        filtered = filtered.filter(p => {
          const rawPrice = Number(p.price);
          const rawDiscount = Number(p.discount || 0);
          const finalPrice = rawDiscount ? Math.round(rawPrice - (rawPrice * rawDiscount) / 100) : rawPrice;
          return finalPrice <= budget;
        });
      }

      // 3. Response Selection
      if (budget && filtered.length === 0) {
        if (!products || products.length === 0) {
          return "🤖 I'm still syncing the catalog. Try again in a moment!";
        }
        return `😔 I couldn't find any products under <b>₹${budget.toLocaleString()}</b> right now. Try searching for "laptops" or "phones" to see our top picks!`;
      }

      // Case 2: Products exist but check stock
      let available = filtered.filter(p => p.stock !== false);
      let outOfStock = filtered.filter(p => p.stock === false);

      if (available.length === 0 && outOfStock.length > 0) {
        let suggestions = products.filter(p => p.stock !== false).slice(0, 3);
        return `
          ⚠️ The items you're looking for are currently out of stock.
          <br><br>💡 <b>Suggestions for you:</b>
          <br>${suggestions.map(p => `• <b>${p.name}</b> – ₹${(p.discount ? Math.round(p.price - (p.price * p.discount) / 100) : p.price).toLocaleString()}`).join("<br>")}
        `;
      }

      // Case 3: Show available products
      if (available.length > 0) {
        // Limit to top 4 results
        const items = available.slice(0, 4);
        return `
          🛍️ I found some great options for you:
          <br><br>${items.map(p => {
            const finalPrice = p.discount ? Math.round(p.price - (p.price * p.discount) / 100) : p.price;
            return `• <b>${p.name}</b> – ₹${finalPrice.toLocaleString()} ${p.discount ? `<span style="color:#10b981;font-size:11px">(${p.discount}% OFF)</span>` : ''}`;
          }).join("<br>")}
          <br><br>Want to see more? Check the <router-link to="/products" style="color:#fb923c">Products</router-link> page!
        `;
      }

      // Fallback to keyword matching
      for (const [key, resp] of Object.entries(BOT_RESPONSES.keywords)) {
        if (lower.includes(key)) return resp;
      }

      return BOT_RESPONSES.default[Math.floor(Math.random() * BOT_RESPONSES.default.length)];
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const c = this.$refs.msgContainer;
        if (c) c.scrollTop = c.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.ai-chat { position: fixed; bottom: 24px; right: 24px; z-index: 9000; }

.chat-fab {
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #f59e0b);
  border: none; color: #fff; font-size: 20px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 30px rgba(249,115,22,0.4);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  position: relative;
}
.chat-fab:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(99,102,241,0.6); }
.chat-fab.open { background: rgba(34,37,43,0.9); border: 1px solid rgba(255,255,255,0.1); }

.fab-badge {
  position: absolute; top: -4px; right: -4px;
  background: #f43f5e; color: #fff; font-size: 10px; font-weight: 700;
  border-radius: 100px; min-width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center; padding: 0 4px;
}

/* Chat Panel */
.chat-panel {
  position: absolute; bottom: 70px; right: 0;
  width: 360px; max-height: 520px;
  background: rgba(17,18,20,0.97);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  display: flex; flex-direction: column; overflow: hidden;
}

/* Header */
.chat-header {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(26,28,32,0.8);
}
.chat-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg,#f97316,#f59e0b);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 16px; flex-shrink: 0;
}
.chat-name { color: #fff; font-weight: 700; font-size: 14px; }
.chat-status { display: flex; align-items: center; gap: 5px; color: #64748b; font-size: 12px; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; animation: pulse-glow 2s infinite; }
.chat-close { margin-left: auto; background: none; border: none; color: #64748b; cursor: pointer; font-size: 13px; padding: 4px; }

/* Messages */
.chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.msg-row { display: flex; align-items: flex-end; gap: 8px; }
.msg-row.user { flex-direction: row-reverse; }
.msg-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#f97316,#f59e0b); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; flex-shrink: 0; }
.msg-bubble {
  max-width: 260px; padding: 10px 14px; border-radius: 16px;
  font-size: 13px; line-height: 1.6;
  position: relative;
}
.msg-bubble.bot { background: rgba(34,37,43,0.9); color: #cbd5e1; border-bottom-left-radius: 4px; }
.msg-bubble.user { background: linear-gradient(135deg,#f97316,#f59e0b); color: #fff; border-bottom-right-radius: 4px; margin-left: auto; }
.msg-time { font-size: 10px; opacity: 0.5; margin-top: 4px; text-align: right; }

/* Typing */
.typing-bubble { display: flex; align-items: center; gap: 5px; padding: 12px 16px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #64748b; animation: typing-dot 1.4s infinite; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing-dot { 0%,60%,100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-6px); opacity: 1; } }

/* Quick Replies */
.quick-replies { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 14px; border-top: 1px solid rgba(255,255,255,0.05); }
.quick-btn {
  background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.18);
  color: #fb923c; font-size: 12px; font-weight: 500;
  padding: 5px 12px; border-radius: 20px; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: all 0.2s;
}
.quick-btn:hover { background: rgba(249,115,22,0.15); color: #a5b4fc; }

/* Input */
.chat-input-row {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.chat-input {
  flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 100px; color: #fff; padding: 8px 16px; font-size: 13px;
  outline: none; font-family: 'Inter', sans-serif;
}
.chat-input:focus { border-color: rgba(249,115,22,0.32); background: rgba(255,255,255,0.07); }
.chat-input::placeholder { color: #475569; }
.send-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg,#f97316,#f59e0b);
  border: none; color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center; font-size: 13px;
  transition: all 0.2s; flex-shrink: 0;
}
.send-btn:hover:not(:disabled) { transform: scale(1.08); }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Transition */
.chat-panel-enter-active, .chat-panel-leave-active { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.chat-panel-enter-from, .chat-panel-leave-to { opacity: 0; transform: translateY(16px) scale(0.97); transform-origin: bottom right; }

@media (max-width: 480px) {
  .chat-panel { width: calc(100vw - 48px); }
  .ai-chat { bottom: 16px; right: 16px; }
}
</style>
