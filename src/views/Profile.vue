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
      <!-- Admin User Management -->
      <div class="card" style="margin-top: 2rem">
        <h2 class="section-title">User Management</h2>

        <div v-if="loadingUsers">Loading users...</div>

        <table v-else class="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="u in allUsers" :key="u.id">
              <td>{{ u.email }}</td>

              <td>
                <span :class="['role-badge', u.is_admin ? 'admin' : 'user']">
                  {{ u.is_admin ? "admin" : "user" }}
                </span>
              </td>

              <td>{{ new Date(u.created_at).toLocaleDateString() }}</td>

              <td>
                <button
                  class="btn-delete"
                  @click="deleteUser(u.id)"
                  :disabled="u.id === user?.id"
                  title="You cannot delete your own account"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="section-title">Post News</h2>

      <!-- Add new article -->
      <div class="card add-news-form">
        <input v-model="title" placeholder="News title" />
        <textarea v-model="content" placeholder="Write something..."></textarea>

        <!-- TAG INPUT -->
        <input
          v-model="tagInput"
          placeholder="Enter tags separated by comma, e.g. action, update"
        />

        <button class="btn-primary" @click="addArticle">Add Article</button>
      </div>

      <!-- Existing articles -->
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

          <!-- TAGS LIST -->
          <div v-if="article.tags.length" class="tag-list">
            <span
              class="tag"
              v-for="tag in article.tags"
              :key="tag.id"
              @click="filterByTag(tag.name)"
            >
              #{{ tag.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Edit form -->
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

const deleteUser = async (userId) => {
  if (!confirm("Delete this user permanently?")) return;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  await fetch(
    "https://niydeuqqyaszdhlruruo.supabase.co/functions/v1/delete-account",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ user_id: userId }),
    },
  );
};

const { user, role } = useUserAuth();

const newsList = ref([]);
const title = ref("");
const content = ref("");
const tagInput = ref(""); // ⭐ NEU

const editingArticle = ref(null);
const editTitle = ref("");
const editContent = ref("");

const allUsers = ref([]);
const loadingUsers = ref(false);

onMounted(async () => {
  await loadNews();
  await loadAllUsers(); // 👈 admin-only
});
// Load all users (admin only)

const loadAllUsers = async () => {
  if (role.value !== "admin") return;

  loadingUsers.value = true;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, is_admin, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading users:", error);
  } else {
    allUsers.value = data;
  }

  loadingUsers.value = false;
};

// Load all news including tags
const loadNews = async () => {
  const { data: articles } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  for (const a of articles) {
    const { data: tagLinks } = await supabase
      .from("tag_links")
      .select("tag_id, tags(name)")
      .eq("target_type", "news")
      .eq("target_id", a.id);

    a.tags = tagLinks?.map((t) => ({ id: t.tag_id, name: t.tags.name })) || [];
  }

  newsList.value = articles;
};

onMounted(loadNews);

// Add article with tags
const addArticle = async () => {
  if (role.value !== "admin") return alert("Only admins can add news.");

  // 1. Insert article
  const { data: article, error: articleError } = await supabase
    .from("news")
    .insert({
      title: title.value,
      content: content.value,
      author: user.value.email,
    })
    .select()
    .single();

  if (articleError) {
    console.error(articleError);
    return alert("Error adding article: " + articleError.message);
  }

  // 2. Extract tags from input
  const tags = tagInput.value
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);

  for (const tagName of tags) {
    // Create tag if not existing
    const { data: tag, error: tagError } = await supabase
      .from("tags")
      .upsert({ name: tagName })
      .select()
      .single();

    if (tagError) {
      console.error("Tag error:", tagError);
      continue;
    }

    // Link tag to article
    await supabase.from("tag_links").insert({
      tag_id: tag.id,
      target_id: article.id,
      target_type: "news",
    });
  }

  title.value = "";
  content.value = "";
  tagInput.value = "";

  await loadNews();
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
  await supabase.from("tag_links").delete().eq("target_id", id);
  await supabase.from("news").delete().eq("id", id);
  loadNews();
};

// Clicking a tag (optional → später Filter-Seite)
const filterByTag = (tag) => {
  alert("Filter by tag: " + tag);
};
</script>

<style scoped>
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--gap-md);
  font-size: 0.95rem;
}

.user-table th,
.user-table td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

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
  transition:
    background 0.2s ease,
    transform 0.1s ease;
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
.tag-list {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 8px;
  background: rgba(138, 43, 226, 0.2);
  border: 1px solid rgba(138, 43, 226, 0.4);
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.85rem;
}

.tag:hover {
  background: rgba(138, 43, 226, 0.4);
}
</style>
