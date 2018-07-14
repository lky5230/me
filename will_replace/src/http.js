import axios from 'axios'

let instance = axios.create({
    baseURL: process.env.VUE_APP_BASEURL,
});

// 请求前-拦截
instance.interceptors.request.use(function (config) {
    config.headers['Authorization'] = 'token-test-0111111111111111111111111';

    return config;
}, function (error) {
    console.error(error);
    return Promise.reject(error);
});

// 响应后-拦截
instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.error(error);
    return Promise.reject(error);
});

export default instance;