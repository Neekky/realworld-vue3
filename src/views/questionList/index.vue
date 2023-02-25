<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <div v-if="quesDetail?.topics?.length > 0">
          <a v-for="item in quesDetail?.topics" :key="item._id">{{
            item?.name
          }}</a>
        </div>
        <h2>{{ quesDetail.title }}</h2>
        <p class="ques-desc">{{ quesDetail.description }}</p>
        <div class="article-meta">
          <a href=""
            ><img
              :src="
                quesDetail?.questioner?.avatar_url || '/defaultUserIcon.jpeg'
              "
          /></a>
          <div class="info">
            <a href="" class="author">{{ quesDetail?.questioner?.name }}</a>
            <span class="date">January 20th</span>
          </div>
          <button class="btn btn-sm btn-outline-secondary">
            <i class="ion-plus-round"></i>
            &nbsp; 关注 {{ quesDetail?.questioner?.name }}
            <span class="counter">({{ followerDetail?.length || 0 }})</span>
          </button>
          <!-- <button class="btn btn-sm btn-outline-primary">
            <i class="ion-heart"></i>
            &nbsp; 赞同 <span class="counter">(29)</span>
          </button> -->
        </div>
      </div>
    </div>
    <template v-if="answerList.length > 0">
      <AnswerItem v-for="item in answerList" :key="item._id" :data="item" />
    </template>
    <div v-else>暂无答案，等你来答</div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import AnswerItem from "./components/AnswerItem.vue";
import { questionApi, userApi } from "@/api";

const quesDetail = ref<any>({});

const answerList = ref<any[]>([]);

const followerDetail = ref<any>({});

const route = useRoute();

onMounted(async () => {
  await Promise.all([getQuestionDetail(), getAnswerById(), getUserFollowers()]);
});

const getQuestionDetail = async () => {
  const id: string = route.query.id as string;
  const res = await questionApi.getQuestionDetail(id);
  if (res.code !== 200) {
    console.log("接口报错", res);
    return;
  }
  quesDetail.value = res.data;
  return res;
};

const getAnswerById = async () => {
  const id: string = route.query.id as string;
  const res = await questionApi.getAnswerByQuestionId(id);
  if (res.code !== 200) {
    console.log("接口报错", res);
    return;
  }
  answerList.value = res.data;
  return res;
};

const getUserFollowers = async () => {
  const id: string = route.query.queserId as string;
  const res = await userApi.getUserFollowers(id);
  if (res.code !== 200) {
    console.log("接口报错", res);
    return;
  }
  followerDetail.value = res.data;
  console.log(res, 1111);
  return res;
};
</script>

<style scope>
.ques-desc {
  margin-top: 6px;
}
</style>
