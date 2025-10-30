<template>
  <div class="auth-container">
    <h2>{{ isLogin ? "Login" : "Register" }}</h2>

    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />

      <button type="submit">
        {{ isLogin ? "Login" : "Register" }}
      </button>
    </form>

    <p class="switch-mode">
      <span @click="isLogin = !isLogin">
        {{
          isLogin
            ? "Don't have an account? Register now"
            : "Already registered? Log in now"
        }}
      </span>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { login, register } from "../services/authService.js";

const email = ref("");
const password = ref("");
const isLogin = ref(true);

async function handleSubmit() {
  try {
    if (isLogin.value) {
      await login(email.value, password.value);
      alert("Login successful!");
    } else {
      await register(email.value, password.value);
      alert("Registration successful! Please verify your email.");
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  border-radius: var(--border-radius);
  background: var(--color-background-dark);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  color: var(--color-text);
  font-family: var(--font-main);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

input {
  display: block;
  width: 100%;
  margin-bottom: var(--gap-md);
  padding: 0.6rem;
  border: 1px solid var(--color-muted);
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  outline: none;
  transition: border-color 0.2s ease;
}

input:focus {
  border-color: var(--color-secondary);
}

button {
  width: 100%;
  padding: 0.7rem;
  border: none;
  background-color: var(--color-primary);
  color: var(--color-text);
  font-weight: bold;
  font-size: var(--font-size-base);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background-color: var(--color-primary-hover);
}

.switch-mode {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--color-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.switch-mode:hover {
  color: var(--color-text);
}
</style>
