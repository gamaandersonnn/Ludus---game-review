import rawgApi from "./rawgApi.js";

export async function getTrendingGames() {
  const { data } = await rawgApi.get("/games", {
    params: {
      ordering: "-added",
      page_size: 10,
    },
  });

  return data;
}

export async function getGames(query: string) {
  const { data } = await rawgApi.get("/games", {
    params: {
      search: query,
      page_size: 20,
    },
  });

  return data;
}
