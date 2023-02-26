<template>
  <div class="card">
    <div class="card-block card-block-page">
      <p class="card-text">{{ item?.content }}</p>
      <div class="comment-reply" v-if="item?.replyTo">
        回复：{{ item?.replyTo.name }}
      </div>
      <div class="delete-comment">
        <div
          v-if="userStore.userInfo._id === item.commentator._id"
          @click="deleteComment(item)"
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
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { commentApi } from "@/api";

const props = defineProps(["data", "pIsAgree", "refreshCommentList"]);

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


const refreshCommentList = () => {
  page.value = 0;
  commentList.value = [];
  getAnswerCommentList(true);
};

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

</script>

<style>
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
