<template>
  <div class="container mt-4 text-light d-flex justify-content-center">
    <div class="w-100" style="max-width: 500px;">
      <h2 class="mb-3">💳 Payment</h2>
      <p>Thanks for shopping with us! Please fill in your details to complete the purchase.</p>

      <form @submit.prevent="submitPayment" class="bg-dark p-4 rounded shadow">
        <div class="mb-3">
          <label for="name" class="form-label">Full Name</label>
          <input type="text" v-model="form.name" class="form-control" id="name" required />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" v-model="form.email" class="form-control" id="email" required />
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">Shipping Address</label>
          <textarea v-model="form.address" class="form-control" id="address" rows="3" required></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Select Payment Method</label>
          <div class="form-check">
            <input class="form-check-input" type="radio" value="Credit Card" v-model="form.paymentMethod" id="credit" required />
            <label class="form-check-label" for="credit">Credit Card</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" value="UPI" v-model="form.paymentMethod" id="upi" />
            <label class="form-check-label" for="upi">UPI</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" value="Cash on Delivery" v-model="form.paymentMethod" id="cod" />
            <label class="form-check-label" for="cod">Cash on Delivery</label>
          </div>
        </div>

        <button type="submit" class="btn btn-success w-100">Pay Now</button>
      </form>

      <div v-if="paymentSuccess" class="alert alert-success mt-4" role="alert">
        ✅ Payment successful! Your order will be delivered soon.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        address: '',
        paymentMethod: ''
      },
      paymentSuccess: false
    };
  },
  methods: {
    submitPayment() {
      if (
        this.form.name &&
        this.form.email &&
        this.form.address &&
        this.form.paymentMethod
      ) {
        this.paymentSuccess = true;
        console.log('Payment Details:', this.form);
        // Here, add API call or further actions
      }
    }
  }
};
</script>

<style scoped>
form {
  background-color: #2c3e50;
}
label {
  font-weight: 500;
}
</style>