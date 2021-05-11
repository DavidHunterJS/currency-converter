import { useState, useEffect } from "react";
import Countries from "./components/Countries";
import Item from "./components/Item";
import "./App.css";
const baseUrl = "https://v6.exchangerate-api.com/v6/";
const APIKey = process.env.REACT_APP_API;
// FAKE API FOR DEV
// import { GET } from "./components/Fake";
// REAL API THAT WORKS BUT LIMITED TRIES
import { GET } from "./Fetch";

function App() {
  const [amount, setAmount] = useState(23);
  const [base, setBase] = useState("USD");
  const [countriesData, setCountriesData] = useState();
  const url = `${baseUrl}${APIKey}/latest/${base}`;

  // SETS THE AMOUNT OF CURRENCY TO BE CALCULATED
  const setNewAmount = (e) => {
    const amountEl = document.getElementById("hiddenAmount");
    const inputEl = document.getElementById("amtInput");
    setAmount(inputEl.value);
    inputEl.parentNode.removeChild(inputEl);
    amountEl.classList.remove("hide");
    console.log("Blurred");
  };
  const makeAmountInput = () => {
    const amountEl = document.querySelector(
      "li.list-group-item:nth-child(1) > span:nth-child(1) > span:nth-child(3)"
    );
    let amtZ = amountEl.innerText;
    const amt = parseInt(amtZ.substring(1));
    const amountParent = document.querySelector(
      "li.list-group-item:nth-child(1) > span:nth-child(1)"
    );
    const inputNum = document.createElement("input");
    inputNum.setAttribute("type", "number");
    inputNum.setAttribute("value", amt);
    inputNum.setAttribute("id", "amtInput");
    amountParent.appendChild(inputNum);
    inputNum.addEventListener("blur", (e) => setNewAmount(e));
    amountEl.setAttribute("id", "hiddenAmount");
    amountEl.classList.add("hide");
    inputNum.focus();
    // grab innhtml and covert to a number
  };
  const editAmount = (e) => {
    const inputExists = document.getElementById("amtInput");
    if (!inputExists) {
      makeAmountInput();
    }
  };
  // SETS THE NEW BASE CURRENCY WHEN FLAGGED IS CLICKED
  // AND SENDS ITEM TO TOP OF LIST
  const sendToTop = (e, symbol) => {
    setBase(symbol);
    const parent = document.getElementById("parent");
    const node = e.target.offsetParent;
    parent.insertBefore(node, parent.firstChild);
  };
  // CALLS FETCH COMPONENT, TRANSFORMS DATA,
  // THEN SAVES NEW DATA TO STATE
  const handleFetch = async () => {
    const response = await GET(url);
    const rates = await response.data.conversion_rates;
    console.log(`Handle Fetched! at: ${url}`);
    if (rates) {
      let countryObjs = [...Countries];
      for (let [k, v] of Object.entries(countryObjs)) {
        for (let [key, value] of Object.entries(rates)) {
          for (let i = 0; i < 1; i++) {
            if (v.symbol === key) {
              v.rate = value;
            }
          }
        }
      }
      setCountriesData(countryObjs);
    }
  };
  // CALLS FETCH ON MOUNT AND WHEN BASE CHANGES
  useEffect(() => {
    handleFetch();
  }, [base]);
  // RETURN STATEMENT
  return (
    <main className="App App-header container-fluid">
      <header>Currency Converter</header>
      {
        <div id="parent">
          {/* MAP COMPONENTS TO DOM ELSE SHOW LOADING */}
          {countriesData
            ? countriesData.map(
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
                      sendToTop={sendToTop}
                      editAmount={editAmount}
                      setNewAmount={setNewAmount}
                    />
                  )
                )
              )
            : "Loading..."}
        </div>
      }
    </main>
  );
}

export default App;
