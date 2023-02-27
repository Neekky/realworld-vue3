<template>
  <div class="card">
    <div class="card-block card-block-page">
      <p class="card-text">{{ data?.content }}</p>
      <div class="comment-reply" v-if="data?.replyTo">
        回复：{{ data?.replyTo.name }}
      </div>
      <div class="delete-comment">
        <div
          v-if="userStore.userInfo._id === data.commentator._id"
          @click="deleteComment(data)"
        >
          删除
        </div>
        <div
          class="comment-tool"
          v-if="userStore.userInfo._id"
          @click="openReplyComment"
        >
          回复
        </div>
      </div>
    </div>
    <div class="card-footer">
      <a href="" class="comment-author">
        <img
          :src="data?.commentator?.avatar_url || defaultUserIcon"
          class="comment-author-img"
        />
      </a>
      &nbsp;
      <a href="" class="comment-author">{{ data?.commentator?.name }}</a>
      <span class="date-posted">{{
        dayjs(data.updatedAt).format("YYYY-MM-DD")
      }}</span>
    </div>
    <div class="card-block card-block-page" v-if="isOpenReplyComment">
      <textarea
        v-model="replyContent"
        class="form-control"
        placeholder="输入回复内容"
        rows="3"
        required
        maxlength="200"
      >
      </textarea>
      <button @click="replyToComment" class="btn btn-sm btn-primary btn-page">
        回复
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { commentApi } from "@/api";
import dayjs from "dayjs";
import defaultUserIcon from "@/assets/img/defaultUserIcon.jpeg";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const props = defineProps(["data", "answerData"]);

const emits = defineEmits(["refreshCommentList"]);

const isOpenReplyComment = ref(false);

const replyContent = ref("");

// 打开回复框
const openReplyComment = () => {
  isOpenReplyComment.value = !isOpenReplyComment.value;
};

const deleteComment = async (item: any) => {
  const res = await commentApi.deleteAnswerComment(
    props.answerData.questionId,
    props.answerData._id,
    item._id
  );
  if (res.code === 204) {
    ElMessage.success({
      message: "删除评论成功",
      duration: 1000,
    });
    emits("refreshCommentList");
  }
};
const replyToComment = async () => {
  const comment: {
    content: string;
    rootCommentId?: string;
    replyTo?: string;
  } = {
    content: replyContent.value,
    rootCommentId: props.data._id,
    replyTo: props.data.commentator._id,
  };
  const res = await commentApi.commentAnswer(
    props.answerData.questionId,
    props.answerData._id,
    comment
  );

  if (res.code === 200) {
    ElMessage.success({
      message: "评论成功",
      duration: 1000,
    });
    replyContent.value = "";
    emits("refreshCommentList");
  }
};
</script>

<style scope>
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

.card-block-page {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.card-block-page p {
  width: 100%;
}

.btn-page {
  margin-top: 10px;
}
</style>
