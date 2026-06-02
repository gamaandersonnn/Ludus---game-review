import rawgApi from "./rawgApi.js";

export async function getTrendingGames(page: number = 1) {
  const today = new Date();
  const monthAgo = new Date();
  monthAgo.setDate(today.getDate() - 30);

  const format = (d: Date) => d.toISOString().split("T")[0];

  const { data } = await rawgApi.get("/games", {
    params: {
      dates: `${format(monthAgo)},${format(today)}`,
      ordering: "-added",
      page_size: 10,
      page,
    },
  });

  return data;
}

export async function getRandomGames() {
  const randomPage = Math.floor(Math.random() * 200) + 1;
  const { data } = await rawgApi.get("/games", {
    params: {
      page: randomPage,
      page_size: 5,
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
