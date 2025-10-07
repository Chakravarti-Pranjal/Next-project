import React, { useState } from "react";
import styles from "../quotationThird.module.css";
import RestauarantIcon from "../../../../../images/itinerary/restaurant.svg";

const defaultDay = {
  destination: "",
  meals: {
    breakfast: {
      enabled: true,
      restaurant: "",
      price: 0,
      self: false,
      hotel: false,
    },
    lunch: {
      enabled: true,
      restaurant: "",
      price: 0,
      self: false,
      hotel: false,
    },
    dinner: {
      enabled: true,
      restaurant: "",
      price: 0,
      self: false,
      hotel: false,
    },
  },
  commonRestaurant: "",
  supplier: "",
  startTime: "",
  endTime: "",
};

export default function Index() {
  const [showTable, setShowTable] = useState(true);
  const [extraBed, setExtraBed] = useState(true);

  const [days, setDays] = useState([{ ...defaultDay }]);

  const handleAddDay = () => {
    setDays([...days, { ...defaultDay }]);
  };

  const handleRemoveDay = (index) => {
    const updated = [...days];
    updated.splice(index, 1);
    setDays(updated);
  };

  const updateField = (index, field, value) => {
    const updated = [...days];
    updated[index][field] = value;
    setDays(updated);
  };

  const updateMeal = (index, mealType, field, value) => {
    const updated = [...days];
    updated[index].meals[mealType][field] = value;
    setDays(updated);
  };

  const calculateTotal = (day) => {
    const mealTotal =
      (day.meals.breakfast.enabled ? +day.meals.breakfast.price : 0) +
      (day.meals.lunch.enabled ? +day.meals.lunch.price : 0) +
      (day.meals.dinner.enabled ? +day.meals.dinner.price : 0);

    const markup = mealTotal * 0.05;
    return {
      restaurantCost: mealTotal,
      markup: markup.toFixed(2),
      total: (mealTotal + markup).toFixed(2),
    };
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
  const totalColumns = 18

  // Fir 3 section divide kar rahe ho to:
  const eachColSpan = Math.floor(totalColumns);

  return (
    <div className={`${styles.wrapper}`}>
      <div
        className={`${styles.header}`}
        onClick={() => setShowTable(!showTable)}
      >
        <h2 className={`${styles.title}`}>
          <img src={RestauarantIcon} alt="icon" />{" "}
          <span className="fs-5">Restauarant</span>
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
                <th>Destination</th>
                <th>H</th>
                <th>Hotel/Restaurant (B)</th>
                <th>Price</th>
                <th>S</th>
                <th>H</th>
                <th>Hotel/Restaurant (L)</th>
                <th>Price</th>
                <th>S</th>
                <th>H</th>
                <th>Hotel/Restaurant (D)</th>
                <th>Price</th>
                <th>S</th>
                <th>Restaurant</th>
                <th>Supplier</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>

            </thead>
            <tbody>
              {days.map((day, index) => {
                const totals = calculateTotal(day);
                return (
                  <React.Fragment key={index}>
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
                          <select
                            value={day.destination}
                            onChange={(e) =>
                              updateField(index, "destination", e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Mumbai">Mumbai</option>
                          </select>
                        </td>

                        {/* Breakfast */}
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
                          <select
                            value={day.meals.breakfast.restaurant}
                            onChange={(e) =>
                              updateMeal(
                                index,
                                "breakfast",
                                "restaurant",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="Taj">Taj</option>
                            <option value="Oberoi">Oberoi</option>
                          </select>
                        </td>
                        <td>
                          <input className={`${styles.input}`} value={""} />
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

                        {/* Lunch */}
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
                          <select
                            value={day.meals.lunch.restaurant}
                            onChange={(e) =>
                              updateMeal(
                                index,
                                "lunch",
                                "restaurant",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="Dominos">Dominos</option>
                            <option value="KFC">KFC</option>
                          </select>
                        </td>
                        <td>
                          <input className={`${styles.input}`} value={""} />
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

                        {/* Dinner */}
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
                          <select
                            value={day.meals.dinner.restaurant}
                            onChange={(e) =>
                              updateMeal(
                                index,
                                "dinner",
                                "restaurant",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="Pizza Hut">Pizza Hut</option>
                            <option value="Barbeque Nation">
                              Barbeque Nation
                            </option>
                          </select>
                        </td>
                        <td>
                          <input className={`${styles.input}`} value={""} />
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

                        {/* Common Section */}
                        <td>
                          <select
                            value={day.commonRestaurant}
                            onChange={(e) =>
                              updateField(
                                index,
                                "commonRestaurant",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="WOW">WOW</option>
                            <option value="BlueCity">BlueCity</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={day.supplier}
                            onChange={(e) =>
                              updateField(index, "supplier", e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            <option value="ALKDJK">ALKDJK</option>
                            <option value="SUPX">SUPX</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="time"
                            value={day.startTime}
                            onChange={(e) =>
                              updateField(index, "startTime", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            value={day.endTime}
                            onChange={(e) =>
                              updateField(index, "endTime", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}


                    <tr>
                      <td className={`${styles.editText}`} colSpan={eachColSpan}>
                        <span className="text-white fs-6 fw-bold">
                          Total :
                        </span>
                        Restaurant : 8000, Markup(5%) : 800, Total : 8800
                      </td>

                    </tr>
                  </React.Fragment>
                );
              })}
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
