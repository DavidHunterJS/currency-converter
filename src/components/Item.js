import PropTypes from "prop-types";
function Item(props) {
  return (
    <li className="list-group-item bg-dark  li-container">
      <span className="item-containter d-flex">
        <span className="flag-icon flag-icon-us flag country"></span>
        <div className="item-text">
          <div className="country-name">{props.name}</div>
          <div className="small text-muted rate">
            1 {props.symbol} = {props.rate} {props.symbol}
          </div>
        </div>
        <span className="amount-result">$500.00 rate times amount</span>
      </span>
    </li>
  );
}
Item.propTypes = {
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  rate: PropTypes.number.isRequired,
};
export default Item;
