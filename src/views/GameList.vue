<template>
  <div class="wrapper">
    <h2>Game-News</h2>

    <div v-if="loadingNews">Loading News...</div>
    <div v-else-if="errorNews">{{ errorNews }}</div>

    <div v-else class="news-list">
      <div v-if="news.length === 0">No news found.</div>

      <div v-for="article in news" :key="article.id" class="news-card">
        <h3>{{ article.title }}</h3>
        <p class="meta">
          created by {{ article.author }} ·
          {{ article.published_at }}
        </p>
        <p>{{ article.content }}</p>

        <div class="tags" v-if="article.tags.length">
          <strong>Tags:</strong>
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <h2>Spiele</h2>

    <div v-if="loadingGames">Lade Spiele...</div>
    <div v-else-if="errorGames">{{ errorGames }}</div>

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
        <p><strong>Developer:</strong> {{ game.developer }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase.js";

const games = ref([]);
const loadingGames = ref(true);
const errorGames = ref(null);

const news = ref([]);
const loadingNews = ref(true);
const errorNews = ref(null);

onMounted(async () => {
  try {
    const { data, error } = await supabase.from("games").select("*");
    if (error) throw error;
    games.value = data;
  } catch (err) {
    console.error(err);
    errorGames.value = "Fehler beim Laden der Spiele.";
  } finally {
    loadingGames.value = false;
  }

  try {
    const { data: newsData, error: newsError } = await supabase
      .from("news")
      .select(
        `
        id,
        title,
        content,
        author,
        published_at,
        tags,
        game_id,
        games ( name )
      `
      )
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
        game_name: article.games?.name || "Unbekanntes Spiel",
      };
    });
  } catch (err) {
    console.error(err);
    errorNews.value = "Fehler beim Laden der News.";
  } finally {
    loadingNews.value = false;
  }
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
  border-radius: var(--border-radius);
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  margin-bottom: var(--gap-lg);
}

.news-card {
  background: var(--color-background-dark);
  border: 1px solid var(--color-background);
  border-radius: var(--border-radius);
  padding: var(--gap-md);
  transition: transform 0.2s, border-color 0.2s;
}

.news-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.meta {
  font-size: 0.85rem;
  color: var(--color-muted);
  margin-bottom: 0.5rem;
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
