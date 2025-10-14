<template>
  <div class="wrapper">
    <h2>Spiele</h2>

    <div v-if="loading">Lade Spiele...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else class="games">
      <div v-for="game in games" :key="game.id" class="game-card">
        <h3>{{ game.name }}</h3>
        <p><strong>Genre:</strong> {{ game.genre }}</p>
        <!-- <p><strong>Plattformen:</strong> {{ game.platforms.join(", ") }}</p> -->
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
  padding: 2rem 1rem;
  color: white;
}

.games {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.game-card {
  border: 1px solid #333;
  padding: 1rem;
  background: #111;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}

@media (max-width: 600px) {
  .games {
    grid-template-columns: 1fr;
  }
}
</style>
