<template>
  <div class="container mt-4 text-light">
    <h2 class="mb-4"> Product List</h2>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="product in products" :key="product.id">
        <div class="card h-100 product-card">
          <img :src="product.image" class="card-img-top" alt="Product image">
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description }}</p>
            <p class="fw-bold">₹{{ product.price }}</p>
            <button @click="addToCart(product)" class="btn btn-success">Add to Cart</button>
            <router-link to="/payment" class="btn btn-warning ms-2">Place Order</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cart } from '../store/cart';
import laptopImage from '../assets/lap.jpg';
import phoneImage from '../assets/mob.jpg';
import headphonesImage from '../assets/headphones.jpg';
import tvImage from '../assets/tv.jpg';
import acImage from '../assets/ac.jpg';
import lipstickImage from '../assets/lipsticks.jpg';

export default {
  name: 'ProductPage',
  data() {
    return {
      products: [
        {
          id: 1,
          name: 'Smartphone',
          price: 19999,
          description: 'Sleek smartphone with high-resolution display and great camera',
          image: phoneImage
        },
        {
          id: 2,
          name: 'Laptop',
          price: 49999,
          description: 'High-performance laptop for gaming and productivity',
          image: laptopImage
        },
        {
          id: 3,
          name: 'Headphones',
          price: 2999,
          description: 'Wireless headphones with noise cancellation',
          image: headphonesImage
        },
        {
          id: 4,
          name: 'Smart TV',
          price: 27999,
          description: '42" 4K UHD Smart TV with streaming apps built-in',
          image: tvImage
        },
        {
          id: 5,
          name: 'Air Conditioner',
          price: 35999,
          description: '1.5 Ton Split AC with fast cooling technology',
          image: acImage
        },
        {
          id: 6,
          name: 'Lipstick',
          price: 599,
          description: 'Long-lasting matte lipstick in various shades',
          image: lipstickImage
        }
      ]
    };
  },
  methods: {
    addToCart(product) {
      cart.addItem(product);
      alert(`${product.name} added to cart!`);
    }
  }
};
</script>

<style scoped>
.card {
  background-color: #34495e;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.btn {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.product-card {
  border: 1px solid #2c3e50;
  border-radius: 10px;
}
</style>
