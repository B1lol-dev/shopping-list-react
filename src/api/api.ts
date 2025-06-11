import axios from "axios";

export const baseApi = axios.create({
  baseURL: "https://nt-shopping-list.onrender.com/api",
});
