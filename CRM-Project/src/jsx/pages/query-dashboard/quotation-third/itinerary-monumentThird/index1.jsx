import React, { useState } from "react";
import styles from "../quotationThird.module.css";
import monumentIcon from "../../../../../images/itinerary/monument.svg";

const destinations = ["Dehradun", "Delhi", "Mumbai"];
const hotelNames = ["Four Points", "Taj", "Marriott"];
const roomCategories = ["Superior Room", "Deluxe Room"];




export default function Index() {
  const [showTable, setShowTable] = useState(true);
  const [visitorType, setVisitorType] = useState("both");


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
const totalColumns = 12

// Fir 3 section divide kar rahe ho to:
const eachColSpan = Math.floor(totalColumns / 2);

  return (
    <div className={`${styles.wrapper}`}>
      <div
        className={`${styles.header}`}
        onClick={() => setShowTable(!showTable)}
      >
        <h2 className={`${styles.title} d-flex align-items-center`}>
          <img src={monumentIcon} alt="icon" />
          <span className="fs-5 ms-2">Monument</span>

          {/* Checkbox */}
          <div
            className="form-check check-sm d-flex align-items-center justify-content-center gap-2 ms-4"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              style={{ borderRadius: "2px !important" }}
              className="form-check-input height-em-1 width-em-1"
              type="checkbox"
            />
            <label className="mt-1" style={{ fontSize: "0.8rem" }}>
              Auto Guide
            </label>
          </div>
        </h2>

        {/* Radio Buttons */}
        <div className={`${styles.controls} d-flex align-items-center gap-3`}>
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
          <label
            className="form-check check-sm d-flex align-items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              className="form-check-input height-em-1 width-em-1 mt-0"
              type="radio"
              name="visitor"
              value="foreigner"
              checked={visitorType === "foreigner"}
              onChange={() => setVisitorType("foreigner")}
            />
            Foreigner
          </label>
          <label
            className="form-check check-sm d-flex align-items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              className="form-check-input height-em-1 width-em-1 mt-0"
              type="radio"
              name="visitor"
              value="indian"
              checked={visitorType === "indian"}
              onChange={() => setVisitorType("indian")}
            />
            Indian
          </label>
          <label
            className="form-check check-sm d-flex align-items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              className="form-check-input height-em-1 width-em-1 mt-0"
              type="radio"
              name="visitor"
              value="both"
              checked={visitorType === "both"}
              onChange={() => setVisitorType("both")}
            />
            Both
          </label>

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
        <div className={`${styles.tableContainer}`}>
          <table className={`${styles.table}`}>
            <thead>
              <tr>
                <th></th>
                <th>Destination</th>
                <th>Program</th>
                <th>Data Type</th>
                <th>Time</th>
                <th>Leasure</th>
                <th>Monuments Name</th>
                <th>Supplier</th>

                {visitorType === "indian" || visitorType === "both" ? (
                  <>
                    <th>
                      <div
                        className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input height-em-1 width-em-1"
                        />
                        <label
                          className=" d-flex align-items-center justify-content-center gap-2"
                          style={{ fontSize: "0.8rem" }}
                        >
                          Adult (Indian Cost)
                        </label>
                      </div>
                    </th>
                    <th><div
                      className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input height-em-1 width-em-1"
                      />
                      <label
                        className=" d-flex align-items-center justify-content-center gap-2"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Child (Indian Cost)
                      </label>
                    </div></th>
                  </>
                ) : null}
                {visitorType === "foreigner" || visitorType === "both" ? (
                  <>
                    <th><div
                      className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input height-em-1 width-em-1"
                      />
                      <label
                        className=" d-flex align-items-center justify-content-center gap-2"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Adult (Foreigner Cost)
                      </label>
                    </div></th>
                    <th><div
                      className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input height-em-1 width-em-1"
                      />
                      <label
                        className=" d-flex align-items-center justify-content-center gap-2"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Child (Foreigner Cost)
                      </label>
                    </div></th>
                  </>
                ) : null}
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
                  <td>Full Day</td>
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
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <select className={`${styles.select}`}>
                      {roomCategories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>

                  {/* Indian Inputs */}
                  {visitorType === "indian" || visitorType === "both" ? (
                    <>
                      <td>
                        <input type="number" className="form-control1" />
                      </td>
                      <td>
                        <input type="number" className="form-control1" />
                      </td>
                    </>
                  ) : null}

                  {/* Foreigner Inputs */}
                  {visitorType === "foreigner" || visitorType === "both" ? (
                    <>
                      <td>
                        <input type="number" className="form-control1" />
                      </td>
                      <td>
                        <input type="number" className="form-control1" />
                      </td>
                    </>
                  ) : null}
                </tr>
              ))}


              <tr>
                <td className={`${styles.editText}`} colSpan={eachColSpan}>
                  <span className="text-white fs-6 fw-bold">
                  Foreigner :
                  </span>
                  Monument Cost : 8000, Markup(5%) : 800, Total : 8800
                </td>
                <td className={`${styles.editText}`} colSpan={eachColSpan}>
                  <span className="text-white fs-6 fw-bold">
                  Indian
                  :
                  </span>
                  Monument Cost : 8000, Markup(5%) : 800, Total : 8800
                </td>
              </tr>
            </tbody>
          </table>

          <div className="col-12 d-flex justify-content-end align-items-end mt-3">
            <button className="btn btn-primary py-1 px-2 radius-4">
              <i className="fa-solid fa-floppy-disk fs-4"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
