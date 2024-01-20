import axios from "axios";
import * as fs from "fs";
const path = require("path");
import { csl, sleep, waiting } from "./func";
import { chain, coinData, coinExport } from "./types";
import { mapCoingeckoChainName } from "./fetchCoingeckoChainlist";
const mapPlatform = (
  platforms: coinData["platforms"],
  chainMap: { [key: string]: string }
) => {
  for (const c of Object.keys(platforms)) {
    if (chainMap?.hasOwnProperty(c)) {
      platforms[chainMap[c]] = platforms[c];
      delete platforms[c];
    }
  }
  return platforms;
};
export const correctImg = (url?: string) => {
  if (url) {
    if (url.includes("?")) {
      url = url.split("?")[0];
    }
  }
  return url ?? "";
};
const getCoinlistIds = async (): Promise<
  { [key: string]: any }[] | undefined
> => {
  const url =
    "https://api.coingecko.com/api/v3/coins/list?include_platform=true";
  const res = await axios.get(url);
  if (res) {
    const data = res.data;
    const ids = data.map((c: any) => ({ id: c.id, platforms: c.platforms }));
    console.log(ids);
    try {
      fs.mkdir("tmp", (e) => {
        if (e) {
          console.error("error: ", e);
        }
        console.log("tmp dir created");
      });
    } catch (e) {
      csl("tmp dir was exist");
    }

    fs.writeFile(`tmp/coinids.json`, JSON.stringify(ids), (e) => {
      if (e) {
        console.error("error: ", e);
      }
      console.log("ids saved");
    });
    return ids;
  }
};
const get_chunk = async (
  ids_arr: ({ [key: string]: any } | undefined)[],
  defautSleepTime: number = 20,
  p: number = 1,
  per_page: number = 250
) => {
  const ids = ids_arr.map((c: any) => c.id).join(",");

  // Get raw coingecko data from ids (list ids of coins from user), support up to 50 coins
  const url = "https://api.coingecko.com/api/v3/coins/markets";
  const queryParams = new URLSearchParams({
    vs_currency: "usd",
    ids: ids,
    order: "market_cap_desc",
    per_page: per_page.toString(),
    page: p.toString(),
    sparkline: "true",

    price_change_percentage: "24h",
  });

  const headers = {
    "Content-Type": "application/json",
  };

  let res: coinData[] | undefined = undefined;
  let timeSleep = defautSleepTime;
  while (true) {
    waiting(timeSleep);
    await sleep(timeSleep * 1000);
    csl(
      `\nGetting data from "${ids_arr[0]?.id}" to "${
        ids_arr[ids_arr.length - 1]?.id
      }" (${ids_arr.length} coins)`
    );
    const response = await fetch(`${url}?${queryParams}`, {
      method: "GET",
      headers: headers,
    });

    if (response.status === 200) {
      res = (await response.json()) as coinData[];
      timeSleep = 1;
      break;
    } else if (response.status === 429) {
      const retry_after = Number(response.headers.get("Retry-After"));
      csl(`Too many requests to coingecko!\n Retry after ${retry_after} (s)`);
      timeSleep = retry_after;
    } else {
      csl("Can not get price data");
      break;
    }
  }
  if (res) {
    const result: coinData[] = res.map((c: coinData) => ({
      ...c,
      platforms:
        ids_arr.find((e: { [key: string]: any } | undefined) => e?.id === c.id)
          ?.platforms ?? {},
    }));
    return result;
  }
};
const getAllData = async (defautSleepTime: number = 20) => {
  const start = Math.floor(Date.now() / 1000);
  const chainMap = (await mapCoingeckoChainName())!;
  csl(chainMap);
  let coinlist: { [key: string]: any }[] = [];
  try {
    coinlist = JSON.parse(fs.readFileSync(`tmp/coinids.json`, "utf8"));
  } catch (e) {
    console.log("feching new data");
    coinlist = (await getCoinlistIds())!;
  }
  const chunk = 250;

  let data: coinExport[] = [];
  var first = 0;
  while (true) {
    const chunkIds = coinlist.slice(first, first + chunk);

    if (!chunkIds.length) {
      csl("No ids left");
      break;
    } else {
      const z: coinData[] | undefined = await get_chunk(
        chunkIds,
        defautSleepTime
      );
      if (z) {
        const chunkData: coinExport[] = z
          .filter((a) => a.id)
          .map((t) => ({
            coingecko_id: t.id,
            symbol: t.symbol,
            name: t.name,
            logo: correctImg(t.image),
            marketcap: t.market_cap ?? 0,
            platforms: mapPlatform(t.platforms, chainMap),
          }));

        fs.writeFile(
          `tmp/${first}_${first + chunk}.json`,
          JSON.stringify(chunkData),
          (e) => {
            if (e) {
              console.error("error: ", e);
            }
            console.log("chunk saved");
          }
        );
        data = data.concat(chunkData);
        fs.writeFile(`tmp/coinlist.json`, JSON.stringify(data), (e) => {
          if (e) {
            console.error("error: ", e);
          }
          console.log("coinlist updated more coin.");
        });
      }
    }
    first = first + chunk;
  }
  if (data) {
    let newdata: { [key: string]: any } = [];
    for (let i = 0; i <= data.length; i++) {
      const dt = data[i];
      if (dt) {
        newdata.push({
          id: i + 1,
          ...dt,
        });
      }
    }
    fs.writeFile(`coinlist.json`, JSON.stringify(newdata, null, 2), (e) => {
      if (e) {
        console.error("error: ", e);
      }
      console.log("Final coinlist exported");
      const directory = "tmp";
      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
          });
        }
      });
      console.log("tmp folder cleaned");
    });
    csl("Total ", data.length, " coins was updated.");
  }
};
setTimeout(async () => {
  const start = Math.floor(Date.now() / 1000);
  getAllData();
  const end = Math.floor(Date.now() / 1000);
  csl("Executed time: ", end - start, " s");
}, 100);
