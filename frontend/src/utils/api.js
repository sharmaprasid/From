import axios from "axios";

const instance = axios.create({
  baseURL: "https://from-nine.vercel.app/api",
  timeout: 5000,
  "Content-Type": "application/json",
});

export default instance;
