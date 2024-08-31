// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000/', // Set the base URL for your API
});

export default axiosInstance;
