import { Axios } from "@/utils"; // 导入 api
import { useUserStore } from "@/stores/user";

export default new (class Question extends Axios {
  /**
   * 获取问题列表
   */
  getQuestionList(params: {
    per_page: number;
    page: number;
    topic_id: string;
  }) {
    return this.get("/question", { params });
  }

  /**
   * 获取指定问题
   */
  getQuestionDetail(id: string) {
    return this.get(`/question/${id}`);
  }

  /**
   * 获取指定问题下的答案列表
   */
  getAnswerByQuestionId(id: string) {
    return this.get(`/question/${id}/answer`);
  }

  /**
   * 创建问题
   */
  createQuestion(params: {
    title: string;
    description: string;
    topics: string[];
  }) {
    const userStore = useUserStore();

    return this.post("/question", params, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
  }

  /**
   * 创建问题
   */
  answerQuestion(
    id: string,
    params: {
      content: string;
    }
  ) {
    const userStore = useUserStore();
    return this.post(`/question/${id}/answer`, params, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
  }
})();
