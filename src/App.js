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
    const amountTxt = document.getElementById("hiddenAmount");
    const inputEl = document.getElementById("amtInput");
    const overlay = document.getElementById("overlay");
    // SETS STATE WITH NEW AMOUNT
    setAmount(inputEl.value);
    // DELETES NUMBER INPUT FROM DOM
    inputEl.parentNode.removeChild(inputEl);
    // REMOVES OVERLAY
    overlay.style.display = "none";
    // SHOWS THE CURRENCY AMOUNT TEXT
    amountTxt.classList.remove("hide");
    console.log("Blurred");
  };
  const makeAmountInput = () => {
    const amountTxt = document.querySelector(
      "li.list-group-item:nth-child(1) > span:nth-child(1) > span:nth-child(3)"
    );
    // GRABS THE AMOUNT TEXT
    let amtZ = amountTxt.innerText;
    // TURNS TEXT INTO A NUMBER REMOVING THE FIRST CHAR / DOLLAR SYMBOL
    const amt = parseInt(amtZ.substring(1));
    const amountParent = document.querySelector(
      "li.list-group-item:nth-child(1) > span:nth-child(1)"
    );
    const inputNum = document.createElement("input");
    // .style.display = block is on none is off
    const overlay = document.getElementById("overlay");
    // SETTING ATTRIBUTES ON THE NEW INPUT
    inputNum.setAttribute("type", "number");
    inputNum.setAttribute("value", amt);
    inputNum.setAttribute("id", "amtInput");
    // ADD INPUT TO DOM
    amountParent.appendChild(inputNum);
    // ADD EVENT LISTENERS TO NEW INPUT
    inputNum.addEventListener("blur", (e) => setNewAmount(e));
    inputNum.addEventListener("keydown", (e) => {
      e.key === "Enter" ? setNewAmount(e) : null;
    });
    // ADD ID TO ACCESS THIS LATER
    amountTxt.setAttribute("id", "hiddenAmount");
    // HIDE AMOUNT TEXT
    amountTxt.classList.add("hide");
    // SHOW THE OVERLAY
    overlay.style.display = "block";
    // PUT THE CURSOR IN THE INPUT
    inputNum.focus();
  };
  const editAmount = (e) => {
    // CHECK ADDED SO ONLY 1 INPUT MAY EXIST
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
      // ADDS ATTRIBUTES TO INTERACTIVE FIELD AT FIRST LI / AMOUNT FIELD
      const amountTextUi = document.querySelector(
        "li.list-group-item:nth-child(1) > span:nth-child(1) > span:nth-child(3)"
      );
      amountTextUi.setAttribute("aria-label", "Enter Currency Amount");
      amountTextUi.setAttribute("amountTextUi", "0");
      amountTextUi.addEventListener("click", (e) => editAmount(e));
      amountTextUi.addEventListener("keydown", (e) => {
        e.key === "Enter" ? editAmount(e) : null;
      });
    }
  };
  useEffect(() => {
    // CALLS FETCH ON MOUNT AND WHEN BASE CURRENCY CHANGES
    handleFetch();
  }, [base]);
  // RETURN STATEMENT
  return (
    <main className="App App-header container-fluid">
      <div id="overlay"></div>
      <header id="title">Currency Converter</header>
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
