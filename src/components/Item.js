import PropTypes from "prop-types";
function Item(props) {
  return (
    <li className="list-group-item bg-dark  li-container">
      <span className="item-containter d-flex">
        <span
          onClick={(e) => props.sendToTop(e, props.symbol)}
          className={`flag-icon flag-icon-${props.flag} flag country`}
        ></span>
        <div className="item-text">
          <div className="country-name">{props.name}</div>
          <div className="small text-muted rate">
            1 {props.base} = {props.rate} {props.symbol}
          </div>
        </div>
        <span className="amount-result">
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
};
export default Item;
