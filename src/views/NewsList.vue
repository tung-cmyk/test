<template>
  <div class="news">
    <h2>Gaming-News</h2>

    <div v-if="loading">Loading content...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div v-for="article in news" :key="article.id" class="news-card">
        <h3 class="article-title">{{ article.title }}</h3>
        <p>{{ article.content }}</p>
        <p class="meta">
          Von {{ article.author }} am {{ article.published_at }}
        </p>

        <div class="tags">
          <strong>Tags:</strong>
          <span v-for="tagName in article.tags" :key="tagName" class="tag">
            {{ tagName }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase.js";

const news = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const { data: newsData, error: newsError } = await supabase
    .from("news")
    .select("*");

  const { data: tagsData, error: tagsError } = await supabase
    .from("tags")
    .select("id, name");

  if (newsError || tagsError) {
    error.value = "Fehler beim Laden der Daten.";
    console.error(newsError || tagsError);
  } else {
    const tagMap = Object.fromEntries(
      tagsData.map((tag) => [tag.id, tag.name])
    );

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
  }

  loading.value = false;
});
</script>

<style scoped>
.news {
  padding: 1rem;
}

.news-card {
  border: 1px solid #333;
  background: #000;
  color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
}

.meta {
  font-size: 0.9rem;
  color: #888;
}

.tags {
  margin-top: 0.5rem;
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
