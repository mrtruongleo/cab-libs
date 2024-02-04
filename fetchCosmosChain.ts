import axios from "axios";
import { csl } from "./func";
import * as fs from "fs";
import * as ts from "typescript";
import * as tsNode from "ts-node";

const getCosmosStationValidatorList = async () => {
  const url =
    "https://raw.githubusercontent.com/cosmostation/web-wallet-ts-react/develop/src/constants/validator.ts";
  const res = await axios.get(url);
  if (res) {
    const data = res.data;
    try {
      const val = data
        .split("export const etcValidatorSet: ValidatorSet[]")[0]
        .split("export const cosmosValidatorSet: ValidatorSet[] =")[1];
      //csl(val);
      // for(const v of val){
      //   const z = v.split()
      // }
      // Options for ts-node
      const options: tsNode.RegisterOptions = {
        transpileOnly: true,
        compilerOptions: {
          module: "es6", // Specify the module system here
        },
      };

      // Execute TypeScript code
      tsNode.register(options);
      const validatorList = eval(val);
      if (Array.isArray(validatorList)) {
        const final = validatorList.concat([
          {
            address: "celestia1uqj5ul7jtpskk9ste9mfv6jvh0y3w34vw7qg7g",
            operatorAddress:
              "celestiavaloper1uqj5ul7jtpskk9ste9mfv6jvh0y3w34vtpz3gw",
          },
          {
            address: "dydx1vl5ty47uwpfv4mcutwv4zam09mvvvdgy2m9e59",
            operatorAddress:
              "dydxvaloper1vl5ty47uwpfv4mcutwv4zam09mvvvdgy09n0l5",
          },
          {
            address: "kyve17xuyhz7s5hkwglmkf3qsrlyr3wk9qvqzxg4mja",
            operatorAddress:
              "kyvevaloper17xuyhz7s5hkwglmkf3qsrlyr3wk9qvqz5c4mul",
          },
          {
            address: "sei1hnkkqnzwmyw652muh6wfea7xlfgplnyj3edm09",
            operatorAddress:
              "seivaloper1hnkkqnzwmyw652muh6wfea7xlfgplnyj0ku4w4",
          },
          ,
          {
            address: "neutron1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep35p7l8",
            operatorAddress:
              "neutronvaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4eptfc8er",
          },
        ]);
        fs.writeFile(
          `validator/cosmostation.json`,
          JSON.stringify(final),
          (e) => {
            if (e) {
              console.error("error: ", e);
            }
          }
        );
        return final;
      }
    } catch (e) {
      csl(e);
    }
  }
};
const getCosmosChainRegistry = async (chain: string) => {
  const chainUrl = `https://raw.githubusercontent.com/cosmos/chain-registry/master/${chain}/chain.json`;
  const assetListUrl = `https://raw.githubusercontent.com/cosmos/chain-registry/master/${chain}/assetlist.json`;

  let Chain: { [key: string]: any } = {};
  const chainRes = await axios.get(chainUrl);
  if (chainRes) {
    const data = chainRes.data;
    //csl(data);

    Chain = {
      ...Chain,
      chain:
        chain === "bandchain"
          ? "band"
          : chain === "injective"
          ? "inj"
          : chain === "assetmantle"
          ? "mantle"
          : chain,
      name: data.pretty_name,
      type: data.network_type,
      network: "cosmos",
      canMemo: true,
      bech32Prefix: data.bech32_prefix,
      slip44: data.slip44,
      rpc: data.apis.rpc.map((i: any) => i.address),
      rest: data.apis.rest.map((i: any) => i.address),
      grpc: data.apis.grpc.map((i: any) => i.address),
      fee: { ...data.fees.fee_tokens[0], simulateGasMultiply: 1.4 },
      logo: data.logo_URIs.png,
      description: data.description,
      explorers: [
        {
          name: "MinScan",
          url: `https://www.mintscan.io/${chain}/`,
        },
      ],
    };
  }

  const assetsRes = await axios.get(assetListUrl);
  if (assetsRes) {
    const data: any = assetsRes.data.assets[0];
    Chain = {
      ...Chain,
      token_info: {
        name: data.name,
        symbol: data.symbol,
        decimals: data.denom_units.find((u: any) => u.exponent != 0).exponent,
        coingecko_id: data.coingecko_id,
      },
      native_token: {
        name: data.name,
        symbol: data.symbol,
        decimals: data.denom_units.find((u: any) => u.exponent !== 0).exponent,
        coingecko_id: data.coingecko_id,
        denom: data.denom_units.find((u: any) => u.exponent === 0).denom,
        delegate: [
          {
            validator: "Cosmos Station",
            validatorAddress: "",
            commission: "",
            apr: "",
            logo: "https://avatars.githubusercontent.com/u/49175386?s=200&v=4",
          },
        ],
      },
    };
  }
  return Chain;
};
setTimeout(async () => {
  const chain: string = "osmosis";
  const validator = await getCosmosStationValidatorList();
  const Chain = await getCosmosChainRegistry(chain);

  if (Chain) {
    const cosmosStationValidator = validator!.filter((e) =>
      e.address.includes(Chain.bech32Prefix)
    );
    if (cosmosStationValidator?.length > 0) {
      Chain.native_token.delegate[0].validatorAddress =
        cosmosStationValidator[0].operatorAddress;
    }
    const filename =
      chain === "bandchain" ? "band" : chain === "injective" ? "inj" : chain;
    fs.writeFile(
      `chainlist/cosmos/${filename}.json`,
      JSON.stringify(Chain),
      (e) => {
        if (e) {
          console.error("error: ", e);
        }
        console.log("Data saved");
      }
    );
  }
  csl(Chain);
}, 100);
