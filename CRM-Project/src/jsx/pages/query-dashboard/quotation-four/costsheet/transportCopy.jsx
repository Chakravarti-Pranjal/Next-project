import React from "react";
import TourManager from "./TourManager";

const Transport = ({ handleNext }) => {
  return (
    <div>
      <div className="d-flex mb-2 justify-content-end gap-2">
        <button className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0">
          <i className="fa-solid fa-floppy-disk fs-4 me-1" />
          Save
        </button>
        <button
          className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0"
          onClick={() => handleNext("transport")}
        >
          Next
          <i
            className="fa-solid fa-backward text-red bg-white p-1 rounded ms-1"
            style={{ transform: "rotate(180deg)" }}
          ></i>
        </button>
      </div>
      {/* Table 1: Delhi Services */}
      <div className="d-flex align-items-center mb-3 mb-sm-0">
        <div className="ml-3">
          <span className="fs-5">
            <span className="querydetails text-grey">Tour Name :</span> Master
            Tours
          </span>
        </div>
      </div>
      <div className="d-flex align-items-center mb-3 mb-sm-0">
        <div className="ml-3">
          <span className="fs-5">
            <span className="querydetails text-grey">Costing Date :</span>{" "}
            09-05-2025
          </span>
        </div>
      </div>
      <table className="table table-bordered itinerary-table">
        <thead>
          <tr>
            <th>City</th>
            <th>Type</th>
            <th>Service</th>
            <th>Entr</th>
            <th>Misc P.P</th>
            <th>Crysta</th>
            <th>Luxury Car</th>
            <th>Tempo</th>
            <th>Guide FIT</th>
            <th>Mini Coach</th>
            <th>Large Coach</th>
            <th>Guide GIT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan="11">Delhi</td>
            <td></td>
            <td>Mineral water</td>
            <td></td>
            <td></td>
            <td>0.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Goody Bags</td>
            <td></td>
            <td></td>
            <td>300.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Gift</td>
            <td></td>
            <td></td>
            <td>0.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Misc</td>
            <td></td>
            <td></td>
            <td>500.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Temple Shoe Keeping</td>
            <td></td>
            <td></td>
            <td>0.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Wi-Fi</td>
            <td></td>
            <td></td>
            <td>200.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Assistance on arrival</td>
            <td></td>
            <td></td>
            <td></td>
            <td>Urbania</td>
            <td>8500.00</td>
            <td>1000.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Jama Masjid with Rickshaw ride</td>
            <td>350.00</td>
            <td>300.00</td>
            <td></td>
            <td>Urbania</td>
            <td>8500.00</td>
            <td>4000.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Humayuns Tomb</td>
            <td>600.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Cycle Tour - Delhi by Cycle</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Mail</td>
            <td>14000.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Assistance on departure</td>
            <td>Saints </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>500.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td rowSpan="4">Agra</td>
            <td></td>
            <td>Assistance on arrival</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>1000.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Taj Mahal with Battery Van</td>
            <td>1300.00</td>
            <td>100.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td>4000.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Agra Fort</td>
            <td>650.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>6000.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Assistance on departure</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>600.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowSpan="5">Jaipur</td>
            <td></td>
            <td>Assistance on arrival</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>1000.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Amber Fort with Jeep Ride</td>
            <td>600.00</td>
            <td>500.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td>4000.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>City palace + Jantar Mantar + Hawa Mahal</td>
            <td>1400.00</td>
            <td>3540.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Jhalana Leopard Safari by Jeep</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>12000.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Assistance on departure</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>1000.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowSpan="3">Delhi</td>
            <td></td>
            <td>Assistance on arrival</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>500.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Mehraul Archaeologi Walk and Qutib at Dusk by ICV</td>
            <td>600.00</td>
            <td>4500.00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Assistance on departure and transfer</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>500.00</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colSpan="3" style={{ color: "red" }}>
              Service tax
            </td>
            <td style={{ color: "red" }}>275.00</td>
            <td style={{ color: "red" }}>522.00</td>
            <td style={{ color: "red" }}>0.00</td>
            <td style={{ color: "red" }}>0.00</td>
            <td style={{ color: "red" }}>5550.00</td>
            <td style={{ color: "red" }}>9000.00</td>
            <td style={{ color: "red" }}>0.00</td>
            <td style={{ color: "red" }}>0.00</td>
            <td style={{ color: "red" }}>0.00</td>
          </tr>
          <tr style={{ background: "#2e2e40" }}>
            <td colSpan="3">TOTAL</td>
            <td>5775.00</td>
            <td>10962.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>16650.00</td>
            <td>18900.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
        </tbody>
      </table>

      <TourManager />
    </div>
  );
};

export default Transport;
