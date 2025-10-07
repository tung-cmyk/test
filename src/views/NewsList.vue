<template>
  <div class="news">
    <h2>Gaming-News</h2>

    <div v-if="loading">Lade Artikel...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div v-for="article in news" :key="article.id" class="news-card">
        <h3>{{ article.title }}</h3>
        <p>{{ article.content }}</p>
        <p class="meta">
          Von {{ article.author }} am {{ article.published_at }}
        </p>
        <p><strong>Tags:</strong> {{ article.tags?.join(", ") }}</p>
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
});
</script>

<style scoped>
.news-card {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 6px;
}
.meta {
  font-size: 0.9rem;
  color: #666;
}
</style>
