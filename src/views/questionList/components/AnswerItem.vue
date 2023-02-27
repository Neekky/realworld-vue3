<template>
  <div class="container page">
    <div class="article-actions-page">
      <div class="article-meta">
        <a href="profile.html"
          ><img :src="props.data?.answerer?.avatar_url || defaultUserIcon"
        /></a>
        <div class="info">
          <a href="" class="author">{{ props.data?.answerer.name }}</a>
          <span class="date">{{
            dayjs(props.data?.answerer.updatedAt).format("YYYY-MM-DD")
          }}</span>
        </div>
      </div>
      <div class="article-meta">
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-plus-round"></i>
          &nbsp; 关注{{ props.data?.answerer.name }}
        </button>
      </div>
    </div>
    <div class="row article-content">
      <div class="col-md-12">
        <p>
          {{ props.data?.content }}
        </p>
      </div>
    </div>

    <div class="tool-bar">
      <div @click="handleAgree" class="tool-bar-item">
        <img :src="cIsAgree ? isAgreeIcon : agreeIcon" class="agree" />{{
          cIsAgree ? "已赞同" : "赞同"
        }}
        {{ voteCount }}
      </div>
      <div @click="handleCommentClick" class="tool-bar-item">查看评论</div>
      <div class="tool-bar-item">收藏</div>
    </div>
    <hr />

    <div class="row" v-show="isComment">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <form @submit.prevent="handleComment" class="card comment-form">
          <div class="card-block card-block-page">
            <textarea
              v-model="commentContent"
              class="form-control"
              placeholder="说说你的想法"
              rows="3"
              required
              maxlength="200"
            ></textarea>
            <span class="indicator">{{ commentContent.length }}/200</span>
          </div>
          <div class="card-footer">
            <img
              :src="userStore.userInfo?.avatar_url || defaultUserIcon"
              class="comment-author-img"
            />
            <button class="btn btn-sm btn-primary">发表评论</button>
          </div>
        </form>
        <Comment
          v-for="item in commentList"
          :key="item._id"
          :data="item"
          :answerData="props.data"
          @refreshCommentList="refreshCommentList"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import defaultUserIcon from "@/assets/img/defaultUserIcon.jpeg";
import agreeIcon from "@/assets/img/agree.png";
import isAgreeIcon from "@/assets/img/isAgree.png";
import { useUserStore } from "@/stores/user";
import { commentApi, userApi } from "@/api";
import { ElMessage } from "element-plus";
import Comment from "./comment.vue";
import dayjs from "dayjs";

const userStore = useUserStore();

const props = defineProps(["data", "pIsAgree"]);

const isComment = ref(false);

// 临时性处理方法，目前数据量小，由前端遍历该用户是否点赞
const cIsAgree = ref(
  props.data?.liked_by?.findIndex(
    (ele: any) => ele._id === userStore.userInfo._id
  ) > -1
);

const commentContent = ref("");

const voteCount = ref<number>(props?.data?.voteCount);

const per_page = 20;

const page = ref(0);

const commentList = ref<any[]>([]);

onMounted(() => {});
// 获取答案下的评论列表
const getAnswerCommentList = async (isRefresh: boolean = false) => {
  const res = await commentApi.getAnswerComment(
    props.data.questionId,
    props.data._id,
    {
      per_page,
      page: page.value,
    }
  );

  if (res.code === 200) {
    commentList.value = isRefresh
      ? res.data
      : [...commentList.value, ...res.data];
  }
};

const refreshCommentList = () => {
  page.value = 0;
  commentList.value = [];
  getAnswerCommentList(true);
};

// 处理赞同
const handleAgree = async () => {
  if (cIsAgree.value) {
    const res = await userApi.unlikingAnswer(props.data._id);
    if (res.code === 204) {
      cIsAgree.value = false;
      voteCount.value--;
    }
    return;
  }

  const res = await userApi.likingAnswer(props.data._id);
  if (res.code === 204) {
    cIsAgree.value = true;
    voteCount.value++;
  }
};

// 处理评论点击
const handleCommentClick = () => {
  if (!isComment.value) {
    getAnswerCommentList();
  } else {
    // 关闭评论，数据重置
    page.value = 0;
    commentList.value = [];
  }
  isComment.value = !isComment.value;
};

// 处理用户评论
const handleComment = async () => {
  const res = await commentApi.commentAnswer(
    props.data.questionId,
    props.data._id,
    { content: commentContent.value }
  );

  if (res.code === 200) {
    ElMessage.success({
      message: "评论成功",
      duration: 1000,
    });
    commentContent.value = "";
    refreshCommentList();
  }
};
</script>

<style scope>
.article-actions-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0 1rem;
}
.tool-bar {
  display: flex;
}

.tool-bar-item {
  display: flex;
  font-size: 14px;
  margin-left: 24px;
  color: #8590a6;
  align-items: center;
  cursor: pointer;
}

.agree {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  margin-bottom: 1px;
}

.card-block-page {
  position: relative;
}

.indicator {
  position: absolute;
  right: 4px;
  bottom: 8px;
  color: #ddd;
  font-size: 14px;
}

.delete-comment {
  position: absolute;
  display: flex;
  right: 4px;
  bottom: 4px;
  color: #ccc;
  font-size: 12px;
  cursor: pointer;
}

.comment-reply {
  position: absolute;
  left: 4px;
  top: 4px;
  color: #bebebe;
  font-size: 12px;
}

.comment-tool {
  margin-left: 15px;
}
</style>
