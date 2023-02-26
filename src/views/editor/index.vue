<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset v-if="isQuestion" class="form-group">
                <div class="title">请输入问题名称</div>
                <input
                  v-model="title"
                  type="text"
                  class="form-control"
                  required
                  placeholder="请输入问题名称"
                />
              </fieldset>
              <fieldset class="form-group">
                <div class="title">
                  请输入{{ isQuestion ? "问题" : "答案" }}内容
                </div>
                <textarea
                  v-model="description"
                  class="form-control"
                  required
                  rows="8"
                  placeholder="请输入内容"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <div class="title">
                  请选择话题
                  <span v-if="topicValue.length >= 4" class="select-tip"
                    >最多选择4个话题</span
                  >
                </div>
                <el-select
                  class="topic-selector"
                  v-model="topicValue"
                  multiple
                  :multiple-limit="4"
                  filterable
                  allow-create
                  clearable
                  default-first-option
                  size="large"
                  :reserve-keyword="false"
                  placeholder="选择话题"
                >
                  <el-option
                    v-for="item in topicList"
                    :key="item._id"
                    :label="item.name"
                    :value="item._id"
                  />
                </el-select>
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">提交</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { topicApi, questionApi } from "@/api";
import { ElMessage } from "element-plus";

// 使用登录校验中间件
export default {
  name: "Editor",
  data(): any {
    return {
      topicList: [],
      title: "",
      description: "",
      per_page: 20,
      page: 0,
      topicValue: [],
    };
  },
  mounted() {
    this.getTopic();
    console.log(this.$route, "this.$route");
  },
  computed: {
    isQuestion() {
      return this.$route?.name === "Question";
    },
  },
  methods: {
    async createQuestion() {
      const res = await questionApi.createQuestion({
        title: this.title,
        description: this.description,
        topics: this.topicValue,
      });
      if (res.code === 200) {
        ElMessage.success({
          message: res.msg || "创建成功",
          duration: 1000,
          onClose: () => {
            this.$router.push("/");
          },
        });
      }
    },
    async answerQuestion() {
      const { quesId } = this.$route?.query;
      const res = await questionApi.answerQuestion(quesId, {
        content: this.description,
      });
      if (res.code === 200) {
        ElMessage.success({
          message: res.msg || "感谢你的回答",
          duration: 1000,
          onClose: () => {
            this.$router.go(-1);
          },
        });
      }
    },
    onSubmit() {
      if (this.isQuestion) {
        this.createQuestion();
      } else {
        this.answerQuestion();
      }
    },
    async getTopic() {
      const res = await topicApi.getTopicList({
        page: this.page,
        per_page: this.per_page,
      });
      if (res.code === 200) {
        this.topicList = res.data;
      }
    },

    handleTopicSelect(val: any) {
      console.log(val, "123123");
    },
  },
};
</script>

<style scope>
.title {
  margin-bottom: 10px;
}

.topic-selector {
  width: 100%;
}

.select-tip {
  font-size: 12px;
  color: #f24;
}
</style>
