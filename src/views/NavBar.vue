<template>
  <nav class="navbar">
    <div class="logo">
      <div class="icon">T</div>
      <span class="brand">GameNews</span>
    </div>
    <div class="right-section">
      <div class="nav-links">
        <a href="/">News</a>
        <router-link to="/categories">Tags</router-link>
      </div>
      <button class="login-register" @click="goToAuth">Login / Register</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goToAuth() {
  router.push("/auth");
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    to right,
    var(--color-background),
    var(--color-background-dark)
  );
  padding: 12px 24px;
  color: var(--color-text);
  font-family: var(--font-main);
}

.logo {
  display: flex;
  align-items: center;
}

.icon {
  background: linear-gradient(to right, #a100ff, #00cfff);
  color: var(--color-text);
  font-weight: bold;
  font-size: 1rem;
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--gap-sm);
}

.brand {
  font-size: 1.1rem;
}

.right-section {
  display: flex;
  align-items: center;
  gap: var(--gap-lg);
}

.nav-links {
  display: flex;
  gap: var(--gap-md);
}

.nav-links a {
  color: var(--color-muted);
  text-decoration: none;
  font-size: var(--font-size-base);
  transition: color 0.2s ease-in-out;
}

.nav-links a:hover {
  color: var(--color-text);
}

.login-register {
  background: var(--color-primary);
  color: var(--color-text);
  border: none;
  padding: 8px 16px;
  font-size: var(--font-size-base);
  font-weight: bold;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.login-register:hover {
  background: var(--color-primary-hover);
}
</style>
