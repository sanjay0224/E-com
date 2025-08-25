<template>
  <div class="container mt-5 text-light">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card bg-dark shadow-lg border-0 p-4 rounded">
          <div class="card-body">
            <h1 class="text-center mb-4">About Us</h1>
            <p class="lead text-center">
              Welcome to <strong>Our E-Shop</strong>, your trusted destination for quality products at affordable prices.
              We aim to bring you the best shopping experience with secure checkout and fast delivery .
            </p>
            <hr class="mx-4 text-light" />

            <h3 class="mb-3">Our Mission</h3>
            <p>
              Our mission is to provide a seamless online shopping platform where customers can easily browse, select,
              and purchase their favorite items. We are dedicated to delivering the best service, 
              maintaining trust, and ensuring customer satisfaction.
            </p>

            <h3 class="mb-3">Our Vision</h3>
            <p>
              We envision becoming a leading e-commerce platform by continuously innovating and 
              focusing on customer needs while staying committed to quality and affordability.
            </p>

            <hr class="my-4 text-light" />

            <div class="text-center mt-4">
              <img
                src="https://via.placeholder.com/150"
                alt="Founder"
                class="rounded-circle shadow mb-3"
              />
              <h4>SANJAYKUMAR</h4>
              <p class="text-muted">Founder & CEO</p>
              <p>
                Sanjaykumar started this journey with a passion for technology and entrepreneurship.
                With a vision to simplify online shopping, he leads the team to build an innovative,
                customer-first platform.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage"
};
</script>

<style scoped>
.card {
  background: #22374d;
  color: #f8f9fa;
}
h1, h3 {
  color: #00d4ff;
}
img {
  width: 120px;
  height: 120px;
}
</style>
