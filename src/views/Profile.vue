<template>
  <div class="profile-container">
    <h1 class="title">Your Profile</h1>

    <div class="profile-card" v-if="user">
      <div class="avatar">{{ initials }}</div>

      <div class="info">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>User ID:</strong> {{ user.id }}</p>
      </div>

      <button class="logout-btn" @click="logout">Logout</button>
    </div>

    <div v-else class="loading">Loading your profile...</div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserAuth } from "@/composables/useAuth";
const { user, logout } = useUserAuth();

const initials = computed(() => {
  if (!user.value?.email) return "?";
  return user.value.email.charAt(0).toUpperCase();
});
</script>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 60px auto;
  padding: 24px;
  background: linear-gradient(
    to bottom right,
    var(--color-background),
    var(--color-background-dark)
  );
  color: var(--color-text);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  text-align: center;
  font-family: var(--font-main);
}

.title {
  font-size: 1.8rem;
  margin-bottom: 24px;
  color: var(--color-primary);
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-md);
}

.avatar {
  background: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  color: var(--color-text);
  font-size: 2rem;
  font-weight: bold;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info {
  text-align: left;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: var(--border-radius);
}

.info p {
  margin: 6px 0;
  font-size: var(--font-size-base);
}

.logout-btn {
  margin-top: 16px;
  background: var(--color-primary);
  color: var(--color-text);
  border: none;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease-in-out, transform 0.1s;
}

.logout-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}
</style>
