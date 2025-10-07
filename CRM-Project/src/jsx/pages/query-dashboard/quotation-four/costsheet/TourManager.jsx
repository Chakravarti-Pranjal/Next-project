import React from "react";

function TourManager() {
  return (
    <>
      <h5>TOUR MANAGER for Groups</h5>
      <table className="table table-bordered itinerary-table w-50">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}></th>
            <th>value</th>
            <th>x days/htl/mls</th>
            <th>subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "left" }}>FD Guide Fees</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="10.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>Language</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>Allow w/ Acco</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="9.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>Allow w/o Acco</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>ABF Tip</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>Lunch Tip</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>Dinner Tip</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>Baggage / htl</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>Misc + Ent</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>Airfare</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "left" }}>Accommodation</td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue="0.00"
                className="formControl1 width50px"
              />
            </td>
          </tr>
          <tr style={{ background: "#2e2e40" }}>
            <td style={{ textAlign: "left" }}>TOTAL</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default TourManager;
