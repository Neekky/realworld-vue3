import Request from "@/utils/request";

export default new (class Home extends Request {
  /**
   * 获取问题列表
   */
  getTopicList(
    query: { per_page: number; page: number } = { per_page: 10, page: 0 }
  ) {
    return this.get("/topics", { query });
  }

  /**
   * 获取话题下的问题列表
   */
  getTopicQuestionList(
    id: string,
    query: { per_page: number; page: number } = { per_page: 10, page: 0 }
  ) {
    return this.get(`/topics/${id}/questions`, {query});
  }
})();
