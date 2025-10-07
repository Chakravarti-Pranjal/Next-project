import React, { useState } from "react";
import styles from "../quotationThird.module.css";
import TransportIcon from "../../../../../images/itinerary/transport.svg";

const destinations = ["Dehradun", "Delhi", "Mumbai"];
const hotelNames = ["Four Points", "Taj", "Marriott"];
const roomCategories = ["Superior Room", "Deluxe Room"];
const suppliers = ["Goibibo", "MakeMyTrip"];

const vehicleOptions = [
  "AC Innova",
  "AC Large Coach",
  "AC Mini Coach",
  "AC Sedan Car (Indigo/ Dzire)",
  "AC Tempo Traveler",
  "AC Volvo",
  "AC Volvo Washroom",
];

export default function HotelPricingTable() {
  const [showTable, setShowTable] = useState(true);
  const [noOfVic, setNoOfVic] = useState(false);
  const [miniAc, setMiniAc] = useState(true);

  const [vehicleType, setVehicleType] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (vehicle) => {
    setSelectedVehicles((prevSelected) =>
      prevSelected.includes(vehicle)
        ? prevSelected.filter((item) => item !== vehicle)
        : [...prevSelected, vehicle]
    );
  };

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
const eachColSpan = Math.floor(totalColumns);

  return (
    <div className={`${styles.wrapper}`}>
      <div
        className={`${styles.header}`}
        onClick={() => setShowTable(!showTable)}
      >
        <h2 className={`${styles.title}`}>
          <img src={TransportIcon} alt="icon" />{" "}
          <span className="fs-5">Transport</span>
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
              No Of Vehicle
            </label>
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className={`${styles.upgradeBtn}`}
          >
            + Alternate
          </button>

          <div className={`${styles.dropdownButtonWrap}`}>
            <button
              onClick={(e) => {
                toggleDropdown();
                e.stopPropagation();
              }}
              className={styles.dropdownButton}
            >
              Vehicle Type{" "}
              <span className={styles.dropdownButtonArrow}>
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            {isOpen && (
              <div className={styles.dropdownMenu}>
                {vehicleOptions.map((vehicle, index) => (
                  <label
                    key={index}
                    className={`${styles.option} ${"form-check"} ${"check-sm"}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle)}
                      onChange={() => handleCheckboxChange(vehicle)}
                      className="ms-2 form-check-input height-em-1 width-em-1"
                    />
                    {vehicle}
                  </label>
                ))}
              </div>
            )}
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
        <div className={`${styles.tableContainer}`}>
          <table className={`${styles.table}`}>
            <thead>
              <tr>
                <th></th>
                <th rowSpan="2">From</th>
                <th rowSpan="2">To</th>
                <th rowSpan="2">Sector</th>
                <th rowSpan="2">Program Type</th>
                <th rowSpan="2">Program</th>
                <th rowSpan="2">Program Details</th>
                <th rowSpan="2">Mode</th>
                <th rowSpan="2">Supplier</th>
                <th rowSpan="2">Vehicle Types</th>

                <th rowSpan="2">Cost Type</th>
                <th>
                  <div
                    className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      checked={miniAc}
                      onChange={() => setMiniAc(!miniAc)}
                    />
                    <label className="mt-1" style={{ fontSize: "0.8rem" }}>
                      AC MINI Coach
                    </label>
                  </div>
                </th>
                {noOfVic && <th>No of Vehicle</th>}
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
                  <select className={`${styles.select}`}>
                    {roomCategories.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </td>
                <td>
                  {" "}
                  <input className={`${styles.input}`} />
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
                  <input className={`${styles.input}`} defaultValue={800} />
                </td>
                <td>
                  <input className={`${styles.input}`} defaultValue={800} />
                </td>
                {noOfVic && (
                  <td>
                    <input className={`${styles.input}`} />
                  </td>
                )}
                <td>
                  <input className={`${styles.input}`} defaultValue={800} />
                </td>
              </tr>
               ))}
              <tr>
                <td className={`${styles.editText}`} colSpan={eachColSpan}>
                  <span className="text-white fs-6 fw-bold">
                  Transport Cost : 
                  </span>
                  Vehicle Cost : 8000, Markup(5%) : 800, Total : 8800
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
