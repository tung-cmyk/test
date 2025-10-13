<template>
  <div class="games">
    <h2>Spiele</h2>

    <div v-if="loading">Lade Spiele...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div v-for="game in games" :key="game.id" class="game-card">
        <h3>{{ game.name }}</h3>
        <p><strong>Genre:</strong> {{ game.genre }}</p>
        <!--       <p><strong>Plattformen:</strong> {{ game.platforms.join(", ") }}</p>-->
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
.games {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem; /* spacing between columns and rows */
  padding: 1rem;
}

.game-card {
  border: 1px solid #333;
  padding: 1rem;
  background: #111;
  border-radius: 6px;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}

/* Make it responsive */
@media (max-width: 900px) {
  .games {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .games {
    grid-template-columns: 1fr;
  }
}
</style>
