<template>
  <div class="wrapper">
    <router-link to="/" class="back-link">⬅️ go back</router-link>

    <div v-if="loading">Loading updates...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div class="game-header">
        <div
          class="game-banner-wrapper"
          :style="{ backgroundImage: `url(${gameImage})` }"
        ></div>
        <div class="header-content">
          <h1>Updates for {{ gameName }}</h1>
          <div class="game-meta">
            <span>Developer: {{ gameDeveloper }}</span>
            <span>Genre: {{ gameGenre }}</span>
          </div>
        </div>
      </div>

      <h2 class="section-title">Patch History</h2>

      <div v-if="updates.length === 0" class="no-updates">
        No updates found for {{ gameName }}.
      </div>

      <div v-else class="update-list">
        <div
          v-for="(update, index) in updates"
          :key="update.id"
          :class="['update-card', { 'is-latest': index === 0 }]"
        >
          <span v-if="index === 0" class="new-badge">✨ Latest Update</span>

          <h3>{{ update.update_title }}</h3>
          <p class="meta">Released on: {{ update.released_at }}</p>
          <div class="update-description">{{ update.update_description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../supabase.js";

const route = useRoute();
const gameId = route.params.id;

const gameName = ref("");
const gameImage = ref("");
const gameGenre = ref("N/A");
const gameDeveloper = ref("N/A");

const updates = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const [gameResult, updatesResult] = await Promise.all([
      // Load game details for the header
      supabase
        .from("games")
        .select("name, image, genre, developer")
        .eq("id", gameId)
        .single(),

      // Load game updates
      supabase
        .from("game_updates")
        .select("id, update_title, update_description, released_at")
        .eq("game_id", gameId)
        .order("released_at", { ascending: false }),
    ]);

    // Error Handling
    if (gameResult.error) throw gameResult.error;
    if (updatesResult.error) throw updatesResult.error;

    // Set Game Data
    gameName.value = gameResult.data.name;
    gameImage.value = gameResult.data.image || ""; // Use empty string if null
    gameGenre.value = gameResult.data.genre;
    gameDeveloper.value = gameResult.data.developer;

    // Set Updates Data
    updates.value = updatesResult.data;
  } catch (err) {
    console.error(err);
    error.value = "Error loading game details or updates.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--gap-lg) var(--gap-md);
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-main);
  border-radius: 16px;
}
.back-link {
  display: inline-block;
  margin-bottom: var(--gap-md);
  color: var(--color-muted);
  text-decoration: none;
}
.back-link:hover {
  color: var(--color-primary);
}
.section-title {
  margin-top: var(--gap-lg);
  margin-bottom: var(--gap-md);
}
.meta {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-bottom: 0.4rem;
}
.update-description {
  line-height: 1.6;
}

.game-header {
  margin-bottom: var(--gap-xl);
  border-radius: var(--border-radius);
  overflow: hidden;
  position: relative;
  border: 1px solid var(--color-background-darker);
}

.game-banner-wrapper {
  height: 200px;
  background-size: cover;
  background-position: center;
  background-color: #333;
  position: relative;
}

.game-banner-wrapper::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

.header-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--gap-md);
  z-index: 10;
  color: white;
}
.header-content h1 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}
.game-meta {
  font-size: 0.9rem;
  color: var(--color-muted);
}
.game-meta span:not(:last-child) {
  margin-right: var(--gap-md);
}

.update-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
  position: relative;
}

.update-list::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  width: 2px;
  background-color: var(--color-background-darker);
}

.update-card {
  background: var(--color-background-dark);
  border: 1px solid var(--color-background);
  border-left: 5px solid var(--color-background-dark);
  border-radius: var(--border-radius);
  padding: var(--gap-md);
  padding-left: calc(var(--gap-md) + 20px);
  transition: all 0.2s;
  position: relative;
}

.update-card::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 15px;
  width: 8px;
  height: 8px;
  background: var(--color-muted);
  border-radius: 50%;
  z-index: 5;
}

.update-card:hover {
  transform: none;
  border-color: var(--color-secondary);
}

.update-card.is-latest {
  border: 1px solid var(--color-primary);
  background: var(--color-background-dark);
  box-shadow: 0 0 10px rgba(var(--color-primary-rgb), 0.2);
}
.update-card.is-latest::before {
  background: var(--color-primary);
}
.new-badge {
  position: absolute;
  top: -10px;
  right: var(--gap-md);
  background: var(--color-primary);
  color: var(--color-text-dark);
  padding: 0.2rem 0.6rem;
  border-radius: var(--border-radius);
  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;
}
</style>
