// import React from "react";

// const QoutationModal = ({ TabclassName, children, Title }) => {

//   return (
//     <div
//       className={`modal fade ${TabclassName}`}
//       tabIndex="-1"
//       role="dialog"
//       aria-labelledby="myLargeModalLabel"
//       aria-hidden="true"
//     >
//       <div className="modal-dialog modal-lg ">
//         <div className="modal-content ">
//           <div className="modal-header p-2 bg-blue">
//             <h5 className="modal-title m-0" id="exampleModalLabel">
//               {Title}
//             </h5>
//             <i
//               className="fa-solid fa-xmark cursor-pointer"
//               data-dismiss="modal"
//               aria-label="Close"
//             ></i>
//           </div>

//           <div className="modal-body p-2">{children}</div>

//           <div className="modal-footer p-2 mt-4">
//             <button type="button" className="modal-save-button">
//               Save
//             </button>
//             <button
//               type="button"
//               className="modal-close-button"
//               data-dismiss="modal"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QoutationModal;

import React from "react";
import { Button, Modal } from "react-bootstrap";

const QoutationModal = ({ setBasicModal, basicModal, children, Title }) => {
  console.log("clicked on me");
  return (
    <>
      {/* <Modal className="fade bd-example-modal-lg" show={basicModal}>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => setBasicModal(false)}
          ></Button>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setBasicModal(false)} variant="danger light">
            Close
          </Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal> */}
      <Modal className="fade bd-example-modal-lg" show={basicModal} size="lg">
        <Modal.Header>
          <Modal.Title>{Title}</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => setBasicModal(false)}
          ></Button>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger light" onClick={() => setBasicModal(false)}>
            Close
          </Button>
          <Button variant="" type="button" className="btn btn-primary">
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QoutationModal;
