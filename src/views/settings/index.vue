<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">你的信息</h1>
          <form @submit.prevent="updateUserById">
            <fieldset>
              <fieldset class="form-group avatar-wrap">
                <img
                  class="avatar"
                  :src="userInfo.avatar_url || defaultUserIcon"
                />
              </fieldset>
              <fieldset class="form-group">
                <div class="title">你的昵称</div>
                <input
                  v-model="userInfo.name"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="你的昵称"
                />
              </fieldset>
              <fieldset class="form-group">
                <div class="title">你的年龄</div>
                <input
                  v-model="userInfo.age"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="你的年龄"
                />
              </fieldset>

              <fieldset class="form-group">
                <div class="title">一句话介绍你</div>

                <textarea
                  v-model="userInfo.headline"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="一句话介绍你"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <div class="title">个人详细介绍</div>

                <textarea
                  v-model="userInfo.introduction"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="个人详细介绍"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <div class="title">Email</div>

                <input
                  v-model="userInfo.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">更新</button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger">或者点击这里退出账号.</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "@/stores/user";
import { userApi } from "@/api";
import { ElMessage } from "element-plus";
import defaultUserIcon from "@/assets/img/defaultUserIcon.jpeg";

const userStore = useUserStore();

const userInfo = ref<any>({});

const error = ref(null);

const findUserById = async () => {
  try {
    const res = await userApi.findUserById(userStore.userInfo._id, {
      filed: "educations;following;followingTopics;password",
    });
    userInfo.value = res.data;
    return res;
  } catch (err: any) {
    error.value = err.message;
  }
};

const updateUserById = async () => {
  try {
    const res = await userApi.updateUserById(
      userStore.userInfo._id,
      userInfo.value
    );
    if (res.code === 200) {
      ElMessage.success({
        message: res.msg,
        duration: 1000
      });
    }
    return res;
  } catch (err: any) {
    error.value = err.message;
  }
};

onMounted(() => {
  findUserById();
});

onUnmounted(() => {
  userInfo.value = {};
  error.value = null;
});
</script>

<style>
.avatar-wrap {
  display: flex;
  justify-content: center;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
}

.form-group {
}

.title {
  white-space: nowrap;
  margin-bottom: 6px;
  font-size: 18px;
  color: #333;
}
</style>
