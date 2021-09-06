import React from "react";
import "./App.css";
import PriceView from "./PriceView.js";
import EthLogo from "./EthLogo.js";

function App() {
  return (
    <div className="container">
      <h2> Ethereum Price Comparison </h2>
      <div className="prices">
        <PriceView version="web2" />
        <PriceView version="web3" />
      </div>
      <EthLogo />
    </div>
  );
}

export default App;
