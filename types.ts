export type coinData = {
  id: string;
  name?: string | any;
  symbol?: string | any;
  image?: string | any;
  current_price?: number | any;
  price_change_percentage_24h?: number | any;
  market_cap?: number | any;
  total_supply?: number | any;
  total_volume?: number | any;
  ath?: number | any;
  ath_change_percentage?: number | any;
  ath_date?: string | any;
  atl?: number | any;
  atl_change_percentage?: number | any;
  atl_date?: string | any;
  circulating_supply?: number | any;
  platforms: { [key: string]: string | any };
  fully_diluted_valuation?: number | any;
  high_24h?: number | any;
  last_updated?: string | any;
  low_24h?: number | any;
  market_cap_change_24h?: number | any;
  market_cap_change_percentage_24h?: number | any;
  market_cap_rank?: number | any;
  max_supply?: number | any;
  price_change_24h?: number | any;
  price_change_percentage_24h_in_currency?: number | any;
  roi?: number | any;
  sparkline_in_7d?: { price?: number[] | any } | any;
};

export type coinExport = {
  coingecko_id: string;
  symbol: string;
  name: string;
  logo: string;
  marketcap: number;
  platforms: { [chain: string]: string };
};
export type coingeckoChain = {
  id: string | any;
  chain_identifier: number | any;
  name: string;
  shortname: string;
  native_coin_id: string;
};
export type chainItem = {
  chain?: string;
  network?: string;
  name?: string;
  canMemo?: boolean;
  logo?: string;
  logo_id?: string;
  type?: string;
  description?: string;
  evm?: boolean | any;
  id?: number;
  hexId?: string;
  api?: string;
  endpoint?: string;
  rpc?: string[];
  rest?: string[];
  grpc?: string[];
  token_program_id?: string; //for solana
  cluster?: string; //for solana
  token_info?: {
    name?: string;
    symbol?: string;
    decimals?: number;
    coingecko_id?: string;
  };
  native_token?: {
    name?: string;
    symbol?: string;
    decimals?: number;
    coingecko_id?: string;
    denom?: string;
    delegate?: {
      validator?: string;
      validatorAddress?: string;
      commission?: string;
      apr?: string;
      logo?: string;
    }[];
  };
  fee?: {
    denom: string;
    fixed_min_gas_price: number;
    low_gas_price: number;
    average_gas_price: number;
    high_gas_price: number;
    simulateGasMultiply: number;
  }[];
  bech32Prefix?: string;
  slip44?: number;
  explorers?: {
    name?: string;
    url?: string;
    standard?: string;
  }[];
  assets?: {
    denom?: string;
    type?: string;
    origin_chain?: string;
    origin_denom?: string;
    origin_type?: string;
    symbol?: string;
    decimals?: number;
    enable?: boolean;
    path?: string;
    channel?: string;
    port?: string;
    counter_party?: {
      channel?: string;
      port?: string;
      denom?: string;
    };
    image?: string;
    coinGeckoId?: string;
  }[];
  gecko_terminal_chain_id?: string | any;
  dexscreener_chain_id?: string | any;
};
