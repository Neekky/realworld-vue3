<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset v-if="isQuestion" class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="请输入问题名称"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                />
                <div class="tag-list"></div>
              </fieldset>
              <el-button class="pull-xs-right" type="primary">提交</el-button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 使用登录校验中间件
definePageMeta({
  middleware: ["auth"]
  // or middleware: 'auth'
})
export default {
  name: "Editor",
  computed: {
    isQuestion() {
      return this.$route?.name === "Question";
    },
  },
  methods: {
    
  }
};
</script>

<style></style>
