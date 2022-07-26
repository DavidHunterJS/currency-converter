import { useState, useEffect } from "react";
import Countries from "./components/Countries";
import Item from "./components/Item";
import LoadingSpinner from "./components/LoadingSpinner";
import Modal from "./components/Modal/Modal";
// import Input from "./components/Input";
import "./App.css";
const baseUrl = "https://v6.exchangerate-api.com/v6/";
const APIKey = process.env.REACT_APP_API;
// FAKE API FOR DEV
// import { GET } from "./components/Fake";
// REAL API THAT WORKS BUT LIMITED TRIES
import { GET } from "./Fetch";

function App() {
  const [symbol, setSymbol] = useState();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [base, setBase] = useState("USD");
  const [countriesData, setCountriesData] = useState();
  const url = `${baseUrl}${APIKey}/latest/${base}`;
  // const fakeUrl = "../components/Fake.js";

  // MODAL METHODS PASSED AS PROPS
  let [value, setValue] = useState("0.00");
  const handleChange = (e) => {
    let val0 = e.target.value;
    let val1 = val0.replace(/\D/g, "");
    let val2 = (val1 / 100).toFixed(2);
    setValue(val2);
  };
  const handleClose = () => {
    setShow(false);
    let floatNum = parseFloat(value);
    setAmount(floatNum);
  };
  const handleOpen = (e, code) => {
    e.target.id && setShow(true);
    console.log(e.target.id);
    setSymbol(code);
  };
  // SETS THE NEW BASE CURRENCY WHEN FLAGGED IS CLICKED
  // AND SENDS ITEM TO TOP OF LIST
  const sendToTop = (e, symbol) => {
    // IF ITS NOT THE FIRST LIST ITEM ALREADY, THEN SEND TO TOP
    if (e.target.offsetParent.previousSibling) {
      // GET EL AND REMOVE ATTRIBUTES
      const amountTextUi = document.querySelector(
        "li.list-group-item:nth-child(1) > span:nth-child(1) > span:nth-child(3)"
      );
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
  // CALLS FETCH ON MOUNT AND WHEN BASE CURRENCY CHANGES
  useEffect(() => {
    handleFetch();
  }, [base]);
  // RETURN STATEMENT
  return (
    <main className="App App-header container-fluid">
      <div id="overlay"></div>
      <header className="title">Currency Converter</header>
      <div id="parent">
        <Modal
          title="Enter Currency Amount"
          onClose={handleClose}
          show={show}
          handleChange={handleChange}
          setValue={setValue}
          value={value}
          symbol={symbol}
        ></Modal>
        {!countriesData ? (
          <div className="title">{<LoadingSpinner />}</div>
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
                  handleOpen={handleOpen}
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
