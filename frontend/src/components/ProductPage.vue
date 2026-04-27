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
import { STATIC_PRODUCTS } from "../data/products";
import { cart } from "../store/cart";

export default {
  name: "ProductPage",
  data() {
    return {
      products: STATIC_PRODUCTS,
      searchQuery: this.$route?.query?.q || "",
      selectedCategory: "",
      sortBy: "newest",
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
