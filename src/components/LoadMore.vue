<template>
  <div class="load-more">
    {{ !has_more ? "没有更多数据了" : "加载中..." }}
    <!-- <div v-loading="loading" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "LoadMore",
  props: {
    has_more: {
      type: Boolean,
      require: true,
    },
    loading: {
      type: Boolean,
      require: true,
    },
  },
});
</script>

<style scoped>
.load-more {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #777;
  font-size: 16px;
}
</style>
