<template>
  <div class="wrapper">
    <h2>Game-News</h2>

    <div v-if="loadingNews">Loading News...</div>
    <div v-else-if="errorNews">{{ errorNews }}</div>

    <div v-else class="news-list">
      <div v-if="news.length === 0">No news found.</div>

      <router-link
        v-for="article in news"
        :key="article.id"
        :to="`/game/${article.game_id}/updates`"
        class="news-card"
      >
        <h3>{{ article.title }}</h3>
        <p class="meta">
          created by {{ article.author }} · {{ article.published_at }}
        </p>
        <p>{{ article.content }}</p>

        <div class="tags" v-if="article.tags.length">
          <strong>Tags: </strong>
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </router-link>
    </div>

    <h2>Games</h2>

    <div v-if="loadingGames">Lade Spiele...</div>
    <div v-else-if="errorGames">{{ errorGames }}</div>

    <div v-else class="games">
      <router-link
        v-for="game in games"
        :key="game.id"
        :to="`/game/${game.id}`"
        class="game-card"
      >
        <div class="game-image-wrapper" :aria-hidden="true">
          <img
            v-if="game && game.image"
            :src="game.image"
            :alt="game.name"
            class="game-image"
          />
        </div>

        <div class="game-info">
          <h3>{{ game.name }}</h3>
          <p><strong>Genre:</strong> {{ game.genre }}</p>
          <p><strong>Release:</strong> {{ game.release_date }}</p>
          <p><strong>Developer:</strong> {{ game.developer }}</p>
        </div>
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
    // 1. Lade News OHNE tags-Spalte
    const { data: newsData, error: newsError } = await supabase
      .from("news")
      .select(
        `
      id,
      title,
      content,
      author,
      published_at,
      game_id,
      games ( name )
    `
      )
      .order("published_at", { ascending: false })
      .limit(3);

    if (newsError) throw newsError;

    // 2. Lade alle Tag-Verknüpfungen für diese news-ids
    const ids = newsData.map((n) => n.id);

    const { data: tagLinks, error: tagLinkError } = await supabase
      .from("tag_links")
      .select("target_id, tags(name)")
      .eq("target_type", "news")
      .in("target_id", ids);

    if (tagLinkError) throw tagLinkError;

    // 3. Ordne Tags den News zu
    const tagMap = {};
    tagLinks.forEach((link) => {
      if (!tagMap[link.target_id]) tagMap[link.target_id] = [];
      tagMap[link.target_id].push(link.tags.name);
    });

    // 4. Setze News + Tags zusammen
    news.value = newsData.map((article) => ({
      ...article,
      tags: tagMap[article.id] || [],
      game_name: article.games?.name || "Unbekanntes Spiel",
    }));
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
  text-decoration: none;
  color: inherit;
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

.games {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--gap-md);
}

.game-card {
  position: relative;
  display: block;
  overflow: hidden;
  border: 1px solid var(--color-background-dark);
  border-radius: var(--border-radius);
  background: var(--color-background-dark);
  color: var(--color-text);
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}
.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
}

.game-image-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}
.game-card:hover .game-image-wrapper {
  opacity: 1;
}

.game-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
  transition: transform 0.45s ease;
}
.game-card:hover .game-image {
  transform: scale(1.05);
}

.game-info {
  position: relative;
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
  padding: var(--gap-md);
  border-radius: var(--border-radius);
  transition: background 0.3s ease;
}
.game-card:hover .game-info {
  background: rgba(0, 0, 0, 0.45);
}

@media (max-width: 600px) {
  .games {
    grid-template-columns: 1fr;
  }
}
</style>
