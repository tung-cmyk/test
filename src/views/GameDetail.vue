<template>
  <div class="wrapper">
    <router-link to="/" class="back-link">⬅️ Zurück</router-link>

    <div v-if="loading">loading content...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <h3 class="section-title">Updates to {{ game.name }}</h3>
      <div v-if="news.length === 0">No news found.</div>
      <div v-else class="news-list">
        <div v-for="article in news" :key="article.id" class="news-card">
          <h4>{{ article.title }}</h4>
          <p>{{ article.content }}</p>
          <p class="meta">
            from {{ article.author }} on {{ article.published_at }}
          </p>

          <div class="tags">
            <strong>Tags:</strong>
            <span v-for="tag in article.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
        </div>
      </div>

      <h3 class="section-title">Ratings</h3>
      <div v-if="reviews.length === 0">No ratings found.</div>
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
  padding: var(--gap-lg) var(--gap-md);
  color: var(--color-text);
  font-family: var(--font-main);
  background-color: var(--color-background);
}

.back-link {
  display: inline-block;
  margin-bottom: var(--gap-md);
  color: var(--color-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-secondary);
}

.section-title {
  margin-top: var(--gap-lg);
  margin-bottom: var(--gap-sm);
  border-bottom: 1px solid var(--color-background-dark);
  padding-bottom: 0.3rem;
  color: var(--color-primary);
}

.news-card,
.review-card {
  background: var(--color-background-dark);
  border: 1px solid var(--color-background);
  border-radius: var(--border-radius);
  padding: var(--gap-md);
  margin-bottom: var(--gap-md);
  transition: transform 0.2s, border-color 0.2s;
}

.news-card:hover,
.review-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.meta {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.tag {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-text);
  border-radius: var(--border-radius);
  padding: 0.2rem 0.5rem;
  margin-right: 0.3rem;
  font-size: 0.8rem;
}

.tag:hover {
  background: var(--color-primary-hover);
}
</style>
