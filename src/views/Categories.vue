<template>
  <div class="wrapper">
    <router-link to="/" class="back-link">⬅️ go back</router-link>
    <h2>Categories</h2>
    <div class="top-bar">
      <div class="filter-bar">
        <button
          class="filter-btn"
          :class="{ active: activeTag === null }"
          @click="activeTag = null"
        >
          All
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

      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search articles..."
          class="search-input"
        />
      </div>
    </div>

    <div class="categories">
      <div
        v-for="(articles, tagName) in filteredCategories"
        :key="tagName"
        class="category-block"
      >
        <h3 class="category-title">{{ tagName }}</h3>

        <div v-if="articles.length === 0">
          <p>No articles available.</p>
        </div>

        <div v-else class="news-list">
          <div v-for="article in articles" :key="article.id" class="news-card">
            <h4>{{ article.title }}</h4>
            <p class="meta">
              game: <strong>{{ article.game_name }}</strong> · by
              {{ article.author }} ·
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
import { ref, computed, onMounted } from "vue";
import { supabase } from "../supabase.js";

//get the data from supabase
const searchQuery = ref("");
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
    games: games ( name )
  `,
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

// if no activeTag selected return all value
const filteredCategories = computed(() => {
  const query = searchQuery.value.toLowerCase();

  const result = {};

  Object.entries(categorizedNews.value).forEach(([tagName, articles]) => {
    // Apply tag filter
    if (activeTag.value && activeTag.value !== tagName) return;

    // Apply search filter
    const filteredArticles = articles.filter((article) => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.game_name.toLowerCase().includes(query)
      );
    });

    if (filteredArticles.length > 0) {
      result[tagName] = filteredArticles;
    }
  });

  return result;
});
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: var(--gap-lg);
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.search-bar {
  flex: 0 0 280px;
}

.search-input {
  width: 100%;
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-background);
  background: var(--color-background-dark);
  color: var(--color-text);
  transition: border 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

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
  transition:
    transform 0.2s,
    border-color 0.2s;
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
