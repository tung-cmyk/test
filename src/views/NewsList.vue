<template>
  <div class="news">
    <h2>Gaming-News</h2>

    <div v-if="loading">Lade Artikel...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div v-for="article in news" :key="article.id" class="news-card">
        <h3 class="article-titel">{{ article.title }}</h3>
        <p>{{ article.content }}</p>
        <p class="meta">
          Von {{ article.author }} am {{ article.published_at }}
        </p>
        <strong>Tags:</strong>
        <span v-for="name in article.tags" :key="name" class="tag">
          {{ name }}
        </span>
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
  const { data, error: fetchError } = await supabase.from("news").select("*");

  if (fetchError) {
    error.value = "Fehler beim Laden der News.";
    console.error(fetchError);
  } else {
    news.value = data;
  }

  loading.value = false;
  console.log("news: ", news.value[0].tags);
});
</script>

<style scoped>
.news-card {
  border: 1px solid #000000;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #000000;
  border-radius: 6px;
}
.meta {
  font-size: 0.9rem;
  color: #666;
}
</style>
