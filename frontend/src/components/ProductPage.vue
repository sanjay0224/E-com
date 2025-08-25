<template>
  <div class="container mt-4 text-light">
    <!-- Page Title -->
    <h2 class="mb-4 text-center fade-in-rise">🛍 Explore Our Products</h2>

    <!-- Search & Filter -->
    <div class="d-flex justify-content-center mb-4 flex-wrap gap-2">
      <input
        type="text"
        class="form-control w-50"
        placeholder="🔍 Search for products..."
        v-model="searchQuery"
      />
      <div>
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          class="btn btn-sm mx-1"
          :class="selectedCategory === cat ? 'btn-warning' : 'btn-outline-light'"
        >
          {{ cat || "All" }}
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="row">
      <transition-group name="fade" tag="div" class="row">
        <div
          class="col-lg-3 col-md-4 col-sm-6 mb-4"
          v-for="product in filteredProducts"
          :key="product.id"
        >
          <div class="card h-100 product-card position-relative">
            
            <!-- Discount Badge -->
            <span v-if="product.discount"
              class="badge bg-danger position-absolute top-0 start-0 m-2"
            >
              -{{ product.discount }}%
            </span>

            <!-- Image -->
            <div class="img-container">
              <img
                :src="product.image"
                class="card-img-top"
                alt="Product image"
                loading="lazy"
              />
            </div>

            <div class="card-body text-center">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text small">{{ product.description }}</p>

              <!-- Ratings -->
              <p>
                <span v-for="star in 5" :key="star" class="text-warning">
                  <i class="bi" :class="star <= product.rating ? 'bi-star-fill' : 'bi-star'"></i>
                </span>
              </p>

              <!-- Price -->
              <p class="fw-bold">
                ₹{{ discountedPrice(product) }}
                <span
                  v-if="product.discount"
                  class="text-decoration-line-through text-muted small"
                >
                  ₹{{ product.price }}
                </span>
              </p>

              <!-- Buttons -->
              <button @click="addToCart(product)" class="btn btn-success btn-sm">
                <i class="bi bi-cart-plus"></i> Add to Cart
              </button>
              <button @click="openQuickView(product)" class="btn btn-info btn-sm ms-2">
                👁 Quick View
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Quick View Modal -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedProduct.name }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body text-center">
            <img :src="selectedProduct.image" class="img-fluid rounded mb-3" />
            <p>{{ selectedProduct.description }}</p>
            <p class="fw-bold">₹{{ discountedPrice(selectedProduct) }}</p>
          </div>
          <div class="modal-footer">
            <button @click="addToCart(selectedProduct)" class="btn btn-success">
              <i class="bi bi-cart-plus"></i> Add to Cart
            </button>
            <router-link to="/payment" class="btn btn-warning">
              Buy Now
            </router-link>
            <button class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cart } from "../store/cart";
import laptopImage from "../assets/lap.jpg";
import phoneImage from "../assets/mob.jpg";
import headphonesImage from "../assets/headphones.jpg";
import tvImage from "../assets/tv.jpg";
import acImage from "../assets/ac.jpg";
import lipstickImage from "../assets/lipsticks.jpg";

export default {
  name: "ProductPage",
  data() {
    return {
      searchQuery: "",
      selectedCategory: "",
      showModal: false,
      selectedProduct: {},
      products: [
        { id: 1, name: "Smartphone", category: "Electronics", price: 19999, discount: 10, rating: 4, description: "Sleek smartphone with high-resolution display and great camera", image: phoneImage },
        { id: 2, name: "Laptop", category: "Electronics", price: 49999, discount: 15, rating: 5, description: "High-performance laptop for gaming and productivity", image: laptopImage },
        { id: 3, name: "Headphones", category: "Electronics", price: 2999, rating: 4, description: "Wireless headphones with noise cancellation", image: headphonesImage },
        { id: 4, name: "Smart TV", category: "Electronics", price: 27999, discount: 20, rating: 3, description: '42" 4K UHD Smart TV with streaming apps built-in', image: tvImage },
        { id: 5, name: "Air Conditioner", category: "Electronics", price: 35999, rating: 5, description: "1.5 Ton Split AC with fast cooling technology", image: acImage },
        { id: 6, name: "Lipstick", category: "Beauty", price: 599, discount: 5, rating: 4, description: "Long-lasting matte lipstick in various shades", image: lipstickImage },
      ],
    };
  },
  computed: {
    categories() {
      return ["", "Electronics", "Beauty"];
    },
    filteredProducts() {
      return this.products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.selectedCategory
          ? p.category === this.selectedCategory
          : true;
        return matchesSearch && matchesCategory;
      });
    },
  },
  methods: {
    discountedPrice(product) {
      if (product.discount) {
        return Math.round(product.price - (product.price * product.discount) / 100);
      }
      return product.price;
    },
    async addToCart(product) {
      try {
        await cart.addItem(product);
        alert(`${product.name} added to cart! ✅`);
      } catch (err) {
        console.error("Error adding to cart:", err);
        alert("Failed to add to cart");
      }
    },
    openQuickView(product) {
      this.selectedProduct = product;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
.card {
  background-color: #2c3e50;
  color: white;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}
.img-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.img-container img:hover {
  transform: scale(1.1);
}
.badge {
  font-size: 0.8rem;
  padding: 5px 8px;
}
.modal-backdrop {
  display: none; /* prevent Bootstrap overlay issues */
}
</style>
