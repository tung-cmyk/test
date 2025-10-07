<template>
  <div class="games">
    <h2>Spiele</h2>

    <div v-if="loading">Lade Spiele...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div v-for="game in games" :key="game.id" class="game-card">
        <h3>{{ game.name }}</h3>
        <p><strong>Genre:</strong> {{ game.genre }}</p>
        <p><strong>Plattformen:</strong> {{ game.platforms.join(", ") }}</p>
        <p><strong>Release:</strong> {{ game.release_date }}</p>
        <p><strong>Entwickler:</strong> {{ game.developer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase.js";

const games = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const { data, error: fetchError } = await supabase.from("games").select("*");

  if (fetchError) {
    error.value = "Fehler beim Laden der Spiele.";
    console.error(fetchError);
  } else {
    games.value = data;
  }

  loading.value = false;
});
</script>

<style scoped>
.game-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f5f5f5;
  border-radius: 6px;
}
</style>
