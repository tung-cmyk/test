<template>
  <div class="wrapper">
    <router-link to="/" class="back-link">⬅️ go back</router-link>

    <div v-if="loading">Loading updates...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <h2>Updates for {{ gameName }}</h2>

      <div v-if="updates.length === 0">No updates found.</div>

      <div v-else class="update-list">
        <div v-for="update in updates" :key="update.id" class="update-card">
          <h3>{{ update.update_title }}</h3>
          <p class="meta">Released on: {{ update.released_at }}</p>
          <p>{{ update.update_description }}</p>
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
const updates = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    // load the game name
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select("name")
      .eq("id", gameId)
      .single();

    if (gameError) throw gameError;
    gameName.value = gameData.name;

    // load game updates
    const { data: updatesData, error: updatesError } = await supabase
      .from("game_updates")
      .select("id, update_title, update_description, released_at")
      .eq("game_id", gameId)
      .order("released_at", { ascending: false });

    if (updatesError) throw updatesError;
    updates.value = updatesData;
  } catch (err) {
    console.error(err);
    error.value = "Error loading game updates.";
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

.update-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

.update-card {
  background: var(--color-background-dark);
  border: 1px solid var(--color-background);
  border-radius: var(--border-radius);
  padding: var(--gap-md);
  transition: transform 0.2s, border-color 0.2s;
}

.update-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-secondary);
}

.meta {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-bottom: 0.4rem;
}
</style>
