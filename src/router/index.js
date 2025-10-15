import { createRouter, createWebHistory } from "vue-router";
import GameList from "../views/GameList.vue";
import GameDetail from "../views/GameDetail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: GameList,
    },
    {
      path: "/game/:id",
      name: "game",
      component: GameDetail,
      props: true,
    },
  ],
});

export default router;
