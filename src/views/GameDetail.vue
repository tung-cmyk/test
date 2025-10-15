<template>
  <div class="wrapper">
    <router-link to="/app" class="back-link">⬅️ Zurück</router-link>

    <div v-if="loading">Lade Spieldetails...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div class="game-header">
        <h2>{{ game.name }}</h2>
        <p><strong>Genre:</strong> {{ game.genre }}</p>
        <p><strong>Plattformen:</strong> {{ game.platforms }}</p>
        <p><strong>Release:</strong> {{ game.release_date }}</p>
        <p><strong>Entwickler:</strong> {{ game.developer }}</p>
        <p><strong>Publisher:</strong> {{ game.publisher }}</p>
        <p>{{ game.description }}</p>
      </div>

      <h3 class="section-title">Neuigkeiten zu {{ game.name }}</h3>
      <div v-if="news.length === 0">Keine News gefunden.</div>
      <div v-else class="news-list">
        <div v-for="article in news" :key="article.id" class="news-card">
          <h4>{{ article.title }}</h4>
          <p>{{ article.content }}</p>
          <p class="meta">
            Von {{ article.author }} am {{ article.published_at }}
          </p>

          <div class="tags">
            <strong>Tags:</strong>
            <span v-for="tag in article.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
        </div>
      </div>

      <h3 class="section-title">Spielerbewertungen</h3>
      <div v-if="reviews.length === 0">Keine Bewertungen vorhanden.</div>
      <div v-else class="review-list">
        <div v-for="review in reviews" :key="review.id" class="review-card">
          <p>
            <strong>{{ review.username }}</strong> – {{ review.rating }}/10
          </p>
          <p>"{{ review.review_text }}"</p>
          <p class="meta">{{ review.created_at }}</p>
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

const game = ref(null);
const news = ref([]);
const reviews = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    if (gameError) throw gameError;
    game.value = gameData;

    const { data: newsData, error: newsError } = await supabase
      .from("news")
      .select("*")
      .eq("game_id", gameId)
      .order("published_at", { ascending: false });

    if (newsError) throw newsError;

    const { data: tagsData, error: tagsError } = await supabase
      .from("tags")
      .select("id, name");

    if (tagsError) throw tagsError;

    const tagMap = Object.fromEntries(tagsData.map((t) => [t.id, t.name]));

    news.value = newsData.map((article) => {
      let tagIds = article.tags;
      if (typeof tagIds === "string") {
        try {
          tagIds = JSON.parse(tagIds);
        } catch {
          tagIds = [];
        }
      }
      return {
        ...article,
        tags: tagIds.map((id) => tagMap[id]).filter(Boolean),
      };
    });

    const { data: reviewData, error: reviewError } = await supabase
      .from("reviews")
      .select(
        `
        id,
        rating,
        review_text,
        created_at,
        user_id,
        users (username)
      `
      )
      .eq("game_id", gameId)
      .order("created_at", { ascending: false });

    if (reviewError) throw reviewError;

    reviews.value = reviewData.map((r) => ({
      ...r,
      username: r.users?.username || "Unbekannt",
    }));
  } catch (err) {
    console.error(err);
    error.value = "Fehler beim Laden der Spieldetails.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: white;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #ccc;
  text-decoration: none;
}

.section-title {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #444;
  padding-bottom: 0.3rem;
}

.news-card,
.review-card {
  background: #111;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.meta {
  font-size: 0.8rem;
  color: #aaa;
}

.tag {
  display: inline-block;
  background: #333;
  color: #fff;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  margin-right: 0.3rem;
  font-size: 0.8rem;
}
</style>
