<template>
  <nav class="navbar">
    <div class="logo">
      <div class="icon">T</div>
      <span class="brand">GameNews</span>
    </div>
    <div class="right-section">
      <div class="nav-links">
        <a href="#">News</a>
        <a href="#">Reviews</a>
        <a href="#">Categories</a>
      </div>
      <button class="subscribe-button">Subscribe</button>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right, #0a0a0a, #0f0f10);
  padding: 12px 24px;
  color: white;
  font-family: "Segoe UI", sans-serif;
}

.logo {
  display: flex;
  align-items: center;
}

.icon {
  background: linear-gradient(to right, #a200ff, #00f6ff);
  color: white;
  font-weight: bold;
  font-size: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.brand {
  font-size: 1.1rem;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-links a {
  color: #cfcfcf;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease-in-out;
}

.nav-links a:hover {
  color: white;
}

.subscribe-button {
  background: #a200ff;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}

.subscribe-button:hover {
  background: #a200ff;
}
</style>
