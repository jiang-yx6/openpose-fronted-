// 封装 axios 请求
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const request = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// // 请求拦截器
// request.interceptors.request.use(
//     config => {
//         // 可以在这里添加 token 等认证信息
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     error => Promise.reject(error)
// );

// 响应拦截器
request.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error)
);

export default request;