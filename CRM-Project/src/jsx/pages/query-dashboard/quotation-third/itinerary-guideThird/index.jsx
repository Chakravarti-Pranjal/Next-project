import React, { useState } from "react";
import styles from "../quotationThird.module.css";
import GuideIcon from "../../../../../images/itinerary/guide.svg";

const destinations = ["Dehradun", "Delhi", "Mumbai"];
const hotelNames = ["Four Points", "Taj", "Marriott"];
const roomCategories = ["Superior Room", "Deluxe Room"];
const suppliers = ["Goibibo", "MakeMyTrip"];

export default function Index() {
  const [showTable, setShowTable] = useState(true);
  const [extraBed, setExtraBed] = useState(true);


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
  const totalColumns = 10

  // Fir 3 section divide kar rahe ho to:
  const eachColSpan = Math.floor(totalColumns);

  return (
    <div className={`${styles.wrapper}`}>
      <div
        className={`${styles.header}`}
        onClick={() => setShowTable(!showTable)}
      >
        <h2 className={`${styles.title}`}>
          <img src={GuideIcon} alt="icon" /> <span className="fs-5">Guide</span>
          <select className={`${styles.select}`}>
            {destinations.map((dest) => (
              <option key={dest}>{dest}</option>
            ))}
          </select>
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
          <button
            onClick={(e) => e.stopPropagation()}
            className={`${styles.upgradeBtn}`}
          >
            + Alternate
          </button>

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
                <th rowSpan="2">City</th>
                <th rowSpan="2">Program</th>
                <th rowSpan="2">Data Type</th>
                <th rowSpan="2">Language</th>
                <th rowSpan="2">Supplier</th>
                <th rowSpan="2">Guide Fee</th>
                <th>Language Allowence</th>
                <th>Other Cost</th>
                <th>Total Cost</th>
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
                      <option>Hotel</option>
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
                    <input className={`${styles.input}`} defaultValue={8000} />
                  </td>
                  <td>
                    <input className={`${styles.input}`} defaultValue={800} />
                  </td>
                  <td>
                    <input className={`${styles.input}`} defaultValue={800} />
                  </td>
                  {extraBed && (
                    <td>
                      <input className={`${styles.input}`} />
                    </td>
                  )}
                </tr>
              ))}
              {/* <tr>
                <td rowSpan={3} colSpan={5} class="text-center fs-6">
                  Total
                </td>
                <td>Hotel Cost</td>
                <td>8000</td>
                <td>800</td>
                <td>800</td>
                {extraBed && <td>0</td>}
              </tr>
              <tr>
                <td>Markup(5%)</td>
                <td>400</td>
                <td>40</td>
                <td>40</td>
                {extraBed && <td>0</td>}
              </tr>
              <tr>
                <td>Total</td>
                <td>8400.00</td>
                <td>840.00</td>
                <td>840.00</td>
                {extraBed && <td>0.00</td>}
              </tr> */}

              <tr>
                <td className={`${styles.editText}`} colSpan={eachColSpan}>
                  <span className="text-white fs-6 fw-bold">
                  Guide Fee :
                  </span>
                  Guide Cost : 8000, Markup(5%) : 800, Total : 8800
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
