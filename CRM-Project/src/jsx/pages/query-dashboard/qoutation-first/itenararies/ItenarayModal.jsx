import React from "react";

const ItenarayModal = ({tabId, children}) => {
  return (
    <div
      className="modal fade"
      id={tabId}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-primary">
            <h5 className="modal-title" id="exampleModalLabel">
              Modal Title
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="modal-close-button"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="modal-save-button">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItenarayModal;
