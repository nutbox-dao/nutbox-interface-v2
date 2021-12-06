import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.query.id) {
    next();
  } else if (to.matched[0].path === "/specify" && from.query.id) {
    next({
      path: to.path,
      query: {
        ...to.query,
        id: from.query.id,
      },
    });
  } else if (to.matched[0].path === "/specify" && !from.query.id) {
    next({
      path: "/",
    });
  } else {
    next();
  }
});
export default router;
