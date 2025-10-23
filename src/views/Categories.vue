<template>
  <div class="wrapper">
    <router-link to="/" class="back-link">⬅️ go back</router-link>
    <h2>Categories</h2>

    <div v-if="loading">Lade Kategorien...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div class="filter-bar">
        <button
          class="filter-btn"
          :class="{ active: activeTag === null }"
          @click="activeTag = null"
        >
          Alle
        </button>
        <button
          v-for="tagName in Object.keys(categorizedNews)"
          :key="tagName"
          class="filter-btn"
          :class="{ active: activeTag === tagName }"
          @click="activeTag = tagName"
        >
          {{ tagName }}
        </button>
      </div>

      <div class="categories">
        <div
          v-for="(articles, tagName) in filteredCategories"
          :key="tagName"
          class="category-block"
        >
          <h3 class="category-title">{{ tagName }}</h3>

          <div v-if="articles.length === 0">
            <p>Keine Artikel vorhanden.</p>
          </div>

          <div v-else class="news-list">
            <div
              v-for="article in articles"
              :key="article.id"
              class="news-card"
            >
              <h4>{{ article.title }}</h4>
              <p class="meta">
                Spiel: <strong>{{ article.game_name }}</strong> · von
                {{ article.author }} ·
                {{ article.published_at }}
              </p>
              <p>{{ article.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "../supabase.js";

//get the data from supabase
const loading = ref(true);
const error = ref(null);
const categorizedNews = ref({});
const activeTag = ref(null);

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

// Filter if not individual String, if value includes search item value
const filteredCategories = computed(() => {
  if (!activeTag.value) return categorizedNews.value;
  return { [activeTag.value]: categorizedNews.value[activeTag.value] || [] };
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

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: var(--gap-md);
}

.filter-btn {
  background: var(--color-background-dark);
  border: 1px solid var(--color-background);
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  color: var(--color-text);
  transition: all 0.2s;
}
.filter-btn:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}
.filter-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
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
