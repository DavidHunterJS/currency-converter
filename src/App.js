import { useState, useEffect } from "react";
const baseUrl = "https://v6.exchangerate-api.com/v6/";
const APIKey = process.env.REACT_APP_API;
import Countries from "./components/Countries";
import Item from "./components/Item";
import "./App.css";

// APIs
// fake API for DEV
// import { GET } from "./components/Fake";
// REAL API That Works But Limited Tries
import { GET } from "./Fetch";

function App() {
  // STATE
  // UI
  const [newCurrency, setNewCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [base, setBase] = useState("USD");
  const [netRates, setNetRates] = useState();
  const [countriesData, setCountriesData] = useState();
  const url = `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${base}`;
  // FETCH: GETS A LIST OF CURRENT EXCHANGE RATES
  useEffect(() => {
    const handleFetch = async () => {
      const response = await GET(url);
      const rates = await response.data.conversion_rates;
      setNetRates(rates);
      console.log("Handle Fetched!");
    };
    handleFetch();
  }, [url]);
  useEffect(() => {
    const handleTransform = () => {
      // console.log(`netRates in transform are: ${netRates}`);
      // console.log(`Countries in transform are: ${Countries}`);
      for (const [k, v] of Object.entries(Countries)) {
        for (let [key, value] of Object.entries(netRates)) {
          for (let i = 0; i < 1; i++) {
            if (v.symbol === key) {
              v.rate = value;
            }
          }
        }
      }
      setCountriesData(Countries);
      // console.log(`countriesData is: ${countriesData}`);
    };
    if (netRates) handleTransform();
  }, [netRates]);

  // console.log(`netRates is: ${typeof netRates}`);
  // console.log(`countriesData222 is: ${countriesData}`);
  const LiComponents =
    countriesData &&
    countriesData.map((v, i) => (
      <Item
        key={i}
        name={v.name}
        symbol={v.symbol}
        flag={v.flag}
        rate={v.rate}
        base={base}
      />
    ));

  // RETURN
  return (
    <main className="App App-header container-fluid">
      <div>{LiComponents}</div>
      <ul className="list-group ">
        <li className="list-group-item bg-dark  li-container">
          <span className="item-containter d-flex">
            <span className="flag-icon flag-icon-us flag country"></span>
            <div className="item-text">
              <div className="country-name">United States</div>
              <div className="small text-muted rate">1 USD = 1.0000 USD</div>
            </div>
            <span className="amount-result">$500.00</span>
          </span>
        </li>
        <li className="list-group-item">A second item</li>
        <li className="list-group-item">A third item</li>
        <li className="list-group-item">A fourth item</li>
        <li className="list-group-item">And a fifth one</li>
      </ul>
      <header>Currency Converter</header>

      <span>
        <label htmlFor="amount">
          Amount{" "}
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value, 10))}
          />
        </label>
        <label htmlFor="baseCurrency">
          From{" "}
          <select
            name="baseCurrency"
            id="baseCurrency"
            onChange={(e) => setBase(e.target.value)}
            value={base}
          >
            <option value=""> </option>
            <option value="USD">USD - US Dollar</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </label>

        <label htmlFor="newCurrency">
          To{" "}
          <select
            name="newCurrency"
            id="newCurrency"
            value={newCurrency}
            onChange={(e) => setNewCurrency(e.target.value)}
          >
            <option value=""> </option>
            <option value="USD">USD - US Dollar</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </label>
      </span>
      <span className="results"></span>
    </main>
  );
}

export default App;
