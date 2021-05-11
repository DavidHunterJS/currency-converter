import PropTypes from "prop-types";
function Item(props) {
  return (
    <li className="list-group-item bg-dark  li-container">
      <span className="item-containter d-flex">
        <span
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              props.sendToTop(e, props.symbol);
            }
          }}
          onClick={(e) => props.sendToTop(e, props.symbol)}
          className={`flag-icon flag-icon-${props.flag} flag country`}
          tabIndex="0"
          aria-label="Set The Base Currency"
        ></span>
        <div className="item-text">
          <div className="country-name">{props.name}</div>
          <div className="small text-muted rate">
            1 {props.base} = {props.rate} {props.symbol}
          </div>
        </div>
        <span
          className="amount-result"
          onClick={(e) => props.editAmount(e)}
          onBlur={(e) => props.setNewAmount(e)}
        >
          {props.result.toLocaleString(`${props.locale}`, {
            style: "currency",
            currency: `${props.symbol}`,
          })}
        </span>
      </span>
    </li>
  );
}
Item.propTypes = {
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  rate: PropTypes.number.isRequired,
  flag: PropTypes.string.isRequired,
  base: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  result: PropTypes.number.isRequired,
  code: PropTypes.string.isRequired,
  sendToTop: PropTypes.func.isRequired,
  editAmount: PropTypes.func.isRequired,
  setNewAmount: PropTypes.func.isRequired,
};
export default Item;
