import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useRequestStore = defineStore("request", () => {
  const isLoading = ref(false);
  function setIsLoading(flag: boolean) {
    isLoading.value = flag;
  }

  return { isLoading, setIsLoading };
});
