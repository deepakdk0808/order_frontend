import axios from "axios";

const BASE_URL = "https://order-backend-3bgm.onrender.com/api"; // use your deployed backend URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
