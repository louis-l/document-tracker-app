// import { useLocalStorage } from "@vueuse/core";
import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./views/LoginPage.vue"),
      // beforeEnter: (_to, _from, next) => {
      //   //
      // },
    },
    {
      path: "/",
      children: [
        {
          path: "home",
          component: () => import("./views/HomePage.vue"),
        },
        {
          path: "documents/create",
          component: () => import("./views/CreateDocumentPage.vue"),
        },
        {
          path: "documents/:documentId",
          component: () => import("./views/ViewDocumentPage.vue"),
          name: 'documents-id',
          props: true,
        },
      ],
      // beforeEnter: (_to, _from, next) => {
      //   //
      // },
    },
  ],
});
