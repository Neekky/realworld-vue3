<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "用户登录" : "注册" }}</h1>
          <p class="text-xs-center">
            <router-link v-if="!isLogin" to="/login">已经有账户?</router-link>
            <router-link v-else to="/register">注册新账户?</router-link>
          </p>

          <ul v-if="user.errMsg" class="error-messages">
            <li>{{ user.errMsg }}</li>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group">
              <input
                v-model="user.name"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                required
                minlength="6"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                required
                minlength="8"
              />
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
              style="background-color: #056de8; border: none"
            >
              {{ isLogin ? "登录" : "注册" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { userApi } from "@/api";

const userStore = useUserStore();

export default {
  name: "Login",
  computed: {
    isLogin(): boolean {
      return this.$route.name === "Login";
    },
  },
  data() {
    return {
      user: {
        name: "",
        password: "",
        errMsg: "",
      },
    };
  },

  mounted() {
    this.user = {
      name: "",
      password: "",
      errMsg: "",
    };
  },

  methods: {
    onSubmit() {
      if (this.isLogin) {
        this.login();
      } else {
        this.register();
      }
    },
    async login() {
      // 提交表单请求登录
      const res = await userApi.login({
        name: this.user.name,
        password: this.user.password,
      });

      if (res.code !== 200) {
        this.user.errMsg = res.msg;
        console.log("请求失败", res);
        return;
      }
      userStore.updateUserInfo(res.data.user);
      userStore.updateToken(res.data.token);
      // 防止页面因为刷新导致数据丢失，将数据持久化到Cookie
      this.$cookies.set("user", res.data.user);
      this.$cookies.set("token", res.data.token);
      // 跳转到首页
      ElMessage({
        message: "登录成功!",
        type: "success",
        duration: 1000,
        onClose: () => {
          this.user = {
            name: "",
            password: "",
            errMsg: "",
          };
          this.$router.push("/");
        },
      });
    },

    async register() {
      // 提交表单请求登录
      const res = await userApi.register({
        name: this.user.name,
        password: this.user.password,
      });

      if (res.code !== 200) {
        this.user.errMsg = res.msg;
        console.log("请求失败", res);
        return;
      }

      // 跳转到首页
      ElMessage({
        message: "恭喜你, 账号注册成功!",
        type: "success",
        duration: 1000,
        onClose: () => {
          this.user = {
            name: "",
            password: "",
            errMsg: "",
          };
          this.$router.push("/login");
        },
      });
    },
  },
};
</script>

<style></style>
