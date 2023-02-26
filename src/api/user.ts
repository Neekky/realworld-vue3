import { Axios } from "@/utils"; // 导入 api
import { useUserStore } from "@/stores/user";

export default new (class User extends Axios {
  /**
   * 用户登录
   */
  login(params: { name: string; password: string }) {
    return this.post("/users/login", { ...params });
  }

  /**
   * 用户注册
   */
  register(params: { name: string; password: string }) {
    return this.post("/users/create", params);
  }

  /**
   * 查询指定用户
   * fields=educations;following;followingTopics;password
   */
  findUserById(userId: string, params: object) {
    return this.get(`/users/findById/${userId}`, { params });
  }

  /**
   * 更新用户信息
   */
  updateUserById(userId: string, params: string) {
    const userStore = useUserStore();
    return this.patch(`/users/update/${userId}`, params, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
  }

  /**
   * 查询用户的粉丝
   */
  getUserFollowers(userId: string) {
    return this.get(`/users/${userId}/followers`);
  }

  /**
   * 关注用户
   */
  followUser(userId: string) {
    const userStore = useUserStore();
    return this.put(
      `/users/following/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );
  }

  /**
   * 关注用户
   */
  cancelFollowUser(userId: string) {
    const userStore = useUserStore();
    return this.delete(`/users/following/${userId}`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
  }
})();
