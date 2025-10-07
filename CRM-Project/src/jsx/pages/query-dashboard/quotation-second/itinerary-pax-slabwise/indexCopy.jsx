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

  const [slabFormValue, setSlabFormValue] = useState([]);
  const [QoutationData, setQoutationData] = useState({});
  const [hotelData, setHotelData] = useState({
    dblRoom: "",
    sglRoom: "",
  });
  const [serviceCosts, setServiceCosts] = useState({
    activityCost: null,
    hotelCost: null,
    SglHotelCost: null,
    TrainCost: null,
    flightAdultCost: null,
    breakfastCost: null,
    MonumentCost: null,
    AdditionalCost: null,
  });

  // =============================================================
  const { UpdateForeignEscortCharges } = useSelector(
    (data) => data?.activeTabOperationReducer
  );

  console.log(UpdateForeignEscortCharges, "UpdateForeignEscortCharges");

  const queryAndQuotationNo = JSON.parse(
    localStorage.getItem("Query_Qoutation")
  );

  // ===============================================================
  async function fetchQueryQuotation() {
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: queryAndQuotationNo?.QueryID,
        QuotationNo: queryAndQuotationNo?.QoutationNum,
      });

      setQoutationData(data?.data[0]);
    } catch (error) {
      console.log(error, "error occurred");
    }
  }

  useEffect(() => {
    fetchQueryQuotation();
  }, [UpdateForeignEscortCharges]);

  // =============================================================

  const getServiceCosts = (data) => {
    let activityCost = null;
    let hotelCost = null;
    let SglHotelCost = null;
    let flightAdultCost = null;
    let breakfastCost = null;
    let AdditionalCost = null;
    let MonumentCost = null;
    let TrainCost = null;

    // Navigate to ExcortDays where Type is "Local"
    const LocalDays = data.ExcortDays?.find(
      (escort) => escort.Type === "Foreigner"
    );

    if (LocalDays && LocalDays.Days) {
      // Iterate through each day
      for (const day of LocalDays.Days) {
        // Check DayServices for Activity, Hotel, and Flight services
        for (const service of day.DayServices) {
          if (service.ServiceType === "Activity" && activityCost === null) {
            activityCost = Number(service.TotalCosting?.ActivityCost) ?? 0;
            console.log(service, "serviceCost22");
          } else if (
            service.ServiceType === "Hotel" &&
            hotelCost === null &&
            SglHotelCost === null
          ) {
            if (service.TotalCosting) {
              for (const costing of service.TotalCosting) {
                const dblRoom = costing.HotelRoomBedType.find(
                  (room) => room.RoomBedTypeName === "DBL Room"
                );

                const sglRoom = costing.HotelRoomBedType.find(
                  (room) => room.RoomBedTypeName == "SGL Room"
                );
                if (dblRoom && hotelCost === null) {
                  hotelCost = Number(dblRoom.ServiceCost) ?? 0;
                }
                //    setHotelData((prev) => ({
                //   ...prev,
                //   dblRoom: hotelCost,
                // }));

                console.log(dblRoom, "hotelCost");

                if (sglRoom && SglHotelCost === null) {
                  SglHotelCost = Number(sglRoom.ServiceCost) ?? 0;
                  // setHotelData((prev) => ({
                  //   ...prev,
                  //   sglRoom: SglHotelCost,
                  // }));
                }
              }
            }
            console.log(service.TotalCosting, "service.TotalCosting");
          } else if (
            service.ServiceType === "Flight" &&
            flightAdultCost === null
          ) {
            flightAdultCost =
              Number(service.TotalCosting?.ServiceAdultCost) ?? 0;
            console.log(service, "flightAdultCost");
          } else if (service.ServiceType === "Train" && TrainCost === null) {
            TrainCost =
              Number(service.TotalCosting?.TotalAdultServiceCost) ?? 0;
          } else if (
            service.ServiceType === "Monument" &&
            MonumentCost === null
          ) {
            MonumentCost = Number(service.TotalCosting?.ServiceAdultCost) ?? 0;
            console.log(service, "MonumentCosting");
          } else if (
            service.ServiceType === "Restaurant" &&
            breakfastCost === null
          ) {
            if (service.TotalCosting) {
              const breakfastCosting = service.TotalCosting.find(
                (costing) => costing.MealType === "Breakfast"
              );
              if (breakfastCosting) {
                breakfastCost = Number(breakfastCosting.TotalServiceCost) ?? 0;
              }
            }
          } else if (
            service.ServiceType === "Additional" &&
            AdditionalCost === null
          ) {
            AdditionalCost = Number(service.TotalCosting?.AdditionalCost) ?? 0;
            console.log(service, "service.AdditionalCost");
          }

          // Break if all costs are found
          if (
            activityCost !== null &&
            hotelCost !== null &&
            SglHotelCost !== null &&
            TrainCost !== null &&
            flightAdultCost !== null &&
            AdditionalCost !== null &&
            MonumentCost !== null &&
            breakfastCost !== null
          ) {
            break;
          }
        }
        if (
          activityCost !== null &&
          hotelCost !== null &&
          SglHotelCost !== null &&
          TrainCost !== null &&
          flightAdultCost !== null &&
          AdditionalCost !== null &&
          MonumentCost !== null &&
          breakfastCost !== null
        ) {
          break;
        }
      }
    }

    return {
      activityCost,
      hotelCost,
      SglHotelCost,
      TrainCost,
      flightAdultCost,
      breakfastCost,
      MonumentCost,
      AdditionalCost,
    };
  };

  // Get the costs

  const {
    activityCost,
    hotelCost,
    SglHotelCost,
    TrainCost,
    flightAdultCost,
    MonumentCost,
    breakfastCost,
    AdditionalCost,
  } = getServiceCosts(QoutationData);
  useEffect(() => {
    if (QoutationData?.ExcortDays) {
      const costs = getServiceCosts(QoutationData);
      setServiceCosts(costs);
      setHotelData({
        dblRoom: costs.hotelCost ?? "",
        sglRoom: costs.SglHotelCost ?? "",
      });
    }
  }, [QoutationData]);
  console.log(hotelData, "hotelData");

  // =============================================================

  // Get Discount Amount Of DBL AND SGL
  // const getDiscountAmount = (cost) => {
  //   const discountAmount = cost ;
  //   return cost ;
  // };

  // =====================================================

  const getDataToServer = async () => {
    try {
      let Verify = qoutationData?.ExcortDays?.find(
        (escort) => escort.Type === "Foreigner"
      );

      if (Verify?.ExcortSlabCost && Verify.ExcortSlabCost.length > 0) {
        const updatedData = Verify.ExcortSlabCost.map((item) => ({
          ...item,
          QueryId: queryData?.QueryAlphaNumId,
          QuotationNumber: QoutationData?.QuotationNumber,
          ExcortType: "Foreigner",
        }));

        setSlabFormValue(updatedData);
      } else {
        const { data } = await axiosOther.post("paxslablist", {
          Type: QoutationData?.TourSummary?.PaxTypeName,
          Default: "Yes",
        });
        const list = data?.DataList || [];
        const DblfinalPrice = hotelCost;
        const SglfinalPrice = SglHotelCost;
        const initialList =
          list.length > 0
            ? list.map((item) => ({
                Min: item.Min,
                Max: item.Max,
                Escort: 0,
                SingleSelectType: "SPercent",
                DoubleSelectType: "DPercent",
                // Double: item.Min + item.Max > 10 ? 0.5 : 0,
                Double: 0,
                Foc: item.Min + item.Max > 10 ? 1 : 0,
                // Single: item.Min + item.Max > 10 ? 0.5 : 0,
                Single: 0,
                Activity: activityCost || 0,
                SglHotel:
                  item.Min + item.Max > 10 ? SglfinalPrice : SglHotelCost,
                // Hotel:
                //   item.Min + item.Max > 10
                //     ? DblfinalPrice + SglfinalPrice
                //     : hotelCost || 0,
                Meal: breakfastCost || 0,
                Fee: MonumentCost || 0,
                Train: TrainCost || 0,
                Additional: AdditionalCost || 0,
                Air: flightAdultCost || 0,
                // TotalPerPerson:
                //   item.Min + item.Max > 10
                //     ? DblfinalPrice +
                //         SglfinalPrice +
                //         activityCost +
                //         TrainCost +
                //         flightAdultCost +
                //         MonumentCost +
                //         breakfastCost +
                //         AdditionalCost || 0
                //     : hotelCost +
                //         activityCost +
                //         TrainCost +
                //         flightAdultCost +
                //         MonumentCost +
                //         breakfastCost +
                //         AdditionalCost || 0,
                QuotationNumber: QoutationData?.QuotationNumber,
                QueryId: queryData?.QueryAlphaNumId,
                ExcortType: "Foreigner",
              }))
            : paxSlabInitialValue;
        setSlabFormValue(initialList);
      }
    } catch (error) {
      console.log("error-pax", error);
    }
  };

  useEffect(() => {
    if (QoutationData?.Days) {
      getDataToServer();
    }
  }, [QoutationData?.Days]);

  // =====================================================

  const handleEscortIncrement = () => {
    setSlabFormValue([
      ...slabFormValue,
      {
        ...paxSlabInitialValue,
        QuotationNumber: QoutationData?.QuotationNumber,
        QueryId: queryData?.QueryAlphaNumId,
      },
    ]);
  };

  const handleEscortDecrement = (ind) => {
    const filteredScort = slabFormValue?.filter((item, index) => index != ind);
    setSlabFormValue(filteredScort);
  };

  // =====================================================

  const handlePaxSlabChange = (index, e) => {
    const { name, value } = e.target;

    setSlabFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };

      // --------------------------------------------------------------

      if (name === "Min" || name === "Max" || name === "Fee") {
        const min = newArr[index]?.Min || 0;
        const max = newArr[index]?.Max || 0;

        const sum = Number(min) + Number(max);
        newArr[index].Foc = sum > 10 ? 1 : 0;
      }

      // --------------------------------------------------------------

      if (["Min", "Max", "Foc"].includes(name)) {
        if (newArr[index].Foc > 0) {
          newArr[index].Double = 0.5;
          newArr[index].Single = 0.5;
        } else {
          newArr[index].Double = 0;
          newArr[index].Single = 0;
        }
      }

      // --------------------------------------------------------------

      // DBL CALCUALITON ONLY

      if (["Min", "Max", "Foc", "Double", "DoubleSelectType"].includes(name)) {
        if (newArr[index].Double > 0) {
          console.log(newArr[index].Double, "newArr[index].Double");

          if (newArr[index].DoubleSelectType === "DFlat") {
            const finalPrice = newArr[index].Hotel - newArr[index].Double;
            console.log(finalPrice, "finalPrice");

            newArr[index].Hotel = finalPrice;
          } else if (newArr[index].DoubleSelectType === "DPercent") {
            console.log(newArr[index].Double, "newArr[index].Double");
            if (Number(newArr[index].Double) > 0) {
              const finalPrice =
                hotelData?.dblRoom * Number(newArr[index].Double);
              // const finalsinglePrice =hotelData?.sgl * Number(newArr[index].Double);
              // console.log( newArr[index].Hotel * Number(newArr[index].Double)," newArr[index].Hotel * Number(newArr[index].Double");

              newArr[index].Hotel = finalPrice;
            }
          }
        }
      }

      // --------------------------------------------------------------

      // SGL CALCUALITON ONLY

      if (
        [
          "Min",
          "Max",
          "Foc",
          "Double",
          "Single",
          "DoubleSelectType",
          "SingleSelectType",
          "DPercent",
        ].includes(name)
      ) {
        if (newArr[index].Single > 0) {
          if (
            newArr[index].DoubleSelectType === "DFlat" &&
            newArr[index].SingleSelectType === "SFlat"
          ) {
            const finalPrice = newArr[index].SglHotel - newArr[index].Single;
            newArr[index].Hotel = newArr[index].Hotel + finalPrice;
          } else if (
            newArr[index].DoubleSelectType === "DPercent" &&
            newArr[index].SingleSelectType === "SPercent"
          ) {
            if (
              Number(newArr[index].Single) > 0
              // (Number(newArr[index].Double) > 0 &&
              //   Number(newArr[index].Double) < 1)
            ) {
              const finalPricedbl =
                hotelData?.dblRoom * Number(newArr[index].Double);
              const finalPrice =
                hotelData?.sglRoom * Number(newArr[index].Single);
              newArr[index].Hotel = finalPricedbl + finalPrice;
            }
          }
        }
      }

      // --------------------------------------------------------------
      if (
        [
          "Min",
          "Max",
          "Foc",
          "Air",
          "Train",
          "Additional",
          "Activity",
          "Meal",
          "Fee",
          "Hotel",
          "Double",
          "Single",
          "DoubleSelectType",
          "SingleSelectType",
        ].includes(name)
      ) {
        newArr[index].TotalPerPerson =
          Number(newArr[index].Hotel || 0) +
          Number(newArr[index].Fee || 0) +
          Number(newArr[index].Activity || 0) +
          Number(newArr[index].Additional || 0) +
          Number(newArr[index].Train || 0) +
          Number(newArr[index].Air || 0) +
          Number(newArr[index].Meal || 0);
      }

      return newArr;
    });
  };

  // =====================================================

  const handleFinalSave = async () => {
    try {
      const { data } = await axiosOther.post(
        "add-slabcost-excort-days",
        slabFormValue
      );

      if (data?.Status == 1) {
        notifySuccess(data?.Message);
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

  return (
    <div className="row mt-3 m-0">
      <div className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg">
        <div className="d-flex gap-2 align-items-center">
          <p className="m-0 text-dark">
            {Type == "Local" ? "Local" : "Foreign"} Escort Slabwise Costdhdhdh
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
                <th>FOC</th>
                <th>DBL</th>
                <th>SGL</th>
                <th>Hotel</th>
                <th>M.Fee</th>
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
                              name="Foc"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Foc}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="d-flex gap-2 justify-content-center">
                            <select
                              style={{ width: "4rem" }}
                              className="formControl1"
                              value={slabFormValue[index]?.DoubleSelectType}
                              name="DoubleSelectType"
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            >
                              {/* <option value="">Select</option> */}
                              <option value="DPercent">%</option>
                              <option selected value="DFlat">
                                FLAT
                              </option>
                            </select>

                            <input
                              type="number"
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
                          <div className="d-flex gap-2 justify-content-center">
                            <select
                              style={{ width: "4rem" }}
                              className="formControl1"
                              name="SingleSelectType"
                              value={slabFormValue[index]?.SingleSelectType}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                            >
                              {/* <option value="">Select</option> */}
                              <option value="SPercent">%</option>
                              <option selected value="SFlat">
                                FLAT
                              </option>
                            </select>
                            <input
                              type="number"
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
                              value={slabFormValue[index]?.Hotel}
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
                              value={slabFormValue[index]?.Fee}
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
                              value={parseInt(
                                slabFormValue[index]?.TotalPerPerson
                              )}
                              onChange={(e) => handlePaxSlabChange(index, e)}
                              readOnly
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
