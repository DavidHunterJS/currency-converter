import { useState, useEffect } from "react";
const baseUrl = "https://v6.exchangerate-api.com/v6/";
const APIKey = process.env.REACT_APP_API;
import Countries from "./components/Countries";
import Item from "./components/Item";
import "./App.css";
// fake API for DEV
// import { GET } from "./components/Fake";
// REAL API That Works But Limited Tries
import { GET } from "./Fetch";

function App() {
  const [amount, setAmount] = useState(23);
  const [base, setBase] = useState("USD");
  // const [newCurrency, setNewCurrency] = useState("EUR");
  const [netRates, setNetRates] = useState();
  const [countriesData, setCountriesData] = useState();
  const url = `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${base}`;
  // fetch data / transform it / display it
  const handleFetch = async () => {
    const response = await GET(url);
    const rates = await response.data.conversion_rates;

    console.log(`Handle Fetched! at: ${url}`);

    setNetRates(rates);
    console.log(netRates);
    if (rates) {
      for (const [k, v] of Object.entries(Countries)) {
        for (let [key, value] of Object.entries(rates)) {
          for (let i = 0; i < 1; i++) {
            if (v.symbol === key) {
              // console.log(v.rate, value);
              v.rate = value;
            }
          }
        }
      }
      setCountriesData(Countries);
    }
  };
  useEffect(() => {
    handleFetch();
  }, []);

  // RETURN STATEMENT
  return (
    <main className="App App-header container-fluid">
      <header>Currency Converter</header>
      <div>
        {
          <div id="parent">
            {countriesData &&
              countriesData.map(
                (v, i) => (
                  console.log("mapping"),
                  (
                    <Item
                      key={v.id}
                      name={v.name}
                      symbol={v.symbol}
                      flag={v.flag}
                      rate={v.rate}
                      locale={v.locale}
                      base={base}
                      result={v.rate * amount}
                      code={v.code}
                    />
                  )
                )
              )}
          </div>
        }
      </div>
    </main>
  );
}

export default App;
