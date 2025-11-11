import { createRouter, createWebHistory } from "vue-router";
import GameList from "../views/GameList.vue";
import GameDetail from "../views/GameDetail.vue";
import Profile from "../views/Profile.vue";
import { useUserAuth } from "@/composables/useAuth";

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
    {
      path: "/categories",
      name: "Categories",
      component: () => import("../views/Categories.vue"),
    },
    {
      path: "/game/:id/updates",
      name: "GameUpdates",
      component: () => import("../views/GameUpdates.vue"),
    },
    {
      path: "/auth",
      name: "Auth",
      component: () => import("../views/LoginRegister.vue"),
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { user } = useUserAuth();
  if (to.meta.requiresAuth && !user.value) {
    next("/auth");
  } else {
    next();
  }
});

export default router;
