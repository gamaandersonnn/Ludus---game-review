import axios from "axios";

const BASE_URL = "https://api.rawg.io/api";
const RAWG_API_KEY = "e66bd0cb2e3148dd92b4bdd302c0c12f";

const rawgApi = axios.create({
  baseURL: BASE_URL,
  params: {
    key: RAWG_API_KEY,
  },
});

export default rawgApi;
