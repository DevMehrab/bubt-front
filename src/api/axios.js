import axios from "axios";

const api = axios.create({
  baseURL: "https://bubt-backend.onrender.com/api",
});

export default api;
