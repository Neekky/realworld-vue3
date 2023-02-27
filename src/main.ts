import { createApp } from "vue";
import { createPinia } from "pinia";
import VueCookies from "vue-cookies";
import router from "./router";
import App from "./App.vue";
import "element-plus/dist/index.css";
import "./assets/main.css";
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueCookies);
// 提供cookies
app.provide("$cookies", VueCookies);
app.mount("#app");
