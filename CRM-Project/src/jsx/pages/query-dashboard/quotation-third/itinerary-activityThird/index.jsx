import React, { useState } from "react";
import styles from "../quotationThird.module.css";
import ActivityIcon from "../../../../../images/itinerary/activity.svg";

const destinations = ["Dehradun", "Delhi", "Mumbai"];
const hotelNames = ["Four Points", "Taj", "Marriott"];
const roomCategories = ["Superior Room", "Deluxe Room"];
const suppliers = ["Goibibo", "MakeMyTrip"];

export default function HotelPricingTable() {
  const [showTable, setShowTable] = useState(true);
  const [noOfVic, setNoOfVic] = useState(false);
  const [miniAc, setMiniAc] = useState(true);
  const [rows2, setRows2] = useState([
    {
      upTo: "",
      rounds: "",
      class: "",
      duration: "",
      amount: "",
      remarks: "",
    },
  ]);

  const handleAddRow2 = () => {
    setRows2([
      ...rows2,
      {
        upTo: "",
        rounds: "",
        class: "",
        duration: "",
        amount: "",
        remarks: "",
      },
    ]);
  };

  const handleRemoveRow2 = (index) => {
    const updatedRows = rows2.filter((_, i) => i !== index);
    setRows2(updatedRows);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows2];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };


  // new Add

  const [rows, setRows] = useState([{}]);
// add row
const handleAddRow = () => {
  setRows([...rows, {}]);
};
// remove row 
const handleRemoveRow = (index) => {
  if (rows.length === 1) {
    return;
  }

  const updatedRows = [...rows];
  updatedRows.splice(index, 1);
  setRows(updatedRows);
};


// Pehle total columns calculate karlo
const totalColumns = 11

// Fir 3 section divide kar rahe ho to:
const eachColSpan = Math.floor(totalColumns);

  return (
    <div className={`${styles.wrapper}`}>
      <div
        className={`${styles.header}`}
        onClick={() => setShowTable(!showTable)}
      >
        <h2 className={`${styles.title}`}>
          <img src={ActivityIcon} alt="icon" />{" "}
          <span className="fs-5">Activity</span>
        </h2>
        <div className={`${styles.controls}`}>
          <label
            className={`${styles.hikeBtn}`}
            onClick={(e) => e.stopPropagation()}
          >
            Hike{" "}
            <input
              type="number"
              defaultValue={0}
              onClick={(e) => e.stopPropagation()}
              className={`${styles.inputSmall}`}
            />{" "}
            %
          </label>

          <div
            className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="form-check-input height-em-1 width-em-1"
              checked={noOfVic}
              onChange={() => setNoOfVic(!noOfVic)}
            />
            <label className="mt-1" style={{ fontSize: "0.8rem" }}>
              No Of Activity
            </label>
          </div>

          <span className={`${styles.arrow} ${showTable ? "rotate" : ""}`}>
            {showTable ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="text-primary"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm231-113.9L103.5 277.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L256 226.9l101.6 101.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L273 142.1c-9.4-9.4-24.6-9.4-34 0z"></path>
              </svg>
            ) : (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="text-primary"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM273 369.9l135.5-135.5c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L256 285.1 154.4 183.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L239 369.9c9.4 9.4 24.6 9.4 34 0z"></path>
              </svg>
            )}
          </span>
        </div>
      </div>

      {showTable && (
        <>
          <div className={`${styles.tableContainer} ${styles.twoTable}`}>
            <table className={`${styles.table}`}>
              <thead>
                <tr>
                  <th></th>
                  <th rowSpan="2">Destination</th>
                  <th rowSpan="2">Service Type</th>
                  <th rowSpan="2">Service</th>
                  <th rowSpan="2">Supplier</th>
                  <th rowSpan="2">Time</th>
                  <th rowSpan="2">Suplement</th>
                  <th rowSpan="2">Package</th>
                  <th rowSpan="2">Highlight</th>
                  <th rowSpan="2">Before SS</th>

                  <th rowSpan="2">Escort</th>
                  {/* {noOfVic && <th>No Of Activity</th>} */}
                </tr>
              </thead>
              <tbody>
              {rows.map((row, index) => (
                <tr className={`${styles.bgTable}`}>
                  <td>
                    <div className="d-flex gap-1">
                      <span>
                        <i
                          style={{ fontSize: "10px", padding: "2px" }}
                          className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"
                          onClick={handleAddRow}
                        ></i>
                      </span>
                      <span>
                        <i
                          style={{ fontSize: "10px", padding: "2px" }}
                          className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"
                          onClick={() => handleRemoveRow(index)}
                        ></i>
                      </span>
                    </div>
                  </td>
                  <td>
                    <select className={`${styles.select}`}>
                      {destinations.map((dest) => (
                        <option key={dest}>{dest}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select className={`${styles.select}`}>
                      {hotelNames.map((name) => (
                        <option key={name}>{name}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select className={`${styles.select}`}>
                      {roomCategories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select className={`${styles.select}`}>
                      <option>Select</option>
                      {suppliers.map((sup) => (
                        <option key={sup}>{sup}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select className={`${styles.select}`}>
                      {roomCategories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input height-em-1 width-em-1"
                      />
                      <label
                        className="mt-1"
                        style={{ fontSize: "0.8rem" }}
                      ></label>
                    </div>
                  </td>
                  <td>
                    <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input height-em-1 width-em-1"
                      />
                      <label
                        className="mt-1"
                        style={{ fontSize: "0.8rem" }}
                      ></label>
                    </div>
                  </td>
                  <td>
                    <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input height-em-1 width-em-1"
                      />
                      <label
                        className="mt-1"
                        style={{ fontSize: "0.8rem" }}
                      ></label>
                    </div>
                  </td>
                  <td>
                    <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input height-em-1 width-em-1"
                      />
                      <label
                        className="mt-1"
                        style={{ fontSize: "0.8rem" }}
                      ></label>
                    </div>
                  </td>
                  <td>
                    <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input height-em-1 width-em-1"
                      />
                      <label
                        className="mt-1"
                        style={{ fontSize: "0.8rem" }}
                      ></label>
                    </div>
                  </td>
                </tr>
                 ))}
                <tr>
                <td className={`${styles.editText}`} colSpan={eachColSpan}>
                  <span className="text-white fs-6 fw-bold">
                  Activity Cost :
                  </span>
                  Additional Cost : 8000, Markup(5%) : 800, Total : 8800
                </td>
                
              </tr>
              </tbody>
            </table>

            <table className={`${styles.table}`}>
              <thead>
                {/* <tr>
                  <th colSpan="7">Day 1 Service Cost</th>
                </tr> */}
                <tr>
                  <th>Up To</th>
                  <th>Rounds</th>
                  <th>Class</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className={`${styles.bgTable}`}>
                {rows2.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(row).map((field, i) => (
                      <td key={i}>
                        <input
                          className={`${styles.input}`}
                          type="text"
                          value={row[field]}
                          onChange={(e) =>
                            handleChange(index, field, e.target.value)
                          }
                        />
                      </td>
                    ))}
                    <td>
                      {rows2.length > 1 && (
                        <span
                          className="fs-4"
                          onClick={() => handleRemoveRow2(index)}
                        >
                          -
                        </span>
                      )}
                      <span
                        className="fs-4"
                        onClick={handleAddRow2}
                        style={{ marginLeft: "10px" }}
                      >
                        +
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-12 d-flex justify-content-end align-items-end mt-3">
            <button className="btn btn-primary py-1 px-2 radius-4">
              <i className="fa-solid fa-floppy-disk fs-4"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
