import { useState, useEffect } from "react";
import Countries from "./components/Countries";
import Item from "./components/Item";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";
const baseUrl = "https://v6.exchangerate-api.com/v6/";
const APIKey = process.env.REACT_APP_API;
// FAKE API FOR DEV
// import { GET } from "./components/Fake";
// REAL API THAT WORKS BUT LIMITED TRIES
import { GET } from "./Fetch";
import { doc } from "prettier";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [base, setBase] = useState("USD");
  const [countriesData, setCountriesData] = useState();
  const url = `${baseUrl}${APIKey}/latest/${base}`;
  // const fakeUrl = "../components/Fake.js";

  // SETS THE AMOUNT OF CURRENCY TO BE CALCULATED
  function setNewAmount() {
    const amountTxt = document.getElementById("hiddenAmount");
    const inputEl = document.getElementById("amtInput");
    const overlay = document.getElementById("overlay");
    let val = parseFloat(inputEl.value);
    // SETS STATE WITH NEW AMOUNT
    setAmount(val);
    // DELETES NUMBER INPUT FROM DOM
    inputEl.parentNode.removeChild(inputEl);
    // REMOVES MODAL OVERLAY
    overlay.style.display = "none";
    // SHOWS THE CURRENCY AMOUNT TEXT
    amountTxt.classList.remove("hide");
    amountTxt.removeEventListener("click", editAmount);
    console.log(amountTxt);
  }
  function makeAmountInputOverlay() {
    const amountTxt = document.querySelector(
      "li.list-group-item:nth-child(1) > span:nth-child(1) > span:nth-child(3)"
    );
    // GRABS THE AMOUNT TEXT
    let amtTxt = amountTxt.outerText;
    // REMOVES THE CURRENCY SYMBOL
    let amtStripped = amtTxt.replace(/^\D|,/g, "");
    // GET THE VALUE OF AMOUNTXT INSTEAD OF ITS INNERTEXT
    // TURNS TEXT INTO A NUMBER REMOVING THE FIRST CHAR / CURRENCY SYMBOL
    const amtNum = parseFloat(amtStripped);
    const amountParent = document.querySelector(
      "li.list-group-item:nth-child(1) > span:nth-child(1)"
    );
    const inputNum = document.createElement("input");
    // .style.display = block is on, none is off
    const overlay = document.getElementById("overlay");
    // SETTING ATTRIBUTES ON THE NEW INPUT
    inputNum.setAttribute("type", "number");
    inputNum.setAttribute("value", amtNum);
    inputNum.setAttribute("id", "amtInput");
    // ADD INPUT TO DOM
    amountParent.appendChild(inputNum);
    // ADD EVENT LISTENERS TO NEW INPUT
    inputNum.addEventListener("blur", setNewAmount);
    inputNum.addEventListener("keydown", (e) => {
      e.key === "Enter" ? setNewAmount(e) : null;
    });
    // HIDE AMOUNT TEXT
    amountTxt.classList.add("hide");
    // SHOW THE OVERLAY
    overlay.style.display = "block";
    // PUT THE CURSOR IN THE INPUT
    inputNum.focus();
  }
  // SINGLETON FOR THE MODAL INPUT OVERLAY
  function editAmount(e) {
    const inputExists = document.getElementById("amtInput");
    if (!inputExists) {
      makeAmountInputOverlay();
    }
  }
  let clickHandler = (e) => {
    if (e.target.id == "hiddenAmount") {
      editAmount(e);
    }
  };
  // SETS THE NEW BASE CURRENCY WHEN FLAGGED IS CLICKED
  // AND SENDS ITEM TO TOP OF LIST
  const sendToTop = (e, symbol) => {
    // IF NOT THE FIRST LIST ITEM ALREADY, THEN SEND TO TOP
    if (e.target.offsetParent.previousSibling) {
      // GET AND REMOVE EVENT LISTENER
      const amountTextUi = document.querySelector(
        "li.list-group-item:nth-child(1) > span:nth-child(1) > span:nth-child(3)"
      );
      // CLONE NODE TO RM ALL EVT LISTENERS WHEN FIELD SHOULD NO LONGER BE EDITABLE
      // let newAmountTextUi = amountTextUi.cloneNode(true);
      // amountTextUi.parentNode.replaceChild(newAmountTextUi, amountTextUi);
      //
      amountTextUi.removeAttribute("id");
      amountTextUi.removeAttribute("aria-label");
      amountTextUi.removeAttribute("amountTextUi");

      // SETS THE NEW BASE CURRENCY COUNTRY
      setBase(symbol);
      // THE SEND TO TOP PART
      const parent = document.getElementById("parent");
      const node = e.target.offsetParent;
      parent.insertBefore(node, parent.firstChild);
      setIsLoading(true);
    }
  };
  const makeInput = () => {
    // ADDS ATTRIBUTES TO TEXT FIELD AT FIRST LI / AMOUNT FIELD TO MAKE IT INTERACTIVE
    const amountTextUi = document.querySelector(
      "li.list-group-item:nth-child(1) > span:nth-child(1) > span:nth-child(3)"
    );
    amountTextUi.setAttribute("id", "hiddenAmount");
    amountTextUi.setAttribute("aria-label", "Enter Currency Amount");
    amountTextUi.setAttribute("amountTextUi", "0");
    amountTextUi.addEventListener("click", clickHandler);
    amountTextUi.addEventListener("keydown", (e) => {
      e.key === "Enter" ? editAmount(e) : null, false;
    });
  };
  // CALLS FETCH COMPONENT, TRANSFORMS DATA,
  // THEN SAVES NEW DATA TO STATE
  const handleFetch = async () => {
    const response = await GET(url);
    const rates = response.data.conversion_rates;
    console.log(rates);
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
      makeInput();
    }
    // console.log(hidAmount);
    setIsLoading(false);
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
      <div id="parent">
        {!countriesData ? (
          <div id="title">{<LoadingSpinner />}</div>
        ) : (
          countriesData.map(
            (country, i) => (
              console.log("mapping"),
              (
                <Item
                  key={country.id}
                  name={country.name}
                  symbol={country.symbol}
                  flag={country.flag}
                  rate={country.rate}
                  locale={country.locale}
                  base={base}
                  result={country.rate * amount}
                  code={country.code}
                  sendToTop={sendToTop}
                  editAmount={editAmount}
                  setNewAmount={setNewAmount}
                  isLoading={isLoading}
                  LoadingSpinner={LoadingSpinner}
                />
              )
            )
          )
        )}
      </div>
    </main>
  );
}

export default App;
