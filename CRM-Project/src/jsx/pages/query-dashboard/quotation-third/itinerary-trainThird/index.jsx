import React, { useState } from "react";
import styles from "../quotationThird.module.css";
import trainIcon from "../../../../../images/itinerary/train.svg";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const destinations = ["Dehradun", "Delhi", "Mumbai"];
const hotelNames = ["Four Points", "Taj", "Marriott"];
const roomCategories = ["Superior Room", "Deluxe Room"];
const suppliers = ["Goibibo", "MakeMyTrip"];

export default function Index() {
  const [showTable, setShowTable] = useState(true);
  const [noOfVic, setNoOfVic] = useState(false);
  const [miniAc, setMiniAc] = useState(true);

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
  const totalColumns = 18

  // Fir 3 section divide kar rahe ho to:
  const eachColSpan = Math.floor(totalColumns);

  return (

    
    <PerfectScrollbar options={{ suppressScrollY: true }}>
    <div className={`${styles.wrapper}`}>
      <div
        className={`${styles.header}`}
        onClick={() => setShowTable(!showTable)}
      >
        <h2 className={`${styles.title}`}>
          <img src={trainIcon} alt="icon" /> <span className="fs-5">Train</span>
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
                <th rowSpan="2">From</th>
                <th rowSpan="2">To</th>
                <th rowSpan="2">Sector</th>
                <th rowSpan="2">Train Name</th>
                <th rowSpan="2">Train Number</th>
                <th rowSpan="2">Type</th>
                <th rowSpan="2">Class</th>
                <th rowSpan="2">Supplier</th>
                <th rowSpan="2">Departure Time</th>
                <th rowSpan="2">Arrival Time</th>
                <th rowSpan="2">Adult</th>
                <th rowSpan="2">Child</th>
                <th rowSpan="2">Guide</th>
                <th rowSpan="2">Service Charge</th>
                <th rowSpan="2">Handling Charge</th>
                <th rowSpan="2">Remarks</th>
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
                  <td>Arrival at Delhi</td>
                  <td>
                    <select className={`${styles.select}`}>
                      <option>Hotel</option>
                    </select>
                  </td>
                  <td>
                    {" "}
                    <input className={`${styles.input}`} />
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
                    <input
                      type="time"
                      id=""
                      name="DepartureTime"
                      className="formControl1"
                      value=""
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      id=""
                      name="DepartureTime"
                      className="formControl1"
                      value=""
                    />
                  </td>
                  <td>
                    <input className={`${styles.input}`} value={""} />
                  </td>
                  <td>
                    <input className={`${styles.input}`} value={""} />
                  </td>{" "}
                  <td>
                    <input className={`${styles.input}`} value={""} />
                  </td>{" "}
                  <td>
                    <input className={`${styles.input}`} value={""} />
                  </td>{" "}
                  <td>
                    <input className={`${styles.input}`} value={""} />
                  </td>{" "}
                  <td>
                    <input className={`${styles.input}`} value={""} />
                  </td>
                </tr>
              ))}
              <tr>
                <td className={`${styles.editText}`} colSpan={eachColSpan}>
                  <span className="text-white fs-6 fw-bold">
                    Total :
                  </span>
                  Train Cost : 8000, Markup(5%) : 800, Total : 8800
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
    </PerfectScrollbar>
  );
}
