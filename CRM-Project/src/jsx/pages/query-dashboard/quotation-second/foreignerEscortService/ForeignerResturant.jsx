import React, { Fragment, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Select from "react-select";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { itineraryRestaurantInitialValue } from "../qoutation_initial_value";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import RestauarantIcon from "../../../../../images/itinerary/restaurant.svg";
import {
  setItineraryRestaurantData,
  setItineraryRestaurantMealData,
} from "../../../../../store/actions/itineraryDataAction";
import {
  setRestaurantPrice,
  setTogglePriceState,
  setTotalResturantPricePax,
} from "../../../../../store/actions/PriceAction";
import { checkPrice } from "../../../../../helper/checkPrice";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { setRestaurantServiceForm } from "../../../../../store/actions/ItineraryServiceAction";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { restaurantMealInitial } from "../qoutation_initial_value";
import { setQoutationResponseData } from "../../../../../store/actions/queryAction";
import { setItineraryCopyRestaurantFormDataCheckbox } from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import {
  incrementForeignEscortCharges,
  incrementLocalEscortCharges,
} from "../../../../../store/actions/createExcortLocalForeignerAction";
import moment from "moment";
import mathRoundHelper from "../../helper-methods/math.round";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import DarkCustomTimePicker from "../../helper-methods/TimePicker";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { customStylesForhotel } from "../../../supplierCommunication/SupplierConfirmation/customStyle";

const ForeignerResturant = ({ Type }) => {
  const { qoutationData, queryData, isItineraryEditing, headerDropdown } =
    useSelector((data) => data?.queryReducer);
  const [copyChecked, setCopyChecked] = useState(false);
  const [originalRestaurantForm, setOriginalRestaurantForm] = useState([]);
  const [restaurantFormValue, setRestaurantFormValue] = useState([]);
  const [restaurantSupplierList, setRestaurantSupplierList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const { restaurantFormData, restaurantMealData } = useSelector(
    (data) => data?.itineraryReducer
  );
  const { background } = useContext(ThemeContext);
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#2e2e40",
      color: "white",
      border: "1px solid transparent",
      boxShadow: "none",
      borderRadius: "0.5rem",
      width: "100%",
      minWidth: "10rem",
      height: "2rem",
      minHeight: "2rem",
      fontSize: "1em",
      zIndex: 0,
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
      fontSize: "0.85em",
    }),
    input: (base) => ({
      ...base,
      color: "white",
      fontSize: "0.85em",
      margin: 0,
      padding: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",
      fontSize: "0.85em",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#ccc",
      padding: "0 6px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#2e2e40",
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#444" : "#2e2e40",
      color: "white",
      cursor: "pointer",
      fontSize: "0.85em",
      padding: "6px 10px",
    }),
  };
  const [rateList, setRateList] = useState([]);
  const [IsMealType, setIsMealType] = useState("Yes");
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState({
    original: false,
    copy: false,
  });
  const [paxFormValue, setPaxFormValue] = useState({
    Adults: "",
    Child: "",
    Infant: "",
  });
  const [modalCentered, setModalCentered] = useState({
    modalIndex: "",
    isShow: false,
  });
  const [restaurantPriceCalculation, setRestaurantPriceCalculation] = useState({
    Price: {
      Adult: "",
      Child: "",
    },
    Markup: {
      Adult: "",
      Child: "",
    },
    MarkupOfCost: {
      Adult: "",
      Child: "",
    },
  });
  const [isAlternate, setIsAlternate] = useState(false);
  const [hikePercent, setHikePercent] = useState(0);
  const [restaurantCopy, setRestaurantCopy] = useState(false);
  const { RestaurantService } = useSelector(
    (data) => data?.ItineraryServiceReducer
  );
  const { itineraryHotelValue } = useSelector((data) => data?.queryReducer);
  const [restaurantMealForm, setRestaurantMealForm] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [checkSupplement, setCheckSupplement] = useState([]);
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const [supplementRate, setSupplementRate] = useState({
    Price: {
      Breakfast: 0,
      Lunch: 0,
      Dinner: 0,
    },
    MarkupOfCost: {
      Breakfast: 0,
      Lunch: 0,
      Dinner: 0,
    },
  });

  const [dataIsLoaded, setDataIsLoaded] = useState(true);
  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.restaurant
  );

  const qoutationDataLocal = qoutationData?.ExcortDays?.find(
    (item) => item.Type == "Foreigner"
  );

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    postDataToServer();
  }, [apiDataLoad]);

  // Initialize restaurantMealForm with BaseAmount
  useEffect(() => {
    if (qoutationDataLocal?.Days) {
      const hasRestaurantService = qoutationDataLocal?.Days?.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType == "Restaurant")
      );
      if (hasRestaurantService) {
        setCopyChecked(true);
        const initialFormValue = qoutationDataLocal?.Days?.map((day) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType == "Restaurant"
          )[0];

          const { ItemUnitCost, ItemSupplierDetail, TimingDetails } =
            service != undefined ? service?.ServiceDetails.flat(1)[0] : "";

          return {
            id: queryData?.QueryId || "",
            QuatationNo: qoutationData?.QuotationNumber || "",
            DayType: "Foreigner" || "",
            DayNo: day.Day || "",
            Date: day?.Date || "",
            Destination: day?.DestinationId || "",
            DayUniqueId: day?.DayUniqueId,
            SupplierId: service?.SupplierId || "",
            ServiceMainType: "No",
            ItemFromDate: TimingDetails?.ItemFromDate || "",
            ItemToDate: TimingDetails?.ItemToDate || "",
            ItemFromTime: TimingDetails?.ItemFromTime || "",
            ItemToTime: TimingDetails?.ItemToTime || "",
            RateUniqueId: "",
            Supplier: ItemSupplierDetail?.ItemSupplierId || "",
            AdultCost: ItemUnitCost?.AdultCost || "",
            ChildCost: ItemUnitCost?.ChildCost || "",
            StartTime: TimingDetails?.ItemFromTime || "",
            EndTime: TimingDetails?.ItemToTime || "",
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount || 0,
              Child: qoutationData?.Pax?.ChildCount || 0,
              Infant: qoutationData?.Pax?.Infant || 0,
              Escort: service?.PaxDetails?.PaxInfo?.Escort || 0,
            },
            ForiegnerPaxInfo: {
              Adults: service?.ForiegnerPaxInfo?.PaxInfo?.Adults || 0,
              Child: service?.ForiegnerPaxInfo?.PaxInfo?.Child || 0,
              Infant: service?.ForiegnerPaxInfo?.PaxInfo?.Infant || 0,
              Escort: service?.ForiegnerPaxInfo?.PaxInfo?.Escort || 0,
            },
          };
        });

        const restaurantInitialValue = qoutationDataLocal?.Days?.map(
          (day, ind) => {
            return {
              ...itineraryRestaurantInitialValue,
              id: queryData?.QueryId,
              DayNo: day.Day,
              Date: day?.Date,
              DayType: Type,
              Destination: day.DestinationId || "",
              QuatationNo: qoutationData?.QuotationNumber,
              DayUniqueId: day?.DayUniqueId,
              ItemFromDate: qoutationData?.TourSummary?.FromDate,
              ItemToDate: qoutationData?.TourSummary?.ToDate,
              ServiceMainType: "No",
              RateUniqueId: "",
              PaxInfo: {
                Adults: qoutationData?.Pax?.AdultCount,
                Child: qoutationData?.Pax?.ChildCount,
                Infant: qoutationData?.Pax?.Infant,
                Escort: "",
              },
            };
          }
        );

        const restaurantMeal = qoutationDataLocal?.Days?.map((day, index) => {
          const service = day?.DayServices?.find(
            (s) => s?.ServiceType == "Restaurant"
          );

          if (!service) return restaurantMealInitial;

          const mealPlan =
            service?.MealPlan?.map((meal) => {
              const isHotel = service?.ServiceType == "Hotel";
              const serviceId =
                service?.ServiceId ||
                service?.HotelId ||
                service?.RestaurantId ||
                "";
              const restaurantId = !isHotel ? serviceId : "";
              const hotelId = isHotel ? serviceId : "";
              const serviceType = isHotel ? "Hotel" : "Restaurant";

              return {
                ...meal,
                MealType: meal.MealType,
                ServiceID: serviceId,
                ServiceType: serviceType,
                RestaurantId:
                  service?.ServiceType !== "Hotel" ? meal?.ServiceID : "",
                HotelId: meal?.ServiceType == "Hotel" ? meal?.ServiceID : "",
                IsHotel: meal?.ServiceType == "Hotel" ? "Yes" : "No",
                Supplement: meal.Supplement,
                Amount: meal.Amount,
                BaseAmount: meal.Amount || 0, // Initialize BaseAmount
              };
            }) || [];

          return mealPlan;
        });

        const initialCheckedMeals = [];
        restaurantMeal.forEach((dayMeals, dayIndex) => {
          dayMeals.forEach((meal) => {
            if (
              meal.IsMealType == "Yes" &&
              !initialCheckedMeals.includes(meal.MealType)
            ) {
              initialCheckedMeals.push(meal.MealType);
            }
          });
        });

        setCheckSupplement(initialCheckedMeals);
        setRestaurantMealForm(restaurantMeal);
        dispatch(setRestaurantServiceForm(restaurantInitialValue));
        setRestaurantFormValue(initialFormValue);
        setOriginalRestaurantForm(initialFormValue);
      } else {
        const restaurantInitialValue = qoutationDataLocal?.Days?.map(
          (day, ind) => {
            return {
              ...itineraryRestaurantInitialValue,
              id: queryData?.QueryId,
              DayNo: day.Day,
              Date: day?.Date,
              DayType: "Foreigner",
              Destination: day.DestinationId || "",
              QuatationNo: qoutationData?.QuotationNumber,
              DayUniqueId: day?.DayUniqueId,
              ItemFromDate: qoutationData?.TourSummary?.FromDate,
              ServiceMainType: "No",
              ItemToDate: qoutationData?.TourSummary?.ToDate,
              RateUniqueId: "",
              PaxInfo: {
                Adults: qoutationData?.Pax?.AdultCount,
                Child: qoutationData?.Pax?.ChildCount,
                Infant: qoutationData?.Pax?.Infant,
                Escort: "",
              },
            };
          }
        );

        const restaurantMeal = qoutationDataLocal?.Days?.map((day, index) => {
          return restaurantMealInitial.map((meal) => ({
            ...meal,
            BaseAmount: meal.Amount || 0, // Initialize BaseAmount
          }));
        });

        const initialCheckedMeals = [];
        restaurantMeal.forEach((dayMeals, dayIndex) => {
          dayMeals.forEach((meal) => {
            if (
              meal.IsMealType == "Yes" &&
              !initialCheckedMeals.includes(meal.MealType)
            ) {
              initialCheckedMeals.push(meal.MealType);
            }
          });
        });
        setCheckSupplement(initialCheckedMeals);
        setRestaurantMealForm(restaurantMeal);
        setRestaurantFormValue(restaurantInitialValue);
        setOriginalRestaurantForm(restaurantInitialValue);
        dispatch(setRestaurantServiceForm(restaurantInitialValue));
      }
    }
  }, [qoutationDataLocal]);

  // Update BaseAmount when Amount is manually changed
  const handleRestaurantMealForm = (e, index, mealInd) => {
    const { checked, name, type, value } = e.target;

    setRestaurantMealForm((prevArr) => {
      const newArr = prevArr.map((innerArray) =>
        innerArray.map((item) => ({ ...item }))
      );

      if (name == "IsMealType") {
        newArr[index][mealInd] = {
          ...newArr[index][mealInd],
          IsMealType: checked ? "Yes" : "No",
        };
      } else if (name == "Amount") {
        newArr[index][mealInd] = {
          ...newArr[index][mealInd],
          Amount: value,
          BaseAmount: parseFloat(value) || 0, // Update BaseAmount when Amount changes
        };
      } else {
        newArr[index][mealInd] = {
          ...newArr[index][mealInd],
          [name]: type == "checkbox" ? (checked ? "Yes" : "No") : value,
        };
      }
      return newArr;
    });

    const { ServiceId } = itineraryHotelValue?.HotelForm[index] || {};
    const hotel = hotelList[index]?.find((hotel) => hotel?.id == ServiceId);

    if (name == "IsHotel") {
      setRestaurantMealForm((prevArr) => {
        const newArr = prevArr.map((innerArray) =>
          innerArray.map((item) => ({ ...item }))
        );
        newArr[index][mealInd] = {
          ...newArr[index][mealInd],
          HotelName: checked ? hotel?.HotelName || "" : "",
        };
        return newArr;
      });
    }
  };

  // Fixed handleHikeChange function
  const handleHikeChange = (e) => {
    const { value } = e.target;
    const hikeValue = parseFloat(value) || 0; // Safe fallback to 0
    setHikePercent(value); // Store string for input binding

    setRestaurantMealForm((prevArr) =>
      prevArr.map((form) =>
        form.map((item) => {
          const baseAmount = parseFloat(item?.BaseAmount) || 0;
          const newAmount = !isNaN(baseAmount)
            ? Math.floor(baseAmount + (baseAmount * hikeValue) / 100)
            : item?.Amount;
          return {
            ...item,
            Amount: newAmount,
          };
        })
      )
    );
  };

  // Rest of the component remains unchanged
  const setFirstValueIntoForm = (index) => {
    const restaurantId =
      restaurantList[index]?.length > 0 ? restaurantList[index][0]?.Id : "";
    const supplierId =
      restaurantSupplierList[index]?.length > 0
        ? restaurantSupplierList[index][0]?.id
        : "";
    const firstMealPlan = restaurantMealForm[index]?.map((meal) => ({
      ...meal,
      RestaurantId:
        restaurantList[index]?.length > 0 ? restaurantList[index][0]?.Id : "",
      HotelId: hotelList[index]?.length > 0 ? hotelList[index][0]?.id : "",
      ServiceID:
        restaurantList[index]?.length > 0
          ? restaurantList[index][0]?.Id
          : hotelList[index]?.length > 0
          ? hotelList[index][0]?.id
          : "",
    }));

    setRestaurantFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: restaurantId,
        Supplier: supplierId,
      };
      return newArr;
    });

    setOriginalRestaurantForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: restaurantId,
        Supplier: supplierId,
      };
      return newArr;
    });

    setRestaurantMealForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = firstMealPlan;
      return newArr;
    });
  };

  useEffect(() => {
    if (!isItineraryEditing) {
      restaurantFormValue?.forEach((item, index) => {
        // setFirstValueIntoForm(index);
      });
    }
  }, [restaurantList, restaurantSupplierList]);

  const getRestaurantSupplierList = async (index, id) => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: "",
        DestinationId: [id],
      });

      setRestaurantSupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    restaurantFormValue?.forEach((item, index) => {
      getRestaurantSupplierList(index, item?.Destination);
    });
  }, [
    restaurantFormValue?.map((item) => item?.Destination)?.join(","),
    apiDataLoad,
  ]);

  const getHotelListDependently = async (city, hotelCategory, index) => {
    try {
      const { data } = await axiosOther.post("hotellist", {
        DestinationId: city,
        HotelCategoryId: hotelCategory,
        Default: "Yes",
        perPage: "600",
      });

      setHotelList((prevList) => {
        const newList = [...prevList];
        newList[index] = data?.DataList || [];
        return newList;
      });
    } catch (error) {
      console.log("Error fetching hotel list:", error);
    }
  };

  useEffect(() => {
    if (!apiDataLoad) return;
    restaurantFormValue.forEach((row, index) => {
      getHotelListDependently(row?.Destination, headerDropdown?.Hotel, index);
    });
  }, [
    restaurantFormValue.map((row) => row?.Destination).join(","),
    headerDropdown?.Hotel,
    apiDataLoad,
  ]);

  const handlingRestaurantDropdownValue = (index) => {
    const supplier =
      restaurantSupplierList[index]?.length > 0
        ? restaurantSupplierList[index][0]?.id
        : "";

    setRestaurantFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], Supplier: supplier };
      return newArr;
    });
    setOriginalRestaurantForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], Supplier: supplier };
      return newArr;
    });
  };

  useEffect(() => {
    restaurantFormValue?.map((item, index) => {
      handlingRestaurantDropdownValue(index);
    });
  }, [restaurantSupplierList]);

  const getRestaurantList = async (id, index) => {
    try {
      const { data } = await axiosOther.post("restaurantmasterlist", {
        Destination: id,
      });

      // console.log(data, "rdata");

      setRestaurantList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    // if (!apiDataLoad) return;
    restaurantFormValue.forEach((item, index) => {
      getRestaurantList(item?.Destination, index);
    });
  }, [
    restaurantFormValue?.map((item) => item?.Destination).join(","),
    // apiDataLoad,
  ]);

  // const handleTableIncrement = (index) => {
  //   const indexHotel = restaurantFormValue[index];
  //   setRestaurantFormValue((prevArr) => {
  //     const newArr = [...prevArr];
  //     newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
  //     return newArr;
  //   });
  //   setOriginalRestaurantForm((prevArr) => {
  //     const newArr = [...prevArr];
  //     newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
  //     return newArr;
  //   });
  // };

  const handleTableIncrement = (index) => {
    const indexHotel = restaurantFormValue[index];

    // Restaurant main form value copy
    setRestaurantFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });

    setOriginalRestaurantForm((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });

    // MealForm bhi copy karna hoga, warna save ke time fat jati hai
    setRestaurantMealForm((prevArr) => {
      const newArr = prevArr.map((inner) => inner.map((item) => ({ ...item })));
      if (prevArr[index]) {
        newArr.splice(
          index + 1,
          0,
          prevArr[index].map((item) => ({ ...item, isCopied: true }))
        );
      }
      return newArr;
    });

    // setOriginalRestaurantMealForm((prevArr) => {
    //   const newArr = prevArr.map(inner => inner.map(item => ({ ...item })));
    //   if (prevArr[index]) {
    //     newArr.splice(index + 1, 0, prevArr[index].map(item => ({ ...item, isCopied: true })));
    //   }
    //   return newArr;
    // });
  };

  // const handleTableDecrement = (index) => {
  //   const filteredTable = restaurantFormValue?.filter(
  //     (item, ind) => ind != index
  //   );
  //   setRestaurantFormValue(filteredTable);
  //   setOriginalRestaurantForm(filteredTable);
  // };

  const handleTableDecrement = (index) => {
    // Main form remove
    const filteredTable = restaurantFormValue?.filter(
      (_, ind) => ind !== index
    );
    setRestaurantFormValue(filteredTable);
    setOriginalRestaurantForm(filteredTable);

    // Meal form remove
    setRestaurantMealForm((prevArr) =>
      prevArr.filter((_, ind) => ind !== index)
    );

    // setOriginalRestaurantMealForm((prevArr) =>
    //   prevArr.filter((_, ind) => ind !== index)
    // );
  };

  const handleRestaurantFormChange = (ind, e) => {
    const { name, value } = e.target;

    setRestaurantFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[ind] = { ...newArr[ind], [name]: value };
      return newArr;
    });
    setOriginalRestaurantForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[ind] = { ...newArr[ind], [name]: value };
      return newArr;
    });
  };

  // const handleFinalSave = async (mealInd, index) => {
  //   try {
  //     const filteredMeal = restaurantMealForm?.map((mealForm) => {
  //       return mealForm?.map((form) => {
  //         const isHotel = form?.IsHotel == "Yes";
  //         return {
  //           ...form,
  //           IsMealType: "Yes",
  //           ServiceID: isHotel ? form?.HotelId : form?.RestaurantId,
  //           ServiceType: isHotel ? "Hotel" : "Restaurant",
  //         };
  //       });
  //     });

  //     const finalForm = restaurantFormValue?.map((form, index) => {
  //       const mealPlan = restaurantMealForm[index];
  //       const totalCostingMealPlan = ["Breakfast", "Lunch", "Dinner"].map(
  //         (mealType) => {
  //           const meal = mealPlan.find((m) => m.MealType == mealType);
  //           const serviceCost = mathRoundHelper(meal?.Amount || 0);
  //           const markupValue = mathRoundHelper(5);
  //           const markupTotalValue =
  //             mealType == "Breakfast"
  //               ? supplementRate?.MarkupOfCost?.Breakfast
  //               : mealType == "Lunch"
  //                 ? supplementRate?.MarkupOfCost?.Lunch
  //                 : supplementRate?.MarkupOfCost?.Dinner;
  //           const totalServiceCost =
  //             mealType == "Breakfast"
  //               ? supplementRate?.Price?.Breakfast +
  //               supplementRate?.MarkupOfCost?.Breakfast
  //               : mealType == "Lunch"
  //                 ? supplementRate?.Price?.Lunch +
  //                 supplementRate?.MarkupOfCost?.Lunch
  //                 : supplementRate?.Price?.Dinner +
  //                 supplementRate?.MarkupOfCost?.Dinner;

  //           return {
  //             MealType: mealType,
  //             ServiceCost: mathRoundHelper(serviceCost.toFixed(2)),
  //             MarkupValue: mathRoundHelper(markupValue.toFixed(2)),
  //             MarkupTotalValue: mathRoundHelper(markupTotalValue.toFixed(2)),
  //             TotalServiceCost: mathRoundHelper(totalServiceCost.toFixed(2)),
  //           };
  //         }
  //       );

  //       return {
  //         ...form,
  //         Hike: hikePercent,
  //         DayType: "Foreigner",
  //         MealPlan: filteredMeal[index],
  //         Sector: fromToDestinationList[index],
  //         TotalCostingMealPlan: totalCostingMealPlan,
  //       };
  //     });

  //     const totalCost = finalForm.reduce((total, item) => {
  //       const adultCost = mathRoundHelper(item.AdultCost) || 0;
  //       const childCost = mathRoundHelper(item.ChildCost) || 0;
  //       return total + adultCost + childCost;
  //     }, 0);

  //     dispatch(setTotalResturantPricePax(totalCost));

  //     const filteredFinalForm = finalForm
  //       ?.map((form) => {
  //         const validMeals = form?.MealPlan?.filter(
  //           (meal) => meal?.HotelId !== "" || meal?.RestaurantId !== ""
  //         );

  //         if (validMeals?.length > 0) {
  //           const cleanedMealPlan = validMeals.map(
  //             ({
  //               IsMealType,
  //               RestaurantId,
  //               HotelId,
  //               IsHotel,
  //               BaseAmount,
  //               ...rest
  //             }) => ({
  //               ...rest,
  //               BaseAmount: mathRoundHelper(BaseAmount)?.toString(),
  //             })
  //           );

  //           return {
  //             ...form,
  //             MealPlan: cleanedMealPlan,
  //           };
  //         } else {
  //           return null;
  //         }
  //       })
  //       ?.filter((form) => form != null);

  //     const { data } = await axiosOther.post(
  //       "update-quotation-restaurent",
  //       filteredFinalForm
  //     );
  //     if (data?.status == 1) {
  //       dispatch(incrementLocalEscortCharges());
  //       notifySuccess("Services Added !");
  //       dispatch(setRestaurantPrice(totalCost));
  //       dispatch(setTogglePriceState());
  //       dispatch(setQoutationResponseData(data?.data));
  //     }
  //   } catch (error) {
  //     console.log(error, "error");
  //     if (error.response?.data?.Errors || error.response?.data?.errors) {
  //       const data = Object.entries(
  //         error.response?.data?.Errors || error.response?.data?.errors
  //       );
  //       notifyError(data[0][1]);
  //       console.log(data, "error");
  //     }
  //     if (error.response?.data) {
  //       const data = Object.entries(error.response?.data);
  //       notifyError(data[0][1]);
  //       console.log(data, "error");
  //     }
  //   }
  // };

  const handleFinalSave = async (mealInd, index) => {
    try {
      const filteredMeal = restaurantMealForm?.map((mealForm) => {
        return mealForm?.map((form) => {
          const isHotel = form?.IsHotel == "Yes";
          return {
            ...form,
            IsMealType: "Yes",
            ServiceID: isHotel ? form?.HotelId : form?.RestaurantId,
            ServiceType: isHotel ? "Hotel" : "Restaurant",
          };
        });
      });

      const finalForm = restaurantFormValue?.map((form, idx) => {
        const mealPlan = restaurantMealForm[idx] || []; // Fallback to empty array
        const totalCostingMealPlan = ["Breakfast", "Lunch", "Dinner"].map(
          (mealType) => {
            const meal = mealPlan.find((m) => m?.MealType == mealType);
            const serviceCost = mathRoundHelper(meal?.Amount || 0);
            const markupValue = mathRoundHelper(5);
            const markupTotalValue =
              mealType == "Breakfast"
                ? supplementRate?.MarkupOfCost?.Breakfast || 0
                : mealType == "Lunch"
                ? supplementRate?.MarkupOfCost?.Lunch || 0
                : supplementRate?.MarkupOfCost?.Dinner || 0;
            const totalServiceCost =
              mealType == "Breakfast"
                ? (supplementRate?.Price?.Breakfast || 0) +
                  (supplementRate?.MarkupOfCost?.Breakfast || 0)
                : mealType == "Lunch"
                ? (supplementRate?.Price?.Lunch || 0) +
                  (supplementRate?.MarkupOfCost?.Lunch || 0)
                : (supplementRate?.Price?.Dinner || 0) +
                  (supplementRate?.MarkupOfCost?.Dinner || 0);

            return {
              MealType: mealType,
              ServiceCost: mathRoundHelper(serviceCost.toFixed(2)),
              MarkupValue: mathRoundHelper(markupValue.toFixed(2)),
              MarkupTotalValue: mathRoundHelper(
                (markupTotalValue || 0).toFixed(2)
              ),
              TotalServiceCost: mathRoundHelper(
                (totalServiceCost || 0).toFixed(2)
              ),
            };
          }
        );

        return {
          ...form,
          Hike: hikePercent,
          DayType: "Foreigner",
          MealPlan: filteredMeal[idx] || [], // Fallback for undefined filteredMeal
          Sector: fromToDestinationList[idx] || [], // Fallback for undefined Sector
          TotalCostingMealPlan: totalCostingMealPlan,
        };
      });

      const totalCost = finalForm.reduce((total, item) => {
        const adultCost = mathRoundHelper(item.AdultCost) || 0;
        const childCost = mathRoundHelper(item.ChildCost) || 0;
        return total + adultCost + childCost;
      }, 0);

      dispatch(setTotalResturantPricePax(totalCost));

      const filteredFinalForm = finalForm
        ?.map((form) => {
          const validMeals = form?.MealPlan?.filter(
            (meal) => meal?.HotelId !== "" || meal?.RestaurantId !== ""
          );

          if (validMeals?.length > 0) {
            const cleanedMealPlan = validMeals.map(
              ({
                IsMealType,
                RestaurantId,
                HotelId,
                IsHotel,
                BaseAmount,
                ...rest
              }) => ({
                ...rest,
                BaseAmount: mathRoundHelper(BaseAmount)?.toString() || "0", // Fallback for undefined BaseAmount
              })
            );

            return {
              ...form,
              MealPlan: cleanedMealPlan,
            };
          } else {
            return null;
          }
        })
        ?.filter((form) => form != null);

      console.log("FilteredFinalForm:", filteredFinalForm);

      const { data } = await axiosOther.post(
        "update-quotation-restaurent",
        filteredFinalForm
      );
      if (data?.status == 1) {
        console.log("GDDVDGDGD988");
        dispatch(incrementForeignEscortCharges());
        notifySuccess("Services Added !");
        dispatch(setRestaurantPrice(totalCost));
        dispatch(setTogglePriceState());
        dispatch(setQoutationResponseData(data?.data));
      }
    } catch (error) {
      console.log(error, "error");
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0]?.[1] || "An error occurred");
      } else if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0]?.[1] || "An error occurred");
      }
    }
  };

  useEffect(() => {
    const costArr = restaurantFormValue?.map((restauarnt) => {
      if (restauarnt?.ServiceId !== "") {
        let arr = [restauarnt?.AdultCost, restauarnt?.ChildCost];

        arr = arr.map((value, index) => {
          if (
            value == null ||
            value == undefined ||
            value == "" ||
            isNaN(value)
          ) {
            arr[index] = 0;
          }
          if (typeof value == "string" && !isNaN(value)) {
            arr[index] = parseFloat(value);
          }
          return arr[index];
        });

        const rate = arr.reduce((acc, curr) => acc + curr, 0);
        return rate;
      } else {
        return 0;
      }
    });
  }, [
    restaurantFormValue
      ?.map((restauarnt) => restauarnt?.AdultCost + restauarnt?.ChildCost)
      ?.join(","),
    restaurantFormValue?.map((item) => item?.ServiceId).join(","),
  ]);

  const handlePaxChange = (index, e) => {
    const { name, value } = e.target;
    setPaxFormValue({ ...paxFormValue, [name]: value });
  };

  const handlePaxModalClick = (index) => {
    setModalCentered({ modalIndex: index, isShow: true });

    const form = restaurantFormValue?.filter((form, ind) => ind == index)[0];
    setPaxFormValue({
      Adults: form?.PaxInfo?.Adults,
      Child: form?.PaxInfo?.Child,
      Infant: form?.PaxInfo?.Infant,
    });
  };

  const handlePaxSave = () => {
    setRestaurantFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setOriginalRestaurantForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setModalCentered({ modalIndex: "", isShow: false });
  };

  const handleAlternateRestaurant = () => {
    setIsAlternate(true);
    setRestaurantCopy(true);
  };

  useEffect(() => {
    const calculateTotalPrice = (data) => {
      let totalAdultPrice = 0;

      data.forEach((item) => {
        totalAdultPrice += parseFloat(item.AdultCost) || 0;
      });

      return totalAdultPrice;
    };

    const totalAdultPrice = calculateTotalPrice(restaurantFormValue);

    const calculateChildPrice = (data) => {
      let totalChildPrice = 0;

      data.forEach((item) => {
        totalChildPrice += parseFloat(item.ChildCost) || 0;
      });

      return totalChildPrice;
    };

    const filteredFormValue = restaurantFormValue?.filter(
      (form) => form?.ServiceId != ""
    );
    const totalChildPrice = calculateChildPrice(filteredFormValue);

    setRestaurantPriceCalculation((prevData) => ({
      ...prevData,
      Price: {
        Adult: totalAdultPrice,
        Child: totalChildPrice,
      },
      MarkupOfCost: {
        Adult: (totalAdultPrice * 5) / 100,
        Child: (totalChildPrice * 5) / 100,
      },
    }));
  }, [
    restaurantFormValue?.map((item) => item?.AdultCost).join(","),
    restaurantFormValue?.map((item) => item?.ChildCost).join(","),
    restaurantFormValue?.map((item) => item?.ServiceId).join(","),
    hikePercent,
  ]);

  useEffect(() => {
    const mealTotals = { Breakfast: 0, Lunch: 0, Dinner: 0 };
    const mealMarkup = { Breakfast: 0, Lunch: 0, Dinner: 0 };

    const filteredMeal = (restaurantMealForm ?? [])?.map((mealArr) => {
      return (mealArr ?? [])
        ?.map((meal) => {
          if (meal?.HotelId != "" || meal?.RestaurantId != "") {
            return meal;
          } else {
            return null;
          }
        })
        .filter((meal) => meal != null);
    });

    filteredMeal.forEach((dayMeals) => {
      dayMeals?.forEach((meal) => {
        if (meal.MealType in mealTotals) {
          mealTotals[meal.MealType] += Number(meal.Amount);
          mealMarkup[meal?.MealType] += Number(meal?.Amount * 5) / 100;
        }
      });
    });
    setSupplementRate({
      ...supplementRate,
      Price: mealTotals,
      MarkupOfCost: mealMarkup,
    });
  }, [restaurantMealForm]);

  useEffect(() => {
    const destinations = restaurantFormValue?.map(
      (restaurant, index, restaurantArr) => {
        return {
          From: restaurant?.Destination,
          To: restaurantArr[index + 1]?.Destination,
        };
      }
    );

    const currAndPrevDest = destinations?.map((dest, ind) => {
      const currentAndPrev =
        dest?.From == destinations[ind - 1]?.From
          ? { From: dest?.From, To: "" }
          : { From: dest?.From, To: destinations[ind - 1]?.From };
      return currentAndPrev;
    });

    const FromToDestination = currAndPrevDest?.map((item) => {
      const filteredFromDest = destinationList.find(
        (dests) => dests?.id == item?.From
      );
      const filteredToDest = destinationList.find(
        (dests) => dests?.id == item?.To
      );

      if (filteredToDest != undefined) {
        return `${filteredToDest?.Name} To ${filteredFromDest?.Name}`;
      } else {
        return filteredFromDest?.Name;
      }
    });

    setFromToDestinationList(FromToDestination);
  }, [
    restaurantFormValue?.map((restaurant) => restaurant?.Destination).join(","),
    destinationList,
  ]);

  const handleIsOpen = () => {
    if (dataIsLoaded) {
      dispatch({
        type: "SET_RESTAURANT_DATA_LOAD",
        payload: true,
      });
      setDataIsLoaded(false);
    }

    setIsOpen({ ...isOpen, original: !isOpen?.original });
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: "SET_RESTAURANT_DATA_LOAD",
        payload: false,
      });
    };
  }, []);

  const [temporaryFormValue, setTemporayFormValue] = useState([]);
  const [temporaryMealForm, setTemporaryMealForm] = useState([]);

  const restaurantData = useSelector(
    (state) => state.itineraryServiceCopyReducer.restaurantData
  );

  const restaurantCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.restaurantCheckbox
  );

  console.log(restaurantFormValue, "RES845");
  console.log(restaurantData?.RestaurantForm, "RESTD652");

  const handleCopyDataFromMain = (e) => {
    const { checked } = e.target;
    setTemporayFormValue(restaurantFormValue);
    setTemporaryMealForm(restaurantMealForm);
    if (checked) {
      const updatedRestaurant = restaurantData?.RestaurantForm?.map(
        (sourceRes, index) => {
          const mainRes = restaurantFormValue?.find(
            (r) => r?.DayNo == sourceRes?.DayNo
          );
          return {
            ...sourceRes,
            DayType: "Foreigner",
            DayUniqueId: mainRes?.DayUniqueId,
          };
        }
      );

      setRestaurantFormValue(updatedRestaurant);
      setRestaurantMealForm(
        restaurantData?.MealForm.map((form) =>
          form.map((item) => ({
            ...item,
            BaseAmount: item.Amount || 0, // Ensure BaseAmount is copied
          }))
        )
      );
      setCopyChecked(true);
      dispatch(setItineraryCopyRestaurantFormDataCheckbox(false));
    } else {
      setCopyChecked(false);
      // setRestaurantFormValue(temporaryFormValue);
      // setRestaurantMealForm(temporaryMealForm);
    }
  };

  return (
    <>
      <div className="row mt-3 m-0">
        <div
          className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg foreignerEscort-head-bg"
          onClick={handleIsOpen}
        >
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex gap-2">
              <img src={RestauarantIcon} alt="RestauarantIcon" />
              <label htmlFor="" className="fs-5">
                Restaurant
              </label>
            </div>

            <div
              className="d-flex gap-1 form-check"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="form-check-input check-md"
                id="copy-guide"
                checked={copyChecked}
                onChange={(e) => handleCopyDataFromMain(e)}
              />
              <label className="fontSize11px m-0 ms-1" htmlFor="copy-guide">
                Copy
              </label>
            </div>
          </div>
          <div className="d-flex gap-4 align-items-center ms-auto">
            {Type == "Main" && (
              <div
                className="d-flex gap-2 align-items-center hike-input"
                onClick={(e) => e.stopPropagation()}
              >
                <label htmlFor="" className="fs-6">
                  Hike
                </label>
                <input
                  type="number"
                  className={`formControl3`}
                  value={hikePercent}
                  onChange={handleHikeChange}
                />
                <span className="fs-6">%</span>
              </div>
            )}
            <span className="cursor-pointer fs-5">
              {!isOpen?.original ? (
                <FaChevronCircleUp
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen({ ...isOpen, original: !isOpen?.original });
                  }}
                />
              ) : (
                <FaChevronCircleDown
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen({ ...isOpen, original: !isOpen?.original });
                  }}
                />
              )}
            </span>
          </div>
        </div>
        <Modal
          className="fade bd-example-modal-sm"
          size="sm"
          show={modalCentered?.isShow}
        >
          <Modal.Header>
            <Modal.Title>Add Pax</Modal.Title>
            <Button
              variant=""
              className="btn-close"
              onClick={() =>
                setModalCentered({ modalIndex: "", isShow: false })
              }
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col className="col-4">
                <label htmlFor="shortName">Adult</label>
                <input
                  type="text"
                  className={`form-control form-control-sm`}
                  name="Adults"
                  placeholder="Pax"
                  value={paxFormValue?.Adults}
                  onChange={(e) => handlePaxChange(modalCentered.modalIndex, e)}
                />
              </Col>
              <Col className="col-4">
                <label htmlFor="shortName">Child</label>
                <input
                  type="text"
                  className={`form-control form-control-sm`}
                  name="Child"
                  placeholder="Pax"
                  value={paxFormValue?.Child}
                  onChange={(e) => handlePaxChange(modalCentered.modalIndex, e)}
                />
              </Col>
              <Col className="col-4">
                <label htmlFor="shortName">Infant</label>
                <input
                  type="text"
                  className={`form-control form-control-sm`}
                  name="Infant"
                  placeholder="Pax"
                  value={paxFormValue.Infant}
                  onChange={(e) => handlePaxChange(modalCentered.modalIndex, e)}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger light"
              onClick={() =>
                setModalCentered({ modalIndex: "", isShow: false })
              }
              className="btn-custom-size"
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handlePaxSave}
              className="btn-custom-size"
            >
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
        {isOpen?.original && (
          <>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar>
                <table className="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th
                        className="text-center days-width-9 align-middle"
                        rowSpan={2}
                      >
                        {restaurantFormValue[0]?.Date ? "Day / Date" : "Day"}
                      </th>
                      {(Type == "Local" || Type == "Foreigner") && (
                        <th rowSpan={2} className="py-1 align-middle">
                          Escort
                        </th>
                      )}
                      <th rowSpan={2} className="align-middle">
                        Destination
                      </th>
                      {Array.isArray(restaurantMealForm?.[0]) &&
                        (restaurantMealForm[0] ?? []).map((meal, index) => (
                          <th colSpan={4} key={index}>
                            <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                id={`mealType-${meal?.MealType}-${index}`}
                                checked={meal?.IsMealType == "Yes"}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;

                                  setRestaurantMealForm((prevArr) => {
                                    const newArr = prevArr.map((section) => {
                                      const updatedSection = [...section];

                                      if (updatedSection[index]) {
                                        updatedSection[index] = {
                                          ...updatedSection[index],
                                          Supplement: isChecked ? "Yes" : "No",
                                        };
                                      }

                                      return updatedSection;
                                    });

                                    if (
                                      Array.isArray(newArr[0]) &&
                                      newArr[0][index]
                                    ) {
                                      newArr[0][index] = {
                                        ...newArr[0][index],
                                        IsMealType: isChecked ? "Yes" : "No",
                                      };
                                    }

                                    return newArr;
                                  });

                                  setCheckSupplement((prevData) => {
                                    return isChecked
                                      ? [...prevData, meal?.MealType]
                                      : prevData.filter(
                                          (data) => data !== meal?.MealType
                                        );
                                  });
                                }}
                              />
                              <label
                                htmlFor={`mealType-${meal?.MealType}-${index}`}
                                className="mt-1"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {meal?.MealType}
                              </label>
                            </div>
                          </th>
                        ))}
                      <th rowSpan={2} className="align-middle">
                        Supplier
                      </th>
                      <th rowSpan={2} className="align-middle">
                        Start Time
                      </th>
                      <th rowSpan={2} className="align-middle">
                        End Time
                      </th>
                    </tr>
                    <tr>
                      {(restaurantMealForm[0] ?? [])?.map((meal, index) => (
                        <Fragment key={index + 1}>
                          <th>H</th>
                          <th>Hotel/Restaurant</th>
                          <th>Price</th>
                          <th>S</th>
                        </Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(restaurantFormValue ?? [])
                      ?.map((form, index) => ({
                        item: form,
                        originalIndex: index,
                      }))
                      ?.filter(({ item }) => item?.ServiceMainType == "No")
                      ?.map(({ item, originalIndex }, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex gap-1 justify-content-start">
                              <div className="d-flex gap-1">
                                <div
                                  className="d-flex align-items-center pax-icon"
                                  onClick={() =>
                                    handlePaxModalClick(originalIndex)
                                  }
                                >
                                  <i className="fa-solid fa-person"></i>
                                </div>
                                <span
                                  onClick={() =>
                                    handleTableIncrement(originalIndex)
                                  }
                                >
                                  <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                </span>
                                <span
                                  onClick={() =>
                                    handleTableDecrement(originalIndex)
                                  }
                                >
                                  <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                </span>
                              </div>
                              {item?.Date ? (
                                <span
                                  style={{
                                    textWrap: "nowrap",
                                    marginRight: "5px",
                                  }}
                                >
                                  <div className="d-flex gap-2">
                                    <div>{`Day ${item?.DayNo}`}</div>
                                    <div>{`${moment(item?.Date).format(
                                      "DD-MM-YYYY"
                                    )}`}</div>
                                  </div>
                                </span>
                              ) : (
                                <span>{`Day ${item?.DayNo}`}</span>
                              )}
                            </div>
                          </td>
                          {(Type == "Local" || Type == "Foreigner") && (
                            <td style={{ width: "30px" }}>
                              <div>
                                <input
                                  name="Escort"
                                  type="number"
                                  style={{ width: "30px" }}
                                  className={`formControl1`}
                                  value={
                                    restaurantFormValue[originalIndex]?.Escort
                                  }
                                  onChange={(e) =>
                                    handleRestaurantFormChange(originalIndex, e)
                                  }
                                />
                              </div>
                            </td>
                          )}
                          <td>
                            <div>
                              <select
                                name="Destination"
                                id=""
                                className="formControl1"
                                value={
                                  restaurantFormValue[originalIndex]
                                    ?.Destination
                                }
                                onChange={(e) =>
                                  handleRestaurantFormChange(originalIndex, e)
                                }
                              >
                                <option value="">Select</option>
                                {qoutationDataLocal?.Days?.map(
                                  (qout, index) => (
                                    <option
                                      value={qout?.DestinationId}
                                      key={index + 1}
                                    >
                                      {qout?.DestinationName}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </td>
                          {restaurantMealForm[0]?.map((meal, mealInd) => (
                            <Fragment key={index + mealInd}>
                              <td>
                                <div className="form-check check-sm d-flex align-items-center justify-content-center">
                                  <input
                                    name="IsHotel"
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    id="no_of_activity"
                                    checked={
                                      restaurantMealForm[index]?.[mealInd]
                                        ?.IsHotel == "Yes"
                                    }
                                    onChange={(e) =>
                                      handleRestaurantMealForm(
                                        e,
                                        originalIndex,
                                        mealInd
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              {restaurantMealForm[index]?.[mealInd]?.IsHotel ==
                              "Yes" ? (
                                <td>
                                  <Select
                                    id={`HotelId-${index}-${mealInd}`}
                                    options={[
                                      { value: "", label: "Select" },
                                      ...(hotelList[index]?.map((hotel) => ({
                                        value: hotel?.id,
                                        label: hotel?.HotelName,
                                      })) || []),
                                    ]}
                                    value={
                                      restaurantMealForm[index]?.[mealInd]
                                        ?.HotelId
                                        ? {
                                            value:
                                              restaurantMealForm[index]?.[
                                                mealInd
                                              ]?.HotelId,
                                            label:
                                              hotelList[index]?.find(
                                                (hotel) =>
                                                  hotel?.id ==
                                                  restaurantMealForm[index]?.[
                                                    mealInd
                                                  ]?.HotelId
                                              )?.HotelName ||
                                              restaurantMealForm[index]?.[
                                                mealInd
                                              ]?.HotelId,
                                          }
                                        : { value: "", label: "Select" }
                                    }
                                    onChange={(option) =>
                                      handleRestaurantMealForm(
                                        {
                                          target: {
                                            name: "HotelId",
                                            value: option?.value || "",
                                          },
                                        },
                                        originalIndex,
                                        mealInd
                                      )
                                    }
                                    styles={customStyles}
                                    isSearchable
                                    className="customSelectLightTheame"
                                    classNamePrefix="custom"
                                    placeholder="Select Hotel"
                                    filterOption={(option, inputValue) =>
                                      option.label
                                        .toLowerCase()
                                        .startsWith(inputValue.toLowerCase())
                                    }
                                  />
                                </td>
                              ) : (
                                <td>
                                  <Select
                                    id={`RestaurantId-${index}-${mealInd}`}
                                    options={[
                                      { value: "", label: "Select" },
                                      ...(restaurantList[index]?.map(
                                        (rest) => ({
                                          value: rest?.Id,
                                          label: rest?.Name,
                                        })
                                      ) || []),
                                    ]}
                                    value={
                                      restaurantMealForm[index]?.[mealInd]
                                        ?.RestaurantId
                                        ? {
                                            value:
                                              restaurantMealForm[index]?.[
                                                mealInd
                                              ]?.RestaurantId,
                                            label:
                                              restaurantList[index]?.find(
                                                (rest) =>
                                                  rest?.Id ==
                                                  restaurantMealForm[index]?.[
                                                    mealInd
                                                  ]?.RestaurantId
                                              )?.Name ||
                                              restaurantMealForm[index]?.[
                                                mealInd
                                              ]?.RestaurantId,
                                          }
                                        : { value: "", label: "Select" }
                                    }
                                    onChange={(option) =>
                                      handleRestaurantMealForm(
                                        {
                                          target: {
                                            name: "RestaurantId",
                                            value: option?.value || "",
                                          },
                                        },
                                        originalIndex,
                                        mealInd
                                      )
                                    }
                                    styles={customStyles}
                                    isSearchable
                                    className="customSelectLightTheame"
                                    classNamePrefix="custom"
                                    placeholder="Select Restaurant"
                                    filterOption={(option, inputValue) =>
                                      option.label
                                        .toLowerCase()
                                        .startsWith(inputValue.toLowerCase())
                                    }
                                  />
                                </td>
                              )}
                              <td>
                                <input
                                  type="number"
                                  name="Amount"
                                  className="formControl1"
                                  value={
                                    restaurantMealForm[index]?.[mealInd]?.Amount
                                  }
                                  onChange={(e) =>
                                    handleRestaurantMealForm(
                                      e,
                                      originalIndex,
                                      mealInd
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <div className="form-check check-sm d-flex align-items-center justify-content-center">
                                  <input
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    id="no_of_activity"
                                    name="Supplement"
                                    checked={
                                      restaurantMealForm[index]?.[mealInd]
                                        ?.Supplement == "Yes"
                                    }
                                    onChange={(e) =>
                                      handleRestaurantMealForm(
                                        e,
                                        originalIndex,
                                        mealInd
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            </Fragment>
                          ))}
                          <td>
                            <div>
                              <select
                                name="Supplier"
                                id=""
                                className="formControl1"
                                onChange={(e) =>
                                  handleRestaurantFormChange(originalIndex, e)
                                }
                                value={
                                  restaurantFormValue[originalIndex]?.Supplier
                                }
                              >
                                <option value="">Select</option>
                                {restaurantSupplierList[index]?.map(
                                  (supplier, index) => (
                                    <option
                                      value={supplier?.id}
                                      key={index + 1}
                                    >
                                      {supplier?.Name}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div className="custom-timepicker">
                              {/*<DarkCustomTimePicker
                                name="StartTime"
                                onChange={(e) =>
                                  handleRestaurantFormChange(originalIndex, e)
                                }
                                value={
                                  restaurantFormValue[originalIndex]?.StartTime
                                }
                              />*/}
                              <input
                                type="text"
                                placeholder="00:00"
                                id=""
                                className="formControl1 width50px"
                                name="StartTime"
                                onChange={(e) =>
                                  handleRestaurantFormChange(originalIndex, e)
                                }
                                value={
                                  restaurantFormValue[originalIndex]?.StartTime
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <DarkCustomTimePicker
                                name="EndTime"
                                onChange={(e) =>
                                  handleRestaurantFormChange(originalIndex, e)
                                }
                                value={
                                  restaurantFormValue[originalIndex]?.EndTime
                                }
                              />
                              {/*<input
                                type="time"
                                id=""
                                name="EndTime"
                                onChange={(e) =>
                                  handleRestaurantFormChange(originalIndex, e)
                                }
                                value={
                                  restaurantFormValue[originalIndex]?.EndTime
                                }
                                className="formControl1 width50px"
                              />*/}
                            </div>
                          </td>
                        </tr>
                      ))}
                    <tr className="costing-td">
                      <td
                        colSpan={Type == "Local" || Type == "Foreigner" ? 3 : 2}
                        rowSpan={3}
                        className="text-center fs-6"
                      >
                        Total
                      </td>
                      <td colSpan={2}>Restaurant Cost</td>
                      <td>
                        {mathRoundHelper(supplementRate?.Price?.Breakfast)}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{mathRoundHelper(supplementRate?.Price?.Lunch)}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{mathRoundHelper(supplementRate?.Price?.Dinner)}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>Markup(5) %</td>
                      <td>
                        {mathRoundHelper(
                          supplementRate?.MarkupOfCost?.Breakfast
                        )}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {mathRoundHelper(supplementRate?.MarkupOfCost?.Lunch)}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {mathRoundHelper(supplementRate?.MarkupOfCost?.Dinner)}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>Total</td>
                      <td>
                        {mathRoundHelper(
                          supplementRate?.Price?.Breakfast +
                            supplementRate?.MarkupOfCost?.Breakfast
                        )}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {mathRoundHelper(
                          supplementRate?.Price?.Lunch +
                            supplementRate?.MarkupOfCost?.Lunch
                        )}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {mathRoundHelper(
                          supplementRate?.Price?.Dinner +
                            supplementRate?.MarkupOfCost?.Dinner
                        )}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </PerfectScrollbar>
            </div>
          </>
        )}
      </div>
      {restaurantCopy && (
        <div className="row mt-3 m-0">
          <div
            className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg foreignerEscort-head-bg"
            onClick={() => setIsOpen({ ...isOpen, copy: !isOpen?.copy })}
          >
            <div className="d-flex gap-4 align-items-center">
              <div className="d-flex gap-2">
                <img src={RestauarantIcon} alt="RestauarantIcon" />
                <label htmlFor="" className="fs-5">
                  Restaurant
                </label>
              </div>
              <div
                className="d-flex gap-2 align-items-center hike-input"
                onClick={(e) => e.stopPropagation()}
              >
                <label htmlFor="" className="fs-6">
                  Hike
                </label>
                <input
                  type="number"
                  className={`formControl3`}
                  value={hikePercent}
                  onChange={handleHikeChange}
                />
                <span className="fs-6">%</span>
              </div>
            </div>
            <div
              className="d-flex gap-4 align-items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {Type == "Main" && (
                <div
                  className="hike-input d-flex align-items-center cursor-pointer"
                  id="copy_transport"
                  name="copy_transport_form"
                  onClick={() => setIsAlternate(false)}
                >
                  <label
                    className="fontSize11px cursor-pointer"
                    htmlFor="copy_transport"
                  >
                    <FaMinus className="m-0 p-0" /> Alternate
                  </label>
                </div>
              )}
              <span className="cursor-pointer fs-5">
                {!isOpen.copy ? (
                  <FaChevronCircleUp
                    className="text-primary"
                    onClick={() =>
                      setIsOpen({ ...isOpen, copy: !isOpen?.copy })
                    }
                  />
                ) : (
                  <FaChevronCircleDown
                    className="text-primary"
                    onClick={() =>
                      setIsOpen({ ...isOpen, copy: !isOpen?.copy })
                    }
                  />
                )}
              </span>
            </div>
          </div>
          {isOpen?.copy && (
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar>
                <table className="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th
                        className="text-center days-width-9 align-middle"
                        rowSpan={2}
                      >
                        {restaurantFormValue[0]?.Date ? "Day / Date" : "Day"}
                      </th>
                      {(Type == "Local" || Type == "Foreigner") && (
                        <th rowSpan={2} className="py-1 align-middle">
                          Escort
                        </th>
                      )}
                      <th rowSpan={2} className="align-middle">
                        Destination
                      </th>
                      {restaurantMealForm[0]?.map((meal, index) => (
                        <th colSpan={4} key={index}>
                          <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id={meal?.MealType + index}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setCheckSupplement((prevData) =>
                                  isChecked
                                    ? [...prevData, meal?.MealType]
                                    : prevData.filter(
                                        (data) => data !== meal?.MealType
                                      )
                                );
                              }}
                            />
                            <label
                              htmlFor={meal?.MealType + index}
                              className="mt-1"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {meal?.MealType}
                            </label>
                          </div>
                        </th>
                      ))}
                      <th rowSpan={2} className="align-middle">
                        Supplier
                      </th>
                      <th rowSpan={2} className="align-middle">
                        Start Time
                      </th>
                      <th rowSpan={2} className="align-middle">
                        End Time
                      </th>
                    </tr>
                    <tr>
                      {restaurantMealForm[0]?.map((meal, index) => (
                        <Fragment key={index + 1}>
                          <th>
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-top">
                                  If Check Hotel
                                </Tooltip>
                              }
                            >
                              <span>H</span>
                            </OverlayTrigger>
                          </th>
                          <th>Hotel/Restaurant</th>
                          <th>Price</th>
                          <th>
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-top">Supplier</Tooltip>
                              }
                            >
                              <span>S</span>
                            </OverlayTrigger>
                          </th>
                        </Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {restaurantFormValue
                      ?.map((form, index) => ({
                        item: form,
                        originalIndex: index,
                      }))
                      ?.filter(({ item }) => item?.ServiceMainType == "Yes")
                      ?.map(({ item, originalIndex }, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex gap-1 justify-content-start">
                              <div className="d-flex gap-1">
                                <div
                                  className="d-flex align-items-center pax-icon"
                                  onClick={() =>
                                    handlePaxModalClick(originalIndex)
                                  }
                                >
                                  <i className="fa-solid fa-person"></i>
                                </div>
                                <span
                                  onClick={() =>
                                    handleTableIncrement(originalIndex)
                                  }
                                >
                                  <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                </span>
                                <span
                                  onClick={() =>
                                    handleTableDecrement(originalIndex)
                                  }
                                >
                                  <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                </span>
                              </div>
                              {item?.Date ? (
                                <span
                                  style={{
                                    textWrap: "nowrap",
                                    marginRight: "5px",
                                  }}
                                >
                                  <div className="d-flex gap-2">
                                    <div>{`Day ${item?.DayNo}`}</div>
                                    <div>{`${moment(item?.Date).format(
                                      "DD-MM-YYYY"
                                    )}`}</div>
                                  </div>
                                </span>
                              ) : (
                                <span>{`Day ${item?.DayNo}`}</span>
                              )}
                            </div>
                          </td>
                          {(Type == "Local" || Type == "Foreigner") && (
                            <td style={{ width: "30px" }}>
                              <div>
                                <input
                                  name="Escort"
                                  type="number"
                                  style={{ width: "30px" }}
                                  className={`formControl1`}
                                  value={
                                    restaurantFormValue[originalIndex]?.Escort
                                  }
                                  onChange={(e) =>
                                    handleRestaurantFormChange(originalIndex, e)
                                  }
                                />
                              </div>
                            </td>
                          )}
                          <td>
                            <div>
                              <select
                                name="Destination"
                                id=""
                                className="formControl1"
                                value={
                                  restaurantFormValue[originalIndex]
                                    ?.Destination
                                }
                                onChange={(e) =>
                                  handleRestaurantFormChange(originalIndex, e)
                                }
                              >
                                <option value="">Select</option>
                                {qoutationDataLocal?.Days?.map(
                                  (qout, index) => (
                                    <option
                                      value={qout?.DestinationId}
                                      key={index + 1}
                                    >
                                      {qout?.DestinationName}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </td>
                          {restaurantMealForm[0]?.map((meal, mealInd) => (
                            <Fragment key={index + mealInd}>
                              <td>
                                <div className="form-check check-sm d-flex align-items-center justify-content-center">
                                  <input
                                    name="IsHotel"
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    id="no_of_activity"
                                    checked={
                                      restaurantMealForm[index][mealInd]
                                        ?.IsHotel == "Yes"
                                    }
                                    onChange={(e) =>
                                      handleRestaurantMealForm(
                                        e,
                                        originalIndex,
                                        mealInd
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="HotelName"
                                  value={
                                    restaurantMealForm[index][mealInd]
                                      ?.HotelName
                                  }
                                  onChange={(e) =>
                                    handleRestaurantMealForm(
                                      e,
                                      originalIndex,
                                      mealInd
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  name="Amount"
                                  className="formControl1"
                                  value={
                                    restaurantMealForm[index][mealInd]?.Amount
                                  }
                                  onChange={(e) =>
                                    handleRestaurantMealForm(
                                      e,
                                      originalIndex,
                                      mealInd
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <div className="form-check check-sm d-flex align-items-center justify-content-center">
                                  <input
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    id="no_of_activity"
                                    name="Supplement"
                                    checked={
                                      restaurantMealForm[index][mealInd]
                                        ?.Supplement == "Yes"
                                    }
                                    onChange={(e) =>
                                      handleRestaurantMealForm(
                                        e,
                                        originalIndex,
                                        mealInd
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            </Fragment>
                          ))}
                          <td>
                            <div>
                              <select
                                name="Supplier"
                                id=""
                                className="formControl1"
                                onChange={(e) =>
                                  handleRestaurantFormChange(originalIndex, e)
                                }
                                value={
                                  restaurantFormValue[originalIndex]?.Supplier
                                }
                              >
                                <option value="">Select</option>
                                {restaurantSupplierList[index]?.map(
                                  (supplier, index) => (
                                    <option
                                      value={supplier?.id}
                                      key={index + 1}
                                    >
                                      {supplier?.Name}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div className="custom-timepicker">
                              <input
                                type="time"
                                id=""
                                className="formControl1 width50px"
                                name="StartTime"
                                onChange={(e) =>
                                  handleRestaurantFormChange(originalIndex, e)
                                }
                                value={
                                  restaurantFormValue[originalIndex]?.StartTime
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <input
                                type="time"
                                id=""
                                name="EndTime"
                                onChange={(e) =>
                                  handleRestaurantFormChange(originalIndex, e)
                                }
                                value={
                                  restaurantFormValue[originalIndex]?.EndTime
                                }
                                className="formControl1 width50px"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    <tr className="costing-td">
                      <td
                        colSpan={Type == "Local" || Type == "Foreigner" ? 3 : 2}
                        rowSpan={3}
                        className="text-center fs-6"
                      >
                        Total
                      </td>
                      <td colSpan={2}>Restaurant Cost</td>
                      <td>
                        {mathRoundHelper(supplementRate?.Price?.Breakfast)}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{mathRoundHelper(supplementRate?.Price?.Lunch)}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{mathRoundHelper(supplementRate?.Price?.Dinner)}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>Markup(5) %</td>
                      <td>
                        {mathRoundHelper(
                          supplementRate?.MarkupOfCost?.Breakfast
                        )}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {mathRoundHelper(supplementRate?.MarkupOfCost?.Lunch)}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {mathRoundHelper(supplementRate?.MarkupOfCost?.Dinner)}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>Total</td>
                      <td>
                        {mathRoundHelper(
                          supplementRate?.Price?.Breakfast +
                            supplementRate?.MarkupOfCost?.Breakfast
                        )}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {mathRoundHelper(
                          supplementRate?.Price?.Lunch +
                            supplementRate?.MarkupOfCost?.Lunch
                        )}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {mathRoundHelper(
                          supplementRate?.Price?.Dinner +
                            supplementRate?.MarkupOfCost?.Dinner
                        )}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </PerfectScrollbar>
            </div>
          )}
        </div>
      )}
      {isOpen?.original && (
        <div className="row mt-3">
          <div className="col-12 d-flex justify-content-end align-items-end">
            <button
              className="btn btn-primary py-1 px-2 radius-4"
              onClick={handleFinalSave}
            >
              <i className="fa-solid fa-floppy-disk fs-4"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ForeignerResturant);
