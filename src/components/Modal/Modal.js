import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";

const Modal = (props) => {
  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="modal container-fluid" onClick={props.onClose}>
        <div
          className="modal-content container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h4 className="modal-title">{props.title}</h4>
          </div>
          <div className="modal-body d-flex justify-content-center">
            <span id="symbol">{props.symbol}</span>
            <input
              className={`flag-icon flag-icon-${props.flag} flag country`}
              id="amtInput"
              type="number"
              value={props.value}
              onChange={props.handleModalInputChange}
              autoFocus
            />
          </div>
          <div className="modal-footer">
            <button onClick={props.onClose} className="button">
              Save
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default Modal;
