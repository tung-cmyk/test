<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import { useUserAuth } from "@/composables/useAuth";

const { user, role } = useUserAuth();
const newsList = ref([]);
const title = ref("");
const content = ref("");

onMounted(async () => {
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });
  newsList.value = data;
});

const addArticle = async () => {
  if (role.value !== "admin") return alert("Only admins can add articles!");

  const { error } = await supabase.from("news").insert([
    {
      title: title.value,
      content: content.value,
      author_id: user.value.id,
    },
  ]);

  if (!error) {
    title.value = "";
    content.value = "";
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    newsList.value = data;
  }
};
</script>

<template>
  <div class="news-page">
    <h1>Latest News</h1>

    <div v-if="role === 'admin'" class="add-news-form">
      <input v-model="title" placeholder="Title" />
      <textarea v-model="content" placeholder="Content"></textarea>
      <button @click="addArticle">Add Article</button>
    </div>

    <div class="news-list">
      <div v-for="item in newsList" :key="item.id" class="news-item">
        <h2>{{ item.title }}</h2>
        <p>{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>
