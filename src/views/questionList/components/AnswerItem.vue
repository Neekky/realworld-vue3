<template>
  <div class="container page">
    <div class="article-actions-page">
      <div class="article-meta">
        <a href="profile.html"
          ><img :src="data?.questioner?.avatar_url || defaultUserIcon"
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
          {{ data?.content }}
        </p>
      </div>
    </div>

    <div class="tool-bar">
      <div class="tool-bar-item">
        <img :src="pIsAgree ? isAgreeIcon : agreeIcon" class="agree" />赞同 1131
      </div>
      <div @click="handleCommentClick" class="tool-bar-item">170条评论</div>
      <div class="tool-bar-item">收藏</div>
    </div>
    <hr />

    <div class="row" v-show="isComment">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <form class="card comment-form">
          <div class="card-block">
            <textarea
              class="form-control"
              placeholder="Write a comment..."
              rows="3"
            ></textarea>
          </div>
          <div class="card-footer">
            <img
              :src="data?.questioner?.avatar_url || defaultUserIcon"
              class="comment-author-img"
            />
            <button class="btn btn-sm btn-primary">Post Comment</button>
          </div>
        </form>

        <div class="card">
          <div class="card-block">
            <p class="card-text">
              With supporting text below as a natural lead-in to additional
              content.
            </p>
          </div>
          <div class="card-footer">
            <a href="" class="comment-author">
              <img
                :src="data?.questioner?.avatar_url || defaultUserIcon"
                class="comment-author-img"
              />
            </a>
            &nbsp;
            <a href="" class="comment-author">Jacob Schmidt</a>
            <span class="date-posted">Dec 29th</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import defaultUserIcon from "@/assets/img/defaultUserIcon.jpeg";
import agreeIcon from "@/assets/img/agree.png";
import isAgreeIcon from "@/assets/img/isAgree.png";

const { data, pIsAgree } = defineProps(["data", "pIsAgree"]);

const isComment = ref(false);
const isAgree = ref(false);

const handleAgree = () => {
  console.log(isAgree.value);
};

const handleCommentClick = () => {
  isComment.value = !isComment.value;
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
</style>
