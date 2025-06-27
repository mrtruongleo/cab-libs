import axios from 'axios';
import { csl } from './func';
import * as fs from 'fs';
import { chainItem, coingeckoChain } from './types';
export const fetchChainList = async (): Promise<coingeckoChain[]> => {
  const url = 'https://api.coingecko.com/api/v3/asset_platforms';
  const res = await axios.get(url);
  const data = res.data;
  fs.writeFile(`coingeckoChainList.json`, JSON.stringify(data), (e) => {
    if (e) {
      console.error('error: ', e);
    }
    console.log('coingecko chain list saved');
  });
  return data;
};
export const mapCoingeckoChainName = async () => {
  let maps: { [cg: string]: string } = {};
  let chainlist: chainItem[] = [];
  try {
    chainlist = JSON.parse(fs.readFileSync(`chainlist.json`, 'utf8'));
  } catch (e) {
    console.log('No chain list was found');
    return undefined;
  }
  let cgchain: coingeckoChain[] = [];
  try {
    console.log('feching new data');
    cgchain = (await fetchChainList())!;
    csl(cgchain);
  } catch (e) {
    cgchain = JSON.parse(fs.readFileSync(`coingeckoChainList.json`, 'utf8'));
  }
  for (const c of chainlist) {
    const cg = cgchain.find((i) => {
      if (c.id) {
        if (i.chain_identifier) {
          if (i.chain_identifier === c.id) {
            return true;
          }
        } else {
          if (i.native_coin_id == c.native_token?.coingecko_id) {
            return true;
          }
        }
      } else {
        if (i.native_coin_id == c.native_token?.coingecko_id) {
          return true;
        }
      }
    });
    if (cg) {
      maps[cg.id] = c.chain ?? '';
    }
  }
  fs.writeFile(`chainmap.json`, JSON.stringify(maps), (e) => {
    if (e) {
      console.error('error: ', e);
    }
    console.log('coingecko chain map saved');
  });
  return maps;
};
// (async () => {
//   await mapCoingeckoChainName();
// })();
