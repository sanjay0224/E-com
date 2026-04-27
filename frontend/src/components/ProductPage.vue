<template>
  <div class="product-page">
    <div class="container py-5">

      <!-- Page Header -->
      <div class="page-header mb-5">
        <h1 class="section-title">All Products</h1>
        <p class="section-subtitle">{{ filteredProducts.length }} products found</p>
      </div>

      <div class="page-layout">
        <!-- Sidebar Filters -->
        <aside class="filter-sidebar glass-card">
          <h5 class="filter-heading"><i class="bi bi-funnel"></i> Filters</h5>

          <div class="filter-group">
            <div class="filter-label">Category</div>
            <div class="filter-options">
              <label v-for="cat in allCategories" :key="cat" class="filter-option">
                <input type="radio" :value="cat" v-model="selectedCategory" />
                <span class="opt-label">{{ cat || 'All' }}</span>
              </label>
            </div>
          </div>

          <div class="filter-group">
            <div class="filter-label">Price Range</div>
            <input type="range" v-model.number="maxPrice" :min="200" :max="175000" :step="500" class="price-range" />
            <div class="price-display">Up to ₹{{ maxPrice.toLocaleString() }}</div>
          </div>

          <div class="filter-group">
            <div class="filter-label">Min Rating</div>
            <div class="rating-options">
              <button v-for="r in [0,3,4,5]" :key="r" class="rating-opt" :class="{active: minRating===r}" @click="minRating=r">
                <template v-if="r===0">All</template>
                <template v-else>{{ r }}★+</template>
              </button>
            </div>
          </div>

          <button class="btn-secondary-cta reset-btn" @click="resetFilters">Reset Filters</button>
        </aside>

        <!-- Product Area -->
        <div class="product-area">
          <!-- Toolbar -->
          <div class="toolbar glass-card">
            <div class="search-box">
              <i class="bi bi-search"></i>
              <input type="text" v-model="searchQuery" placeholder="Search products..." class="toolbar-search" />
            </div>
            <div class="toolbar-right">
              <select v-model="sortBy" class="sort-select">
                <option value="">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Most Discounted</option>
              </select>
              <button class="view-btn" :class="{active: viewMode==='grid'}" @click="viewMode='grid'"><i class="bi bi-grid"></i></button>
              <button class="view-btn" :class="{active: viewMode==='list'}" @click="viewMode='list'"><i class="bi bi-list"></i></button>
            </div>
          </div>

          <!-- No results -->
          <div v-if="filteredProducts.length === 0" class="no-results glass-card">
            <i class="bi bi-search no-results-icon"></i>
            <h4>No products found</h4>
            <p>Try adjusting your filters or search query.</p>
            <button class="btn-primary-cta" @click="resetFilters">Clear Filters</button>
          </div>

          <!-- Grid View -->
          <div v-else-if="viewMode==='grid'" class="products-grid">
            <div v-for="p in filteredProducts" :key="p._id" class="prod-card glass-card" @click="openProduct(p)">
              <div class="prod-img-wrap">
                <img :src="p.image" :alt="p.name" class="prod-img" loading="lazy" @error="onImgError" />
                <span v-if="p.discount" class="badge-sale prod-badge">-{{ p.discount }}%</span>
                <div class="prod-overlay">
                  <button class="overlay-btn" @click.stop="addToCart(p)"><i class="bi bi-cart-plus"></i></button>
                  <button class="overlay-btn" @click.stop="openProduct(p)"><i class="bi bi-eye"></i></button>
                </div>
              </div>
              <div class="prod-body">
                <div class="prod-cat">{{ p.category }}</div>
                <div class="prod-name">{{ p.name }}</div>
                <div class="prod-stars">
                  <i v-for="s in 5" :key="s" class="bi" :class="s <= p.rating ? 'bi-star-fill star-filled' : 'bi-star-half star-empty'"></i>
                  <span class="rating-txt">{{ p.rating }}.0</span>
                </div>
                <div class="prod-price">
                  <span class="price-main">₹{{ discounted(p).toLocaleString() }}</span>
                  <span v-if="p.discount" class="price-strike">₹{{ p.price.toLocaleString() }}</span>
                </div>
                <div v-if="p.stock === false" class="out-badge">Out of Stock</div>
              </div>
              <div class="prod-actions">
                <button class="btn-primary-cta add-btn" @click.stop="addToCart(p)" :disabled="p.stock===false">
                  <i class="bi bi-cart-plus"></i> {{ p.stock === false ? 'Out of Stock' : 'Add to Cart' }}
                </button>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else class="products-list">
            <div v-for="p in filteredProducts" :key="p._id" class="list-card glass-card">
              <div class="list-img-wrap">
                <img :src="p.image" :alt="p.name" class="list-img" loading="lazy" @error="onImgError" />
                <span v-if="p.discount" class="badge-sale list-badge">-{{ p.discount }}%</span>
              </div>
              <div class="list-body">
                <div class="prod-cat">{{ p.category }}</div>
                <div class="list-name">{{ p.name }}</div>
                <div class="prod-stars">
                  <i v-for="s in 5" :key="s" class="bi" :class="s <= p.rating ? 'bi-star-fill star-filled' : 'bi-star-half star-empty'"></i>
                </div>
                <p class="list-desc">{{ p.description }}</p>
              </div>
              <div class="list-right">
                <div class="price-main" style="font-size:24px">₹{{ discounted(p).toLocaleString() }}</div>
                <div v-if="p.discount" class="price-strike">₹{{ p.price.toLocaleString() }}</div>
                <div v-if="p.discount" class="saving-badge">You save ₹{{ (p.price - discounted(p)).toLocaleString() }}</div>
                <button class="btn-primary-cta add-btn" @click="addToCart(p)">
                  <i class="bi bi-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <div v-if="modal" class="modal-overlay" @click.self="modal=null">
      <div class="modal-box glass-card animate-fade-up">
        <button class="modal-close" @click="modal=null"><i class="bi bi-x-lg"></i></button>
        <div class="modal-inner">
          <div class="modal-img-wrap">
            <img :src="modal.image" :alt="modal.name" class="modal-img" @error="onImgError" />
            <span v-if="modal.discount" class="badge-sale modal-badge">-{{ modal.discount }}%</span>
          </div>
          <div class="modal-details">
            <div class="prod-cat">{{ modal.category }}</div>
            <h2 class="modal-title">{{ modal.name }}</h2>
            <div class="prod-stars mb-3">
              <i v-for="s in 5" :key="s" class="bi" :class="s <= modal.rating ? 'bi-star-fill star-filled' : 'bi-star-half star-empty'"></i>
              <span class="rating-txt">{{ modal.rating }}.0</span>
            </div>
            <p class="modal-desc">{{ modal.description }}</p>
            <div class="modal-price-row">
              <span class="price-main" style="font-size:28px">₹{{ discounted(modal).toLocaleString() }}</span>
              <span v-if="modal.discount" class="price-strike">₹{{ modal.price.toLocaleString() }}</span>
            </div>
            <div v-if="modal.discount" class="saving-badge d-inline-flex mb-4">
              You save ₹{{ (modal.price - discounted(modal)).toLocaleString() }} ({{ modal.discount }}% off)
            </div>
            <div class="modal-actions">
              <button class="btn-primary-cta" style="flex:1" @click="addToCart(modal); modal=null">
                <i class="bi bi-cart-plus"></i> Add to Cart
              </button>
              <router-link to="/cart" class="btn-secondary-cta" style="flex:1; justify-content:center">
                <i class="bi bi-bag"></i> Go to Cart
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast" class="toast-msg">
        <i class="bi bi-check-circle-fill"></i> {{ toast }}
      </div>
    </transition>
  </div>
</template>

<script>
import { cart } from "../store/cart";
// Using Unsplash CDN for high-quality product imagery (free for use)
const PRODUCTS = [
  // ── SMARTPHONES ──
  { _id:"64f1a3c0a1b2c3d4e5f67891", name:"Samsung Galaxy S24 Ultra", category:"Smartphones", price:134999, discount:10, rating:5, reviews:4821, description:"6.8\" QHD+ Dynamic AMOLED 2X, 200MP quad-camera, 100x Space Zoom, Snapdragon 8 Gen 3, S Pen included, 5000mAh, 45W fast charging. Titanium frame.", image:"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f67892", name:"Apple iPhone 15 Pro", category:"Smartphones", price:134900, discount:5, rating:5, reviews:6230, description:"6.1\" Super Retina XDR, A17 Pro chip, 48MP triple-camera, Titanium design, Action Button, USB-C, ProMotion 120Hz. Camera Control button.", image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f67893", name:"OnePlus 12 5G", category:"Smartphones", price:64999, discount:8, rating:4, reviews:2145, description:"6.82\" 2K LTPO AMOLED, Snapdragon 8 Gen 3, Hasselblad 50MP triple camera, 5400mAh, 100W SUPERVOOC + 50W AirVOOC wireless charging.", image:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f67894", name:"Redmi Note 13 Pro+ 5G", category:"Smartphones", price:29999, discount:12, rating:4, reviews:3910, description:"6.67\" Curved AMOLED 1.5K, 200MP OIS camera, Dimensity 7200 Ultra, 5000mAh, 120W HyperCharge. IP68 rated. Best camera under ₹30K.", image:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f67895", name:"Google Pixel 8a", category:"Smartphones", price:52999, discount:0, rating:4, reviews:987, description:"6.1\" Actua OLED, Google Tensor G3, 64MP+13MP dual camera with AI magic eraser, 7 years OS updates, 4492mAh, IP67. Pure Android.", image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80", stock:true },
  // ── LAPTOPS ──
  { _id:"64f1a3c0a1b2c3d4e5f67896", name:"Apple MacBook Air M3", category:"Laptops", price:114900, discount:8, rating:5, reviews:3201, description:"13.6\" Liquid Retina, Apple M3 chip, 8GB RAM, 256GB SSD, 18-hour battery, 1080p FaceTime camera, MagSafe 3, two Thunderbolt 3 ports. Fanless.", image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f67897", name:"Dell XPS 15 (2024)", category:"Laptops", price:154990, discount:10, rating:4, reviews:1456, description:"15.6\" OLED 3.5K touch, Intel Core i7-13700H, 16GB DDR5, 512GB NVMe, NVIDIA RTX 4060 8GB, 86WHr battery. Premium CNC aluminium build.", image:"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f67898", name:"ASUS ROG Strix G16", category:"Laptops", price:134990, discount:15, rating:5, reviews:2087, description:"16\" QHD 240Hz IPS, Intel Core i9-14900HX, 32GB DDR5, 1TB SSD, NVIDIA RTX 4070 8GB, ROG Intelligent Cooling, per-key RGB keyboard.", image:"https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f67899", name:"HP Pavilion 15 AMD Ryzen 7", category:"Laptops", price:67990, discount:18, rating:4, reviews:1734, description:"15.6\" FHD IPS anti-glare, AMD Ryzen 7 7730U, 16GB DDR4, 512GB SSD, Radeon Graphics, B&O audio, Windows 11. Great for students.", image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80", stock:true },
  // ── AUDIO ──
  { _id:"64f1a3c0a1b2c3d4e5f6789a", name:"Sony WH-1000XM5", category:"Audio", price:29990, discount:20, rating:5, reviews:5612, description:"Industry-leading noise cancelling, 8 mics, 30hr battery, 3-min quick charge = 3hr playback, multipoint connection, speak-to-chat. Premium over-ear.", image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f6789b", name:"Apple AirPods Pro (2nd Gen)", category:"Audio", price:24900, discount:5, rating:5, reviews:8921, description:"ANC + Transparency mode, Adaptive Audio, Personalized Spatial Audio, H2 chip, up to 6hr + 30hr with MagSafe case.", image:"https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f6789c", name:"boAt Airdopes 141 TWS", category:"Audio", price:1299, discount:35, rating:4, reviews:18430, description:"42hr total playtime, ENx tech for crystal calls, BEAST mode low latency, IPX4 water resistant, Bluetooth 5.1. India's #1 TWS bestseller.", image:"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f6789d", name:"JBL Flip 6 Portable Speaker", category:"Audio", price:9999, discount:15, rating:5, reviews:4230, description:"Powerful JBL Pro Sound, IP67 waterproof & dustproof, 12hr playtime, PartyBoost to link multiple speakers, USB-C charging, bold fabric design.", image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80", stock:true },
  // ── SMART TVs ──
  { _id:"64f1a3c0a1b2c3d4e5f6789e", name:'Samsung 55" Crystal 4K UHD', category:"Smart TVs", price:54990, discount:22, rating:4, reviews:3102, description:"Crystal 4K UHD Processor, PurColor, Motion Xcelerator, HDR, AirSlim design, Amazon Alexa built-in, Tizen OS, 3 HDMI + 2 USB.", image:"https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f6789f", name:'LG OLED C3 65" 4K', category:"Smart TVs", price:169990, discount:18, rating:5, reviews:1890, description:"65 inch OLED Evo panel, Alpha9 AI Processor Gen6, Dolby Vision IQ + Atmos, 120Hz, 4x HDMI 2.1, NVIDIA G-Sync & AMD FreeSync Premium.", image:"https://images.unsplash.com/photo-1601944177325-f8867652837f?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678a0", name:'Mi 43" 4K Smart TV X Series', category:"Smart TVs", price:29999, discount:10, rating:4, reviews:7845, description:"43 inch 4K HDR10+ display, PatchWall 4, Dolby Vision & Atmos, 30W speaker, HDMI 2.1 eARC, Android TV 11, Google Assistant, Chromecast.", image:"https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80", stock:true },
  // ── APPLIANCES ──
  { _id:"64f1a3c0a1b2c3d4e5f678a1", name:"Voltas 1.5T 5★ Inverter AC", category:"Appliances", price:43990, discount:12, rating:4, reviews:2341, description:"1.5 Ton, 5 Star, Turbo Cool, Sleep Mode, Self-Clean, Anti-bacterial filter, Wi-Fi compatible, ISEER 4.72. Fits up to 150 sq.ft room.", image:"https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678a2", name:"LG 7kg Front Load Washer", category:"Appliances", price:34990, discount:20, rating:4, reviews:1567, description:"7kg, 6 Motion Direct Drive, AI DD Technology, Steam, TurboWash, Allergy Care, 14 programmes, Wi-Fi ThinQ, 10yr motor warranty.", image:"https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678a3", name:"Philips Air Fryer HD9200", category:"Appliances", price:6995, discount:30, rating:5, reviews:9873, description:"4.1L capacity, Rapid Air Technology, up to 90% less fat, 13 cooking functions, Quick Clean basket, 1400W. Make healthier food effortlessly.", image:"https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678a4", name:"Dyson V15 Detect Absolute", category:"Appliances", price:64900, discount:8, rating:5, reviews:2087, description:"Laser reveals hidden dust, HEPA filtration, 60 min run time, LCD real-time particle count, piezo sensor auto-adjusts suction. 3 heads included.", image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80", stock:false },
  // ── BEAUTY ──
  { _id:"64f1a3c0a1b2c3d4e5f678a5", name:"Lakme Absolute Matte Lip Kit", category:"Beauty", price:799, discount:15, rating:4, reviews:3421, description:"5 full-size matte liquid lipsticks + liner + setting spray. 16hr long stay, hydrating matte finish, transfer-proof, 10 trending shades.", image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678a6", name:"Minimalist 10% Niacinamide Serum", category:"Beauty", price:599, discount:0, rating:5, reviews:12034, description:"10% Niacinamide + Zinc for pore minimising and oil balance. Lightweight water-based, no fragrance, no alcohol. Dermatologist tested. 30ml.", image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678a7", name:"Dyson Airwrap Multi-Styler", category:"Beauty", price:44900, discount:5, rating:5, reviews:3201, description:"Dries, waves, curls, smooths & hides frizz. Coanda airflow technology. No extreme heat damage. Includes long barrel + firm & soft smoothing brush.", image:"https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678a8", name:"Mamaearth Onion Hair Kit", category:"Beauty", price:649, discount:20, rating:4, reviews:21045, description:"Onion Shampoo 250ml + Conditioner 250ml + Hair Mask 200ml. Reduces hairfall, strengthens from root, toxin-free, dermatologically tested.", image:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80", stock:true },
  // ── WEARABLES ──
  { _id:"64f1a3c0a1b2c3d4e5f678a9", name:"Apple Watch Series 9 GPS 45mm", category:"Wearables", price:41900, discount:6, rating:5, reviews:5432, description:"S9 chip, Double Tap gesture, Always-On Retina display, 18hr battery, Blood Oxygen + ECG, Crash Detection, WR50 waterproof. Carbon neutral.", image:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678aa", name:"Fitbit Charge 6", category:"Wearables", price:14999, discount:18, rating:4, reviews:2341, description:"Google Maps + Wallet on wrist, 7-day battery, built-in GPS, 40 exercise modes, ECG, Stress Management, Sleep Profile. Works iOS & Android.", image:"https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678ab", name:"boAt Wave Call Smartwatch", category:"Wearables", price:1799, discount:40, rating:4, reviews:34521, description:"1.69\" HD display, Bluetooth calling, 100+ sports modes, SpO2 + heart rate, 7-day battery, IP68 waterproof, always-on display, stress monitoring.", image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678ac", name:"Garmin Forerunner 265", category:"Wearables", price:42990, discount:10, rating:5, reviews:876, description:"AMOLED display, advanced running metrics, Training Readiness, HRV Status, 13-day battery, GPS, multisport tracking, body battery energy monitor.", image:"https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80", stock:true },
  // ── FASHION & APPAREL ──
  { _id:"64f1a3c0a1b2c3d4e5f678ad", name:"Levi's 511 Slim Fit Jeans", category:"Fashion & Apparel", price:3799, discount:20, rating:4, reviews:8432, description:"Classic slim fit denim with just the right amount of stretch. Mid-rise, tapered leg. 99% Cotton 1% Elastane. Machine washable. Blue and black.", image:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678ae", name:"Nike Air Max 270 Sneakers", category:"Fashion & Apparel", price:12995, discount:15, rating:5, reviews:5621, description:"Max Air heel unit for all-day comfort. Mesh upper for breathability, foam midsole for lightweight cushioning. Iconic 270-degree visible Air unit.", image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678af", name:"Raymond Premium Formal Shirt", category:"Fashion & Apparel", price:1899, discount:25, rating:4, reviews:3102, description:"100% premium cotton formal shirt. Wrinkle resistant, easy-iron finish. 12 colours available. Regular fit with spread collar. Machine washable.", image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678b0", name:"Zara Floral Midi Dress", category:"Fashion & Apparel", price:3490, discount:10, rating:4, reviews:2198, description:"Flowy midi-length floral print dress with V-neckline and puff sleeves. 100% viscose, lined. Perfect for casual and semi-formal occasions.", image:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80", stock:true },
  // ── HOME & KITCHEN ──
  { _id:"64f1a3c0a1b2c3d4e5f678b1", name:"Prestige Pressure Cooker 5L", category:"Home & Kitchen", price:1899, discount:22, rating:5, reviews:14302, description:"5 Litre aluminium pressure cooker with deep lid. Extra thick base for even heating, safety valve and gasket release system. ISI marked. 5yr warranty.", image:"https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678b2", name:"IKEA HEMNES Wooden Bookcase", category:"Home & Kitchen", price:14999, discount:0, rating:4, reviews:3871, description:"Solid pine wood bookcase with 8 compartments. Durable, timeless design. Fits A4 binders. Suitable for living room, bedroom or home office. 185x77cm.", image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678b3", name:"Borosil Vision Glass Set 6pc", category:"Home & Kitchen", price:599, discount:15, rating:5, reviews:22041, description:"Set of 6 borosilicate glass tumblers 375ml each. Microwave and dishwasher safe. Thermal shock resistant. Lead-free. Perfect for water, juice and beverages.", image:"https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678b4", name:"Saral Home Cotton Bedsheet King", category:"Home & Kitchen", price:1299, discount:30, rating:4, reviews:7654, description:"King size 100% pure cotton bedsheet with 2 pillow covers. 300 TC, anti-pilling, fade resistant. Available in 20 designs. Machine washable.", image:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80", stock:true },
  // ── BOOKS & STATIONERY ──
  { _id:"64f1a3c0a1b2c3d4e5f678b5", name:"Atomic Habits by James Clear", category:"Books & Stationery", price:499, discount:40, rating:5, reviews:31240, description:"The no.1 bestseller on building good habits. Over 10 million copies sold worldwide. Backed by neuroscience and proven strategies for lasting change.", image:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678b6", name:"STABILO Boss Highlighter Set 8pc", category:"Books & Stationery", price:349, discount:10, rating:4, reviews:9821, description:"Set of 8 pastel and neon highlighters. Smear-proof on inkjet prints, chisel tip for thick and thin lines, ink visible through tip. Long cap-off time.", image:"https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678b7", name:"Leuchtturm1917 Notebook A5 Dotted", category:"Books & Stationery", price:1099, discount:5, rating:5, reviews:4502, description:"A5 hardcover dotted notebook, 249 numbered pages, 2 bookmarks, elastic closure, ink-proof paper 80g. Ideal for journaling and bullet journaling.", image:"https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&q=80", stock:true },
  // ── SPORTS & FITNESS ──
  { _id:"64f1a3c0a1b2c3d4e5f678b8", name:"Decathlon Domyos Yoga Mat 6mm", category:"Sports & Fitness", price:999, discount:20, rating:4, reviews:12430, description:"6mm thick non-slip yoga mat, natural rubber base, carrying strap included. 183x61cm. Ideal for yoga, pilates, and floor exercises. Easy to clean.", image:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678b9", name:"Boldfit 20kg Adjustable Dumbbell Set", category:"Sports & Fitness", price:4999, discount:25, rating:4, reviews:5632, description:"Adjustable 20kg dumbbell set (2x10kg). Quick-lock weight plates, anti-slip handle, compact design. Replaces 15 sets of dumbbells. Home gym essential.", image:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678ba", name:"Cosco Cyclone Basketball Size 7", category:"Sports & Fitness", price:799, discount:0, rating:4, reviews:3201, description:"Official size 7 rubber basketball. Butyl rubber bladder for superior air retention, deep channel design for better grip. Indoor and outdoor use.", image:"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80", stock:true },
  // ── TOYS & GAMES ──
  { _id:"64f1a3c0a1b2c3d4e5f678bb", name:"LEGO Technic Lamborghini 42115", category:"Toys & Games", price:34999, discount:8, rating:5, reviews:2891, description:"3696-piece LEGO Technic set. Authentic Lamborghini V12 engine, moving pistons, openable doors. Detailed interior. For ages 18 plus. Display model.", image:"https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678bc", name:"Funskool Scrabble Classic Board Game", category:"Toys & Games", price:649, discount:12, rating:4, reviews:6741, description:"Classic Scrabble for 2-4 players. 100 premium letter tiles, rotating board, 4 tile racks, letter bag and score pad included. For ages 10 and above.", image:"https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=500&q=80", stock:true },
  // ── AUTOMOTIVE ACCESSORIES ──
  { _id:"64f1a3c0a1b2c3d4e5f678bd", name:"Portronics 36W 4-Port Car Charger", category:"Automotive Accessories", price:799, discount:30, rating:4, reviews:8921, description:"4-port USB car charger with 2x QC 3.0 plus 2x USB-A, 36W total output. LED indicator, universal compatibility, overcharge protection. 12V and 24V.", image:"https://images.unsplash.com/photo-1609429019995-8c40f49535a5?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678be", name:"CarSpa Dash Camera 4K UHD", category:"Automotive Accessories", price:5499, discount:20, rating:4, reviews:3421, description:"4K UHD dash cam, 170-degree wide angle, Sony STARVIS night vision, GPS, Wi-Fi, loop recording, G-sensor, parking mode, 2.5-inch IPS display.", image:"https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500&q=80", stock:true },
  // ── HEALTH & WELLNESS ──
  { _id:"64f1a3c0a1b2c3d4e5f678bf", name:"Omron HEM-7124 BP Monitor", category:"Health & Wellness", price:2199, discount:18, rating:5, reviews:14302, description:"Fully automatic digital blood pressure monitor, clinically validated, 60-reading memory, irregular heartbeat detector, IntelliSense technology.", image:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678c0", name:"Neuherbs Raw Whey Protein 1kg", category:"Health & Wellness", price:1299, discount:22, rating:4, reviews:9034, description:"25g protein per serving, 5.5g BCAA, undenatured whey from grass-fed cows. No artificial sweeteners, low sugar, 33 servings. Chocolate and vanilla.", image:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80", stock:true },
  // ── PET SUPPLIES ──
  { _id:"64f1a3c0a1b2c3d4e5f678c1", name:"Royal Canin Adult Dog Food 3kg", category:"Pet Supplies", price:1799, discount:10, rating:5, reviews:7234, description:"Complete dry dog food for adult dogs 1-7 years. Balanced proteins, fibres and prebiotics for digestive health. Optimal kibble shape for easy chewing.", image:"https://images.unsplash.com/photo-1583512603806-077998240c7a?w=500&q=80", stock:true },
  { _id:"64f1a3c0a1b2c3d4e5f678c2", name:"Catlink Smart Self-Cleaning Litter Box", category:"Pet Supplies", price:12999, discount:15, rating:4, reviews:1876, description:"Self-cleaning automatic cat litter box, app-controlled, odour removal UV lamp, health monitor, safe for cats 2.5kg plus. Handles up to 3 cats. Quiet.", image:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80", stock:true },
];


export default {
  name: "ProductPage",
  data() {
    return {
      products: PRODUCTS,
      searchQuery: this.$route?.query?.q || "",
      selectedCategory: "",
      sortBy: "",
      maxPrice: 175000,
      minRating: 0,
      viewMode: "grid",
      modal: null,
      toast: null,
    };
  },
  computed: {
    allCategories() {
      const cats = [...new Set(this.products.map(p => p.category))];
      return ["", ...cats];
    },
    filteredProducts() {
      const query = this.searchQuery.toLowerCase().trim();
      let list = this.products.filter(p => {
        const name = p.name.toLowerCase();
        const cat = p.category.toLowerCase();
        
        // Synonym handling: "mobile" matches "smartphones"
        let isMatch = name.includes(query) || cat.includes(query);
        const mobileTerms = ['mobile', 'smartphone', 'phone'];
        if (!isMatch && mobileTerms.some(term => query.includes(term))) {
          isMatch = cat.includes('wearables') ? false : (cat.includes('electronics') || cat.includes('smart tv') || name.includes('phone') || name.includes('watch') ? name.includes(query) : mobileTerms.some(t => name.includes(t) || cat.includes(t)));
        }
        // Simpler approach for mobile specifically
        if (!isMatch && (query.includes('mobile') || query.includes('phone') || query.includes('smart'))) {
           if (cat.includes('wearables') || cat.includes('electronics') || name.includes('iphone') || name.includes('galaxy') || name.includes('pixel')) {
             isMatch = true;
           }
        }

        const matchSearch = !query || isMatch;
        const matchCat = !this.selectedCategory || p.category === this.selectedCategory;
        const matchPrice = this.discounted(p) <= this.maxPrice;
        const matchRating = p.rating >= this.minRating;
        return matchSearch && matchCat && matchPrice && matchRating;
      });
      if (this.sortBy === "price-asc") list = [...list].sort((a,b) => this.discounted(a) - this.discounted(b));
      if (this.sortBy === "price-desc") list = [...list].sort((a,b) => this.discounted(b) - this.discounted(a));
      if (this.sortBy === "rating") list = [...list].sort((a,b) => b.rating - a.rating);
      if (this.sortBy === "discount") list = [...list].sort((a,b) => (b.discount||0) - (a.discount||0));
      return list;
    },
  },
  watch: {
    '$route.query.q': {
      immediate: true,
      handler(newVal) {
        this.searchQuery = newVal || "";
      }
    }
  },
  methods: {
    discounted(p) {
      return p.discount ? Math.round(p.price - (p.price * p.discount) / 100) : p.price;
    },
    addToCart(p) {
      cart.addItem(p);
      this.toast = `${p.name} added to cart!`;
      setTimeout(() => { this.toast = null; }, 2500);
    },
    openProduct(p) { this.modal = p; },
    resetFilters() {
      this.searchQuery = "";
      this.selectedCategory = "";
      this.sortBy = "";
      this.maxPrice = 175000;
      this.minRating = 0;
    },
    onImgError(e) {
      // Replace broken image with a clean SVG placeholder
      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231e293b'/%3E%3Ctext x='50%25' y='45%25' font-size='40' text-anchor='middle' dy='.3em' fill='%23475569'%3E🛍️%3C/text%3E%3Ctext x='50%25' y='65%25' font-size='12' text-anchor='middle' fill='%23475569'%3EImage unavailable%3C/text%3E%3C/svg%3E";
      e.target.style.objectFit = "contain";
      e.target.style.padding = "16px";
    },

  },
};
</script>

<style scoped>
.product-page { min-height: 100vh; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.page-header { border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 24px; }

.page-layout { display: grid; grid-template-columns: 260px 1fr; gap: 24px; align-items: start; }

/* Sidebar */
.filter-sidebar { padding: 24px; position: sticky; top: 84px; }
.filter-heading { color: #fff; font-weight: 700; margin-bottom: 20px; font-size: 15px; display: flex; align-items: center; gap: 8px; }
.filter-group { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.filter-label { color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
.filter-options { display: flex; flex-direction: column; gap: 8px; }
.filter-option { display: flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 14px; cursor: pointer; }
.filter-option input { accent-color: #f97316; }
.opt-label { transition: color 0.2s; }
.filter-option:hover .opt-label { color: #fff; }

.price-range { width: 100%; accent-color: #f97316; margin-bottom: 8px; }
.price-display { color: #f97316; font-weight: 600; font-size: 14px; }

.rating-options { display: flex; gap: 8px; flex-wrap: wrap; }
.rating-opt {
  padding: 5px 12px; border-radius: 20px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: #94a3b8; font-size: 13px; cursor: pointer; transition: all 0.2s;
}
.rating-opt.active, .rating-opt:hover {
  background: rgba(249,115,22,0.12); border-color: rgba(249,115,22,0.32); color: #fb923c;
}
.reset-btn { width: 100%; justify-content: center; font-size: 13px; padding: 10px; }

/* Toolbar */
.toolbar {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; margin-bottom: 20px; flex-wrap: wrap;
}
.search-box { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 200px; color: #64748b; }
.toolbar-search {
  flex: 1; background: none; border: none; outline: none;
  color: #fff; font-size: 14px; font-family: 'Inter', sans-serif;
}
.toolbar-search::placeholder { color: #475569; }
.toolbar-right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.sort-select {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: #cbd5e1; border-radius: 8px; padding: 6px 10px;
  font-size: 13px; font-family: 'Inter', sans-serif; cursor: pointer; outline: none;
}
.view-btn {
  width: 34px; height: 34px; border-radius: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.view-btn.active { background: rgba(249,115,22,0.12); border-color: rgba(249,115,22,0.32); color: #fb923c; }

/* Grid */
.products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.prod-card { display: flex; flex-direction: column; overflow: hidden; padding: 0; cursor: pointer; }
.prod-card:hover { transform: translateY(-5px); border-color: rgba(249,115,22,0.3); }
.prod-img-wrap { position: relative; height: 200px; background: #fff; overflow: hidden; }
.prod-img { width: 100%; height: 100%; object-fit: contain; padding: 12px; transition: transform 0.4s ease; }
.prod-card:hover .prod-img { transform: scale(1.07); }
.prod-badge { position: absolute; top: 8px; left: 8px; }
.prod-overlay {
  position: absolute; inset: 0; background: rgba(17,18,20,0.5);
  display: flex; align-items: center; justify-content: center; gap: 10px;
  opacity: 0; transition: opacity 0.25s;
}
.prod-card:hover .prod-overlay { opacity: 1; }
.overlay-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(99,102,241,0.85); border: none; color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 15px; transition: all 0.2s;
}
.overlay-btn:hover { background: #f97316; transform: scale(1.1); }

.prod-body { padding: 14px 14px 0; flex: 1; }
.prod-cat { color: #f97316; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
.prod-name { color: #fff; font-weight: 600; font-size: 14px; line-height: 1.4; margin-bottom: 7px; }
.prod-stars { display: flex; align-items: center; gap: 2px; margin-bottom: 8px; }
.star-filled { color: #f59e0b; font-size: 12px; }
.star-empty { color: #334155; font-size: 12px; }
.rating-txt { color: #64748b; font-size: 12px; margin-left: 4px; }
.prod-price { display: flex; align-items: baseline; gap: 8px; }
.price-main { font-size: 18px; font-weight: 700; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; }
.price-strike { font-size: 13px; color: #475569; text-decoration: line-through; }
.out-badge { color: #f87171; font-size: 12px; font-weight: 600; margin-top: 6px; }

.prod-actions { padding: 10px 14px 14px; }
.add-btn { width: 100%; justify-content: center; font-size: 13px; padding: 9px; }

/* List */
.products-list { display: flex; flex-direction: column; gap: 14px; }
.list-card { display: flex; gap: 0; overflow: hidden; padding: 0; }
.list-img-wrap { position: relative; width: 200px; min-height: 160px; background: #fff; flex-shrink: 0; }
.list-img { width: 100%; height: 100%; object-fit: contain; padding: 12px; }
.list-badge { position: absolute; top: 8px; left: 8px; }
.list-body { padding: 20px; flex: 1; }
.list-name { color: #fff; font-weight: 700; font-size: 17px; margin-bottom: 8px; }
.list-desc { color: #64748b; font-size: 13px; line-height: 1.6; margin-top: 8px; }
.list-right {
  padding: 20px; display: flex; flex-direction: column;
  align-items: flex-end; justify-content: center; gap: 8px;
  min-width: 200px; border-left: 1px solid rgba(255,255,255,0.06);
}
.saving-badge {
  background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25);
  color: #34d399; font-size: 12px; font-weight: 600;
  padding: 3px 10px; border-radius: 20px; white-space: nowrap;
}

/* No results */
.no-results { padding: 60px; text-align: center; }
.no-results-icon { font-size: 48px; color: #334155; display: block; margin-bottom: 16px; }
.no-results h4 { color: #fff; margin-bottom: 8px; }
.no-results p { color: #64748b; margin-bottom: 20px; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px); z-index: 9999;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-box { max-width: 860px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; padding: 0; }
.modal-close {
  position: absolute; top: 16px; right: 16px; z-index: 10;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,0.08); border: none; color: #94a3b8;
  cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px;
}
.modal-inner { display: grid; grid-template-columns: 1fr 1fr; }
.modal-img-wrap { background: #fff; position: relative; min-height: 300px; }
.modal-img { width: 100%; height: 100%; object-fit: contain; padding: 24px; }
.modal-badge { position: absolute; top: 10px; left: 10px; }
.modal-details { padding: 32px; display: flex; flex-direction: column; }
.modal-title { color: #fff; font-size: 22px; font-weight: 700; margin-bottom: 8px; }
.modal-desc { color: #94a3b8; font-size: 14px; line-height: 1.7; margin-bottom: 16px; }
.modal-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
.modal-actions { display: flex; gap: 10px; margin-top: auto; }

/* Toast */
.toast-msg {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  background: rgba(16,185,129,0.95); color: #fff;
  padding: 12px 20px; border-radius: 12px;
  display: flex; align-items: center; gap: 8px;
  font-weight: 600; font-size: 14px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }

@media (max-width: 1024px) {
  .page-layout { grid-template-columns: 1fr; }
  .filter-sidebar { position: static; }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .products-grid { grid-template-columns: 1fr; }
  .list-card { flex-direction: column; }
  .list-img-wrap { width: 100%; min-height: 200px; }
  .list-right { align-items: flex-start; border-left: none; border-top: 1px solid rgba(255,255,255,0.06); }
  .modal-inner { grid-template-columns: 1fr; }
}
</style>
