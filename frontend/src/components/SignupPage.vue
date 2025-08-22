<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Signup</h2>
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <form class="bg-light text-dark p-4 rounded shadow-sm">
          <div class="mb-3">
            <label>Name</label>
            <input type="text" v-model="name" class="form-control" placeholder="Enter name" />
          </div>
          <div class="mb-3">
            <label>Email</label>
            <input type="email" v-model="email" class="form-control" placeholder="Enter email" />
          </div>
          <div class="mb-3">
            <label>Password</label>
            <input type="password" v-model="password" class="form-control" placeholder="Create password" />
          </div>
          <button type="button" @click="handleSignup" class="btn btn-success w-100">Signup</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignupPage',
  data() {
    return {
      name: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async handleSignup() {
      try {
        const response = await axios.post('http://localhost:5000/api/signup', {
          name: this.name,
          email: this.email,
          password: this.password 
        });

        alert(response.data.message);
        this.$router.push('/login');
      } catch (err) {
        alert(err.response?.data?.message || 'Signup failed');
      }
    }
  }
};
</script>
