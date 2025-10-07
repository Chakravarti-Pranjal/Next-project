import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { paxSlabInitialValue } from "../qoutation_initial_value";
import { notifyError, notifySuccess } from "../../../../../helper/notify";

const PaxSlab = ({ Type }) => {
  const { qoutationData, queryData } = useSelector(
    (data) => data?.queryReducer
  );

  const priceAmount = useSelector((state) => state?.itineraryReducer);

  const totalCost = useMemo(() => {
    return priceAmount?.localMonumentFormData.reduce((acc, item) => {
      const adultCost = item.ItemUnitCost?.Adult
        ? parseFloat(item.ItemUnitCost.Adult)
        : 0;
      const childCost = item.ItemUnitCost?.Child
        ? parseFloat(item.ItemUnitCost.Child)
        : 0;

      return acc + adultCost + childCost;
    }, 0);
  }, [priceAmount?.localMonumentFormData]);

  const totalActivityCost = useMemo(() => {
    return (
      priceAmount?.localActivityFormData?.reduce(
        (acc, item) => acc + (parseFloat(item.Cost) || 0),
        0
      ) || 0
    );
  }, [priceAmount?.localActivityFormData]);

  const totalAdditionalCost = useMemo(() => {
    return priceAmount?.localAdditionalFormData?.reduce(
      (acc, item) =>
        acc +
        (parseFloat(item.AdultCost) || 0) +
        (parseFloat(item.ChildCost) || 0),
      0
    );
  }, [priceAmount?.localAdditionalFormData]);
  const totalTrainCost = useMemo(() => {
    return priceAmount?.localTrainFormData.reduce((total, item) => {
      const adultCost = item.AdultCost ? parseInt(item.AdultCost) : 0;
      const childCost = item.ChildCost ? parseInt(item.ChildCost) : 0;
      return total + adultCost + childCost;
    }, 0);
  }, [priceAmount?.localTrainFormData]);
  const totalAirAmount = useMemo(() => {
    return priceAmount?.localAirFormData.reduce((total, item) => {
      const adultTotal = item.AdultCost ? parseInt(item.AdultCost) : 0;
      const childTotal = item.ChildCost ? parseInt(item.ChildCost) : 0;
      return total + adultTotal + childTotal;
    }, 0);
  }, [priceAmount?.localAirFormData]);
  // const totalHotelAmount = useMemo(() => {
  //   const amounts = {
  //     SGL: 0,
  //     TPL: 0,
  //     ExtraBed: 0,
  //   };

  //   priceAmount?.localHotelFormData.forEach(dayData => {
  //     dayData.forEach(room => {
  //       if (room.RoomType == 'SGL Room' && room.RoomCost) {
  //         amounts.SGL += parseFloat(room.RoomCost);
  //       } else if (room.RoomType == 'TPL Room' && room.RoomCost) {
  //         amounts.TPL += parseFloat(room.RoomCost);
  //       } else if (room.RoomType == 'ExtraBed(A)' && room.RoomCost) {
  //         amounts.ExtraBed += parseFloat(room.RoomCost);
  //       }
  //     });
  //   });

  //   return amounts;
  // }, [priceAmount?.localHotelFormData]);

  const totalHotelAmount = useMemo(() => {
    const flatData = priceAmount?.localHotelFormData.flat();

    return flatData.reduce((total, room) => {
      if (room.RoomCost) {
        total += parseFloat(room.RoomCost);
      }
      return total;
    }, 0);
  }, [priceAmount?.localHotelFormData]);

  const totalMealAmount = useMemo(() => {
    const flatData = priceAmount?.localMealFormData.flat();

    return flatData.reduce((total, room) => {
      if (room.MealCost) {
        total += parseFloat(room.MealCost);
      }
      return total;
    }, 0);
  }, [priceAmount?.localMealFormData]);

  const totalResturantAmount = useMemo(() => {
    return priceAmount?.localResturantFormData.reduce((total, item) => {
      const adultTotal = item.AdultCost ? parseInt(item.AdultCost) : 0;
      const childTotal = item.ChildCost ? parseInt(item.ChildCost) : 0;
      return total + adultTotal + childTotal;
    }, 0);
  }, [priceAmount?.localResturantFormData]);

  const [slabFormValue, setSlabFormValue] = useState([
    {
      ...paxSlabInitialValue,
      QuotationNumber: qoutationData?.QuotationNumber,
      QueryId: queryData?.QueryAlphaNumId,
    },
  ]);

  useEffect(() => {
    if (slabFormValue) {
      const updatedSlabFormValue = slabFormValue.map((data) => ({
        ...data,
        Fee: totalCost,
        Activity: totalActivityCost,
        Additional: totalAdditionalCost,
        Train: totalTrainCost,
        Air: totalAirAmount,
        Hotel: totalHotelAmount,
        Meal: totalMealAmount + totalHotelAmount + totalResturantAmount,
        Double: 0,
      }));

      setSlabFormValue(updatedSlabFormValue);
    }
    // console.log(totalMealAmount , totalHotelAmount , totalResturantAmount,priceAmount?.localResturantFormData,"meal-143")
  }, [priceAmount]);

  const handleEscortIncrement = () => {
    setSlabFormValue([
      ...slabFormValue,
      {
        ...paxSlabInitialValue,
        QuotationNumber: qoutationData?.QuotationNumber,
        QueryId: queryData?.QueryAlphaNumId,
      },
    ]);
  };

  const handleEscortDecrement = (ind) => {
    const filteredScort = slabFormValue?.filter((item, index) => index != ind);
    setSlabFormValue(filteredScort);
  };

  const handlePaxSlabChange = (index, e) => {
    const { name, value } = e.target;

    setSlabFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  const handleFinalSave = async () => {
    try {
      const { data } = await axiosOther.post(
        "add-slabcost-excort-days",
        slabFormValue
      );

      if (data?.status == 1) {
        notifySuccess("Services Added !");
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0][1]);
      }
    }
  };

  useEffect(() => {
    const updatedSlabFormValue = slabFormValue?.map((data) => ({
      ...data,
      TotalPerPerson:
        (parseInt(data?.Fee) || 0) +
        (parseInt(data?.Activity) || 0) +
        (parseInt(data?.Additional) || 0) +
        (parseInt(data?.Train) || 0) +
        (parseInt(data?.Air) || 0) +
        (parseInt(data?.Hotel) || 0) +
        (parseInt(data?.Meal) || 0),
    }));

    setSlabFormValue(updatedSlabFormValue);
  }, []); // here was passed 'slabFormValue' as dependency that causeing re-rendering that i removed - ansar

  return (
    <div className="row mt-3 m-0">
      <div className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg">
        <div className="d-flex gap-2 align-items-center">
          <div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <path d="M0 0H24V24H0V0Z" fill="url(#pattern0_242_1461)" />
              <defs>
                <pattern
                  id="pattern0_242_1461"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlink:href="#image0_242_1461"
                    transform="scale(0.0166667)"
                  />
                </pattern>
                <image
                  id="image0_242_1461"
                  width="60"
                  height="60"
                  xlink:href="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </div>
          <p className="m-0 text-dark">
            {Type == "Local" ? "Local" : "Foreign"} Escort Slabwise Cost
          </p>
        </div>
      </div>
      <div className="col-12 px-0 mt-2">
        <PerfectScrollbar>
          <table class="table table-bordered itinerary-table">
            <thead>
              <tr>
                <th></th>
                <th>Min</th>
                <th>Max</th>
                <th>Escort</th>
                <th>Div.Factor</th>
                <th>DBL</th>
                <th>SGL</th>
                <th>Hotel</th>
                <th>Fee</th>
                <th>Meal</th>
                <th>Activity</th>
                <th>Additional</th>
                <th>Train</th>
                <th>Air</th>
                <th>Total Per Person</th>
              </tr>
            </thead>
            <tbody>
              {slabFormValue?.length > 0 &&
                slabFormValue.map((item, index) => {
                  return (
                    <tr key={index + 1}>
                      <td>
                        <div className="d-flex gap-2 justify-content-center align-items-center">
                          <div>
                            {index > 0 ? (
                              <span
                                onClick={() => handleEscortDecrement(index)}
                              >
                                <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                              </span>
                            ) : (
                              <span onClick={handleEscortIncrement}>
                                <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                              </span>
                            )}
                          </div>
                          <div>
                            {/* <div>
                            <select
                              name="Pax"
                              id=""
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Pax}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            >
                              <option value="">Select</option>
                            </select>
                          </div> */}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Min"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Min}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Max"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Max}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Escort"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Escort}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Factor"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Factor}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Double"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Double}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Single"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Single}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="number"
                              id=""
                              name="Hotel"
                              className="formControl1 width50px"
                              value={
                                slabFormValue[index]?.Double === 0
                                  ? slabFormValue[index]?.Hotel
                                  : Number(slabFormValue[index]?.Double) ===
                                    parseFloat(slabFormValue[index]?.Double)
                                  ? slabFormValue[index]?.Hotel *
                                    parseFloat(slabFormValue[index]?.Double)
                                  : slabFormValue[index]?.Hotel /
                                    parseInt(slabFormValue[index]?.Double)
                              }
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Fee"
                              className="formControl1 width50px"
                              // value={slabFormValue[index]?.Fee}
                              value={
                                slabFormValue[index]?.Double === 0
                                  ? slabFormValue[index]?.Fee
                                  : Number(slabFormValue[index]?.Double) ===
                                    parseFloat(slabFormValue[index]?.Double)
                                  ? slabFormValue[index]?.Fee *
                                    parseFloat(slabFormValue[index]?.Double)
                                  : slabFormValue[index]?.Fee /
                                    parseInt(slabFormValue[index]?.Double)
                              }
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Meal"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Meal}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Activity"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Activity}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Additional"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Additional}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="text"
                              id=""
                              name="Train"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Train}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="number"
                              id=""
                              name="Air"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Air}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <input
                              type="number"
                              id=""
                              name="TotalPerPerson"
                              className="formControl1 width50px"
                              value={
                                slabFormValue[index]?.Factor > 0
                                  ? slabFormValue[index]?.TotalPerPerson /
                                    slabFormValue[index]?.Factor
                                  : slabFormValue[index]?.TotalPerPerson
                              }
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </PerfectScrollbar>
      </div>
      <div className="col-12 d-flex justify-content-end align-items-end">
        <button
          className="btn btn-primary py-1 px-2 radius-4"
          onClick={handleFinalSave}
        >
          <i className="fa-solid fa-floppy-disk fs-4"></i>
        </button>
      </div>
    </div>
  );
};

export default PaxSlab;
