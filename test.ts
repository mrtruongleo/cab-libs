import { fetchChainList } from './fetchCoingeckoChainlist';
import { csl } from './func';
(async () => {
  const cgchain = (await fetchChainList())!;
  csl(cgchain.filter((i) => i.id.includes('hyper')));
})();
