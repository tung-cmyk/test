<template>
  <div class="wrapper">
    <h2>Spiele</h2>

    <div v-if="loading">Lade Spiele...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else class="games">
      <router-link
        v-for="game in games"
        :key="game.id"
        :to="`/game/${game.id}`"
        class="game-card"
      >
        <h3>{{ game.name }}</h3>
        <p><strong>Genre:</strong> {{ game.genre }}</p>
        <p><strong>Release:</strong> {{ game.release_date }}</p>
        <p><strong>Entwickler:</strong> {{ game.developer }}</p>
      </router-link>
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
  const { data, error: fetchError } = await supabase
    .from("games")
    .select(`*,game_tags ( tags (*) )`);

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
.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--gap-lg) var(--gap-md);
  color: var(--color-text);
  font-family: var(--font-main);
  background-color: var(--color-background);
}

.games {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--gap-md);
}

.game-card {
  display: block;
  border: 1px solid var(--color-background-dark);
  padding: var(--gap-md);
  background: var(--color-background-dark);
  border-radius: var(--border-radius);
  color: var(--color-text);
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  background: var(--color-primary-hover);
}

@media (max-width: 600px) {
  .games {
    grid-template-columns: 1fr;
  }
}
</style>
