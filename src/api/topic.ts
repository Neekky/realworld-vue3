import Request from "@/utils/request";

export default new (class Home extends Request {
  /**
   * 获取问题列表
   */
  getTopicList(
    params: { per_page: number; page: number } = { per_page: 10, page: 0 }
  ) {
    return this.get("/topics", { params });
  }

  /**
   * 获取话题下的问题列表
   */
  getTopicQuestionList(
    id: string,
    params: { per_page: number; page: number } = { per_page: 10, page: 0 }
  ) {
    return this.get(`/topics/${id}/questions`, { params });
  }
})();
