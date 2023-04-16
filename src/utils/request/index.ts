import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { errorCodeType } from "./error-code-type";
import { ElMessage, ElLoading } from "element-plus";
import router from "@/router";

// 创建axios实例
const service: AxiosInstance = axios.create({
  // 服务接口请求
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时设置
  // timeout: 15000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

let loading: any;
//正在请求的数量
let requestCount: number = 0;
//显示loading
const showLoading = () => {
  if (requestCount === 0 && !loading) {
    //加载中显示样式可以自行修改
    loading = ElLoading.service({
      text: "拼命加载中，请稍后...",
      background: "rgba(0, 0, 0, 0.7)",
      spinner: "el-icon-loading",
    });
  }
  requestCount++;
};
//隐藏loading
const hideLoading = () => {
  requestCount--;
  if (requestCount == 0) {
    loading.close();
  }
};

// 请求拦截
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    // todo 将token设置，放在拦截器中
    if (config.headers?.Authorization === "Bearer ") {
      console.log("执行了吗", config);
      const err: any = new Error("用户未登录");
      err.cancelToken = true; // 标识请求已被取消
      router.push({
        path: "/login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
      return Promise.reject(err);
    }
    showLoading();
    // 是否需要设置 token放在请求头
    // config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?";
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        const part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof value !== "undefined") {
          // 对象处理
          if (typeof value === "object") {
            for (const key of Object.keys(value)) {
              const params = propName + "[" + key + "]";
              const subPart = encodeURIComponent(params) + "=";
              url += subPart + encodeURIComponent(value[key]) + "&";
            }
          } else {
            url += part + encodeURIComponent(value) + "&";
          }
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res: any) => {
    hideLoading();
    // 未设置状态码则默认成功状态
    const code = res.data["code"] || 200;
    // 获取错误信息
    const msg = res.data["msg"] || errorCodeType(code) || errorCodeType(-1);
    if (code === 200 || code === 204) {
      return Promise.resolve(res.data);
    } else {
      ElMessage.error(msg);
      return Promise.reject(res.data);
    }
  },
  (error) => {
    console.log("err" + error);
    hideLoading();
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage.error({
      message: message,
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default class Http {
  get(url: string, options?: AxiosRequestConfig): Promise<any> {
    return service.get(url, { method: "get", ...options });
  }

  post(url: string, data: any, options?: AxiosRequestConfig): Promise<any> {
    return service.post(url, data, { method: "post", ...options });
  }

  put(url: string, data: any, options?: AxiosRequestConfig): Promise<any> {
    return service.put(url, data, { method: "put", ...options });
  }

  patch(url: string, data: any, options?: AxiosRequestConfig): Promise<any> {
    return service.patch(url, data, { method: "patch", ...options });
  }

  delete(url: string, options?: AxiosRequestConfig): Promise<any> {
    return service.delete(url, { method: "delete", ...options });
  }
}
