<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="avatar">👤</div>
      <h1 class="user-title">User Profile</h1>

      <div v-if="user" class="user-info">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p>
          <strong>Role: </strong>
          <span :class="['role-badge', role === 'admin' ? 'admin' : 'user']">{{
            role
          }}</span>
        </p>
      </div>
    </div>

    <!-- Admin News Section -->
    <div v-if="role === 'admin'" class="admin-section">
      <h2 class="section-title">Post News</h2>

      <!-- Add new article -->
      <div class="card add-news-form">
        <input v-model="title" placeholder="News title" />
        <textarea v-model="content" placeholder="Write something..."></textarea>
        <button class="btn-primary" @click="addArticle">Add Article</button>
      </div>

      <!-- Edit/Delete articles -->
      <div v-if="newsList.length" class="news-list">
        <div
          v-for="article in newsList"
          :key="article.id"
          class="card news-item"
        >
          <div class="news-header">
            <h3>{{ article.title }}</h3>
            <div class="actions">
              <button class="btn-edit" @click="startEditing(article)">
                Edit
              </button>
              <button class="btn-delete" @click="deleteArticle(article.id)">
                Delete
              </button>
            </div>
          </div>
          <p class="news-content">{{ article.content }}</p>
        </div>
      </div>

      <div v-if="editingArticle" class="card edit-form">
        <h3>Edit Article</h3>
        <input v-model="editTitle" />
        <textarea v-model="editContent"></textarea>
        <div class="edit-actions">
          <button class="btn-primary" @click="updateArticle">
            Save Changes
          </button>
          <button class="btn-cancel" @click="cancelEdit">Cancel</button>
        </div>
      </div>
    </div>

    <div v-else class="non-admin-message card">
      <p>You are not an admin — viewing-only mode.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import { useUserAuth } from "@/composables/useAuth";

const { user, role } = useUserAuth();

const newsList = ref([]);
const title = ref("");
const content = ref("");
const editingArticle = ref(null);
const editTitle = ref("");
const editContent = ref("");

const loadNews = async () => {
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });
  newsList.value = data || [];
};

onMounted(loadNews);

const addArticle = async () => {
  if (role.value !== "admin") return alert("Only admins can add news.");

  const { error } = await supabase.from("news").insert([
    {
      title: title.value,
      content: content.value,
      author: user.value.email,
      tags: "general",
    },
  ]);

  if (error) {
    console.error("Error adding news:", error);
    alert("Error adding news: " + error.message);
  } else {
    title.value = "";
    content.value = "";
    await loadNews();
  }
};

const startEditing = (article) => {
  editingArticle.value = article;
  editTitle.value = article.title;
  editContent.value = article.content;
};

const cancelEdit = () => {
  editingArticle.value = null;
  editTitle.value = "";
  editContent.value = "";
};

const updateArticle = async () => {
  if (!editingArticle.value) return;
  const { error } = await supabase
    .from("news")
    .update({
      title: editTitle.value,
      content: editContent.value,
    })
    .eq("id", editingArticle.value.id);

  if (!error) {
    editingArticle.value = null;
    loadNews();
  }
};

const deleteArticle = async (id) => {
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (!error) loadNews();
};
</script>

<style scoped>
.profile-page {
  color: var(--color-text);
  padding: var(--gap-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-lg);
  font-family: var(--font-main);
}

.profile-card {
  background: linear-gradient(
    145deg,
    var(--color-background-dark),
    var(--color-background)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px rgba(138, 43, 226, 0.25);
  text-align: center;
  padding: var(--gap-lg);
  max-width: 400px;
  width: 100%;
}

.avatar {
  font-size: 2.8rem;
  background: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto var(--gap-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-title {
  font-size: 1.5rem;
  margin-bottom: var(--gap-sm);
  font-weight: 600;
}

.user-info p {
  margin: 0.5rem 0;
  font-size: var(--font-size-base);
}

.role-badge {
  padding: 4px 10px;
  border-radius: var(--border-radius);
  text-transform: capitalize;
  font-weight: 600;
}

.role-badge.admin {
  background: var(--color-primary);
  color: var(--color-text);
}

.role-badge.user {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-muted);
}

.admin-section {
  width: 100%;
  max-width: 800px;
}

.section-title {
  font-size: 1.3rem;
  margin-bottom: var(--gap-md);
  text-align: left;
  color: var(--color-primary);
}

.card {
  background: var(--color-background-dark);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--border-radius);
  padding: var(--gap-md);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.add-news-form,
.edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
}

input,
textarea {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--border-radius);
  padding: 10px;
  font-family: var(--font-main);
  font-size: var(--font-size-base);
}

textarea {
  min-height: 80px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.news-content {
  color: var(--color-muted);
  margin-top: var(--gap-sm);
  line-height: 1.5;
}

.actions,
.edit-actions {
  display: flex;
  gap: var(--gap-sm);
}

button {
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.1s ease;
  font-family: var(--font-main);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-text);
  padding: 8px 16px;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.btn-edit {
  background: var(--color-secondary);
  color: var(--color-background);
  padding: 6px 12px;
}

.btn-edit:hover {
  opacity: 0.9;
}

.btn-delete {
  background: hsl(0, 70%, 45%);
  color: var(--color-text);
  padding: 6px 12px;
}

.btn-delete:hover {
  background: hsl(0, 70%, 55%);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
  padding: 8px 16px;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.non-admin-message {
  text-align: center;
  opacity: 0.8;
  max-width: 400px;
  background: var(--color-background-dark);
  border-radius: var(--border-radius);
  padding: var(--gap-md);
}
</style>
