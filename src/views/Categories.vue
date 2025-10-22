<template>
  <div class="wrapper">
    <router-link to="/" class="back-link">⬅️ back</router-link>
    <h2>Tags</h2>

    <div v-if="loading">Loading Tags...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else class="categories">
      <div
        v-for="(articles, tagName) in categorizedNews"
        :key="tagName"
        class="category-block"
      >
        <h3 class="category-title">{{ tagName }}</h3>

        <div v-if="articles.length === 0">
          <p>No acrticles</p>
        </div>

        <div v-else class="news-list">
          <div v-for="article in articles" :key="article.id" class="news-card">
            <h4>{{ article.title }}</h4>
            <p class="meta">
              created by {{ article.author }} ·
              {{ article.published_at }}
            </p>
            <p>{{ article.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase.js";

const loading = ref(true);
const error = ref(null);
const categorizedNews = ref({});

onMounted(async () => {
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

    const categorized = {};

    newsData.forEach((article) => {
      let tagIds = article.tags;
      if (typeof tagIds === "string") {
        try {
          tagIds = JSON.parse(tagIds);
        } catch {
          tagIds = [];
        }
      }

      const tagNames = tagIds.map((id) => tagMap[id]).filter(Boolean);

      tagNames.forEach((tagName) => {
        if (!categorized[tagName]) categorized[tagName] = [];
        categorized[tagName].push({
          ...article,
          game_name: article.games?.name || "Unbekanntes Spiel",
        });
      });
    });

    categorizedNews.value = categorized;
  } catch (err) {
    console.error(err);
    error.value = "Fehler beim Laden der Kategorien.";
  } finally {
    loading.value = false;
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
  border-radius: 16px;
  overflow: hidden;
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

.categories {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
}

.category-block {
  background: var(--color-background-dark);
  padding: var(--gap-md);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-background);
}

.category-title {
  color: var(--color-primary);
  margin-bottom: var(--gap-sm);
  border-bottom: 1px solid var(--color-background);
  padding-bottom: 0.3rem;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
}

.news-card {
  background: var(--color-background);
  border-radius: var(--border-radius);
  padding: var(--gap-sm);
  transition: transform 0.2s, border-color 0.2s;
}

.news-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.meta {
  font-size: 0.8rem;
  color: var(--color-muted);
  margin-bottom: 0.4rem;
}
</style>
