<template>
  <div>
    <NavBar />
    <router-view />
    <h1>Stay Ahead in</h1>
    <h1>Gaming News</h1>
    <router-view />
    <GameList />
    <NewsList />
  </div>
</template>

<script setup>
import GameList from "./GameList.vue";
import NewsList from "./NewsList.vue";
import NavBar from "./NavBar.vue";
</script>
