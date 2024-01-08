import { useState } from "react";
import { CovalentClient } from "@covalenthq/client-sdk";
import "./App.css";
import {
  SearchSelect,
  SearchSelectItem,
  TextInput,
  Title,
  Grid,
  Col,
  Card,
  Text,
  Metric,
  Button,
} from "@tremor/react";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [event, setEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [gasPrice, setGasPrice] = useState({ one: "", three: "", five: "" });

  const allChain = [
    "arbitrum-goerli",
    "arbitrum-mainnet",
    "arbitrum-nova-mainnet",
    "arbitrum-sepolia",
    "aurora-mainnet",
    "avalanche-beam-mainnet",
    "avalanche-dexalot-mainnet",
    "avalanche-dos",
    "avalanche-loco-legends-mainnet",
    "avalanche-mainnet",
    "avalanche-meld-mainnet",
    "avalanche-numbers",
    "avalanche-shrapnel-mainnet",
    "avalanche-step-network",
    "avalanche-uptn",
    "avalanche-xanachain",
    "avalanche-xplus",
    "axie-mainnet",
    "base-mainnet",
    "bnb-antimatter-mainnet",
    "bnb-fncy-mainnet",
    "bnb-meta-apes-mainnet",
    "bnb-opbnb-mainnet",
    "boba-bnb-mainnet",
    "boba-goerli",
    "boba-mainnet",
    "bsc-mainnet",
    "btc-mainnet",
    "canto-mainnet",
    "covalent-internal-network-v1",
    "cronos-mainnet",
    "defi-kingdoms-mainnet",
    "emerald-paratime-mainnet",
    "eth-goerli",
    "eth-holesky",
    "eth-mainnet",
    "eth-sepolia",
    "evmos-mainnet",
    "fantom-mainnet",
    "flarenetworks-canary-mainnet",
    "flarenetworks-flare-mainnet",
    "gather-mainnet",
    "gnosis-mainnet",
    "harmony-mainnet",
    "horizen-eon-mainnet",
    "kcc-mainnet",
    "linea-mainnet",
    "loot-mainnet",
    "lumoz-decibling",
    "lumoz-public-zksync-v2",
    "lumoz-stark-sport",
    "mantle-mainnet",
    "matic-mainnet",
    "matic-mumbai",
    "meter-mainnet",
    "metis-mainnet",
    "metis-stardust",
    "milkomeda-a1-mainnet",
    "milkomeda-c1-devnet",
    "milkomeda-c1-mainnet",
    "moonbeam-mainnet",
    "moonbeam-moonbase-alpha",
    "moonbeam-moonriver",
    "oasis-sapphire-mainnet",
    "oasys-mainnet",
    "opside-cb-zkevm",
    "opside-debox",
    "opside-era7",
    "opside-jackbot",
    "opside-law-chain",
    "opside-public-zkevm",
    "opside-relation",
    "opside-soquest-zkevm",
    "opside-vip3",
    "opside-xthrill",
    "opside-zkmeta",
    "optimism-goerli",
    "optimism-mainnet",
    "optimism-sepolia",
    "palm-mainnet",
    "pgn-mainnet",
    "polygon-zkevm-mainnet",
    "rollux-mainnet",
    "rsk-mainnet",
    "scroll-mainnet",
    "solana-mainnet",
    "sx-mainnet",
    "telos-mainnet",
    "tomochain-mainnet",
    "ultron-mainnet",
    "zksync-mainnet",
    "zora-mainnet",
  ];

  const eventTypes = [
    "ERC20 token transfers",
    "Native token transfers",
    "Uniswap V3 swap events",
  ];
  const keys = ["erc20", "nativetokens", "uniswapv3"];

  const getGasPrice = async (inputKey, inputChain, inputEvents) => {
    try {
      const client = new CovalentClient(inputKey);
      const data = await client.BaseService.getGasPrices(
        inputChain,
        inputEvents,
        "USD"
      );
      if (data.error) {
        alert(data.error.error_message);
        setGasPrice({ one: "Error...", three: "Error...", five: "Error..." });
      }
      if (!data.data.items[0].pretty_total_gas_quote) {
        setGasPrice({
          one: "Not available",
          three: "Not available",
          five: "Not available",
        });
      } else {
        setGasPrice({
          one: data.data.items[0].pretty_total_gas_quote,
          three: data.data.items[1].pretty_total_gas_quote,
          five: data.data.items[2].pretty_total_gas_quote,
        });
      }
    } catch (error) {
      alert("Error");
      setGasPrice({ one: "Error...", three: "Error...", five: "Error..." });
    }
  };

  return (
    <section className="container mx-auto p-4 bg-gray-200">
      <header className="bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6 shadow rounded-md mb-5">
        <div className="flex items-center justify-center">
          <h2 className="font-bold inline-block text-blue-400 text-2xl">
            COVALENT GAS PRICE CHECKER
          </h2>
        </div>
      </header>

      <Grid numItemsSm={3}>
        <Col className="p-2">
          <Text className="my-2 text-xl font-bold">API Key</Text>
          <TextInput value={apiKey} onValueChange={setApiKey}></TextInput>
        </Col>
        <Col className="p-2">
          <Text className="my-2 text-xl font-bold">Blockchain</Text>
          <SearchSelect value={blockchain} onValueChange={setBlockchain}>
            {allChain.map((item) => (
              <SearchSelectItem key={item} value={item}>
                {item}
              </SearchSelectItem>
            ))}
          </SearchSelect>
        </Col>
        <Col className="p-2">
          <Text className="my-2 text-xl font-bold">Events</Text>
          <SearchSelect value={event} onValueChange={setEvent}>
            {eventTypes.map((item, index) => (
              <SearchSelectItem key={keys[index]} value={keys[index]}>
                {item}
              </SearchSelectItem>
            ))}
          </SearchSelect>
        </Col>
        <Col className="col-span-full p-2">
          <Button
            variant="secondary"
            onClick={async () => {
              if (!apiKey || !blockchain || !event) {
                return;
              }

              setLoading(true);
              try {
                await getGasPrice(apiKey, blockchain, event);
              } finally {
                setLoading(false);
              }
            }}
            className={`font-semibold rounded-md w-full ${
              loading || !apiKey || !blockchain || !event
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={loading || !apiKey || !blockchain || !event}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </Col>
      </Grid>

      <Grid numItemsSm={3} className="gap-3 mt-10">
        <Col>
          <Card>
            <Title>Average Gas Price</Title>
            <Text>1 Minutes</Text>
            <Metric className="mt-4">{loading ? "..." : gasPrice.one}</Metric>
          </Card>
        </Col>
        <Col>
          <Card>
            <Title>Average Gas Price</Title>
            <Text>3 Minutes</Text>
            <Metric className="mt-4">{loading ? "..." : gasPrice.three}</Metric>
          </Card>
        </Col>
        <Col>
          <Card>
            <Title>Average Gas Price</Title>
            <Text>5 Minutes</Text>
            <Metric className="mt-4">{loading ? "..." : gasPrice.five}</Metric>
          </Card>
        </Col>
      </Grid>

      <Grid numItemsSm={2} className="gap-3 mt-10">
        <Col>
          <Card>
            <Title>About API Key</Title>
            <Text>
              If you need to get API Key, please visit{" "}
              <a
                href="https://www.covalenthq.com/platform/"
                className="text-blue-500 underline"
              >
                Covalent Platform
              </a>{" "}
              and sign up for an API Key. Sign up or register on the platform to
              obtain your exclusive and distinct API key.
            </Text>
          </Card>
        </Col>
        <Col>
          <Card>
            <Title>About Page</Title>
            <Text>
              This page was made for the Covalent bounty - Build and Deploy a
              Chain-specific Gas Price Dashboard Using GoldRush Kit
            </Text>
          </Card>
        </Col>
      </Grid>
    </section>
  );
}

export default App;
