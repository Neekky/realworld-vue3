import type { VueCookies } from "vue-cookies";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/home/index.vue";
import { useUserStore } from "@/stores/user";

const noAuth = () => {
  const userStore = useUserStore();
  if (userStore?.userInfo?._id) {
    // 已登录
    return { path: "/" };
  } else {
    // 未登录
    return true;
  }
};

const auth = () => {
  const userStore = useUserStore();
  if (!userStore?.userInfo?._id) {
    // 已登录
    return { path: "/login" };
  } else {
    // 未登录
    return true;
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/question-list",
      name: "QuestionList",
      component: () => import("../views/questionList/index.vue"),
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("../views/profile/index.vue"),
      beforeEnter: [auth],
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/login/index.vue"),
      beforeEnter: [noAuth],
    },
    {
      path: "/settings",
      name: "Settings",
      component: () => import("../views/settings/index.vue"),
      meta: {
        requiresAuth: true,
      },
      beforeEnter: [auth],
    },
    {
      path: "/question",
      name: "Question",
      component: () => import("../views/editor/index.vue"),
    },
    {
      path: "/answer",
      name: "Answer",
      component: () => import("../views/editor/index.vue"),
    },
  ],
});

export default router;
