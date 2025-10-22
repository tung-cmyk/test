<template>
  <div>
    <NavBar />
    <br />
    <router-view />
  </div>
</template>

<script setup>
import GameList from "./GameList.vue";
/*import NewsList from "./NewsList.vue";*/
import NavBar from "./NavBar.vue";
/*    <NewsList />      <GameList />*/
</script>
