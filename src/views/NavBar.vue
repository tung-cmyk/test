<template>
  <nav class="navbar">
    <!-- Left: Logo -->
    <div class="logo">
      <div class="icon">T</div>
      <span class="brand">GameNews</span>
    </div>

    <!-- Right: Links + Auth -->
    <div class="right-section">
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/categories">Categories</router-link>
        <router-link v-if="user" to="/profile">Profile</router-link>
        <!-- 👈 added -->
      </div>

      <div class="auth-section">
        <template v-if="user">
          <span class="user-email">👋 {{ user.email }}</span>
          <button class="logout-btn" @click="logout">Logout</button>
        </template>
        <template v-else>
          <router-link to="/auth" class="login-btn">Login</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserAuth } from "@/composables/useAuth";
const { user, logout } = useUserAuth();

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
  color: var(--color-text);
  padding: 12px 24px;
  font-family: var(--font-main);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
}

.icon {
  background: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  color: var(--color-text);
  font-weight: bold;
  font-size: 1rem;
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand {
  font-size: 1.2rem;
  font-weight: 600;
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
  font-weight: 500;
  font-size: var(--font-size-base);
  transition: color 0.2s ease-in-out;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--color-primary);
}

.auth-section {
  display: flex;
  align-items: center;
  gap: var(--gap-md);
}

.user-email {
  font-size: 0.9rem;
  color: var(--color-muted);
}

.login-btn,
.logout-btn {
  background: var(--color-primary);
  color: var(--color-text);
  border: none;
  padding: 8px 16px;
  font-size: var(--font-size-base);
  font-weight: bold;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background 0.2s ease-in-out, transform 0.1s;
}

.login-btn:hover,
.logout-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
