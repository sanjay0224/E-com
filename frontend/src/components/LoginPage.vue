<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Login</h2>
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <form class="bg-light text-dark p-4 rounded shadow-sm">
          <div class="mb-3">
            <label>Email</label>
            <input type="email" v-model="email" class="form-control" placeholder="Enter email" />
          </div>
          <div class="mb-3">
            <label>Password</label>
            <input type="password" v-model="password" class="form-control" placeholder="Enter password" />
          </div>
          <button type="button" @click="handleLogin" class="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          email: this.email,
          password: this.password
        });

        alert(response.data.message);

        // Removed page locking and redirection logic
        // localStorage.setItem('isLoggedIn', 'true');
        // localStorage.setItem('userName', response.data.name);
        // this.$router.push('/home');

      } catch (err) {
        alert(err.response?.data?.message || 'Login failed');
      }
    }
  }
};
</script>
