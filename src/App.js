import { useState, useEffect } from "react";
const baseUrl = "https://v6.exchangerate-api.com/v6/";
// import axios from "axios";
const APIKey = process.env.REACT_APP_API;
import "./App.css";

// APIs
// fake API for DEV
import { GET } from "./components/Fake";
// REAL API That Works But Limited Tries
// import { GET } from "./Fetch";

function App() {
  // STATE
  // UI
  const [amount, setAmount] = useState(1);
  const [original, setOriginal] = useState("USD");
  const [newCurrency, setNewCurrency] = useState("EUR");
  // LOGIC
  const [rate, setRate] = useState(888);
  const [result, setResult] = useState(888);
  const [url, setUrl] = useState("");

  // HANDLER
  const handleConvert = async () => {
    const response = await GET(url);
    const netRate = await response.conversion_rate;
    setRate(netRate);
    setResult(amount * netRate);
    console.log("Handle Converted");
  };
  // DO NOTHING ON FIRST MOUNT
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
  }, []);
  // DO STUFF ONLY AFTER FIRST MOUNT
  useEffect(() => {
    if (didMount) {
      setUrl(`${baseUrl}${APIKey}/pair/${original}/${newCurrency}`);
      handleConvert();
    }
  }, [url, amount, original, newCurrency]);

  // RETURN
  return (
    <main className="App App-header container-fluid">
      <header>Currency Converter</header>
      <p>
        The amount is {amount}, the base currency is {original}{" "}
        {original ? "and is converted to" : null} {newCurrency} at the rate{" "}
        {rate}, gives the result {result}
      </p>
      <p></p>
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
        <label htmlFor="originalCurrency">
          From{" "}
          <select
            name="originalCurrency"
            id="originalCurrency"
            onChange={(e) => setOriginal(e.target.value)}
            value={original}
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
      <span className="results">
        {!result ? (
          <p>Loading...</p>
        ) : (
          `${amount} ${original}s converted to ${newCurrency} equals ${result}`
        )}
      </span>
    </main>
  );
}

export default App;
