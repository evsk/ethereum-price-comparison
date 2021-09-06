import React from "react";
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";

function PriceView({ version }) {
  const [ethPrice, setEthPrice] = useState(null);

  const web2Fetch = useCallback(async () => {
    const ethId = "ethereum";
    const currency = "USD";
    const coinGeckoPriceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${ethId}&vs_currencies=${currency}`;
    try {
      const response = await fetch(coinGeckoPriceUrl);
      const data = await response.json();
      setEthPrice(data?.ethereum?.usd);
    } catch (error) {
      console.log(error);
    }
  }, [setEthPrice]);

  const web3Fetch = useCallback(async () => {
    // set up an infura account and project to handle your request
    const web3 = new Web3(
      "https://kovan.infura.io/v3/407b5e7328d8499aaab2b5a48efc4af1"
    );
    const aggregatorV3InterfaceABI = [
      {
        inputs: [],
        name: "latestRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    const address = "0x9326BFA02ADD2366b30bacB125260Af641031331";
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, address);
    try {
      const roundData = await priceFeed.methods.latestRoundData().call();
      setEthPrice((roundData[1] / 10 ** 8).toFixed(2));
    } catch (error) {
      console.log(error);
    }
  }, [setEthPrice]);

  useEffect(() => {
    if (version === "web2") {
      web2Fetch();
    } else {
      web3Fetch();
    }
  }, [web2Fetch, web3Fetch, version]);

  return (
    <div>
      {version === "web2" ? "Web2" : "Web3"} Price:{" "}
      {ethPrice ? `${ethPrice} USD` : "loading..."}
    </div>
  );
}

export default PriceView;
