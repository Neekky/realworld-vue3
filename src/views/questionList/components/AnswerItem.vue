<template>
  <div class="container page">
    <div class="article-actions-page">
      <div class="article-meta">
        <a href="profile.html"
          ><img :src="props.data?.questioner?.avatar_url || defaultUserIcon"
        /></a>
        <div class="info">
          <a href="" class="author">Eric Simons</a>
          <span class="date">January 20th</span>
        </div>
      </div>
      <div class="article-meta">
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-plus-round"></i>
          &nbsp; Follow Eric Simons
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
      <div class="tool-bar-item">
        <img
          :src="props.pIsAgree ? isAgreeIcon : agreeIcon"
          class="agree"
        />赞同 1131
      </div>
      <div @click="handleCommentClick" class="tool-bar-item">170条评论</div>
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

        <div v-for="item in commentList" :key="item._id" class="card">
          <div class="card-block card-block-page">
            <p class="card-text">{{ item?.content }}</p>
            <div class="comment-reply" v-if="item?.replyTo">回复：{{ item?.replyTo.name }}</div>
            <div class="delete-comment">
              <div
                v-if="userStore.userInfo._id === item.commentator._id"
                @click="deleteComment(item)"
              >
                删除
              </div>
              <!-- <div
                class="comment-tool"
                v-if="userStore.userInfo._id"
                @click="openReplyComment"
              >
                回复
              </div> -->
            </div>
          </div>
          <div class="card-footer">
            <a href="" class="comment-author">
              <img
                :src="item?.commentator?.avatar_url || defaultUserIcon"
                class="comment-author-img"
              />
            </a>
            &nbsp;
            <a href="" class="comment-author">{{ item?.commentator?.name }}</a>
            <span class="date-posted">{{
              dayjs(item.updatedAt).format("YYYY-MM-DD")
            }}</span>
          </div>
          <div class="card-block card-block-page" v-if="isOpenReplyComment">
            <textarea
              class="form-control"
              placeholder="回复"
              rows="3"
              required
              maxlength="200"
            >
            </textarea>
            <button class="btn btn-sm btn-primary">回复</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import defaultUserIcon from "@/assets/img/defaultUserIcon.jpeg";
import agreeIcon from "@/assets/img/agree.png";
import isAgreeIcon from "@/assets/img/isAgree.png";
import { useUserStore } from "@/stores/user";
import { commentApi } from "@/api";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";

const userStore = useUserStore();

const props = defineProps(["data", "pIsAgree"]);

const isComment = ref(false);

const isAgree = ref(false);

const commentContent = ref("");

const per_page = 20;

const page = ref(0);

const commentList = ref<any[]>([]);

const isOpenReplyComment = ref(false);

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
const handleAgree = () => {
  console.log(isAgree.value);
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

const deleteComment = async (item: any) => {
  const res = await commentApi.deleteAnswerComment(
    props.data.questionId,
    props.data._id,
    item._id
  );
  if (res.code === 204) {
    ElMessage.success({
      message: "删除评论成功",
      duration: 1000,
    });
    refreshCommentList();
  }
};

const openReplyComment = () => {
  isOpenReplyComment.value = !isOpenReplyComment.value;
}

const replyToComment = async (item: any) => {
  console.log(item, 123213);
  const comment: {
    content: string;
    rootCommentId?: string;
    replyTo?: string;
  } = {
    content: commentContent.value,
    rootCommentId: item._id,
    replyTo: item.commentator._id,
  };

  const res = await commentApi.commentAnswer(
    props.data.questionId,
    props.data._id,
    comment
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
