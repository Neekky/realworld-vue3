import { ref, computed } from "vue";
import { defineStore } from "pinia";

// 定义store
export const useUserStore = defineStore("userInfo", {
  state: () => {
    return {
      userInfo: {
        _id: "",
        name: "",
        age: "",
        avatar_url: "",
        gender: "",
        headline: "",
      },
      token: "",
    };
  },
  actions: {
    updateUserInfo(data: any) {
      this.userInfo = { ...this.userInfo, ...data };
    },
    updateToken(data: string) {
      this.token = data;
    },
  },
  getters: {},
});
