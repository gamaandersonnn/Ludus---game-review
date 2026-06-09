import axios from "axios";

const BASE_URL = "https://api.rawg.io/api";
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const rawgApi = axios.create({
  baseURL: BASE_URL,
  params: {
    key: RAWG_API_KEY,
  },
});

export default rawgApi;
