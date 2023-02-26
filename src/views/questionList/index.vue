<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <div class="topic-wrap" v-if="quesDetail?.topics?.length > 0">
          <router-link
            :to="{
              name: 'Home',
              query: { topic: JSON.stringify(item) },
            }"
            class="topic-item"
            v-for="item in quesDetail?.topics"
            :key="item._id"
          >
            {{ item?.name }}
          </router-link>
        </div>
        <h2>{{ quesDetail.title }}</h2>
        <p class="ques-desc">{{ quesDetail.description }}</p>
        <div class="article-meta">
          <a href=""
            ><img :src="quesDetail?.questioner?.avatar_url || defaultUserIcon"
          /></a>
          <div class="info">
            <a href="" class="author">{{ quesDetail?.questioner?.name }}</a>
            <span class="date">January 20th</span>
          </div>
          <button
            @click="handleFollow"
            class="btn btn-sm btn-outline-secondary"
            :class="{ 'follow-btn': followerDetail?.isFollow }"
          >
            <template v-if="followerDetail?.isFollow">已关注</template>
            <template v-else>
              <i class="ion-plus-round"></i>
              &nbsp; 关注 {{ quesDetail?.questioner?.name }}
              <span class="counter"
                >({{ followerDetail?.users?.length || 0 }})</span
              >
            </template>
          </button>
          &nbsp;
          <router-link
            :to="{ path: '/answer', query: { quesId: quesDetail._id } }"
          >
            <button class="btn btn-sm btn-outline-primary">
              <i class="ion-heart"></i>
              &nbsp; 写回答
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <template v-if="answerList.length > 0">
      <AnswerItem v-for="item in answerList" :key="item._id" :data="item" />
    </template>
    <div class="no-answer" v-else>
      <div class="no-data" />
      <div>暂无答案，等你来答</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import AnswerItem from "./components/AnswerItem.vue";
import { questionApi, userApi } from "@/api";
import defaultUserIcon from "@/assets/img/defaultUserIcon.jpeg";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

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
  const id: string = userStore.userInfo._id;
  const res = await userApi.getUserFollowers(id);
  if (res.code !== 200) {
    console.log("接口报错", res);
    return;
  }
  followerDetail.value = res.data;
  return res;
};

const followUser = async () => {
  const id: string = userStore.userInfo._id;
  const res = await userApi.followUser(id);
  if (res.code === 204) {
    ElMessage.success({
      message: res.msg,
      duration: 1000,
    });
  }
  getUserFollowers();
};

const cancelFollowUser = async () => {
  const id: string = userStore.userInfo._id;
  const res = await userApi.cancelFollowUser(id);
  if (res.code === 204) {
    ElMessage.success({
      message: res.msg,
      duration: 1000,
    });
  }
  getUserFollowers();
};

const handleFollow = () => {
  if (followerDetail.value?.isFollow) {
    cancelFollowUser();
  } else {
    followUser();
  }
};
</script>

<style scope>
.topic-wrap {
  margin-bottom: 10px;
}

.topic-item {
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 5px;
  margin-right: 10px;
}

.ques-desc {
  margin-top: 6px;
}

.no-answer {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #b9b9b9;
  font-size: 18px;
}

.no-data {
  background-image: url("./img/nodata.png");
  background-repeat: no-repeat;
  background-size: contain;
  width: 300px;
  height: 300px;
}

.follow-btn {
  background-image: #555;
}
</style>
