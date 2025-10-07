import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/App.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/app",
      name: "app",
      component: HomeView,
    },
    {
      path: "/sign-in",
      name: "sign in",
      component: () => import("../views/SignIn.vue"),
    },
    {
      path: "/",
      name: "sign up",
      component: () => import("../views/SignUp.vue"),
    },
  ],
});


export default router;