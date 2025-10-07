import React, { useState } from "react";
import styles from "../quotationThird.module.css";
import HotelIcon from "../../../../../images/itinerary/hotel.svg";

const destinations = ["Dehradun", "Delhi", "Mumbai"];
const hotelNames = ["Four Points", "Taj", "Marriott"];
const roomCategories = ["Superior Room", "Deluxe Room"];
const suppliers = ["Goibibo", "MakeMyTrip"];



export default function Index({ }) {
  const [showTable, setShowTable] = useState(true);
  const [extraBed, setExtraBed] = useState(true);
  const [extraMeal, setExtraMeal] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
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
  const totalColumns = 9 +
    (extraBed ? 1 : 0) +
    (extraMeal ? 1 : 0) +
    (breakfast ? 1 : 0) +
    (lunch ? 1 : 0) +
    (dinner ? 1 : 0);

  // Fir 3 section divide kar rahe ho to:
  const eachColSpan = Math.floor(totalColumns / 3);

  return (
    <div className={`${styles.wrapper}`}>
      <div
        className={`${styles.header}`}
        onClick={() => setShowTable(!showTable)}
      >
        <h2 className={`${styles.title} d-flex gap-3 align-items-center`}>
          <img src={HotelIcon} alt="icon" /> <span className="fs-5">Hotel</span>
          <div className={`${styles.showDestination} ${styles.controls}`}>
            <label
              className={`${styles.hikeBtn}`}
              onClick={(e) => e.stopPropagation()}
            >
              Destination : <span className={`${styles.nameDestination}`}>Diglipur</span>
            </label>
            <label
              className={`${styles.hikeBtn}`}
              onClick={(e) => e.stopPropagation()}
            >
              Hotel : <span className={`${styles.nameDestination}`}>Taj Hotel - (Delux)</span>
            </label>
          </div>
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

          <div
            className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="form-check-input height-em-1 width-em-1"
              checked={extraBed}
              onChange={() => setExtraBed(!extraBed)}
            />
            <label className="mt-1" style={{ fontSize: "0.8rem" }}>
              Extra Bed
            </label>
          </div>
          <div
            className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="form-check-input height-em-1 width-em-1"
              checked={extraMeal}
              onChange={() => setExtraMeal(!extraMeal)}
            />
            <label className="mt-1" style={{ fontSize: "0.8rem" }}>
              Meal Plan
            </label>
          </div>
          <div
            className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="form-check-input height-em-1 width-em-1"
              checked={breakfast}
              onChange={() => setBreakfast(!breakfast)}
            />
            <label className="mt-1" style={{ fontSize: "0.8rem" }}>
              Breakfast
            </label>
          </div>
          <div
            className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="form-check-input height-em-1 width-em-1"
              checked={lunch}
              onChange={() => setLunch(!lunch)}
            />
            <label className="mt-1" style={{ fontSize: "0.8rem" }}>
              Lunch
            </label>
          </div>
          <div
            className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="form-check-input height-em-1 width-em-1"
              checked={dinner}
              onChange={() => setDinner(!dinner)}
            />
            <label className="mt-1" style={{ fontSize: "0.8rem" }}>
              Dinner
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
        <div className={`${styles.tableContainer}`}>
          <table className={`${styles.table}`}>
            <thead>
              <tr>
                <th>

                </th>
                <th>Destination</th>
                <th>Hotel Name</th>
                <th>Overnight</th>
                <th>Room Category</th>
                <th>Supplier</th>
                <th>DBL Room (FIT)</th>
                <th>SGL Room (FIT)</th>
                <th>TWIN Room (FIT)</th>
                {extraBed && <th>ExtraBed(A)</th>}
                {extraMeal && <th>ExtraMeal</th>}
                {breakfast && <th>Breakfast</th>}
                {lunch && <th>Lunch</th>}
                {dinner && <th>Dinner</th>}
              </tr>

            </thead>
            <tbody>

              {rows.map((row, index) => (
                <tr key={index} className={`${styles.bgTable}`}>
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
                  {extraMeal && (
                    <td>
                      <input className={`${styles.input}`} />
                    </td>
                  )}
                  {breakfast && (
                    <td>
                      <input className={`${styles.input}`} />
                    </td>
                  )}
                  {lunch && (
                    <td>
                      <input className={`${styles.input}`} />
                    </td>
                  )}
                  {dinner && (
                    <td>
                      <input className={`${styles.input}`} />
                    </td>
                  )}
                </tr>
              ))}
              <tr>
                <td className={`${styles.editText}`} colSpan={eachColSpan}>
                  <span className="text-white fs-6 fw-bold">
                    DBL Room (FIT) :
                  </span>
                  Hotel Cost : 8000, Markup(5%) : 800, Total : 8800
                </td>
                <td className={`${styles.editText}`} colSpan={eachColSpan}>
                  <span className="text-white fs-6 fw-bold">
                    SGL Room (FIT) :
                  </span>
                  Hotel Cost : 8000, Markup(5%) : 800, Total : 8800
                </td>
                <td className={`${styles.editText}`} colSpan={totalColumns - (eachColSpan * 2)}>
                  <span className="text-white fs-6 fw-bold">
                    TWIN Room (FIT) :
                  </span>
                  Hotel Cost : 8000, Markup(5%) : 800, Total : 8800
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
