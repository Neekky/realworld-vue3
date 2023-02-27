import { Axios } from "@/utils"; // 导入 api
import { useUserStore } from "@/stores/user";

export default new (class Comment extends Axios {
  /**
   * 创建答案下的评论
   */
  commentAnswer(
    quesId: string,
    answerId: string,
    params: {
      content: string;
      rootCommentId?: string;
      replyTo?: string;
    }
  ) {
    const userStore = useUserStore();
    return this.post(`question/${quesId}/answer/${answerId}/comments`, params, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });
  }

  /**
   * 获取答案下的评论
   */
  getAnswerComment(
    quesId: string,
    answerId: string,
    params: {
      per_page: number;
      page: number;
      q?: string;
    }
  ) {
    const userStore = useUserStore();
    return this.get(`question/${quesId}/answer/${answerId}/comments`, {
      params,
      // headers: { Authorization: `Bearer ${userStore.token}` },
    });
  }

  /**
   * 删除答案下的评论
   */
  deleteAnswerComment(quesId: string, answerId: string, commentId: string) {
    const userStore = useUserStore();
    return this.delete(
      `question/${quesId}/answer/${answerId}/comments/${commentId}`,
      {
        headers: { Authorization: `Bearer ${userStore.token}` },
      }
    );
  }
})();
