import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
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
import { quotationData } from "../../qoutation-first/quotationdata";
import {
  setItineraryCopyRestaurantFormData,
  setItineraryCopyRestaurantFormDataCheckbox,
} from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import moment from "moment";
import IsDataLoading from "../IsDataLoading";
import mathRoundHelper from "../../helper-methods/math.round";

const Restaurant = ({ Type, headerDropdown, TabId }) => {
  const { queryData } = useSelector((data) => data?.queryReducer);
  const [copyChecked, setCopyChecked] = useState(false);
  const [originalRestaurantForm, setOriginalRestaurantForm] = useState([]);
  const [restaurantFormValue, setRestaurantFormValue] = useState([]);
  const [restaurantSupplierList, setRestaurantSupplierList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { restaurantFormData, restaurantMealData, hotelServiceData } =
    useSelector((data) => data?.itineraryReducer);
  // console.log(hotelServiceData,"hotelServiceData11");

  //  const { } = useSelector(
  //   (data) => data?.itineraryReducer
  // );
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
  const [hikePercent, setHikePercent] = useState(" ");
  const [restaurantCopy, setRestaurantCopy] = useState(false);
  const { RestaurantService } = useSelector(
    (data) => data?.ItineraryServiceReducer
  );
  const { itineraryHotelValue } = useSelector((data) => data?.queryReducer);
  // console.log(restaurantFormValue, "vvvvv333xxxx");
  const [restaurantMealForm, setRestaurantMealForm] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [checkSupplement, setCheckSupplement] = useState([]);
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const [originalRestaurantMealForm, setOriginalRestaurantMealForm] = useState(
    []
  );
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

  const { OptionQoutationData } = useSelector(
    (data) => data?.activeTabOperationReducer
  );

  const [dataIsLoaded, setDataIsLoaded] = useState(true);
  const apiDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.restaurant
  );
  // state to markup data
  const [markupArray, setMarkupArray] = useState({
    Markup: { Data: [] },
  });
  // console.log(markupArray, "markupArray111");
  const RestaurantData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Restaurant"
  );
  // console.log(RestaurantData, "RestaurantData")

  const postDataToServer = async () => {
    try {
      setIsDataLoading(true);
      try {
        const { data } = await axiosOther.post("destinationlist");
        setDestinationList(data?.DataList);
      } catch (error) {
        console.log("error", error);
      }
      // try {
      //   const { data } = await axiosOther.post("hotellist");
      //   setHotelList(data?.DataList);
      // } catch (error) {
      //   console.log("error", error);
      // }

      // Call markupvalue to  api
      try {
        let CompanyUniqueId = JSON.parse(
          localStorage.getItem("token")
        )?.companyKey;
        const { data } = await axiosOther.post("listCompanySetting", {
          id: "",
          CompanyId: CompanyUniqueId,
        });
        const rawData = data?.DataList?.[0]?.Value || [];
        const transformedData = rawData.map((item) => ({
          Type: item.ProductName,
          Markup: item.MarkupType,
          Value: item.MarkupValue,
        }));

        setMarkupArray({
          Markup: {
            MarkupType: "Service Wise",
            Data: transformedData,
          },
        });
      } catch (error) {
        console.error(error);
      }
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);

  useEffect(() => {
    if (OptionQoutationData?.Days) {
      const hasMonumentService = OptionQoutationData?.Days.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType === "Restaurant")
      );

      if (hasMonumentService) {
        const initialFormValue = OptionQoutationData?.Days?.map((day) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType == "Restaurant"
          )[0];
          // console.log(service, "serviceservice");

          const { ItemUnitCost, ItemSupplierDetail, TimingDetails } =
            service != undefined ? service?.ServiceDetails.flat(1)[0] : "";

          return {
            id: queryData?.QueryId || "",
            QuatationNo: OptionQoutationData?.QuotationNumber || "",
            DayType: Type || "",
            OptionId: TabId,
            DayNo: day.Day || "",
            Date: day?.Date || "",
            Destination: day?.DestinationId || "",
            // DestinationUniqueId: day?.DestinationUniqueId || "",
            // Escort: 1 || 0,
            DayUniqueId: day?.DayUniqueId,
            // ServiceId: service?.ServiceId || "",
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
              Adults: OptionQoutationData?.Pax?.AdultCount || 0,
              Child: OptionQoutationData?.Pax?.ChildCount || 0,
              Infant: OptionQoutationData?.Pax?.Infant || 0,
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

        const restaurantMeal = OptionQoutationData?.Days?.map((day, index) => {
          const service = day?.DayServices?.find(
            (s) => s?.ServiceType === "Restaurant"
          );

          if (!service) return [];

          const mealPlan =
            service?.ServiceDetails?.[0]?.MealPlan?.map((meal) => {
              const isHotel = service?.ServiceType === "Hotel";
              const serviceId =
                service?.ServiceId ||
                service?.HotelId ||
                service?.RestaurantId ||
                "";
              const restaurantId = !isHotel ? serviceId : "";
              const hotelId = isHotel ? serviceId : "";
              const serviceType = isHotel ? "Hotel" : "Restaurant";
              // console.log(meal, "meall");

              return {
                ...meal,
                MealType: meal.MealType,
                ServiceID: serviceId,
                ServiceType: serviceType,
                RestaurantId:
                  service?.ServiceType !== "Hotel" ? meal?.ServiceID : "",
                HotelId: meal?.ServiceType === "Hotel" ? meal?.ServiceID : "",
                IsHotel: meal?.ServiceType === "Hotel" ? "Yes" : "No",
                Supplement: meal.Supplement,
                Amount: meal.Amount,
                // IsMealType: meal.Supplement === "Yes" ? "Yes" : "No",
              };
            }) || [];

          return mealPlan;
        });
        const initialCheckedMeals = [];
        restaurantMeal.forEach((dayMeals, dayIndex) => {
          dayMeals.forEach((meal) => {
            if (
              meal.IsMealType === "Yes" &&
              !initialCheckedMeals.includes(meal.MealType)
            ) {
              initialCheckedMeals.push(meal.MealType);
            }
          });
        });

        setCheckSupplement(initialCheckedMeals);
        setRestaurantMealForm(restaurantMeal);
        setOriginalRestaurantMealForm(restaurantMeal);
        // dispatch(setRestaurantServiceForm(restaurantInitialValue));
        setRestaurantFormValue(initialFormValue);
        setOriginalRestaurantForm(initialFormValue);
      } else {
        const restaurantInitialValue = OptionQoutationData?.Days?.map(
          (day, ind) => {
            return {
              ...itineraryRestaurantInitialValue,
              id: queryData?.QueryId,
              DayNo: day.Day,
              Date: day?.Date,
              OptionId: TabId,
              DayType: Type,
              Destination: day.DestinationId || "",
              // DestinationUniqueId: day?.DestinationUniqueId,
              QuatationNo: OptionQoutationData?.QuotationNumber,
              DayUniqueId: day?.DayUniqueId,
              ItemFromDate: OptionQoutationData?.TourSummary?.FromDate,
              ServiceMainType: "No",
              ItemToDate: OptionQoutationData?.TourSummary?.ToDate,
              RateUniqueId: "",
              PaxInfo: {
                Adults: OptionQoutationData?.Pax?.AdultCount,
                Child: OptionQoutationData?.Pax?.ChildCount,
                Infant: OptionQoutationData?.Pax?.Infant,
                Infant: "",
                Escort: "",
              },
            };
          }
        );

        const restaurantMeal = OptionQoutationData?.Days?.map((day, index) => {
          return restaurantMealInitial;
        });
        const initialCheckedMeals = [];
        restaurantMeal.forEach((dayMeals, dayIndex) => {
          dayMeals.forEach((meal) => {
            if (
              meal.IsMealType === "Yes" &&
              !initialCheckedMeals.includes(meal.MealType)
            ) {
              initialCheckedMeals.push(meal.MealType);
            }
          });
        });
        console.log(restaurantMeal, "restaurantMeal84747");
        setCheckSupplement(initialCheckedMeals);
        setRestaurantMealForm(restaurantMeal);
        setOriginalRestaurantMealForm(restaurantMeal);
        setRestaurantFormValue(restaurantInitialValue);
        setOriginalRestaurantForm(restaurantInitialValue);
        // dispatch(setRestaurantServiceForm(restaurantInitialValue));
      }
    }
  }, [OptionQoutationData, TabId]);

  console.log(restaurantMealForm, "restaurantMealForm8474");

  // set value into for it's first value from list

  const setFirstValueIntoForm = (index) => {
    // console.log(hotelServiceData?.serviceId," hotelServiceData1")
    // Get the first restaurant or hotel ID
    // const restaurantId =
    //   restaurantList[index]?.length > 0 ? restaurantList[index][0]?.Id : "";
    const serviceId = hotelServiceData[index]?.serviceId;

    const supplierId =
      restaurantSupplierList[index]?.length > 0
        ? restaurantSupplierList[index][0]?.id
        : "";

    const firstMealPlan = restaurantMealForm[index]?.map((meal) => ({
      ...meal,
      // RestaurantId:
      //   restaurantList[index]?.length > 0 ? restaurantList[index][0]?.Id : "",

      HotelId: serviceId || "",
      ServiceID:
        restaurantList[index]?.length > 0
          ? restaurantList[index][0]?.Id
          : "" || hotelList[index]?.length > 0
            ? hotelList[index][0]?.id
            : "",
      //
    }));

    setRestaurantFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: " ",
        Supplier: supplierId,
      };
      return newArr;
    });

    setOriginalRestaurantForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: " ",
        Supplier: supplierId,
      };
      return newArr;
    });

    setRestaurantMealForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = firstMealPlan;
      return newArr;
    });
    setOriginalRestaurantMealForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = firstMealPlan;
      return newArr;
    });
  };
  // useEffect(() => {
  //   if (!isItineraryEditing) {
  //     restaurantFormValue?.forEach((item, index) => {
  //       setFirstValueIntoForm(index);
  //     });
  //   }
  // }, [restaurantList, restaurantSupplierList]);

  useEffect(() => {
    // console.log("useEffect fired:");
    // console.log("Days:", OptionQoutationData?.Days);

    // OptionQoutationData?.Days?.forEach((day,i) => {
    //   // console.log(`Day ${i} DayServices:`, day.DayServices);
    // });

    const allDaysEmpty =
      Array.isArray(OptionQoutationData?.Days) &&
      OptionQoutationData.Days.every((day) => {
        if (!Array.isArray(day.DayServices)) return true;
        const resServices = day.DayServices.filter(
          (service) =>
            service.ServiceType === "Restaurant" &&
            service?.ServiceMainType == "Guest"
        );
        return resServices.length === 0;
      });

    if (allDaysEmpty) {
      restaurantFormValue?.forEach((form, index) => {
        // console.log(`Setting first value into form at index ${index}`);
        // setFirstValueIntoForm(index);
      });
    }
  }, [OptionQoutationData, restaurantList, restaurantSupplierList]);

  // getting supplier for restaurant list with and without dependently it's dependent on transport city
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
    // if (!apiDataLoad) return;
    restaurantFormValue?.forEach((item, index) => {
      getRestaurantSupplierList(index, item?.Destination);
    });
  }, [restaurantFormValue?.map((item) => item?.Destination)?.join(",")]);

  // useEffect(() => {
  //   if (Array.isArray(hotelServiceData)) {
  //     setRestaurantMealForm((prev) => {
  //       const updated = [...prev];

  //       hotelServiceData.forEach((hotel, index) => {
  //         if (Array.isArray(updated[index])) {
  //           updated[index] = [...updated[index]];

  //           updated[index] = updated[index].map((meal) => ({
  //             ...meal,
  //             HotelId: hotel.serviceId,
  //           }));
  //         }
  //       });

  //       return updated;
  //     });
  //     setOriginalRestaurantMealForm((prev) => {
  //       const updated = [...prev];

  //       hotelServiceData.forEach((hotel, index) => {
  //         if (Array.isArray(updated[index])) {
  //           updated[index] = [...updated[index]];

  //           updated[index] = updated[index].map((meal) => ({
  //             ...meal,
  //             HotelId: hotel.serviceId,
  //           }));
  //         }
  //       });

  //       return updated;
  //     });
  //   }
  // }, [JSON.stringify(hotelServiceData)]);

  const getHotelListDependently = async (city, hotelCategory, index) => {
    // console.log(city, hotelCategory, index,"checkreshotel")

    try {
      const { data } = await axiosOther.post("hotellist", {
        DestinationId: city,
        HotelCategoryId: hotelCategory,
        Default: "Yes",
      });

      setHotelList((prevList) => {
        const newList = [...prevList];
        newList[index] = data?.DataList || [];
        return newList;
      });

      // if (data?.DataList?.length > 0 && !isItineraryEditing) {
      //   setFirstValueIntoForm(index);
      // }
    } catch (error) {
      console.log("Error fetching hotel list:", error);
    }
  };

  useEffect(() => {
    // if (!apiDataLoad) return;
    restaurantFormValue.forEach((row, index) => {
      getHotelListDependently(row?.Destination, headerDropdown?.Hotel, index);
    });
  }, [
    restaurantFormValue.map((row) => row?.Destination).join(","),
    headerDropdown?.Hotel,
  ]);

  // handling restaurant dropdown value
  const handlingRestaurantDropdownValue = (index) => {
    const supplier =
      restaurantSupplierList[index] != undefined ||
        (restaurantSupplierList[index] != null &&
          restaurantSupplierList?.length > 0)
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

  // getting restauarnt list with and without dependencies of destination for restaurant table form
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
  }, [restaurantFormValue?.map((item) => item?.Destination).join(",")]);

  const handleTableIncrement = (index) => {
    const indexHotel = restaurantFormValue[index];
    // console.log(indexHotel, "indexHotel");
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
  };

  const handleTableDecrement = (index) => {
    const filteredTable = restaurantFormValue?.filter(
      (item, ind) => ind != index
    );
    setRestaurantFormValue(filteredTable);
    setOriginalRestaurantForm(filteredTable);
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

  const handleFinalSave = async (mealInd, index) => {
    try {
      const filteredMeal = restaurantMealForm?.map((mealForm) => {
        return mealForm?.map((form) => {
          const isHotel = form?.IsHotel === "Yes";
          return {
            ...form,
            IsMealType: "Yes",
            ServiceID: isHotel ? form?.HotelId : form?.RestaurantId,
            ServiceType: isHotel ? "Hotel" : "Restaurant",
          };
        });
      });

      const finalForm = restaurantFormValue?.map((form, index) => {
        const mealPlan = restaurantMealForm[index];
        const totalCostingMealPlan = ["Breakfast", "Lunch", "Dinner"].map(
          (mealType) => {
            const meal = mealPlan.find((m) => m.MealType === mealType);
            const serviceCost = mathRoundHelper(meal?.Amount || 0);
            const markupValue = mathRoundHelper(RestaurantData?.Value || 0); // chnage markup value to dynamice
            const markupTotalValue =
              mealType === "Breakfast"
                ? supplementRate?.MarkupOfCost?.Breakfast
                : mealType === "Lunch"
                  ? supplementRate?.MarkupOfCost?.Lunch
                  : supplementRate?.MarkupOfCost?.Dinner;
            const totalServiceCost =
              mealType === "Breakfast"
                ? supplementRate?.Price?.Breakfast +
                supplementRate?.MarkupOfCost?.Breakfast
                : mealType === "Lunch"
                  ? supplementRate?.Price?.Lunch +
                  supplementRate?.MarkupOfCost?.Lunch
                  : supplementRate?.Price?.Dinner +
                  supplementRate?.MarkupOfCost?.Dinner;

            return {
              MealType: mealType,
              ServiceCost: mathRoundHelper(serviceCost.toFixed(2)),
              MarkupValue: mathRoundHelper(markupValue.toFixed(2)),
              MarkupTotalValue: mathRoundHelper(markupTotalValue.toFixed(2)),
              TotalServiceCost: mathRoundHelper(totalServiceCost.toFixed(2)),
            };
          }
        );

        return {
          ...form,
          Hike: hikePercent,
          DayType: Type,
          MealPlan: filteredMeal[index],
          Sector: fromToDestinationList[index],
        };
      });

      const totalCost = finalForm.reduce((total, item) => {
        const adultCost = mathRoundHelper(item.AdultCost) || 0;
        const childCost = mathRoundHelper(item.ChildCost) || 0;
        return total + adultCost + childCost; // Sum up all costs
      }, 0);

      // dispatch(setTotalResturantPricePax(totalCost));

      const filteredFinalForm = finalForm
        ?.map((form) => {
          const validMeals = form?.MealPlan?.filter(
            (meal) =>
              // meal?.Amount !== "" &&
              meal?.HotelId !== "" || meal?.RestaurantId !== ""
          );

          if (validMeals?.length > 0) {
            // Clean each MealPlan item by removing specific keys
            const cleanedMealPlan = validMeals.map(
              ({ IsMealType, RestaurantId, HotelId, IsHotel, ...rest }) => ({
                ...rest,
                // Amount: mathRoundHelper(Amount)?.toString(),
              })
            );

            return {
              ...form,
              MealPlan: cleanedMealPlan,
              OptionId: TabId,
            };
          } else {
            return null;
          }
        })
        ?.filter((form) => form != null);

      console.log(filteredFinalForm, "filteredFinalForm");

      const { data } = await axiosOther.post(
        "update-multiple-quatation-restaurant",
        filteredFinalForm
      );
      if (data?.status == 1) {
        // notifySuccess("Services Added !");
        notifySuccess(data.message);
        // dispatch(setRestaurantPrice(totalPriceForPax()));
        // dispatch(setTogglePriceState());
        // dispatch(setQoutationResponseData(data?.data));
      }
    } catch (error) {
      console.log(error, "error");
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
        console.log(data, "error");
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0][1]);
        console.log(data, "error");
      }
    }
  };

  useEffect(() => {
    const costArr = restaurantFormValue?.map((restauarnt) => {
      if (restauarnt?.ServiceId !== "") {
        let arr = [restauarnt?.AdultCost, restauarnt?.ChildCost];

        arr = arr.map((value, index) => {
          if (
            value === null ||
            value === undefined ||
            value === "" ||
            isNaN(value)
          ) {
            arr[index] = 0;
          }
          if (typeof value === "string" && !isNaN(value)) {
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
    // const restaurantRate = costArr?.reduce((acc, curr) => acc + curr, 0);
  }, [
    restaurantFormValue
      ?.map((restauarnt) => restauarnt?.AdultCost + restauarnt?.ChildCost)
      ?.join(","),
    restaurantFormValue?.map((item) => item?.ServiceId).join(","),
  ]);

  // useEffect(() => {
  //   if (restaurantCopy) {
  //     if (isAlternate) {
  //       setRestaurantCopy(true);
  //       const supplementRestaurant = RestaurantService?.map((form) => ({
  //         ...form,
  //         ServiceMainType: "Yes",
  //       }));
  //       const newFormArr = [...restaurantFormValue, ...supplementRestaurant];
  //       const newMealForm = [...restaurantMealForm];
  //       // setRestaurantMealForm((prevArr) => {
  //       //   let newArr = [...prevArr];
  //       //   newArr = [...newArr, ...newMealForm];
  //       //   return newArr;
  //       // });
  //       // setRestaurantFormValue(newFormArr);
  //     } else {
  //       setRestaurantCopy(false);
  //       const removedCopiedForm = restaurantFormValue?.filter(
  //         (form, index) => form?.ServiceMainType == "No"
  //       );
  //       const filteredMeal = restaurantMealForm?.filter(
  //         (_, index) => index < removedCopiedForm.length
  //       );
  //       // setRestaurantFormValue(removedCopiedForm);
  //       // setRestaurantFormValue(filteredMeal);
  //     }
  //   }
  // }, [isAlternate]);

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

  // console.log(restaurantMealForm,"restaurantMealForm");

  const handleHikeChange = (e) => {
    const { value } = e.target;
    const hikeValue = parseFloat(value) || 0; // safe fallback
    setHikePercent(value); // store string for input binding

    const updatedData = originalRestaurantMealForm?.map((form) => {
      return form?.map((item) => {
        const baseAmount = parseFloat(item?.Amount);
        return {
          ...item,
          Amount: !isNaN(baseAmount)
            ? Math.floor(baseAmount + (baseAmount * hikeValue) / 100)
            : item?.Amount,
        };
      });
    });

    setRestaurantMealForm(updatedData); // <== This line was incomplete in your code
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
        Adult: (totalAdultPrice * RestaurantData?.Value) / 100 || 0, // Change Markup value dynamice
        Child: (totalChildPrice * RestaurantData?.Value) / 100 || 0, // Change Markup value dynamice
      },
    }));
  }, [
    restaurantFormValue?.map((item) => item?.AdultCost).join(","),
    restaurantFormValue?.map((item) => item?.ChildCost).join(","),
    restaurantFormValue?.map((item) => item?.ServiceId).join(","),
    hikePercent,
    RestaurantData?.Value, // Add dependency to react to markup changes
  ]);

  useEffect(() => {
    const mealTotals = { Breakfast: 0, Lunch: 0, Dinner: 0 };
    const mealMarkup = { Breakfast: 0, Lunch: 0, Dinner: 0 };

    const filteredMeal = restaurantMealForm?.map((mealArr) => {
      return mealArr
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
          mealMarkup[meal?.MealType] +=
            Number(meal?.Amount * RestaurantData?.Value) / 100 || 0; // Change Markup value dynamice
        }
      });
    });
    setSupplementRate({
      ...supplementRate,
      Price: mealTotals,
      MarkupOfCost: mealMarkup,
    });
  }, [restaurantMealForm, RestaurantData?.Value]); // Add dependency to react to markup changes

  const handleRestaurantMealForm = (e, index, mealInd) => {
    const { checked, name, type, value } = e.target;
    // console.log(name, "name");

    setRestaurantMealForm((prevArr) => {
      const newArr = prevArr.map((innerArray) =>
        innerArray.map((item) => ({ ...item }))
      );

      if (name === "IsMealType") {
        newArr[index][mealInd] = {
          ...newArr[index][mealInd],
          IsMealType: checked ? "Yes" : "No",
        };
      } else {
        newArr[index][mealInd] = {
          ...newArr[index][mealInd],
          [name]: type === "checkbox" ? (checked ? "Yes" : "No") : value,
        };
      }
      return newArr;
    });
    if (name === "Amount") {
      setOriginalRestaurantMealForm((prevArr) => {
        const newArr = prevArr.map((innerArray) =>
          innerArray.map((item) => ({ ...item }))
        );
        newArr[index][mealInd] = {
          ...newArr[index][mealInd],
          Amount: value, // Update the original Amount with the new value
        };
        return newArr;
      });
    }

    const { ServiceId } = itineraryHotelValue?.HotelForm[index];
    const { HotelName } = hotelList?.find((hotel) => hotel?.id == ServiceId);

    if (name == "IsHotel") {
      setRestaurantMealForm((prevArr) => {
        const newArr = prevArr.map((innerArray) =>
          innerArray.map((item) => ({ ...item }))
        );
        newArr[index][mealInd] = {
          ...newArr[index][mealInd],
          HotelName: checked ? HotelName : "",
        };
        return newArr;
      });
      setOriginalRestaurantMealForm((prevArr) => {
        const newArr = prevArr.map((innerArray) =>
          innerArray.map((item) => ({ ...item }))
        );
        newArr[index][mealInd] = {
          ...newArr[index][mealInd],
          HotelName: checked ? HotelName : "",
        };
        return newArr;
      });
    }
  };

  // calculating from destination & to destination
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
    // if (dataIsLoaded) {
    //   dispatch({
    //     type: "SET_RESTAURANT_DATA_LOAD",
    //     payload: true,
    //   });
    //   setDataIsLoaded(false);
    // }

    setIsOpen({ ...isOpen, original: !isOpen?.original });
  };

  // useEffect(() => {
  //   return () => {
  //     dispatch({
  //       type: "SET_RESTAURANT_DATA_LOAD",
  //       payload: false,
  //     });
  //   };
  // }, []);

  // ======================================================

  // storing guide form into redux store
  // useEffect(() => {
  //   if (Type == "Main") {
  //     dispatch(setItineraryRestaurantData(restaurantFormValue));
  //     dispatch(setItineraryRestaurantMealData(restaurantMealForm));
  //   }
  // }, [restaurantMealForm, restaurantFormValue]);

  // useEffect(() => {
  //   if (Type !== "Main" && restaurantMealForm?.length > 0) {
  //     if (copyChecked) {
  //       setRestaurantMealForm(restaurantMealData);
  //       setRestaurantFormValue(restaurantFormData);
  //     }
  //   }
  // }, [copyChecked]);

  // // Copy logic for local and foringer
  // const restaurantCheckbox = useSelector(
  //   (state) => state.itineraryServiceCopyReducer.restaurantCheckbox
  // );

  // useEffect(() => {
  //   if (restaurantCheckbox) {
  //     dispatch(
  //       setItineraryCopyRestaurantFormData({
  //         RestaurantForm: restaurantFormValue,
  //         MealForm: restaurantMealForm,
  //       })
  //     );
  //   }
  // }, [restaurantFormValue, restaurantMealForm]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(setItineraryCopyRestaurantFormDataCheckbox(true));
  //   };
  // }, []);

  return (
    <>
      <div className="row mt-3 m-0">
        <div
          className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
          onClick={handleIsOpen}
        >
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex gap-2">
              <img src={RestauarantIcon} alt="RestauarantIcon" />
              <label htmlFor="" className="fs-5">
                Restaurant
              </label>
            </div>
            {Type !== "Main" && (
              <div
                className="d-flex gap-1 form-check"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  className="form-check-input check-md"
                  id="copy-guide"
                  checked={copyChecked}
                  onChange={(e) => setCopyChecked(e.target.checked)}
                />
                <label className="fontSize11px m-0 ms-1" htmlFor="copy-guide">
                  Copy
                </label>
              </div>
            )}
          </div>
          <div className="d-flex gap-4 align-items-center ms-auto">
            {" "}
            {/* Added ms-auto */}
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
        {isOpen?.original &&
          (isDataLoading ? (
            <IsDataLoading />
          ) : (
            <>
              <div className="col-12 px-0 mt-2">
                <PerfectScrollbar>
                  <table class="table table-bordered itinerary-table">
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
                          restaurantMealForm[0].map((meal, index) => (
                            <th colSpan={4} key={index}>
                              <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                                <input
                                  type="checkbox"
                                  className="form-check-input height-em-1 width-em-1"
                                  id={`mealType-${meal?.MealType}-${index}`}
                                  checked={meal?.IsMealType === "Yes"}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;

                                    // Update IsMealType in the state
                                    setRestaurantMealForm((prevArr) => {
                                      const newArr = prevArr.map((section) => {
                                        const updatedSection = [...section];

                                        if (updatedSection[index]) {
                                          updatedSection[index] = {
                                            ...updatedSection[index],
                                            Supplement: isChecked
                                              ? "Yes"
                                              : "No",
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

                                    // Update checkSupplement state
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

                        {/* <th rowSpan={2} className="align-middle">
                        Restaurantaaaaaaaaaaaaaaaaa
                      </th> */}
                        <th rowSpan={2} className="align-middle">
                          Supplier
                        </th>
                        {/* <th rowSpan={2} className="align-middle">
                        Adult Cost
                      </th>
                      <th rowSpan={2} className="align-middle">
                        Child Cost
                      </th> */}
                        <th rowSpan={2} className="align-middle">
                          Start Time
                        </th>
                        <th rowSpan={2} className="align-middle">
                          End Time
                        </th>
                      </tr>
                      <tr>
                        {restaurantMealForm[0]?.map((meal, index) => {
                          return (
                            <Fragment key={index + 1}>
                              <th>H</th>
                              <th>Hotel/Restaurant</th>
                              <th>Price</th>
                              <th>S</th>
                            </Fragment>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {restaurantFormValue
                        ?.map((form, index) => ({
                          item: form,
                          originalIndex: index,
                        }))
                        ?.filter(({ item }) => item?.ServiceMainType === "No")
                        ?.map(({ item, originalIndex }, index) => {
                          return (
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
                                      <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                    </span>
                                  </div>
                                  {item?.Date ? (
                                    <span
                                      style={{
                                        textWrap: "nowrap",
                                        marginRight: "5px",
                                      }}
                                    >
                                      {" "}
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
                                        restaurantFormValue[originalIndex]
                                          ?.Escort
                                      }
                                      onChange={(e) =>
                                        handleRestaurantFormChange(
                                          originalIndex,
                                          e
                                        )
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
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    {OptionQoutationData?.Days?.map(
                                      (qout, index) => {
                                        return (
                                          <option
                                            value={qout?.DestinationId}
                                            key={index + 1}
                                          >
                                            {qout?.DestinationName}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </td>
                              {restaurantMealForm[0]?.map((meal, mealInd) => {
                                return (
                                  <Fragment key={index + mealInd}>
                                    <td>
                                      <div className="form-check check-sm  d-flex align-items-center justify-content-center">
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
                                    {restaurantMealForm[index]?.[mealInd]
                                      ?.IsHotel == "Yes" ? (
                                      <td>
                                        <select
                                          name="HotelId"
                                          id=""
                                          className="formControl1"
                                          onChange={(e) =>
                                            handleRestaurantMealForm(
                                              e,
                                              originalIndex,
                                              mealInd
                                            )
                                          }
                                          value={
                                            restaurantMealForm[index]?.[mealInd]
                                              ?.HotelId
                                          }
                                        >
                                          <option value="">Select</option>
                                          {hotelList[index]?.map(
                                            (hotel, index) => {
                                              return (
                                                <option
                                                  value={hotel?.id}
                                                  key={index + 1}
                                                >
                                                  {hotel?.HotelName}
                                                </option>
                                              );
                                            }
                                          )}
                                        </select>
                                      </td>
                                    ) : (
                                      <td>
                                        <select
                                          name="RestaurantId"
                                          id=""
                                          className="formControl1"
                                          onChange={(e) =>
                                            handleRestaurantMealForm(
                                              e,
                                              originalIndex,
                                              mealInd
                                            )
                                          }
                                          value={
                                            restaurantMealForm[index]?.[mealInd]
                                              ?.RestaurantId
                                          }
                                        >
                                          <option value="">Select</option>
                                          {restaurantList[index]?.map(
                                            (rest, index) => {
                                              return (
                                                <option
                                                  value={rest?.Id}
                                                  key={index + 1}
                                                >
                                                  {rest?.Name}
                                                </option>
                                              );
                                            }
                                          )}
                                        </select>
                                      </td>
                                    )}

                                    <td>
                                      <input
                                        type="number"
                                        name="Amount"
                                        className="formControl1"
                                        value={
                                          restaurantMealForm[index]?.[mealInd]
                                            ?.Amount
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
                                      <div className="form-check check-sm  d-flex align-items-center justify-content-center">
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
                                );
                              })}
                              {/* <td>
                              <div>
                                <select
                                  name="ServiceId"
                                  id=""
                                  className="formControl1"
                                  onChange={(e) =>
                                    handleRestaurantFormChange(originalIndex, e)
                                  }
                                  value={
                                    restaurantFormValue[originalIndex]
                                      ?.ServiceId
                                  }
                                >
                                  <option value="">Select</option>
                                  {restaurantList[index]?.map((rest, index) => {
                                    return (
                                      <option value={rest?.Id} key={index + 1}>
                                        {rest?.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </td> */}
                              <td>
                                <div>
                                  <select
                                    name="Supplier"
                                    id=""
                                    className="formControl1"
                                    onChange={(e) =>
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                    value={
                                      restaurantFormValue[originalIndex]
                                        ?.Supplier
                                    }
                                  >
                                    <option value="">Select</option>
                                    {restaurantSupplierList[index]?.map(
                                      (supplier, index) => {
                                        return (
                                          <option
                                            value={supplier?.id}
                                            key={index + 1}
                                          >
                                            {supplier?.Name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </td>
                              {/* <td>
                              <div>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="AdultCost"
                                  onChange={(e) =>
                                    handleRestaurantFormChange(originalIndex, e)
                                  }
                                  value={
                                    restaurantFormValue[originalIndex]
                                      ?.AdultCost
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div>
                                <input
                                  type="text"
                                  className="formControl1"
                                  name="ChildCost"
                                  onChange={(e) =>
                                    handleRestaurantFormChange(originalIndex, e)
                                  }
                                  value={
                                    restaurantFormValue[originalIndex]
                                      ?.ChildCost
                                  }
                                />
                              </div>
                            </td> */}
                              <td>
                                <div className="custom-timepicker">
                                  <input
                                    type="time"
                                    id=""
                                    className="formControl1 "
                                    name="StartTime"
                                    onChange={(e) =>
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                    value={
                                      restaurantFormValue[originalIndex]
                                        ?.StartTime
                                    }
                                  />
                                  {/* <TimePicker  value="10:10" /> */}
                                  {/* <TimePickerComponent placeholder="Select a time"/> */}
                                </div>
                              </td>
                              <td>
                                <div>
                                  <input
                                    type="time"
                                    id=""
                                    name="EndTime"
                                    onChange={(e) =>
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                    value={
                                      restaurantFormValue[originalIndex]
                                        ?.EndTime
                                    }
                                    className="formControl1 "
                                  />
                                  {/* <TimePicker  value="10:10" /> */}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      <tr className="costing-td">
                        <td
                          colSpan={
                            Type == "Local" || Type == "Foreigner" ? 3 : 2
                          }
                          rowSpan={3}
                          className="text-center fs-6"
                        >
                          Total
                        </td>

                        <td colSpan={2}>Restaurant Cost</td>
                        <td>{mathRoundHelper(supplementRate?.Price?.Breakfast)}</td>
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
                        {/* <td>{restaurantPriceCalculation?.Price?.Adult}</td>
                      <td>{restaurantPriceCalculation?.Price?.Child}</td> */}
                        <td></td>
                        <td></td>
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={2}>
                          Markup ({RestaurantData?.Value}){" "}
                          {RestaurantData?.Markup}
                        </td>
                        <td>{mathRoundHelper(supplementRate?.MarkupOfCost?.Breakfast)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{mathRoundHelper(supplementRate?.MarkupOfCost?.Lunch)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{mathRoundHelper(supplementRate?.MarkupOfCost?.Dinner)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td>{restaurantPriceCalculation?.MarkupOfCost?.Adult}</td>
                      <td>{restaurantPriceCalculation?.MarkupOfCost?.Child}</td> */}
                        <td></td>
                        <td></td>
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={2}>Total</td>
                        <td>
                          {mathRoundHelper(supplementRate?.Price?.Breakfast +
                            supplementRate?.MarkupOfCost?.Breakfast)}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          {mathRoundHelper(supplementRate?.Price?.Lunch +
                            supplementRate?.MarkupOfCost?.Lunch)}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          {mathRoundHelper(supplementRate?.Price?.Dinner +
                            supplementRate?.MarkupOfCost?.Dinner)}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td>
                        {parseInt(restaurantPriceCalculation?.Price?.Adult) +
                          parseInt(
                            restaurantPriceCalculation?.MarkupOfCost?.Adult
                          )}
                      </td>
                      <td>
                        {parseInt(restaurantPriceCalculation?.Price?.Child) +
                          parseInt(
                            restaurantPriceCalculation?.MarkupOfCost?.Child
                          )}
                      </td> */}
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </PerfectScrollbar>
              </div>
            </>
          ))}
      </div>
      {restaurantCopy && (
        <div className="row mt-3 m-0">
          <div
            className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
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
                <input name="Escort" type="number" className={`formControl3`} />
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
                {!isOpen ? (
                  <FaChevronCircleUp
                    className="text-primary"
                    onClick={(e) => {
                      setIsOpen({ ...isOpen, copy: !isOpen?.copy });
                    }}
                  />
                ) : (
                  <FaChevronCircleDown
                    className="text-primary"
                    onClick={(e) => {
                      setIsOpen({ ...isOpen, copy: !isOpen?.copy });
                    }}
                  />
                )}
              </span>
            </div>
          </div>
          {isOpen?.copy && (
            <>
              <div className="col-12 px-0 mt-2">
                <PerfectScrollbar>
                  <table class="table table-bordered itinerary-table">
                    {/* <thead>
                      <tr>
                        <th className="text-start">Days</th>
                        {(Type == "Local" || Type == "Foreigner") && (
                          <th rowSpan={2} className="py-1 align-middle">
                            Escort
                          </th>
                        )}
                        <th>Destination</th>
                        <th>Restaurant</th>
                        <th>Supplier</th>
                        <th>Adult Cost</th>
                        <th>Child Cost</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                      </tr>
                    </thead> */}
                    <thead>
                      <tr>
                        <th
                          className="text-start days-width-9 align-middle"
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
                        {restaurantMealForm[0]?.map((meal, index) => {
                          return (
                            <th colSpan={4} key={index}>
                              <div className="form-check check-sm  d-flex align-items-center justify-content-center gap-2">
                                <input
                                  type="checkbox"
                                  className="form-check-input height-em-1 width-em-1"
                                  id={meal?.MealType + index}
                                  onChange={(e) =>
                                    setCheckSupplement((prevData) => {
                                      const data = [...prevData];

                                      if (e.target.checked) {
                                        return [...data, meal?.MealType];
                                      } else {
                                        let filteredData = data?.filter(
                                          (data) => data != meal?.MealType
                                        );
                                        return filteredData;
                                      }
                                    })
                                  }
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
                          );
                        })}
                        <th rowSpan={2} className="align-middle">
                          Restaurant
                        </th>
                        <th rowSpan={2} className="align-middle">
                          Supplier
                        </th>
                        {/* <th rowSpan={2} className="align-middle">
                          Adult Cost
                        </th>
                        <th rowSpan={2} className="align-middle">
                          Child Cost
                        </th> */}
                        <th rowSpan={2} className="align-middle">
                          Start Time
                        </th>
                        <th rowSpan={2} className="align-middle">
                          End Time
                        </th>
                      </tr>
                      <tr>
                        {restaurantMealForm[0]?.map((meal, index) => {
                          return (
                            <Fragment key={index + 1}>
                              <th>H</th>
                              <th>Hotel/Restaurant</th>
                              <th>Price</th>
                              <th>S</th>
                            </Fragment>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {restaurantFormValue
                        ?.map((form, index) => ({
                          item: form,
                          originalIndex: index,
                        }))
                        ?.filter(({ item }) => item?.ServiceMainType === "Yes")
                        ?.map(({ item, originalIndex }, index) => {
                          return (
                            // <tr key={index}>
                            //   <td>
                            //     <div className="d-flex gap-2 justify-content-start">
                            //       <div className="d-flex gap-2">
                            //         <span
                            //           onClick={() =>
                            //             handleTableIncrement(originalIndex)
                            //           }
                            //         >
                            //           <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                            //         </span>
                            //         <span
                            //           onClick={() =>
                            //             handleTableDecrement(originalIndex)
                            //           }
                            //         >
                            //           <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                            //         </span>
                            //       </div>
                            //       <div>{`Day ${item?.DayNo}`}</div>
                            //     </div>
                            //   </td>
                            //   {(Type == "Local" || Type == "Foreigner") && (
                            //     <td style={{ width: "30px" }}>
                            //       <div>
                            //         <input
                            //           name="Escort"
                            //           type="number"
                            //           style={{ width: "30px" }}
                            //           className={`formControl1`}
                            //           value={
                            //             restaurantFormValue[originalIndex]
                            //               ?.Escort
                            //           }
                            //           onChange={(e) =>
                            //             handleRestaurantFormChange(
                            //               originalIndex,
                            //               e
                            //             )
                            //           }
                            //         />
                            //       </div>
                            //     </td>
                            //   )}
                            //   <td>
                            //     <div>
                            //       <select
                            //         name="Destination"
                            //         id=""
                            //         className="formControl1"
                            //         value={
                            //           restaurantFormValue[originalIndex]
                            //             ?.Destination
                            //         }
                            //         onChange={(e) =>
                            //           handleRestaurantFormChange(
                            //             originalIndex,
                            //             e
                            //           )
                            //         }
                            //       >
                            //         <option value="">Select</option>
                            //         {destinationList?.map((city, index) => {
                            //           return (
                            //             <option
                            //               value={city?.id}
                            //               key={index + "ab"}
                            //             >
                            //               {city?.Name}
                            //             </option>
                            //           );
                            //         })}
                            //       </select>
                            //     </div>
                            //   </td>
                            //   <td>
                            //     <div>
                            //       <select
                            //         name="ServiceId"
                            //         id=""
                            //         className="formControl1"
                            //         onChange={(e) =>
                            //           handleRestaurantFormChange(
                            //             originalIndex,
                            //             e
                            //           )
                            //         }
                            //         value={
                            //           restaurantFormValue[originalIndex]
                            //             ?.ServiceId
                            //         }
                            //       >
                            //         <option value="">Select</option>
                            //         {restaurantList[index]?.map(
                            //           (rest, index) => {
                            //             return (
                            //               <option
                            //                 value={rest?.Id}
                            //                 key={index + 1}
                            //               >
                            //                 {rest?.Name}
                            //               </option>
                            //             );
                            //           }
                            //         )}
                            //       </select>
                            //     </div>
                            //   </td>
                            //   <td>
                            //     <div>
                            //       <select
                            //         name="Supplier"
                            //         id=""
                            //         className="formControl1"
                            //         onChange={(e) =>
                            //           handleRestaurantFormChange(
                            //             originalIndex,
                            //             e
                            //           )
                            //         }
                            //         value={
                            //           restaurantFormValue[originalIndex]
                            //             ?.Supplier
                            //         }
                            //       >
                            //         <option value="">Select</option>
                            //         {restaurantSupplierList[index]?.map(
                            //           (supplier, index) => {
                            //             return (
                            //               <option
                            //                 value={supplier?.id}
                            //                 key={index + 1}
                            //               >
                            //                 {supplier?.Name}
                            //               </option>
                            //             );
                            //           }
                            //         )}
                            //       </select>
                            //     </div>
                            //   </td>
                            //   <td>
                            //     <div>
                            //       <input
                            //         type="text"
                            //         className="formControl1"
                            //         name="AdultCost"
                            //         onChange={(e) =>
                            //           handleRestaurantFormChange(
                            //             originalIndex,
                            //             e
                            //           )
                            //         }
                            //         value={
                            //           restaurantFormValue[originalIndex]
                            //             ?.AdultCost
                            //         }
                            //       />
                            //     </div>
                            //   </td>
                            //   <td>
                            //     <div>
                            //       <input
                            //         type="text"
                            //         className="formControl1"
                            //         name="ChildCost"
                            //         onChange={(e) =>
                            //           handleRestaurantFormChange(
                            //             originalIndex,
                            //             e
                            //           )
                            //         }
                            //         value={
                            //           restaurantFormValue[originalIndex]
                            //             ?.ChildCost
                            //         }
                            //       />
                            //     </div>
                            //   </td>
                            //   <td>
                            //     <div className="custom-timepicker">
                            //       <input
                            //         type="time"
                            //         id=""
                            //         className="formControl1 width50px"
                            //         name="StartTime"
                            //         onChange={(e) =>
                            //           handleRestaurantFormChange(
                            //             originalIndex,
                            //             e
                            //           )
                            //         }
                            //         value={
                            //           restaurantFormValue[originalIndex]
                            //             ?.StartTime
                            //         }
                            //       />
                            //       {/* <TimePicker  value="10:10" /> */}
                            //       {/* <TimePickerComponent placeholder="Select a time"/> */}
                            //     </div>
                            //   </td>
                            //   <td>
                            //     <div>
                            //       <input
                            //         type="time"
                            //         id=""
                            //         name="EndTime"
                            //         onChange={(e) =>
                            //           handleRestaurantFormChange(
                            //             originalIndex,
                            //             e
                            //           )
                            //         }
                            //         value={
                            //           restaurantFormValue[originalIndex]
                            //             ?.EndTime
                            //         }
                            //         className="formControl1 width50px"
                            //       />
                            //     </div>
                            //   </td>
                            // </tr>
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
                                      <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                    </span>
                                  </div>
                                  {item?.Date ? (
                                    <span
                                      style={{
                                        textWrap: "nowrap",
                                        marginRight: "5px",
                                      }}
                                    >
                                      {" "}
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
                                        restaurantFormValue[originalIndex]
                                          ?.Escort
                                      }
                                      onChange={(e) =>
                                        handleRestaurantFormChange(
                                          originalIndex,
                                          e
                                        )
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
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    {OptionQoutationData?.Days?.map(
                                      (qout, index) => {
                                        return (
                                          <option
                                            value={qout?.DestinationId}
                                            key={index + 1}
                                          >
                                            {qout?.DestinationName}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </td>
                              {restaurantMealForm[0]?.map((meal, mealInd) => {
                                return (
                                  <Fragment key={index + mealInd}>
                                    <td>
                                      <div className="form-check check-sm  d-flex align-items-center justify-content-center">
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
                                          restaurantMealForm[index][mealInd]
                                            ?.Amount
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
                                      <div className="form-check check-sm  d-flex align-items-center justify-content-center">
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
                                );
                              })}
                              {/* <td>
                                <div>
                                  <select
                                    name="ServiceId"
                                    id=""
                                    className="formControl1"
                                    onChange={(e) =>
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                    value={
                                      restaurantFormValue[originalIndex]
                                        ?.ServiceId
                                    }
                                  >
                                    <option value="">Select</option>
                                    {restaurantList[index]?.map(
                                      (rest, index) => {
                                        return (
                                          <option
                                            value={rest?.Id}
                                            key={index + 1}
                                          >
                                            {rest?.Name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </td> */}
                              <td>
                                <div>
                                  <select
                                    name="Supplier"
                                    id=""
                                    className="formControl1"
                                    onChange={(e) =>
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                    value={
                                      restaurantFormValue[originalIndex]
                                        ?.Supplier
                                    }
                                  >
                                    <option value="">Select</option>
                                    {restaurantSupplierList[index]?.map(
                                      (supplier, index) => {
                                        return (
                                          <option
                                            value={supplier?.id}
                                            key={index + 1}
                                          >
                                            {supplier?.Name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </td>
                              {/* <td>
                                <div>
                                  <input
                                    type="text"
                                    className="formControl1"
                                    name="AdultCost"
                                    onChange={(e) =>
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                    value={
                                      restaurantFormValue[originalIndex]
                                        ?.AdultCost
                                    }
                                  />
                                </div>
                              </td>
                              <td>
                                <div>
                                  <input
                                    type="text"
                                    className="formControl1"
                                    name="ChildCost"
                                    onChange={(e) =>
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                    value={
                                      restaurantFormValue[originalIndex]
                                        ?.ChildCost
                                    }
                                  />
                                </div>
                              </td> */}
                              <td>
                                <div className="custom-timepicker">
                                  <input
                                    type="time"
                                    id=""
                                    className="formControl1 " // remove width50px only
                                    name="StartTime"
                                    onChange={(e) =>
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                    value={
                                      restaurantFormValue[originalIndex]
                                        ?.StartTime
                                    }
                                  />
                                  {/* <TimePicker  value="10:10" /> */}
                                  {/* <TimePickerComponent placeholder="Select a time"/> */}
                                </div>
                              </td>
                              <td>
                                <div>
                                  <input
                                    type="time"
                                    id=""
                                    name="EndTime"
                                    onChange={(e) =>
                                      handleRestaurantFormChange(
                                        originalIndex,
                                        e
                                      )
                                    }
                                    value={
                                      restaurantFormValue[originalIndex]
                                        ?.EndTime
                                    }
                                    className="formControl1 " // remove width50px only
                                  />
                                  {/* <TimePicker  value="10:10" /> */}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {/* <tr className="costing-td">
                        <td
                          colSpan={
                            Type == "Local" || Type == "Foreigner" ? 4 : 3
                          }
                          rowSpan={3}
                          className="text-center fs-6"
                        >
                          Total
                        </td>
                        <td colSpan={2}>Restaurant Cost</td>
                        <td>{hikePercent}%</td>
                        <td>{hikePercent}%</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={2}>Markup(5) %</td>
                        <td>{restaurantPriceCalculation?.Markup?.Adult}</td>
                        <td>{restaurantPriceCalculation?.Markup?.Child}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={2}>Total</td>
                        <td>{restaurantPriceCalculation?.Price?.Adult}</td>
                        <td>{restaurantPriceCalculation?.Price?.Child}</td>
                        <td></td>
                        <td></td>
                      </tr> */}
                      <tr className="costing-td">
                        <td
                          colSpan={
                            Type == "Local" || Type == "Foreigner" ? 1 : 2
                          }
                          rowSpan={3}
                          className="text-center fs-6"
                        >
                          Total
                        </td>

                        <td colSpan={2}>Restaurant Cost</td>
                        <td>{mathRoundHelper(supplementRate?.Price?.Breakfast)}</td>
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
                        {/* <td>{restaurantPriceCalculation?.Price?.Adult}</td>
                        <td>{restaurantPriceCalculation?.Price?.Child}</td> */}
                        <td></td>
                        <td></td>
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={2}>
                          Markup ({RestaurantData?.Value}){" "}
                          {RestaurantData?.Markup}
                        </td>
                        <td>{mathRoundHelper(supplementRate?.MarkupOfCost?.Breakfast)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{mathRoundHelper(supplementRate?.MarkupOfCost?.Lunch)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{mathRoundHelper(supplementRate?.MarkupOfCost?.Dinner)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td>
                          {restaurantPriceCalculation?.MarkupOfCost?.Adult}
                        </td>
                        <td>
                          {restaurantPriceCalculation?.MarkupOfCost?.Child}
                        </td> */}
                        <td></td>
                        <td></td>
                      </tr>
                      <tr className="costing-td">
                        <td colSpan={2}>Total</td>
                        <td>
                          {mathRoundHelper(supplementRate?.Price?.Breakfast +
                            supplementRate?.MarkupOfCost?.Breakfast)}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          {mathRoundHelper(supplementRate?.Price?.Lunch +
                            supplementRate?.MarkupOfCost?.Lunch)}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          {mathRoundHelper(supplementRate?.Price?.Dinner +
                            supplementRate?.MarkupOfCost?.Dinner)}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td>
                          {parseInt(restaurantPriceCalculation?.Price?.Adult) +
                            parseInt(
                              restaurantPriceCalculation?.MarkupOfCost?.Adult
                            )}
                        </td>
                        <td>
                          {parseInt(restaurantPriceCalculation?.Price?.Child) +
                            parseInt(
                              restaurantPriceCalculation?.MarkupOfCost?.Child
                            )}
                        </td> */}
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
      )}
      {isOpen?.original &&
        (isDataLoading ? (
          ""
        ) : (
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
        ))}
    </>
  );
};

export default React.memo(Restaurant);
