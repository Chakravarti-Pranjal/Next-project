import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
// import { axiosOther } from "../../../../../http/axios_base_url";
import { hotelItineraryValue } from "../qoutation_initial_value";
import { notifySuccess, notifyError } from "../../../../../helper/notify";
import { ToastContainer } from "react-toastify";
import HotelIcon from "../../../../../images/itinerary/hotel.svg";
import {
  setHotelPrice,
  setTogglePriceState,
  setTotalHotelPricePax,
  setTotalMealPricePax,
} from "../../../../../store/actions/PriceAction";
import { setMealPrice } from "../../../../../store/actions/PriceAction";
import { Modal, Row, Col, Button } from "react-bootstrap";
import {
  setItineraryHotelFormValue,
  setLocalHotelFormValue,
  setQoutationData,
  setQoutationResponseData,
  setQueryData,
} from "../../../../../store/actions/queryAction";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import {
  setLocalItineraryHotelData,
  setLocalItineraryMealData,
  setForeignerItineraryHotelData,
} from "../../../../../store/actions/itineraryDataAction";
import { quotationData } from "../../qoutation-first/quotationdata";

import { setItinerayTabChange } from "../../../../../store/itinerarayTabAction/itinerarayTabWiseDataLoadAction";
import {
  setItineraryCopyHotelFormData,
  setItineraryCopyHotelFormDataCheckbox,
} from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import { axiosOther } from "../../../../../http/axios_base_url";
import moment from "moment";
import mathRoundHelper from "../../helper-methods/math.round";

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const Hotel = ({ headerDropdown, Type, ActiveOptionId, TabId }) => {
  const [hotelCheckBox, setHotelCheckBox] = useState({
    original: [],
    copy: [],
    copy_hotel_form: false,
  });
  const [hotelFormValue, setHotelFormValue] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [originalRoomDetails, setOriginalRoomDetails] = useState([]);
  const [mealDetails, setMealDetails] = useState([]);
  const [originalMealDetails, setOriginalMealDetails] = useState([]);
  const [isCopyHotel, setIsCopyHotel] = useState(false);
  const [isOpen, setIsOpen] = useState({
    original: true,
    copy: [],
  });
  const [hikePercent, setHikePercent] = useState(0);
  const {
    qoutationData,
    queryData,
    isItineraryEditing,
    itineraryHotelValue,
    localHotelValue,
  } = useSelector((data) => data?.queryReducer);
  // console.log("Qutation-date", qoutationData);
  const dispatch = useDispatch();
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [overnightList, setOvernightList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [rateList, setRateList] = useState([]);
  const [isFocus, setIsFocus] = useState();
  const prevHotelFormValue = useRef(hotelFormValue);
  const [alternateFormValue, setAlternateFormValue] = useState([]);
  const [alternateRoomDetails, setAlternateRoomDetails] = useState([]);
  const [alternateMealDetails, setAlternateMealDetails] = useState([]);
  const [alternateRateList, setAlternateRateList] = useState([]);
  const [checkIncludes, setCheckIncludes] = useState("No");
  const [paxFormValue, setPaxFormValue] = useState({
    Adults: "",
    Child: "",
    Infant: "",
  });
  const [modalCentered, setModalCentered] = useState({
    modalIndex: "",
    isShow: false,
  });
  const [totalHotelCost, setHotelTotalCost] = useState("");
  const [selectedInd, setSelectedInd] = useState({});
  const [formIsEmpty, setFormIsEmpty] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [calculatedRateDetails, setCalculatedRateDetails] = useState({
    RoomRates: [],
    MealRates: [],
    RoomMarkup: [],
    MealMarkup: [],
  });
  const [isHotelLoaded, setIsHotelLoaded] = useState(false);
  const [isRoomLoaded, setIsRoomLoaded] = useState(false);
  const [isOvernightLoaded, setIsOvernightLoaded] = useState(false);
  const [hasSetFirstValues, setHasSetFirstValues] = useState(false);
  const previousHotelFormValue = useRef();
  const hasInitialized = useRef(false);
  const handleFocus = (index) => {
    setIsFocus(index);
  };

  const handleBlur = () => {
    setIsFocus(null);
  };

  const itinerarayTab = useSelector(
    (state) => state.tabWiseDataLoadReducer.tab
  );

  const { OptionQoutationData } = useSelector(
    (data) => data?.activeTabOperationReducer
  );

  // console.log(hotelFormValue, "HotelFormValue");

  useEffect(() => {
    previousHotelFormValue.current = hotelFormValue;
  }, [hotelFormValue]);

  useEffect(() => {
    if (OptionQoutationData?.Days) {
      const hasMonumentService = OptionQoutationData?.Days.some((day) =>
        day?.DayServices?.some((service) => service.ServiceType === "Hotel")
      );

      if (hasMonumentService) {
        const initialFormValue = OptionQoutationData?.Days?.filter(
          (day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          }
        )
          ?.map((day) => {
            const service = day?.DayServices?.filter(
              (service) => service?.ServiceType == "Hotel"
            )[0];
            return {
              id: queryData?.QueryId,
              QueryId: queryData?.QueryAlphaNumId,
              QuatationNo: OptionQoutationData?.QuotationNumber || "",
              OptionId: TabId,
              DayType: "Main" || "",
              DayNo: day.Day,
              Date: day?.Date,
              Escort: 1,
              EnrouteName: day?.EnrouteName,
              EnrouteId: day?.EnrouteId,
              Destination: day?.DestinationId,
              DestinationUniqueId: day?.DestinationUniqueId,
              DayUniqueId: day?.DayUniqueId,
              ItemFromDate: OptionQoutationData?.TourSummary?.FromDate,
              ItemToDate: OptionQoutationData?.TourSummary?.ToDate,
              ServiceId: service != undefined ? service?.ServiceId : "",
              OverNight: service != undefined ? service?.OvernightId : "",
              RoomCategory: service != undefined ? service?.RoomCategoryId : "",
              Supplier: service
                ? service?.ServiceDetails[0]?.ItemSupplierDetail?.ItemSupplierId
                : "",
              RateUniqueId: "",
              HotelCategory: service?.HotelCategoryId || headerDropdown?.Hotel,
              FromDay: "",
              ToDay: "",
              ItemFromTime: "",
              ItemToTime: "",
              PaxSlab: day?.PaxDetails?.TotalNoOfPax,
              MealPlan: service?.MealPlanId
                ? service?.MealPlanId
                : headerDropdown?.MealPlan,
              ServiceMainType: "No",
              PaxInfo: {
                Adults: OptionQoutationData?.Pax?.AdultCount,
                Child: OptionQoutationData?.Pax?.ChildCount,
                Infant: OptionQoutationData?.Pax?.Infant,
                Escort: day?.PaxDetails?.PaxInfo?.Escort,
              },
              ForiegnerPaxInfo: {
                Adults: "",
                Child: "",
                Infant: "",
                Escort: "",
              },
              DayServices: day?.DayServices || [],
            };
          })
          ?.filter((item) => {
            return !item.EnrouteId;
          });

        // console.log(initialFormValue, "InitialFormValue");

        setHotelFormValue(initialFormValue);

        const servicesRoom = OptionQoutationData?.Days?.filter(
          (day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          }
        )?.map((day) => {
          const serv = day?.DayServices?.map((service) => {
            return service?.ServiceType?.includes("Hotel")
              ? service
              : undefined;
          }).filter((data) => data != undefined);
          const result = serv?.length > 0 ? serv[0]?.ServiceDetails.flat() : [];
          const final = result?.map((item) => item?.ItemUnitCost?.RoomBedType);
          return final;
        });

        const staticRoom = OptionQoutationData?.Days?.filter(
          (day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          }
        )?.map(() => {
          const details =
            OptionQoutationData?.QueryInfo?.Accomondation?.RoomInfo?.filter(
              (room) => room?.NoOfPax != null
            );

          const equalToDBLRoom = details?.filter(
            (room) => room?.RoomType == "DBL Room"
          )[0];

          const notEqualToDBLRoom = details?.filter(
            (room) => room?.RoomType != "DBL Room"
          );

          const orderedRoom =
            equalToDBLRoom != undefined
              ? [equalToDBLRoom, ...notEqualToDBLRoom]
              : notEqualToDBLRoom;

          const isExtraBedAvailable = orderedRoom?.some((rooms) =>
            rooms?.RoomType?.includes("ExtraBed(A)")
          );

          if (isExtraBedAvailable) {
            return orderedRoom?.map((room) => ({
              RoomBedTypeId: room?.id,
              RoomCost: "",
              RoomType: room?.RoomType,
            }));
          } else {
            let extraBed = {
              id: 7,
              RoomCost: "",
              RoomType: "ExtraBed(A)",
            };
            const orderedRoomWithExtraBed = [...orderedRoom, extraBed];
            return orderedRoomWithExtraBed?.map((room) => ({
              RoomBedTypeId: room?.id,
              RoomCost: "",
              RoomType: room?.RoomType,
            }));
          }
        });

        const finalRoomJson = staticRoom?.map((dayArray, dayIndex) => {
          if (dayArray != undefined) {
            return dayArray.map((roomObj) => {
              const matchingRoom = servicesRoom[dayIndex]
                ?.flat()
                .find((room) => room?.RoomBedTypeId === roomObj?.RoomBedTypeId);

              if (matchingRoom) {
                return {
                  ...roomObj,
                  RoomCost: matchingRoom.RoomCost || "",
                };
              }
              return roomObj;
            });
          } else {
            return [];
          }
        });
        setRoomDetails(finalRoomJson);
        setOriginalRoomDetails(finalRoomJson);

        const servicesMeal = OptionQoutationData?.Days?.filter(
          (day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          }
        )?.map((day) => {
          const serv = day?.DayServices?.map((service) => {
            return service?.ServiceType?.includes("Hotel")
              ? service
              : undefined;
          }).filter((data) => data != undefined);

          const result = serv?.length > 0 ? serv[0]?.ServiceDetails.flat() : [];
          const final = result?.map((item) => item?.ItemUnitCost?.MealType);

          return final;
        });

        const staticMeal = OptionQoutationData?.Days?.filter(
          (day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          }
        )?.map(() => [
          {
            MealTypeId: "1",
            MealCost: "",
            IsPrice: true,
          },
          {
            MealTypeId: "2",
            MealCost: "",
            IsPrice: true,
          },
          {
            MealTypeId: "3",
            MealCost: "",
            IsPrice: true,
          },
        ]);

        const finalMealJson = staticMeal?.map((dayArray, dayIndex) => {
          return dayArray.map((mealObj) => {
            const matchingMeal = servicesMeal[dayIndex]
              ?.flat()
              .find((meal) => meal?.MealTypeId === mealObj?.MealTypeId);

            if (matchingMeal) {
              return {
                ...mealObj,
                MealCost: matchingMeal.MealCost || "",
                IsPrice: true,
              };
            }
            return mealObj;
          });
        });
        setMealDetails(finalMealJson);
        setOriginalMealDetails(finalMealJson);

        dispatch(
          setLocalHotelFormValue({
            HotelForm: initialFormValue,
            MealType: finalMealJson,
            RoomBedType: finalRoomJson,
          })
        );
      } else {
        if (hasInitialized.current) return;

        const initialFormValue = OptionQoutationData?.Days?.filter(
          (day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          }
        )
          ?.filter((day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          })
          ?.map((day, ind) => ({
            ...hotelItineraryValue,
            id: queryData?.QueryId,
            QueryId: queryData?.QueryAlphaNumId,
            QuatationNo: OptionQoutationData?.QuotationNumber || "",
            OptionId: TabId,
            DayType: "Main" || "",
            DayNo: day.Day,
            Date: day?.Date,
            EnrouteName: day?.EnrouteName,
            EnrouteId: day?.EnrouteId,
            Destination: day.DestinationId || "",
            DestinationUniqueId: day?.DestinationUniqueId,

            DayUniqueId: day?.DayUniqueId,
            ItemFromDate: OptionQoutationData?.TourSummary?.FromDate,
            ItemToDate: OptionQoutationData?.TourSummary?.ToDate,
            RateUniqueId: "",
            PaxInfo: {
              Adults: OptionQoutationData?.Pax?.AdultCount,
              Child: OptionQoutationData?.Pax?.ChildCount,
              Infant: OptionQoutationData?.Pax?.Infant,
              Escort: "",
            },
          }))
          ?.filter((item) => {
            return !item.EnrouteId;
          });
        setHotelFormValue(initialFormValue);
        setFormIsEmpty(true);

        // creating room details array
        const roomJson = OptionQoutationData?.Days?.filter(
          (day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          }
        )?.map(() => {
          const details =
            OptionQoutationData?.QueryInfo?.Accomondation?.RoomInfo?.filter(
              (room) => room?.NoOfPax != null
            );

          const equalToDBLRoom = details?.filter(
            (room) => room?.RoomType == "DBL Room"
          )[0];

          const notEqualToDBLRoom = details?.filter(
            (room) => room?.RoomType != "DBL Room"
          );

          const orderedRoom =
            equalToDBLRoom != undefined
              ? [equalToDBLRoom, ...notEqualToDBLRoom]
              : notEqualToDBLRoom;

          const isExtraBedAvailable = orderedRoom?.some((rooms) =>
            rooms?.RoomType?.includes("ExtraBed(A)")
          );

          if (isExtraBedAvailable) {
            return orderedRoom?.map((room) => ({
              RoomBedTypeId: room?.id,
              RoomCost: "",
              RoomType: room?.RoomType,
            }));
          } else {
            let extraBed = {
              id: 7,
              RoomCost: "",
              RoomType: "ExtraBed(A)",
            };
            const orderedRoomWithExtraBed = [...orderedRoom, extraBed];
            return orderedRoomWithExtraBed?.map((room) => ({
              RoomBedTypeId: room?.id,
              RoomCost: "",
              RoomType: room?.RoomType,
            }));
          }
        });
        setRoomDetails(roomJson);
        setOriginalRoomDetails(roomJson);

        // creating meal details array
        const mealJson = OptionQoutationData?.Days?.filter(
          (day, index, daysArray) => {
            const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
            if (
              previousEnrouteId != null &&
              previousEnrouteId !== "" &&
              previousEnrouteId === day?.DestinationId
            ) {
              return false;
            }
            return true;
          }
        )?.map(() => [
          {
            MealTypeId: "1",
            MealCost: "",
            IsPrice: true,
          },
          {
            MealTypeId: "2",
            MealCost: "",
            IsPrice: true,
          },
          {
            MealTypeId: "3",
            MealCost: "",
            IsPrice: true,
          },
        ]);
        setMealDetails(mealJson);
        setOriginalMealDetails(mealJson);
        dispatch(
          setLocalHotelFormValue({
            HotelForm: initialFormValue,
            MealType: mealJson,
            RoomBedType: roomJson,
          })
        );
        hasInitialized.current = true;
      }
    }
  }, [OptionQoutationData, headerDropdown?.MealPlan]);

  // setting meal plan from header to form
  useEffect(() => {
    let updatedForm = hotelFormValue?.map((form, index) => {
      return {
        ...form,
        MealPlan: headerDropdown?.MealPlan,
      };
    });
    if (hotelFormValue.length > 0) {
      setHotelFormValue(updatedForm);
    }
  }, [headerDropdown?.MealPlan]);

  useEffect(() => {
    prevHotelFormValue.current = hotelFormValue;
  }, [hotelFormValue]);

  const getSupplierList = async (index, id, name) => {
    try {
      const { data } = await axiosOther.post("supplierlistforselect", {
        Name: name,
        id: "",
        SupplierService: [12],
        DestinationId: [parseInt(id)],
      });

      setSupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
      return data;
    } catch (error) {
      console.log("error", error);
    }
  };

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("overnight-master-list");
      setOvernightList(data?.Data);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("roomtypelist", {
        name: "",
        id: "",
        status: 1,
      });
      setRoomList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("hotelmealplanlist");
      setMealPlanList(data?.DataList);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (destinationList.length == 0) postDataToServer();
  }, []);
  //setting rate for the rooms
  const applyMultipleRatesToRoomDetails = (rateEntries) => {
    const updatedRoomDetails = [...roomDetails];

    rateEntries?.forEach((rateEntry) => {
      const rateRooms = rateEntry?.RateJson?.RoomBedType;
      if (!rateRooms) return;
      // Match rate to index in hotelFormValue based on HotelID or Destination
      const targetIndex = hotelFormValue.findIndex(
        (form) =>
          form?.ServiceId === rateEntry?.HotelID ||
          form?.Destination === rateEntry?.Destination
      );
      if (targetIndex === -1) return;

      const updatedRooms = updatedRoomDetails[targetIndex]?.map((room) => {
        const matchedRoomRate = rateRooms.find(
          (r) => r.RoomBedTypeName === room.RoomType
        );
        return {
          ...room,
          RoomCost: matchedRoomRate?.RoomCost ?? room.RoomCost ?? "",
        };
      });

      updatedRoomDetails[targetIndex] = updatedRooms;
    });
    setRoomDetails(updatedRoomDetails);
    setOriginalRoomDetails(updatedRoomDetails); // optional
  };

  // getting rate data form api
  const getHotelRateApi = async (
    hotel,
    destination,
    index,
    gettingCalledFrom
    // QuatationNo,
    // date,
    // mealPlan,
    // roomCategory,
  ) => {
    try {
      const storedData = localStorage.getItem("token");
      const parsedData = JSON.parse(storedData);

      const paxType = parsedData?.PaxInfo?.PaxType; // "1"
      const companyId = parsedData?.companyKey;
      const queryId = parsedData?.QueryID;

      if (hotel && companyId && destination) {
        const { data } = await axiosOther.post("priceEditHotelRatesJson", {
          Id: "",
          HotelID: hotel ? hotel : "",
          HotelName: "",
          DestinationID: destination ? destination : "",
          CompanyId: companyId ? companyId : "",
          Date: "",
          Year: "",
          MealPlanId: " ",
          CurrencyId: "",
          TariffTypeId: "",
          RoomTypeId: "",
          MarketTypeId: "",
          HotelCategoryId: "",
          SupplierID: " ",
          PaxTypeId: "",
          ValidFrom: "",
          ValidTo: " ",
          QueryId: "",
          QuatationNo: "",
        });
        if (data?.Status === 1 && data?.Data?.length > 0) {
          const rateData = data.Data[0];

          const updatedRoomArray = roomDetails[index]?.map((roomObj) => {
            const matchedRoom = rateData?.RateJson?.RoomBedType?.find(
              (r) => r.RoomBedTypeId === roomObj.RoomBedTypeId
            );

            return {
              ...roomObj,
              RoomCost: matchedRoom
                ? matchedRoom.RoomTotalCost
                : roomObj.RoomTotalCost,
            };
          });

          // 👇 Apply this update back into romDettt (roomDetails)
          setRoomDetails((prev) => {
            const updated = [...prev];
            updated[index] = updatedRoomArray;
            return updated;
          });
          setOriginalRoomDetails((prev) => {
            const updated = [...prev];
            updated[index] = updatedRoomArray;
            return updated;
          });
        } else {
          // Reset this index when no data
          const fallbackRoomArray =
            roomDetails[index]?.map((room) => ({
              ...room,
              RoomCost: "",
            })) || [];

          setRoomDetails((prev) => {
            const updated = [...prev];
            updated[index] = fallbackRoomArray;
            return updated;
          });

          setOriginalRoomDetails((prev) => {
            const updated = [...prev];
            updated[index] = fallbackRoomArray;
            return updated;
          });
        }

        if (data?.Status === 1 && data?.Data?.length > 0) {
          const rateData = data.Data[0];

          const updatedMealArray = mealDetails[index]?.map((mealObj) => {
            const matchedMeal = rateData?.RateJson?.MealType?.find(
              (r) => r.MealTypeId === mealObj.MealTypeId
            );

            return {
              ...mealObj,
              MealCost: matchedMeal ? matchedMeal.MealCost : mealObj.MealCost,
            };
          });

          setMealDetails((prev) => {
            const updated = [...prev];
            updated[index] = updatedMealArray;
            return updated;
          });

          setOriginalMealDetails((prev) => {
            const updated = [...prev];
            updated[index] = updatedMealArray;
            return updated;
          });
        } else {
          const fallbackMealArray =
            mealDetails[index]?.map((meal) => ({
              ...meal,
              MealCost: "",
            })) || [];

          setMealDetails((prev) => {
            const updated = [...prev];
            updated[index] = fallbackMealArray;
            return updated;
          });

          setOriginalMealDetails((prev) => {
            const updated = [...prev];
            updated[index] = fallbackMealArray;
            return updated;
          });
        }
      }
    } catch (error) {
      console.log("rate-error", error);
    }
  };

  //   useEffect(() => {

  //     hotelFormValue?.forEach(async (form, index) => {
  //       const hotelUId =
  //         hotelList[index] != undefined ||
  //         (hotelList[index] != null && hotelList[index]?.length > 0)
  //           ? hotelList[index]?.filter((hotel) => hotel?.id == form?.ServiceId)
  //           : "";
  // if(hotelUId){
  //   getHotelRateApi(
  //     hotelUId[0]?.HotelUniqueID,
  //     form.DestinationUniqueId,
  //     form.QuatationNo,
  //     form.Date ? form.Date : "",
  //     form?.MealPlan ? form.MealPlan : "",
  //     index,
  //     form.RoomCategory ? form.RoomCategory : "",

  //   );

  // }
  //     });
  //   }, [
  //     hotelFormValue?.map((form) => form?.ServiceId)?.join(","),
  //     hotelFormValue?.map((form) => form?.MealPlan)?.join(","),
  //     hotelFormValue?.map((form) => form?.RoomCategory)?.join(","),
  //     hotelFormValue?.map((form) => form?.Supplier)?.join(","),
  //     headerDropdown?.Year,
  //   ]);
  useEffect(() => {
    const runRateApiForSelectedHotels = async () => {
      if (hasSetFirstValues) {
        for (let index = 0; index < hotelFormValue.length; index++) {
          const form = hotelFormValue[index];
          const hotelOptions = hotelList?.[index] || [];

          const matchedHotel = hotelOptions.find(
            (hotel) => hotel?.id === form?.ServiceId
          );
          const gettingCalledFrom = "useEffect";
          if (matchedHotel) {
            await getHotelRateApi(
              matchedHotel?.HotelUniqueID,
              form?.DestinationUniqueId,
              index,
              gettingCalledFrom
              // form?.QuatationNo,
              // form?.Date || "",
              // form?.MealPlan || "",
              // form?.RoomCategory || ""
            );
          }
        }
      }
      setHasSetFirstValues(false);
    };

    if (hotelFormValue?.length && hotelList?.length) {
      runRateApiForSelectedHotels();
    }
  }, [hasSetFirstValues, headerDropdown?.Year, hotelList]);

  // getting hotel rate api for alternate
  const getHotelRateApiForAlternate = async (
    destination,
    hotel,
    alternateIndex,
    formIndex,
    date
  ) => {
    try {
      const { data } = await axiosOther.post("priceEditHotelRatesJson", {
        Id: "",
        HotelID: hotel,
        HotelName: "",
        DestinationID: destination,
        Date: "",
        Year: headerDropdown?.Year,
        MealPlanName: "CP",
        PaxTypeId: "",
        ValidFrom: OptionQoutationData?.TourSummary?.FromDate,
        ValidTo: OptionQoutationData?.TourSummary?.FromDate,
        QueryId: queryData?.QueryId,
        QuatationNo: OptionQoutationData?.QuotationNumber,
      });
      // setAlternateRateList((prevState) => {
      //   const updatedState = [...prevState];
      //   updatedState[alternateIndex][formIndex] = data?.Data; // Store the API response
      //   return updatedState;
      // });
    } catch (error) {
      console.log("rate-error", error);
    }
  };

  useEffect(() => {
    if (false) {
      alternateFormValue?.forEach((alternate, alternateIndex) => {
        alternate?.Form?.forEach((form, formIndex) => {
          if (form?.Destination != "" && form?.ServiceId != "") {
            const hotelUId =
              hotelList[alternateIndex] != undefined ||
                (hotelList[alternateIndex] != null &&
                  hotelList[alternateIndex]?.length > 0)
                ? hotelList[alternateIndex]?.filter(
                  (hotel) => hotel?.id == form?.ServiceId
                )
                : "";

            getHotelRateApiForAlternate(
              form?.DestinationUniqueId,
              hotelUId[0]?.HotelUniqueID,
              alternateIndex,
              formIndex,
              form?.Date
            );
          }
        });
      });
    }
  }, [
    alternateFormValue
      ?.map((alternate) =>
        alternate?.Form?.map((form) => form?.ServiceId)?.join(",")
      )
      ?.join(","),
    alternateFormValue
      ?.map((alternate) =>
        alternate?.Form?.map((form) => form?.Destination)?.join(",")
      )
      ?.join(","),
  ]);

  // set value into for it's first value from list
  useEffect(() => {
    if (
      hotelList?.length > 0 &&
      overnightList.length > 0 &&
      roomList.length > 0
    ) {
      hotelList?.forEach((list, index) => {
        if (formIsEmpty) {
          setFirstValueIntoForm(index);
        }
      });
    }
  }, [
    hotelList,
    overnightList,
    roomList,
    headerDropdown?.MealPlan,
    isItineraryEditing,
    formIsEmpty,
  ]);
  const setFirstValueIntoForm = (index) => {
    const hotelNameId = hotelList[index]?.[0]?.id || "";
    // const supplier = supplierList[index]?.[0]?.id || "";
    const overnightId = overnightList?.[0]?.Id || "";
    const roomCategoryId = roomList?.[0]?.id || "";
    setHotelFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        ServiceId: hotelNameId,
        OverNight: hotelFormValue?.length - 1 === index ? "9" : overnightId,
        RoomCategory: roomCategoryId,
        MealPlan: headerDropdown?.MealPlan,
      };
      return newArr;
    });
    setHasSetFirstValues(true);
  };

  const getHotelListDependently = async (city, hotelCategory, index) => {
    try {
      const { data } = await axiosOther.post("hotellist", {
        DestinationId: city,
        HotelCategoryId: hotelCategory,
        Default: "Yes",
        perPage: "100",
      });
      setHotelList((prevList) => {
        const newList = [...prevList];
        newList[index] = data?.DataList || [];
        return newList;
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    hotelFormValue.forEach((row, index) => {
      const prevRow = previousHotelFormValue.current[index];
      const prevDestinationId = prevRow?.Destination;
      const currentDestinationId = row.Destination;
      getHotelListDependently(row?.Destination, headerDropdown?.Hotel, index);
    });
  }, [
    JSON.stringify(hotelFormValue?.map((row) => row?.Destination)),
    headerDropdown?.Hotel,
  ]);

  const handleHotelCheckBox = (e, type, index) => {
    const { value, checked, name } = e.target;

    if (name == "copy_hotel_form" && checked) {
      setHotelCheckBox({ ...hotelCheckBox, copy_hotel_form: true });
      const newArr = [...hotelFormValue, ...localHotelValue?.HotelForm];
      const newMealArr = [...mealDetails, ...localHotelValue?.MealType];
      const newRoomArr = [...roomDetails, ...localHotelValue?.RoomBedType];
      setMealDetails(newMealArr);
      setOriginalMealDetails(newMealArr);
      setRoomDetails(newRoomArr);
      setOriginalRoomDetails(newRoomArr);
      setHotelFormValue(newArr);
      return null;
    }

    if (name == "copy_hotel_form" && !checked) {
      setHotelCheckBox({ ...hotelCheckBox, copy: [], copy_hotel_form: false });
      const filteredArr = hotelFormValue?.filter(
        (form, index) => index <= localHotelValue?.HotelForm?.length - 1 && form
      );

      const filteredMeal = mealDetails?.filter(
        (form, index) => index <= localHotelValue?.MealType?.length - 1 && form
      );
      const filteredRoom = roomDetails?.filter(
        (form, index) =>
          index <= localHotelValue?.RoomBedType?.length - 1 && form
      );
      setHotelFormValue(filteredArr);
      setMealDetails(filteredMeal);
      setOriginalMealDetails(filteredMeal);
      setRoomDetails(filteredRoom);
      setRoomDetails(filteredRoom);
      return null;
    }

    if (type == "original") {
      if (checked) {
        setHotelCheckBox({
          ...hotelCheckBox,
          original: [...hotelCheckBox?.original, value],
        });
      }
      if (!checked) {
        const checkedValues = hotelCheckBox?.original?.filter(
          (checkValue) => checkValue != value
        );
        setHotelCheckBox({
          ...hotelCheckBox,
          original: checkedValues,
        });
      }
    }

    if (type == "copy") {
      if (checked) {
        setHotelCheckBox({
          ...hotelCheckBox,
          copy: hotelCheckBox?.copy.map((arr, i) =>
            i === index ? [...arr, value] : arr
          ),
        });
      }

      if (!checked) {
        setHotelCheckBox({
          ...hotelCheckBox,
          copy: hotelCheckBox?.copy.map((arr, i) =>
            i === index ? arr.filter((item) => item !== value) : arr
          ),
        });
      }
    }
  };

  const handleHotelTableIncrement = (index) => {
    const indexHotel = hotelFormValue[index];
    setHotelFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr?.splice(index + 1, 0, { ...indexHotel, isCopied: true });
      return newArr;
    });

    const indexRoom = roomDetails[index];
    const copiedRoom = indexRoom.map((room) => ({
      ...room,
      isCopied: true,
    }));

    setRoomDetails((prevArr) => {
      const newArr = [...prevArr];
      newArr?.splice(index + 1, 0, copiedRoom);
      return newArr;
    });

    setOriginalRoomDetails((prevArr) => {
      const newArr = [...prevArr];
      newArr?.splice(index + 1, 0, copiedRoom);
      return newArr;
    });

    const indexMeal = mealDetails[index];
    const copiedMeal = indexMeal.map((meal) => ({
      ...meal,
      isCopied: true,
    }));

    setMealDetails((prevArr) => {
      const newArr = [...prevArr];
      newArr?.splice(index + 1, 0, copiedMeal);
      return newArr;
    });
    setOriginalMealDetails((prevArr) => {
      const newArr = [...prevArr];
      newArr?.splice(index + 1, 0, copiedMeal);
      return newArr;
    });
  };

  const handleHotelTableDecrement = (index) => {
    const filteredTable = hotelFormValue.filter((item, ind) => ind != index);
    setHotelFormValue(filteredTable);

    const filteredRoom = roomDetails.filter((item, ind) => ind !== index);
    setRoomDetails(filteredRoom);
    setOriginalRoomDetails(filteredRoom);

    const filteredMeal = mealDetails.filter((item, ind) => ind !== index);
    setMealDetails(filteredMeal);
    setOriginalMealDetails(filteredMeal);
  };

  useEffect(() => {
    const { index, field, value } = selectedInd;
    if (index === undefined || !field) return;

    const hotelForm = hotelFormValue[index];
    const currentServiceId = hotelForm?.ServiceId;
    const selectedHotel = hotelList[index]?.find(
      (hotel) => hotel?.id == currentServiceId
    );
    if (!selectedHotel) return;

    if (["ServiceId", "RoomCategory", "MealPlan"].includes(field)) {
      getHotelRateApi(
        selectedHotel.HotelUniqueID,
        selectedHotel.HotelDestination?.DestinationUniqueId,
        index,
        hotelForm?.QuatationNo || "",
        hotelForm?.Date || "",
        hotelForm?.MealPlan || "",
        hotelForm?.RoomCategory || ""
      );
    }
  }, [selectedInd]);

  // hotel table forms onchange handler
  const handleHotelFormChange = (ind, subIndex, formType, e) => {
    const { name, value, checked, type } = e.target;

    if (name === "ServiceId") {
      setHotelFormValue((prevValue) => {
        const newArr = [...prevValue];
        newArr[ind] = {
          ...hotelFormValue[ind],
          [name]: value,
        };
        return newArr;
      });
    }

    // Rest of your existing logic for other fields
    if (formType == "original") {
      if (checked != "checkbox") {
        setHotelFormValue((prevValue) => {
          const newArr = [...prevValue];
          newArr[ind] = { ...hotelFormValue[ind], [name]: value };
          return newArr;
        });
      }

      if (type == "checkbox") {
        if (checked) {
          setHotelFormValue((prevValue) => {
            const newArr = [...prevValue];
            newArr[ind] = { ...hotelFormValue[ind], [name]: true };
            return newArr;
          });
        }

        if (!checked) {
          setHotelFormValue((prevValue) => {
            const newArr = [...prevValue];
            newArr[ind] = { ...hotelFormValue[ind], [name]: false };
            return newArr;
          });
        }
      }
    }

    if (formType === "alternate") {
      if (type !== "checkbox") {
        setAlternateFormValue((prevValue) => {
          const newArr = [...prevValue];
          newArr[ind].Form[subIndex] = {
            ...newArr[ind].Form[subIndex],
            [name]: value,
          };
          return newArr;
        });
      }
    }
    setSelectedInd({ index: ind, field: name, value: value });
  };
  const handleRoomTypeChange = (index, hotelIndex, roomIndex, roomType, e) => {
    const { name, value } = e.target;

    if (roomType == "original") {
      const { name, value } = e.target;
      setRoomDetails((prevArr) => {
        const newArr = [...prevArr];
        newArr[index][hotelIndex] = {
          ...newArr[index][hotelIndex],
          [name]: value,
        };
        return newArr;
      });
      setOriginalRoomDetails((prevArr) => {
        const newArr = [...prevArr];
        newArr[index][hotelIndex] = {
          ...newArr[index][hotelIndex],
          [name]: value,
        };
        return newArr;
      });
    }

    if (roomType === "alternate") {
      setAlternateRoomDetails((prevArr) => {
        const newArr = [...prevArr];
        newArr[index].Form[hotelIndex][roomIndex] = {
          ...newArr[index].Form[hotelIndex][roomIndex],
          [name]: value,
        };
        return newArr;
      });
    }
  };
  const handleMealFormChange = (index, mealIndex, subMealInd, mealType, e) => {
    const { type, checked, value, name } = e.target;

    if (mealType == "original") {
      if (type != "checkbox") {
        setMealDetails((prevArr) => {
          const newArr = [...prevArr];
          newArr[index][mealIndex] = {
            ...newArr[index][mealIndex],
            MealCost: value,
          };
          return newArr;
        });
        setOriginalMealDetails((prevArr) => {
          const newArr = [...prevArr];
          newArr[index][mealIndex] = {
            ...newArr[index][mealIndex],
            MealCost: value,
          };
          return newArr;
        });
      }

      if (type == "checkbox" && checked) {
        setMealDetails((prevArr) => {
          const newArr = [...prevArr];
          newArr[index][mealIndex] = {
            ...newArr[index][mealIndex],
            IsPrice: true,
          };
          return newArr;
        });
        setOriginalMealDetails((prevArr) => {
          const newArr = [...prevArr];
          newArr[index][mealIndex] = {
            ...newArr[index][mealIndex],
            IsPrice: true,
          };
          return newArr;
        });
      }

      if (type == "checkbox" && !checked) {
        setMealDetails((prevArr) => {
          const newArr = [...prevArr];
          newArr[index][mealIndex] = {
            ...newArr[index][mealIndex],
            IsPrice: false,
          };
          return newArr;
        });
        setOriginalMealDetails((prevArr) => {
          const newArr = [...prevArr];
          newArr[index][mealIndex] = {
            ...newArr[index][mealIndex],
            IsPrice: false,
          };
          return newArr;
        });
      }
    }

    if (mealType === "alternate") {
      if (type !== "checkbox") {
        setAlternateMealDetails((prevValue) => {
          const newArr = [...prevValue];
          newArr[index].Form[mealIndex][subMealInd] = {
            ...newArr[index].Form[mealIndex][subMealInd],
            MealCost: value,
          };
          return newArr;
        });
      }

      if (type === "checkbox") {
        setAlternateMealDetails((prevValue) => {
          const newArr = [...prevValue];
          newArr[index].Form[mealIndex][subMealInd] = {
            ...newArr[index].Form[mealIndex][subMealInd],
            IsPrice: checked,
          };
          return newArr;
        });
      }
    }
  };

  const getQueryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  // console.log(getQueryQuotation, "JJ9911");

  const getQoutationList = async () => {
    const payload = {
      QueryId: getQueryQuotation?.QueryID,
      QuotationNo: getQueryQuotation?.QoutationNum,
    };
    try {
      const { data } = await axiosOther.post("listqueryquotation", payload);
      if (data?.success) {
        dispatch(setQoutationData(data?.data[0]));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleFinalSave = async () => {
    const finalRoomDetails = hotelFormValue?.map((_, index) => {
      return roomDetails[index]?.map((room) => ({
        RoomBedTypeId: room?.RoomBedTypeId,
        RoomCost: mathRoundHelper(room?.RoomCost),
      }));
    });

    if (alternateFormValue.length > 0) {
      const supplementForm = alternateFormValue?.map(
        (alternate) => alternate?.Form
      )[0];
      const supplementRoom = alternateRoomDetails?.map(
        (alter) => alter?.Form
      )[0];
      const supplementMeal = alternateMealDetails?.map(
        (alter) => alter?.Form
      )[0];
      const finalSupplement = supplementForm?.map((form, index) => {
        if (form?.ServiceId != "") {
          return {
            ...form,
            ServiceMainType: "Yes",
            RoomBedType: supplementRoom[index],
            MealType: supplementMeal[index],
          };
        } else {
          return null;
        }
      });
      // finalRoomDetail = [...finalRoomDetails, ...finalSupplement];
    }

    dispatch(
      setTotalHotelPricePax({ hotelData: finalRoomDetails, hikePercent })
    );

    const finalMealDetails = hotelFormValue?.map((_, index) => {
      return mealDetails[index]?.map((meal) => ({
        MealTypeId: meal?.MealTypeId,
        MealCost: mathRoundHelper(meal?.MealCost),
        MealTypePackage: checkIncludes,
      }));
    });

    dispatch(setTotalMealPricePax(finalMealDetails));

    const roomRatesWithoutDBL = calculatedRateDetails?.RoomRates?.map(
      (room) => {
        if (room?.RoomType != "DBL Room") {
          return {
            RoomBedType: room?.RoomBedTypeId,
            ServiceCost: mathRoundHelper(room?.RoomCost),
            Markupvalue: mathRoundHelper(room?.MarkupPercent),
            MarkupTotalValue: mathRoundHelper(room?.Markup),
            TotalServiceCost: mathRoundHelper(room?.RoomCost + room?.Markup),
            RoomBedTypeName: room?.RoomType,
          };
        }
      }
    ).filter((rate) => rate != undefined);
    const roomRatesWithDBL = calculatedRateDetails?.RoomRates?.map((room) => {
      if (room?.RoomType == "DBL Room") {
        return {
          RoomBedType: room?.RoomBedTypeId,
          ServiceCost: mathRoundHelper(room?.RoomCost),
          Markupvalue: mathRoundHelper(room?.MarkupPercent),
          MarkupTotalValue: mathRoundHelper(room?.Markup),
          TotalServiceCost: mathRoundHelper(room?.RoomCost + room?.Markup),
          RoomBedTypeName: room?.RoomType,
        };
      }
    }).filter((rate) => rate != undefined);

    const mergedBedPrice = [...roomRatesWithDBL, ...roomRatesWithoutDBL];

    const mealRates = calculatedRateDetails?.MealRates?.map((meal) => {
      let mealName = { 1: "Breakfast", 2: "Lunch", 3: "Dinner" };
      return {
        id: meal?.MealTypeId,
        MealTypeName: mealName[meal?.MealTypeId],
        ServiceCost: mathRoundHelper(meal?.MealCost),
        Markupvalue: mathRoundHelper(meal?.MarkupPercent),
        MarkupTotalValue: mathRoundHelper(meal?.Markup),
        TotalServiceCost: mathRoundHelper(meal?.MealCost + meal?.Markup),
      };
    });

    let finalJson = hotelFormValue?.map((row, index) => {
      if (row?.ServiceId != "") {
        return {
          ...row,
          ...(ActiveOptionId ? { OptionId: ActiveOptionId } : {}),
          Hike: hikePercent,
          RoomBedType: finalRoomDetails[index],
          MealType: finalMealDetails[index],
          DayType: "Main" || "",
          HotelCategory: headerDropdown?.Hotel,
          HotelRoomBedType: mergedBedPrice,
          HotelMealType: mealRates,
          Sector: fromToDestinationList[index],
        };
      } else {
        return null;
      }
    });

    let filteredFinalJson = finalJson?.filter((form) => form != null);

    if (alternateFormValue.length > 0) {
      const supplementForm = alternateFormValue?.map(
        (alternate) => alternate?.Form
      )[0];
      const supplementRoom = alternateRoomDetails?.map(
        (alter) => alter?.Form
      )[0];
      const supplementMeal = alternateMealDetails?.map(
        (alter) => alter?.Form
      )[0];
      const finalSupplement = supplementForm?.map((form, index) => {
        if (form?.ServiceId != "") {
          return {
            ...form,
            ServiceMainType: "Yes",
            RoomBedType: supplementRoom[index],
            MealType: supplementMeal[index],
            Sector: fromToDestinationList[index],
          };
        } else {
          return null;
        }
      });

      const filteredSupplement = finalSupplement?.filter(
        (form) => form != null
      );

      finalJson = [...filteredFinalJson, ...filteredSupplement];
    }

    try {
      const { data } = await axiosOther.post(
        ActiveOptionId
          ? "update-multiple-quatation-hotel"
          : "update-multiple-quatation-hotel",
        filteredFinalJson
      );

      if (data?.status == 1) {
        notifySuccess("Services Added !");
        // getQoutationList();
        dispatch(setQoutationResponseData(data?.data));
        dispatch(setTogglePriceState());
      }
    } catch (error) {
      console.log("error", error);

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

  // calculating total price of hotel room
  useEffect(() => {
    const costArr = hotelFormValue?.map((item, index) => {
      if (item?.ServiceId) {
        const cost = roomDetails[index]?.map((room) =>
          room?.RoomCost && room?.RoomBedTypeId == 4
            ? parseInt(room?.RoomCost)
            : 0
        );
        const totalCost = cost?.reduce((acc, curr) => acc + curr, 0);
        return totalCost;
      } else {
        return 0;
      }
    });

    const totalCost = costArr?.reduce((acc, curr) => acc + curr, 0);
  }, [roomDetails, hotelFormValue?.map((item) => item?.ServiceId).join(",")]);

  // calculating total price of meal
  useEffect(() => {
    const costArr = hotelFormValue?.map((item, index) => {
      if (item?.ServiceId) {
        const cost = mealDetails[index]?.map((room) =>
          room?.MealCost ? parseInt(room?.MealCost) : 0
        );
        const totalCost = cost?.reduce((acc, curr) => acc + curr, 0);
        return totalCost;
      } else {
        return 0;
      }
    });
    const totalCost = costArr?.reduce((acc, curr) => acc + curr, 0);
  }, [mealDetails, hotelFormValue?.map((item) => item?.ServiceId).join(",")]);

  // copying state will be false on initial render
  useEffect(() => {
    if (Type != "Main" && isCopyHotel) {
      setHotelFormValue(itineraryHotelValue?.HotelForm);
      setMealDetails(itineraryHotelValue?.MealType);
      setOriginalMealDetails(itineraryHotelValue?.MealType);
      setRoomDetails(itineraryHotelValue?.RoomBedType);
      setOriginalRoomDetails(itineraryHotelValue?.RoomBedType);
    }
  }, []);

  // storing hotel form data to redux store

  // const handleHotelCopy = (e) => {
  //   const { checked } = e.target;
  //   if (checked) {
  //     setIsCopyHotel(true);
  //     setHotelFormValue(itineraryHotelValue?.HotelForm);
  //     setMealDetails(itineraryHotelValue?.MealType);
  //     setOriginalMealDetails(itineraryHotelValue?.MealType);
  //     setRoomDetails(itineraryHotelValue?.RoomBedType);
  //     setOriginalRoomDetails(itineraryHotelValue?.RoomBedType);
  //   } else {
  //     setIsCopyHotel(false);
  //     setHotelFormValue(localHotelValue?.HotelForm);
  //     setMealDetails(localHotelValue?.MealType);
  //     setOriginalMealDetails(localHotelValue?.MealType);
  //     setRoomDetails(localHotelValue?.RoomBedType);
  //     setOriginalRoomDetails(localHotelValue?.RoomBedType);
  //   }
  // };

  // merge rate array to roomDetails arr & mealDetails
  // Modified mergeRoomRateJson to handle specific row
  const mergeRoomRateJson = (rowIndex) => {
    const roomRate = [...roomDetails];

    if (rowIndex !== undefined && rateList[rowIndex] !== undefined) {
      roomRate[rowIndex] = roomDetails[rowIndex]?.map((roomItem) => {
        const findedRoom = rateList[rowIndex][0]?.RateJson?.RoomBedType?.find(
          (item) => item?.RoomBedTypeId == roomItem?.RoomBedTypeId
        );
        return {
          RoomBedTypeId: roomItem?.RoomBedTypeId,
          RoomCost: findedRoom?.RoomCost || "",
          RoomType: roomItem?.RoomType,
        };
      });
      setRoomDetails(roomRate);
      setOriginalRoomDetails(roomRate);
    }
  };

  // Modified mergeMealRateJson to handle specific row
  const mergeMealRateJson = (rowIndex) => {
    const mealRate = [...mealDetails];

    if (rowIndex !== undefined && rateList[rowIndex] !== undefined) {
      mealRate[rowIndex] = mealDetails[rowIndex]?.map((mealItem) => {
        const finededMeal = rateList[rowIndex][0]?.RateJson?.MealType?.find(
          (item) => item?.MealTypeId == mealItem?.MealTypeId
        );
        return {
          MealTypeId: mealItem?.MealTypeId,
          MealCost: finededMeal?.MealCost || "",
          IsPrice: true,
        };
      });

      setMealDetails(mealRate);
      setOriginalMealDetails(mealRate);
    }
  };

  // Update the useEffect for room rates
  useEffect(() => {
    // Find which rows have changed by comparing current and previous hotelFormValue
    if (previousHotelFormValue.current) {
      hotelFormValue.forEach((row, index) => {
        const prevRow = previousHotelFormValue.current[index];
        if (
          prevRow?.ServiceId !== row?.ServiceId ||
          prevRow?.RoomCategory !== row?.RoomCategory
        ) {
          mergeRoomRateJson(index);
        }
      });
    }
  }, [
    hotelFormValue?.map((form) => form?.ServiceId)?.join(","),
    hotelFormValue?.map((form) => form?.RoomCategory)?.join(","),
  ]);

  useEffect(() => {
    if (previousHotelFormValue.current) {
      hotelFormValue.forEach((row, index) => {
        const prevRow = previousHotelFormValue.current[index];
        if (
          prevRow?.ServiceId !== row?.ServiceId ||
          prevRow?.MealPlan !== row?.MealPlan
        ) {
          mergeMealRateJson(index);
        }
      });
    }
  }, [
    hotelFormValue?.map((form) => form?.ServiceId)?.join(","),
    hotelFormValue?.map((form) => form?.MealPlan)?.join(","),
  ]);
  function filterValuesFromArray(array, values) {
    return values.filter((value) => array.includes(value));
  }

  const createHotelAlternate = () => {
    if (alternateFormValue.length <= 0) {
      setAlternateFormValue([
        ...alternateFormValue,
        {
          AlternateId: alternateFormValue.length + 1,
          Form: localHotelValue?.HotelForm,
        },
      ]);
      setAlternateRoomDetails([
        ...alternateRoomDetails,
        {
          AlternateId: alternateFormValue.length + 1,
          Form: localHotelValue?.RoomBedType,
        },
      ]);
      setAlternateMealDetails([
        ...alternateMealDetails,
        {
          AlternateId: alternateFormValue.length + 1,
          Form: localHotelValue?.MealType,
        },
      ]);
      setHotelCheckBox({
        ...hotelCheckBox,
        copy: [...hotelCheckBox?.copy, []],
      });
      setIsOpen({ ...isOpen, copy: [...isOpen?.copy, false] });
    }
  };

  const removeHotelAlternate = (index, alternateId) => {
    const newAlternate = [...alternateFormValue];
    const filteredAlternate = newAlternate.filter(
      (alternate, ind) => ind != index
    );
    setAlternateFormValue(filteredAlternate);
  };

  const handlePaxChange = (index, e) => {
    const { name, value } = e.target;
    setPaxFormValue({ ...paxFormValue, [name]: value });
  };

  const handlePaxModalClick = (index) => {
    setModalCentered({ modalIndex: index, isShow: true });

    const form = hotelFormValue?.filter((form, ind) => ind == index)[0];

    setPaxFormValue({
      Adults: form?.PaxInfo?.Adults,
      Child: form?.PaxInfo?.Child,
      Infant: form?.PaxInfo?.Infant,
    });
  };

  const handlePaxSave = () => {
    setHotelFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[modalCentered?.modalIndex] = {
        ...newForm[modalCentered?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setModalCentered({ modalIndex: "", isShow: false });
  };

  const handleHikeChange = (e) => {
    const { value } = e.target;
    setHikePercent(value);

    const hikeMergedRoom = originalRoomDetails?.map((rooms) => {
      return rooms?.map((room) => {
        return {
          ...room,
          RoomCost:
            room?.RoomCost && !isNaN(room?.RoomCost)
              ? value
                ? Math.floor(
                  parseInt(room?.RoomCost) + (room?.RoomCost * value) / 100
                )
                : parseInt(room?.RoomCost)
              : 0,
        };
      });
    });
    setRoomDetails(hikeMergedRoom);

    // Same logic for meal details
    const hikeMergedMeal = originalMealDetails?.map((meals) => {
      return meals?.map((meal) => {
        return {
          ...meal,
          MealCost:
            meal?.MealCost && !isNaN(meal?.MealCost)
              ? value
                ? Math.floor(
                  parseInt(meal?.MealCost) + (meal?.MealCost * value) / 100
                )
                : parseInt(meal?.MealCost)
              : 0,
        };
      });
    });
    setMealDetails(hikeMergedMeal);
  };

  useEffect(() => {
    const calculateRoomCosts = (roomDetails) => {
      const roomCostMap = {};
      roomDetails.flat().forEach((room) => {
        const roomId = room.RoomBedTypeId;
        const roomCost = parseFloat(room.RoomCost) || 0;
        const roomType = room.RoomType;

        if (roomCostMap[roomId]) {
          roomCostMap[roomId].RoomCost += roomCost;
        } else {
          roomCostMap[roomId] = {
            RoomBedTypeId: roomId,
            RoomCost: roomCost,
            RoomType: roomType,
          };
        }
      });
      return Object.values(roomCostMap);
    };

    const applyMarkup = (roomCosts, markupPercent) => {
      return roomCosts.map((room) => {
        const markupValue = (room.RoomCost * markupPercent) / 100;
        const markedUpCost = room.RoomCost + markupValue;
        const mrkp = (room.RoomCost * 5) / 100;
        return {
          RoomBedTypeId: room.RoomBedTypeId,
          RoomCost: room.RoomCost,
          MarkedUpCost: markedUpCost.toFixed(2),
          MarkupPercent: markupPercent,
          RoomType: room.RoomType,
          Markup: mrkp,
        };
      });
    };

    let filteredRoomDetails = hotelFormValue
      ?.map((form, index) => {
        if (form?.ServiceId) {
          return roomDetails[index];
        } else {
          return null;
        }
      })
      .filter((form) => form != null);
    const roomCosts = calculateRoomCosts(filteredRoomDetails);

    const roomCostsWithMarkup = applyMarkup(roomCosts, hikePercent);
    const dblRoomRate = roomCostsWithMarkup?.find(
      (rates) => rates?.RoomBedTypeId == 4
    );
    dispatch(
      setHotelPrice(
        (parseInt(dblRoomRate?.RoomCost) + parseInt(dblRoomRate?.Markup)) / 2
      )
    );

    setCalculatedRateDetails((prevRates) => {
      return { ...prevRates, RoomRates: roomCostsWithMarkup };
    });
  }, [roomDetails, hikePercent]);

  useEffect(() => {
    const calculateMealCosts = (mealDetails) => {
      const mealCostMap = {};

      mealDetails.flat().forEach((meal) => {
        const mealId = meal.MealTypeId;
        const mealCost = parseFloat(meal.MealCost) || 0;

        if (mealCostMap[mealId]) {
          mealCostMap[mealId].MealCost += mealCost;
        } else {
          mealCostMap[mealId] = {
            MealTypeId: mealId,
            MealCost: mealCost,
          };
        }
      });

      return Object.values(mealCostMap);
    };

    const applyMarkup = (mealCosts, markupPercent) => {
      return mealCosts.map((meal) => {
        const markupValue = (meal.MealCost * markupPercent) / 100;
        const markedUpCost = meal.MealCost + markupValue;
        const mrkp = (meal?.MealCost * 5) / 100;
        return {
          MealTypeId: meal.MealTypeId,
          MealCost: meal.MealCost,
          MarkedUpCost: markedUpCost.toFixed(2),
          MarkupPercent: markupPercent,
          Markup: mrkp,
        };
      });
    };

    const filteredMealDetails = hotelFormValue
      ?.map((form, index) => {
        if (form?.ServiceId) {
          return mealDetails[index];
        } else {
          return null;
        }
      })
      .filter((form) => form != null);

    const mealCosts = calculateMealCosts(filteredMealDetails);
    const mealCostsWithMarkup = applyMarkup(mealCosts, hikePercent);

    const mealTotalPriceWithMarkup = () => {
      const totalPrice = mealCostsWithMarkup?.map(
        (item) => item?.MealCost + item?.Markup
      );
      const finalPrice = totalPrice?.reduce((curr, acc) => curr + acc, 0);
      return finalPrice;
    };
    dispatch(setMealPrice(mealTotalPriceWithMarkup()));

    setCalculatedRateDetails((prevRates) => {
      return { ...prevRates, MealRates: mealCostsWithMarkup };
    });
  }, [mealDetails, hikePercent]);

  const handleSupplementAllCheck = (id, e) => {
    const { checked } = e.target;
    const updatedMeal = mealDetails?.map((meal) => {
      return meal?.map((item) =>
        item?.MealTypeId == id ? { ...item, IsPrice: checked } : item
      );
    });
    setMealDetails(updatedMeal);
  };

  // calculating from destination & to destination
  useEffect(() => {
    const destinations = hotelFormValue?.map((hotel, index, hotelArr) => {
      return {
        From: hotel?.Destination,
        To: hotelArr[index + 1]?.Destination,
      };
    });

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
    hotelFormValue?.map((hotel) => hotel?.Destination).join(","),
    destinationList,
  ]);

  // =========================

  // const mainHotelCheckBox = useSelector(
  //   (state) => state.itineraryServiceCopyReducer.hotelCheckbox
  // );

  // useEffect(() => {
  //   // console.log("COPY67", mainHotelCheckBox);
  //   if (mainHotelCheckBox) {
  //     dispatch(
  //       setItineraryCopyHotelFormData({
  //         HotelForm: hotelFormValue,
  //         MealType: mealDetails,
  //         RoomBedType: roomDetails,
  //       })
  //     );
  //   }
  // }, [hotelFormValue, roomDetails, mealDetails, mainHotelCheckBox]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(setItineraryCopyHotelFormDataCheckbox(true));
  //   };
  // }, []);

  return (
    <>
      <div className="row mt-3 m-0">
        <ToastContainer />
        <div
          className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
          onClick={(e) => setIsOpen({ ...isOpen, original: !isOpen?.original })}
        >
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex gap-2">
              <img src={HotelIcon} alt="image" />
              <label htmlFor="" className="fs-5">
                Hotel
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
                  id="copy-hotel"
                  value="extrabed"
                  checked={isCopyHotel}
                // onChange={handleHotelCopy}
                />
                <label className="fontSize11px m-0 ms-1 " htmlFor="copy-hotel">
                  Copy
                </label>
              </div>
            )}
          </div>
          <div
            className="d-flex gap-4 align-items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {Type == "Main" && (
              <div
                className="d-flex gap-2 align-items-center hike-input"
                onClick={(e) => e.stopPropagation()}
              >
                <label htmlFor="" className="fs-6">
                  Hike
                </label>
                <input
                  name="Hike"
                  type="number"
                  className={`formControl3`}
                  value={hikePercent}
                  onChange={handleHikeChange}
                />
                <span className="fs-6">%</span>
              </div>
            )}
            {Type == "Main" && (
              <div
                className="hike-input d-flex align-items-center cursor-pointer"
                onClick={createHotelAlternate}
              >
                <label
                  className="fontSize11px cursor-pointer"
                  htmlFor="copy_hotel py-1"
                >
                  <FaPlus className="m-0 p-0" /> Upgrade
                </label>
              </div>
            )}
            <div className="form-check check-sm d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input height-em-1 width-em-1"
                id="extrabed_org"
                value="extrabed"
                checked={hotelCheckBox?.original?.includes("extrabed")}
                onChange={(e) => handleHotelCheckBox(e, "original")}
              />
              <label
                className="fontSize11px m-0 ms-1 mt-1"
                htmlFor="extrabed_org"
              >
                Extra Bed
              </label>
            </div>
            <div className="form-check check-sm d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input height-em-1 width-em-1"
                id="meal_plan_org"
                value="mealplan"
                checked={hotelCheckBox?.original?.includes("mealplan")}
                onChange={(e) => handleHotelCheckBox(e, "original")}
              />
              <label
                className="fontSize11px m-0 ms-1 mt-1"
                htmlFor="meal_plan_org"
              >
                Meal Plan
              </label>
            </div>
            <div className="form-check check-sm  d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input height-em-1 width-em-1"
                id="breakfast_org"
                value="1"
                checked={hotelCheckBox?.original?.includes("1")}
                onChange={(e) => handleHotelCheckBox(e, "original")}
              />
              <label
                className="fontSize11px m-0 ms-1 mt-1"
                htmlFor="breakfast_org"
              >
                Breakfast
              </label>
            </div>
            <div className="form-check check-sm d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input height-em-1 width-em-1"
                id="lunch_org"
                value="2"
                checked={hotelCheckBox?.original?.includes("2")}
                onChange={(e) => handleHotelCheckBox(e, "original")}
              />
              <label className="fontSize11px m-0 ms-1 mt-1" htmlFor="lunch_org">
                Lunch
              </label>
            </div>
            <div className="form-check check-sm d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input height-em-1 width-em-1"
                id="dinner_org"
                value="3"
                checked={hotelCheckBox?.original?.includes("3")}
                onChange={(e) => handleHotelCheckBox(e, "original")}
              />
              <label
                className="fontSize11px m-0 ms-1 mt-1"
                htmlFor="dinner_org"
              >
                Dinner
              </label>
            </div>
            <div>
              <span className="cursor-pointer fs-5">
                {!isOpen?.original ? (
                  <FaChevronCircleUp
                    className="text-primary"
                    onClick={(e) => {
                      e.stopPropagation(),
                        setIsOpen({ ...isOpen, original: !isOpen?.original });
                    }}
                  />
                ) : (
                  <FaChevronCircleDown
                    className="text-primary"
                    onClick={(e) => {
                      e.stopPropagation(),
                        setIsOpen({ ...isOpen, original: !isOpen?.original });
                    }}
                  />
                )}
              </span>
            </div>
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
            <div
              className="col-12 px-0 mt-2"
              style={{ transition: "0.5s ease" }}
            >
              <PerfectScrollbar>
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr className="its-table">
                      <th
                        rowSpan={2}
                        className="py-1 align-middle text-center days-width-9"
                      >
                        {hotelFormValue[0]?.Date ? "Day / Date" : "Day"}
                      </th>
                      {(Type == "Local" || Type == "Foreigner") && (
                        <th rowSpan={2} className="py-1 align-middle">
                          Escort
                        </th>
                      )}
                      <th rowSpan={2} className="py-1 align-middle">
                        Destination
                      </th>
                      <th rowSpan={2} className="py-1 align-middle">
                        Hotel Name
                      </th>
                      <th rowSpan={2} className="py-1 align-middle">
                        Overnight
                      </th>
                      <th rowSpan={2} className="py-1 align-middle">
                        Room Category
                      </th>
                      <th
                        style={{ display: "none" }}
                        // style={{ visibility: "hidden" }}
                        rowSpan={2}
                        className="py-1 align-middle"
                      >
                        Supplier
                      </th>
                      {(OptionQoutationData?.TourSummary?.PaxTypeName ===
                        "FIT" ||
                        OptionQoutationData?.TourSummary?.PaxTypeName ===
                        "BOTH") &&
                        roomDetails[0]?.length > 1 && (
                          <th
                            colSpan={
                              roomDetails &&
                                roomDetails[0]
                                  ?.map((room) => room?.RoomType)
                                  ?.includes("ExtraBed(A)")
                                ? hotelCheckBox?.original?.includes("extrabed")
                                  ? roomDetails[0]?.length
                                  : roomDetails[0]?.length - 1
                                : roomDetails?.[0]?.length || 0
                            }
                            className="py-1 align-middle"
                          >
                            FIT
                          </th>
                        )}
                      {(OptionQoutationData?.TourSummary?.PaxTypeName ===
                        "FIT" ||
                        OptionQoutationData?.TourSummary?.PaxTypeName ===
                        "BOTH") &&
                        roomDetails[0]?.length == 1 &&
                        hotelCheckBox?.original?.includes("extrabed") && (
                          <th
                            colSpan={
                              roomDetails &&
                                roomDetails[0]
                                  ?.map((room) => room?.RoomType)
                                  ?.includes("ExtraBed(A)")
                                ? hotelCheckBox?.original?.includes("extrabed")
                                  ? roomDetails[0]?.length
                                  : roomDetails[0]?.length - 1
                                : roomDetails?.[0]?.length || 0
                            }
                            className="py-1 align-middle"
                          >
                            FIT
                          </th>
                        )}
                      {(OptionQoutationData?.TourSummary?.PaxTypeName ===
                        "GIT" ||
                        OptionQoutationData?.TourSummary?.PaxTypeName ===
                        "BOTH") &&
                        roomDetails?.length > 1 &&
                        hotelCheckBox?.original?.includes("extrabed") && (
                          <th
                            colSpan={
                              roomDetails &&
                                roomDetails[0]
                                  ?.map((room) => room?.RoomType)
                                  ?.includes("ExtraBed(A)")
                                ? hotelCheckBox?.original?.includes("extrabed")
                                  ? roomDetails[0]?.length
                                  : roomDetails[0]?.length - 1
                                : roomDetails?.[0]?.length || 0
                            }
                            className="py-1 align-middle"
                          >
                            GIT
                          </th>
                        )}

                      {(OptionQoutationData?.TourSummary?.PaxTypeName ===
                        "GIT" ||
                        OptionQoutationData?.TourSummary?.PaxTypeName ===
                        "BOTH") &&
                        roomDetails?.length == 1 && (
                          <th
                            colSpan={
                              roomDetails &&
                                roomDetails[0]
                                  ?.map((room) => room?.RoomType)
                                  ?.includes("ExtraBed(A)")
                                ? hotelCheckBox?.original?.includes("extrabed")
                                  ? roomDetails[0]?.length
                                  : roomDetails[0]?.length - 1
                                : roomDetails?.[0]?.length || 0
                            }
                            className="py-1 align-middle"
                          >
                            GIT
                          </th>
                        )}
                      {hotelCheckBox?.original?.includes("mealplan") && (
                        <th rowSpan={2} className="py-1 align-middle">
                          Meal Plan
                        </th>
                      )}
                      {filterValuesFromArray(hotelCheckBox?.original, [
                        "1",
                        "2",
                        "3",
                      ]).length > 0 && (
                          <th
                            className="py-1 align-middle"
                            colSpan={
                              filterValuesFromArray(hotelCheckBox?.original, [
                                "1",
                                "2",
                                "3",
                              ]).length
                            }
                          >
                            <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                name="Includes"
                                id={`Includes`}
                                value={"Yes"}
                                checked={checkIncludes === "Yes"}
                                onChange={(e) =>
                                  setCheckIncludes(
                                    e.target.checked ? "Yes" : "No"
                                  )
                                }
                              />
                              <label htmlFor="Includes" className="mt-1">
                                Includes
                              </label>
                            </div>
                          </th>
                        )}
                    </tr>
                    <tr>
                      {(OptionQoutationData?.TourSummary?.PaxTypeName ==
                        "FIT" ||
                        OptionQoutationData?.TourSummary?.PaxTypeName ==
                        "BOTH") &&
                        (hotelCheckBox?.original?.includes("extrabed")
                          ? roomDetails[0]?.map((room, index) => {
                            return (
                              <th className="py-1" key={index}>
                                {room?.RoomType}
                              </th>
                            );
                          })
                          : roomDetails[0]?.map((room, index) => {
                            return (
                              room?.RoomType != "ExtraBed(A)" && (
                                <th className="py-1" key={index}>
                                  {room?.RoomType}
                                </th>
                              )
                            );
                          }))}
                      {(OptionQoutationData?.TourSummary?.PaxTypeName ==
                        "GIT" ||
                        OptionQoutationData?.TourSummary?.PaxTypeName ==
                        "BOTH") &&
                        (hotelCheckBox?.original?.includes("extrabed")
                          ? roomDetails[0]?.map((room, index) => {
                            return (
                              <th className="py-1" key={index}>
                                {room?.RoomType}
                              </th>
                            );
                          })
                          : roomDetails[0]?.map((room, index) => {
                            return (
                              room?.RoomType != "ExtraBed(A)" && (
                                <th className="py-1" key={index}>
                                  {room?.RoomType}
                                </th>
                              )
                            );
                          }))}

                      {/* {mealDetails[0]?.map((meal, mealIndex) => {
                        const mealArr = [
                          { Id: "1", Name: "Breakfast" },
                          { Id: "2", Name: "Lunch" },
                          { Id: "3", Name: "Dinner" },
                        ];
                        return (
                          hotelCheckBox?.original?.includes(
                            meal?.MealTypeId
                          ) && (
                            <th className="py-1 align-middle">
                              <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                                <input
                                  type="checkbox"
                                  className="form-check-input height-em-1 width-em-1"
                                  name="Breakfast"
                                  id={`mealcheck_${mealIndex}`}
                                  value={"Yes"}
                                  checked={mealDetails?.every((set) => {
                                    const data = set.find(
                                      (item) =>
                                        item.MealTypeId === meal?.MealTypeId
                                    );
                                    return data ? data.IsPrice === true : false;
                                  })}
                                  onChange={(e) =>
                                    handleSupplementAllCheck(
                                      meal?.MealTypeId,
                                      e
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`mealcheck_${mealIndex}`}
                                  className="mt-1"
                                >
                                  Supp{" "}
                                  {mealArr[mealIndex]?.Id == meal?.MealTypeId &&
                                    mealArr[mealIndex]?.Name}
                                </label>
                              </div>
                            </th>
                          )
                        );
                      })} */}
                      {hotelCheckBox?.original?.includes("1") && (
                        <th className="py-1 align-middle">
                          <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              name="Breakfast"
                              id={`breakfast_check`}
                              value={"Yes"}
                            // checked={checkIncludes === "Yes"}
                            // onChange={(e) =>
                            //   setCheckIncludes(
                            //     e.target.checked ? "Yes" : "No"
                            //   )
                            // }
                            />
                            <label htmlFor="breakfast_check" className="mt-1">
                              Supp Breakfast
                            </label>
                          </div>
                        </th>
                      )}
                      {hotelCheckBox?.original?.includes("2") && (
                        <th className="py-1 align-middle">
                          <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              name="Lunch"
                              id={`lunch_check`}
                              value={"Yes"}
                            // checked={checkIncludes === "Yes"}
                            // onChange={(e) =>
                            //   setCheckIncludes(
                            //     e.target.checked ? "Yes" : "No"
                            //   )
                            // }
                            />
                            <label htmlFor="lunch_check" className="mt-1">
                              Supp Lunch
                            </label>
                          </div>
                        </th>
                      )}
                      {hotelCheckBox?.original?.includes("3") && (
                        <th rowSpan={2} className="py-1 align-middle">
                          <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              name="Includes"
                              id={`dinner_check`}
                              value={"Yes"}
                            // checked={checkIncludes === "Yes"}
                            // onChange={(e) =>
                            //   setCheckIncludes(
                            //     e.target.checked ? "Yes" : "No"
                            //   )
                            // }
                            />
                            <label htmlFor="dinner_check" className="mt-1">
                              Supp Dinner
                            </label>
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {hotelFormValue.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="days-width-9">
                            <div className={`d-flex gap-1 `}>
                              <div className="d-flex gap-1">
                                <div
                                  className="d-flex align-items-center pax-icon"
                                  onClick={() => handlePaxModalClick(index)}
                                >
                                  <i className="fa-solid fa-person"></i>
                                </div>
                                <span
                                  onClick={() =>
                                    handleHotelTableIncrement(index)
                                  }
                                >
                                  <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                </span>

                                <span
                                  onClick={() =>
                                    handleHotelTableDecrement(index)
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
                                  className={`formControl1 ${isFocus == index + "a" && "focus-red"
                                    }`}
                                  onFocus={() => handleFocus(index + "a")}
                                  onBlur={handleBlur}
                                  value={hotelFormValue[index]?.Escort}
                                  onChange={(e) =>
                                    handleHotelFormChange(
                                      index,
                                      "",
                                      "original",
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
                                className={`formControl1 ${isFocus == index + "b" && "focus-red"
                                  }`}
                                value={hotelFormValue[index]?.Destination}
                                onChange={(e) =>
                                  handleHotelFormChange(
                                    index,
                                    "",
                                    "original",
                                    e
                                  )
                                }
                                onFocus={() => handleFocus(index + "b")}
                                onBlur={handleBlur}
                              >
                                <option value="">Select</option>;
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
                          <td>
                            <div>
                              <select
                                name="ServiceId"
                                id=""
                                value={hotelFormValue[index]?.ServiceId}
                                className={`formControl1 ${isFocus == index + "c" && "focus-red"
                                  }`}
                                onChange={(e) =>
                                  handleHotelFormChange(
                                    index,
                                    "",
                                    "original",
                                    e
                                  )
                                }
                                onFocus={() => handleFocus(index + "c")}
                                onBlur={handleBlur}
                              >
                                <option value="">Select</option>;
                                {hotelList[index]?.map((hotel, index) => {
                                  return (
                                    <option key={index} value={hotel?.id}>
                                      {hotel?.HotelName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="OverNight"
                                id=""
                                className={`formControl1 ${isFocus == index + "d" && "focus-red"
                                  }`}
                                value={hotelFormValue[index]?.OverNight}
                                onChange={(e) =>
                                  handleHotelFormChange(
                                    index,
                                    "",
                                    "original",
                                    e
                                  )
                                }
                                onFocus={() => handleFocus(index + "d")}
                                onBlur={handleBlur}
                              >
                                <option value="">Select</option>
                                {overnightList?.map((overnight, index) => {
                                  return (
                                    <option value={overnight?.Id} key={index}>
                                      {overnight?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="RoomCategory"
                                id=""
                                className={`formControl1 ${isFocus == index + "roomCategory" &&
                                  "focus-red"
                                  }`}
                                value={hotelFormValue[index]?.RoomCategory}
                                onChange={(e) =>
                                  handleHotelFormChange(
                                    index,
                                    "",
                                    "original",
                                    e
                                  )
                                }
                                onFocus={() =>
                                  handleFocus(index + "roomCategory")
                                }
                                onBlur={handleBlur}
                              >
                                <option value="">Select</option>
                                {roomList?.map((room, index) => {
                                  return (
                                    <option value={room?.id} key={index + "h"}>
                                      {room?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td style={{ display: "none" }}>
                            <div>
                              <select
                                name="Supplier"
                                id=""
                                className={`formControl1 ${isFocus == index + "supplier" && "focus-red"
                                  }`}
                                value={hotelFormValue[index]?.Supplier}
                                onChange={(e) =>
                                  handleHotelFormChange(
                                    index,
                                    "",
                                    "original",
                                    e
                                  )
                                }
                                onFocus={() => handleFocus(index + "supplier")}
                                onBlur={handleBlur}
                              >
                                <option value="">Select</option>
                                {supplierList[index]?.map((supplier, idx) => {
                                  return (
                                    <option
                                      value={supplier?.id}
                                      key={idx + "h"}
                                    >
                                      {supplier?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>

                          {(OptionQoutationData?.TourSummary?.PaxTypeName ==
                            "FIT" ||
                            OptionQoutationData?.TourSummary?.PaxTypeName ==
                            "BOTH") && (
                              <>
                                {hotelCheckBox?.original?.includes("extrabed")
                                  ? roomDetails[index]?.map((room, ind) => {
                                    return (
                                      <td key={ind + 1}>
                                        <div>
                                          <input
                                            id=""
                                            className={`formControl1 width50px ${isFocus == index + "f" + ind &&
                                              "focus-red"
                                              }`}
                                            onFocus={() =>
                                              handleFocus(index + "f" + ind)
                                            }
                                            onBlur={handleBlur}
                                            name="RoomCost"
                                            value={
                                              roomDetails[index][ind]
                                                ?.RoomCost || " "
                                            }
                                            onChange={(e) =>
                                              handleRoomTypeChange(
                                                index,
                                                ind,
                                                "",
                                                "original",
                                                e
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    );
                                  })
                                  : roomDetails[index]?.map((room, ind) => {
                                    return (
                                      room?.RoomType != "ExtraBed(A)" && (
                                        <td key={ind + 1}>
                                          <div>
                                            <input
                                              id=""
                                              className={`formControl1 width50px ${isFocus == index + "f" + ind &&
                                                "focus-red"
                                                }`}
                                              onFocus={() =>
                                                handleFocus(index + "f" + ind)
                                              }
                                              onBlur={handleBlur}
                                              name="RoomCost"
                                              value={
                                                roomDetails[index][ind]
                                                  ?.RoomCost || ""
                                              }
                                              onChange={(e) =>
                                                handleRoomTypeChange(
                                                  index,
                                                  ind,
                                                  "",
                                                  "original",
                                                  e
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      )
                                    );
                                  })}
                              </>
                            )}
                          {(OptionQoutationData?.TourSummary?.PaxTypeName ==
                            "GIT" ||
                            OptionQoutationData?.TourSummary?.PaxTypeName ==
                            "BOTH") && (
                              <>
                                {hotelCheckBox?.original?.includes("extrabed")
                                  ? roomDetails[index]?.map((room, ind) => {
                                    return (
                                      <td key={ind + 1}>
                                        <div>
                                          <input
                                            id=""
                                            className={`formControl1 width50px ${isFocus == index + "f" + ind &&
                                              "focus-red"
                                              }`}
                                            onFocus={() =>
                                              handleFocus(index + "f" + ind)
                                            }
                                            onBlur={handleBlur}
                                            name="RoomCost"
                                            value={
                                              roomDetails[index][ind]?.RoomCost
                                            }
                                            onChange={(e) =>
                                              handleRoomTypeChange(
                                                index,
                                                ind,
                                                "",
                                                "original",
                                                e
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    );
                                  })
                                  : roomDetails[index]?.map((room, ind) => {
                                    return (
                                      room?.RoomType != "ExtraBed(A)" && (
                                        <td key={ind + 1}>
                                          <div>
                                            <input
                                              id=""
                                              className={`formControl1 width50px ${isFocus == index + "f" + ind &&
                                                "focus-red"
                                                }`}
                                              onFocus={() =>
                                                handleFocus(index + "f" + ind)
                                              }
                                              onBlur={handleBlur}
                                              name="RoomCost"
                                              value={
                                                roomDetails[index][ind]
                                                  ?.RoomCost
                                              }
                                              onChange={(e) =>
                                                handleRoomTypeChange(
                                                  index,
                                                  ind,
                                                  "",
                                                  "original",
                                                  e
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      )
                                    );
                                  })}
                              </>
                            )}
                          {hotelCheckBox?.original?.includes("mealplan") && (
                            <td>
                              <div>
                                <select
                                  name="MealPlan"
                                  id=""
                                  className={`formControl1 ${isFocus == index + "j" && "focus-red"
                                    }`}
                                  onFocus={() => handleFocus(index + "j")}
                                  onBlur={handleBlur}
                                  value={hotelFormValue[index]?.MealPlan}
                                  onChange={(e) =>
                                    handleHotelFormChange(
                                      index,
                                      "",
                                      "original",
                                      e
                                    )
                                  }
                                >
                                  <option value="">Select</option>
                                  {mealPlanList?.map((meal, index) => {
                                    return (
                                      <option
                                        value={meal?.id}
                                        key={index + "h"}
                                      >
                                        {meal?.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </td>
                          )}
                          {mealDetails[index]?.map((meal, mealIndex) => {
                            return (
                              hotelCheckBox?.original?.includes(
                                meal?.MealTypeId
                              ) && (
                                <td>
                                  <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                                    <input
                                      type="checkbox"
                                      className={`form-check-input height-em-1 width-em-1`}
                                      name="Breakfast"
                                      id={`breakfast${index}`}
                                      value="1"
                                      checked={
                                        mealDetails[index][mealIndex]?.IsPrice
                                      }
                                      onChange={(e) =>
                                        handleMealFormChange(
                                          index,
                                          mealIndex,
                                          "",
                                          "original",
                                          e
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      className={`formControl1 width50px ${isFocus == `${index}+${mealIndex}` &&
                                        "focus-red"
                                        }`}
                                      onFocus={() =>
                                        handleFocus(`${index}+${mealIndex}`)
                                      }
                                      onBlur={handleBlur}
                                      value={
                                        mealDetails[index][mealIndex]?.MealCost
                                      }
                                      onChange={(e) =>
                                        handleMealFormChange(
                                          index,
                                          mealIndex,
                                          "",
                                          "original",
                                          e
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              )
                            );
                          })}
                        </tr>
                      );
                    })}
                    <tr className="costing-td">
                      <td
                        colSpan={Type == "Local" || Type == "Foreigner" ? 5 : 4}
                        className="text-center fs-6"
                        rowSpan={3}
                      >
                        Total
                      </td>
                      <td>Hotel Cost</td>
                      {hotelCheckBox?.original?.includes("extrabed")
                        ? roomDetails[0]?.map((room, index) => {
                          const rate = calculatedRateDetails?.RoomRates?.find(
                            (rates) =>
                              room?.RoomBedTypeId === rates?.RoomBedTypeId
                          );
                          return <td key={index}>{mathRoundHelper(rate?.RoomCost)}</td>;
                        })
                        : roomDetails[0]?.map((room, index) => {
                          const rate = calculatedRateDetails?.RoomRates?.find(
                            (rates) =>
                              room?.RoomBedTypeId === rates?.RoomBedTypeId
                          );
                          return (
                            room?.RoomType !== "ExtraBed(A)" && (
                              <td key={index}>{mathRoundHelper(rate?.RoomCost)}</td>
                            )
                          );
                        })}
                      {hotelCheckBox?.original?.includes("mealplan") && (
                        <td></td>
                      )}
                      {mealDetails[0]?.map((meal, index) => {
                        const rate = calculatedRateDetails?.MealRates?.find(
                          (rates) => meal?.MealTypeId == rates?.MealTypeId
                        );

                        return (
                          hotelCheckBox?.original?.includes(
                            meal?.MealTypeId
                          ) && <td>{mathRoundHelper(rate?.MealCost)}</td>
                        );
                      })}
                    </tr>
                    <tr className="costing-td">
                      <td>Markup(5) % </td>
                      {hotelCheckBox?.original?.includes("extrabed")
                        ? roomDetails[0]?.map((room, index) => {
                          const rate = calculatedRateDetails?.RoomRates?.find(
                            (rates) =>
                              room?.RoomBedTypeId === rates?.RoomBedTypeId
                          );
                          return <td key={index}>{mathRoundHelper(rate?.Markup)}</td>;
                        })
                        : roomDetails[0]?.map((room, index) => {
                          const rate = calculatedRateDetails?.RoomRates?.find(
                            (rates) =>
                              room?.RoomBedTypeId === rates?.RoomBedTypeId
                          );
                          return (
                            room?.RoomType !== "ExtraBed(A)" && (
                              <td key={index}>{mathRoundHelper(rate?.Markup)}</td>
                            )
                          );
                        })}
                      {hotelCheckBox?.original?.includes("mealplan") && (
                        <td></td>
                      )}
                      {mealDetails[0]?.map((meal, index) => {
                        const rate = calculatedRateDetails?.MealRates?.find(
                          (rates) => meal?.MealTypeId == rates?.MealTypeId
                        );

                        return (
                          hotelCheckBox?.original?.includes(
                            meal?.MealTypeId
                          ) && <td>{mathRoundHelper(rate?.Markup)}</td>
                        );
                      })}
                    </tr>
                    <tr className="costing-td">
                      <td>Total</td>
                      {hotelCheckBox?.original?.includes("extrabed")
                        ? roomDetails[0]?.map((room, index) => {
                          const rate = calculatedRateDetails?.RoomRates?.find(
                            (rates) =>
                              room?.RoomBedTypeId === rates?.RoomBedTypeId
                          );
                          return (
                            <td key={index}>
                              {mathRoundHelper((
                                parseFloat(rate?.RoomCost || 0) +
                                parseFloat(rate?.Markup || 0)
                              ).toFixed(2))}
                            </td>
                          );
                        })
                        : roomDetails[0]?.map((room, index) => {
                          const rate = calculatedRateDetails?.RoomRates?.find(
                            (rates) =>
                              room?.RoomBedTypeId === rates?.RoomBedTypeId
                          );
                          return (
                            room?.RoomType !== "ExtraBed(A)" && (
                              <td key={index}>
                                {mathRoundHelper((
                                  parseFloat(rate?.RoomCost || 0) +
                                  parseFloat(rate?.Markup || 0)
                                ).toFixed(2))}
                              </td>
                            )
                          );
                        })}
                      {hotelCheckBox?.original?.includes("mealplan") && (
                        <td></td>
                      )}
                      {mealDetails[0]?.map((meal, index) => {
                        const rate = calculatedRateDetails?.MealRates?.find(
                          (rates) => meal?.MealTypeId === rates?.MealTypeId
                        );
                        return (
                          hotelCheckBox?.original?.includes(
                            meal?.MealTypeId
                          ) && (
                            <td key={index}>
                              {mathRoundHelper((
                                parseFloat(rate?.MealCost || 0) +
                                parseFloat(rate?.Markup || 0)
                              ).toFixed(2))}
                            </td>
                          )
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </PerfectScrollbar>
            </div>
          </>
        )}
        {isOpen?.original && (
          <div className="row">
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
      </div>
      {alternateFormValue?.map((alternate, index) => {
        return (
          <div className="row mt-3 m-0" key={index}>
            <div
              className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
              onClick={(e) =>
                setIsOpen({
                  ...isOpen,
                  copy: isOpen.copy.map((item, i) =>
                    i === index ? !item : item
                  ),
                })
              }
            >
              <div className="d-flex gap-4 align-items-center">
                <div className="d-flex gap-4 align-items-center">
                  <div className="d-flex gap-2">
                    <img src={HotelIcon} alt="image" />
                    <label htmlFor="" className="fs-5">
                      Hotel Upgrade
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
                      name="Escort"
                      type="number"
                      value={hikePercent}
                      className={`formControl3`}
                    />
                    <span className="fs-6">%</span>
                  </div>
                </div>
              </div>
              <div
                className="d-flex gap-4 align-items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="hike-input d-flex align-items-center cursor-pointer"
                  onClick={() => removeHotelAlternate(index)}
                >
                  <label
                    className="fontSize11px cursor-pointer"
                    htmlFor="copy_hotel py-1"
                  >
                    <FaMinus className="m-0 p-0" /> Remove
                  </label>
                </div>
                {alternateRoomDetails[0]?.Form[0]
                  ?.map((room) => room?.RoomType)
                  ?.includes("ExtraBed(A)") && (
                    <div className="form-check check-sm d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input height-em-1 width-em-1"
                        id={`extrabed_cop${index}`}
                        value={`extrabed`}
                        checked={hotelCheckBox?.copy[index]?.includes("extrabed")}
                        onChange={(e) => handleHotelCheckBox(e, "copy", index)}
                      />
                      <label
                        className="fontSize11px m-0 ms-1 mt-1"
                        htmlFor={`extrabed_cop${index}`}
                      >
                        Extra Bed
                      </label>
                    </div>
                  )}
                <div className="form-check check-sm d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input height-em-1 width-em-1"
                    id={`meal_plan_cop${index}`}
                    value="mealplan"
                    checked={hotelCheckBox?.copy[index]?.includes("mealplan")}
                    onChange={(e) => handleHotelCheckBox(e, "copy", index)}
                  />
                  <label
                    className="fontSize11px m-0 ms-1 mt-1"
                    htmlFor={`meal_plan_cop${index}`}
                  >
                    Meal Plan
                  </label>
                </div>
                <div className="form-check check-sm d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input height-em-1 width-em-1"
                    id={`breakfast_cop${index}`}
                    value="1"
                    checked={hotelCheckBox?.copy[index]?.includes("1")}
                    onChange={(e) => handleHotelCheckBox(e, "copy", index)}
                  />
                  <label
                    className="fontSize11px m-0 ms-1 mt-1"
                    htmlFor={`breakfast_cop${index}`}
                  >
                    Breakfast
                  </label>
                </div>
                <div className="form-check check-sm d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input height-em-1 width-em-1"
                    id={`lunch_cop${index}`}
                    value="2"
                    checked={hotelCheckBox?.copy[index]?.includes("2")}
                    onChange={(e) => handleHotelCheckBox(e, "copy", index)}
                  />
                  <label
                    className="fontSize11px m-0 ms-1 mt-1"
                    htmlFor={`lunch_cop${index}`}
                  >
                    Lunch
                  </label>
                </div>
                <div className="form-check check-sm d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input height-em-1 width-em-1"
                    id={`dinner_cop${index}`}
                    value="3"
                    checked={hotelCheckBox?.copy[index]?.includes("3")}
                    onChange={(e) => handleHotelCheckBox(e, "copy", index)}
                  />
                  <label
                    className="fontSize11px m-0 ms-1 mt-1"
                    htmlFor={`dinner_cop${index}`}
                  >
                    Dinner
                  </label>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <span className="cursor-pointer fs-5">
                    {!isOpen ? (
                      <FaChevronCircleUp
                        className="text-primary"
                        onClick={(e) =>
                          setIsOpen({
                            ...isOpen,
                            copy: isOpen.copy.map((item, i) =>
                              i === index ? !item : item
                            ),
                          })
                        }
                      />
                    ) : (
                      <FaChevronCircleDown
                        className="text-primary"
                        onClick={(e) =>
                          setIsOpen({
                            ...isOpen,
                            copy: isOpen.copy.map((item, i) =>
                              i === index ? !item : item
                            ),
                          })
                        }
                      />
                    )}
                  </span>
                </div>
              </div>
            </div>
            {isOpen?.copy[index] && (
              <>
                <div
                  className="col-12 px-0 mt-2"
                  style={{ transition: "0.5s ease" }}
                >
                  <PerfectScrollbar>
                    <table class="table table-bordered itinerary-table">
                      <thead>
                        <tr className="its-table">
                          <th
                            rowSpan={2}
                            className="py-1 align-middle text-center"
                          >
                            {hotelFormValue[0]?.Date ? "Day / Date" : "Day"}
                          </th>
                          {(Type == "Local" || Type == "Foreigner") && (
                            <th rowSpan={2} className="py-1 align-middle">
                              Escort
                            </th>
                          )}
                          <th rowSpan={2} className="py-1 align-middle">
                            Destination
                          </th>
                          <th rowSpan={2} className="py-1 align-middle">
                            Hotel Name
                          </th>
                          <th rowSpan={2} className="py-1 align-middle">
                            Overnight
                          </th>
                          <th rowSpan={2} className="py-1 align-middle">
                            Room Category
                          </th>
                          <th
                            style={{ display: "none" }}
                            rowSpan={2}
                            className="py-1 align-middle"
                          >
                            Supplier
                          </th>

                          {(OptionQoutationData?.TourSummary?.PaxTypeName ===
                            "FIT" ||
                            OptionQoutationData?.TourSummary?.PaxTypeName ===
                            "BOTH") &&
                            alternateRoomDetails[index]?.Form[0]?.length >
                            1 && (
                              <th
                                colSpan={
                                  alternateRoomDetails[0]?.Form &&
                                    alternateRoomDetails[0]?.Form[0]
                                      ?.map((room) => room?.RoomType)
                                      ?.includes("ExtraBed(A)")
                                    ? hotelCheckBox?.copy[index]?.includes(
                                      "extrabed"
                                    )
                                      ? alternateRoomDetails[0]?.Form[0]?.length
                                      : alternateRoomDetails[0]?.Form[0]
                                        ?.length - 1
                                    : alternateRoomDetails?.[0]?.Form[0]
                                      ?.length || 0
                                }
                                className="py-1 align-middle"
                              >
                                FIT
                              </th>
                            )}
                          {(OptionQoutationData?.TourSummary?.PaxTypeName ===
                            "FIT" ||
                            OptionQoutationData?.TourSummary?.PaxTypeName ===
                            "BOTH") &&
                            alternateRoomDetails[index]?.Form[0]?.length == 1 &&
                            hotelCheckBox?.copy[index]?.includes(
                              "extrabed"
                            ) && (
                              <th
                                colSpan={
                                  alternateRoomDetails[0]?.Form &&
                                    alternateRoomDetails[0]?.Form[0]
                                      ?.map((room) => room?.RoomType)
                                      ?.includes("ExtraBed(A)")
                                    ? hotelCheckBox?.copy[index]?.includes(
                                      "extrabed"
                                    )
                                      ? alternateRoomDetails[0]?.Form[0]?.length
                                      : alternateRoomDetails[0]?.Form[0]
                                        ?.length - 1
                                    : alternateRoomDetails?.[0]?.Form[0]
                                      ?.length || 0
                                }
                                className="py-1 align-middle"
                              >
                                FIT
                              </th>
                            )}

                          {(OptionQoutationData?.TourSummary?.PaxTypeName ===
                            "GIT" ||
                            OptionQoutationData?.TourSummary?.PaxTypeName ===
                            "BOTH") &&
                            alternateRoomDetails[0]?.Form?.length > 1 && (
                              <th
                                colSpan={
                                  alternateRoomDetails[0]?.Form &&
                                    alternateRoomDetails[0]?.Form[0]
                                      ?.map((room) => room?.RoomType)
                                      ?.includes("ExtraBed(A)")
                                    ? hotelCheckBox?.copy[index]?.includes(
                                      "extrabed"
                                    )
                                      ? alternateRoomDetails[0]?.Form[0]?.length
                                      : alternateRoomDetails[0]?.Form[0]
                                        ?.length - 1
                                    : alternateRoomDetails[0]?.Form[0]
                                      ?.length || 0
                                }
                                className="py-1 align-middle"
                              >
                                GIT
                              </th>
                            )}
                          {(OptionQoutationData?.TourSummary?.PaxTypeName ===
                            "GIT" ||
                            OptionQoutationData?.TourSummary?.PaxTypeName ===
                            "BOTH") &&
                            alternateRoomDetails[0]?.Form?.length == 1 &&
                            hotelCheckBox?.copy[index]?.includes(
                              "extrabed"
                            ) && (
                              <th
                                colSpan={
                                  alternateRoomDetails[0]?.Form &&
                                    alternateRoomDetails[0]?.Form[0]
                                      ?.map((room) => room?.RoomType)
                                      ?.includes("ExtraBed(A)")
                                    ? hotelCheckBox?.copy[index]?.includes(
                                      "extrabed"
                                    )
                                      ? alternateRoomDetails[0]?.Form[0]?.length
                                      : alternateRoomDetails[0]?.Form[0]
                                        ?.length - 1
                                    : alternateRoomDetails[0]?.Form[0]
                                      ?.length || 0
                                }
                                className="py-1 align-middle"
                              >
                                GIT
                              </th>
                            )}

                          {hotelCheckBox?.copy[index]?.includes("mealplan") && (
                            <th rowSpan={2} className="py-1 align-middle">
                              Meal Plan
                            </th>
                          )}
                          {filterValuesFromArray(hotelCheckBox?.copy[index], [
                            "1",
                            "2",
                            "3",
                          ]).length > 0 && (
                              <th
                                className="py-1 align-middle"
                                colSpan={
                                  filterValuesFromArray(
                                    hotelCheckBox?.copy[index],
                                    ["1", "2", "3"]
                                  ).length
                                }
                              >
                                <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="form-check-input height-em-1 width-em-1"
                                    name="Includes"
                                    id={`Alternate_Includes`}
                                    value={"Yes"}
                                  // checked={checkIncludes === "Yes"}
                                  />
                                  <label
                                    htmlFor="Alternate_Includes"
                                    className="mt-1"
                                  >
                                    Includes
                                  </label>
                                </div>
                              </th>
                            )}
                        </tr>
                        <tr>
                          {(OptionQoutationData?.TourSummary?.PaxTypeName ==
                            "FIT" ||
                            OptionQoutationData?.TourSummary?.PaxTypeName ==
                            "BOTH") &&
                            (hotelCheckBox?.copy[index]?.includes("extrabed")
                              ? alternateRoomDetails[0]?.Form[0]?.map(
                                (room, index) => {
                                  return (
                                    <th className="py-1" key={index}>
                                      {room?.RoomType}
                                    </th>
                                  );
                                }
                              )
                              : alternateRoomDetails[0]?.Form[0]?.map(
                                (room, index) => {
                                  return (
                                    room?.RoomType != "ExtraBed(A)" && (
                                      <th className="py-1" key={index}>
                                        {room?.RoomType}
                                      </th>
                                    )
                                  );
                                }
                              ))}
                          {(OptionQoutationData?.TourSummary?.PaxTypeName ==
                            "GIT" ||
                            OptionQoutationData?.TourSummary?.PaxTypeName ==
                            "BOTH") &&
                            (hotelCheckBox?.copy[index]?.includes("extrabed")
                              ? alternateRoomDetails[0]?.Form[0]?.map(
                                (room, index) => {
                                  return (
                                    <th className="py-1" key={index}>
                                      {room?.RoomType}
                                    </th>
                                  );
                                }
                              )
                              : alternateRoomDetails[0]?.Form[0]?.map(
                                (room, index) => {
                                  return (
                                    room?.RoomType != "ExtraBed(A)" && (
                                      <th className="py-1" key={index}>
                                        {room?.RoomType}
                                      </th>
                                    )
                                  );
                                }
                              ))}
                          {hotelCheckBox?.copy[index]?.includes("1") && (
                            <th className="py-1 align-middle">
                              Supp Breakfast
                            </th>
                          )}
                          {hotelCheckBox?.copy[index]?.includes("2") && (
                            <th className="py-1 align-middle">Supp Lunch</th>
                          )}
                          {hotelCheckBox?.copy[index]?.includes("3") && (
                            <th rowSpan={2} className="py-1 align-middle">
                              Supp Dinner
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {alternate?.Form?.map((item, hotelIndex) => {
                          return (
                            <tr key={hotelIndex + 1}>
                              <td>
                                <div className={`d-flex gap-1 `}>
                                  <div className="d-flex gap-1">
                                    <span>
                                      <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                    </span>

                                    <span>
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
                                      className={`formControl1 ${isFocus == hotelIndex + "a" &&
                                        "focus-red"
                                        }`}
                                      onFocus={() =>
                                        handleFocus(hotelIndex + "a")
                                      }
                                      onBlur={handleBlur}
                                      value={
                                        alternateFormValue[index][hotelIndex]
                                          ?.Escort
                                      }
                                      onChange={(e) =>
                                        handleHotelFormChange(
                                          index,
                                          hotelIndex,
                                          "alternate",
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
                                    className={`formControl1 ${isFocus == hotelIndex + "b" && "focus-red"
                                      }`}
                                    // value={
                                    //   alternateFormValue[index][hotelIndex]
                                    //     ?.Destination
                                    // }

                                    value={
                                      alternateFormValue[0].Form[hotelIndex]
                                        ?.Destination
                                    }
                                    onChange={(e) =>
                                      handleHotelFormChange(
                                        index,
                                        hotelIndex,
                                        "alternate",
                                        e
                                      )
                                    }
                                    onFocus={() =>
                                      handleFocus(hotelItineraryValue + "b")
                                    }
                                    onBlur={handleBlur}
                                  >
                                    <option value="">Select</option>;
                                    {destinationList?.map(
                                      (destination, index) => {
                                        return (
                                          <option
                                            value={destination?.id}
                                            key={index + 1}
                                          >
                                            {destination?.Name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <select
                                    name="ServiceId"
                                    id=""
                                    value={
                                      alternateFormValue[index]?.Form[
                                        hotelIndex
                                      ]?.ServiceId
                                    }
                                    className={`formControl1 ${isFocus == index + "c" && "focus-red"
                                      }`}
                                    onChange={(e) =>
                                      handleHotelFormChange(
                                        index,
                                        hotelIndex,
                                        "alternate",
                                        e
                                      )
                                    }
                                    onFocus={() => handleFocus(index + "c")}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">Select</option>;
                                    {hotelList[index]?.map((hotel, index) => {
                                      return (
                                        <option key={index} value={hotel?.id}>
                                          {hotel?.HotelName}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <select
                                    name="OverNight"
                                    id=""
                                    className={`formControl1 ${isFocus == index + "d" && "focus-red"
                                      }`}
                                    value={
                                      alternateFormValue[index]?.Form[
                                        hotelIndex
                                      ]?.OverNight
                                    }
                                    onChange={(e) =>
                                      handleHotelFormChange(
                                        index,
                                        hotelIndex,
                                        "alternate",
                                        e
                                      )
                                    }
                                    onFocus={() => handleFocus(index + "d")}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">Select</option>
                                    {overnightList?.map((overnight, index) => {
                                      return (
                                        <option
                                          value={overnight?.Id}
                                          key={index}
                                        >
                                          {overnight?.Name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <select
                                    name="RoomCategory"
                                    id=""
                                    className={`formControl1 ${isFocus == hotelIndex + "e" && "focus-red"
                                      }`}
                                    value={
                                      alternateFormValue[index]?.Form[
                                        hotelIndex
                                      ]?.RoomCategory
                                    }
                                    onChange={(e) =>
                                      handleHotelFormChange(
                                        index,
                                        hotelIndex,
                                        "alternate",
                                        e
                                      )
                                    }
                                    onFocus={() => handleFocus(index + "e")}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">Select</option>
                                    {roomList?.map((room, index) => {
                                      return (
                                        <option
                                          value={room?.id}
                                          key={index + "h"}
                                        >
                                          {room?.Name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </td>
                              <td style={{ display: "none" }}>
                                <div>
                                  <select
                                    name="Supplier"
                                    id=""
                                    className={`formControl1 ${isFocus == index + "e" && "focus-red"
                                      }`}
                                    value={
                                      alternateFormValue[index]?.Form[
                                        hotelIndex
                                      ]?.Supplier
                                    }
                                    onChange={(e) =>
                                      handleHotelFormChange(
                                        index,
                                        hotelIndex,
                                        "alternate",
                                        e
                                      )
                                    }
                                    onFocus={() => handleFocus(index + "e")}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">Select</option>
                                    {supplierList[index]?.map((room, index) => {
                                      return (
                                        <option
                                          value={room?.id}
                                          key={index + "h"}
                                        >
                                          {room?.Name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </td>
                              {(OptionQoutationData?.TourSummary?.PaxTypeName ==
                                "FIT" ||
                                OptionQoutationData?.TourSummary?.PaxTypeName ==
                                "BOTH") && (
                                  <>
                                    {hotelCheckBox?.copy[index]?.includes(
                                      "extrabed"
                                    )
                                      ? alternateRoomDetails[index]?.Form[
                                        hotelIndex
                                      ]?.map((room, roomInd) => {
                                        return (
                                          <td key={roomInd + 1}>
                                            <div>
                                              <input
                                                className="formControl1 width50px"
                                                name="RoomCost"
                                                value={Math.round(
                                                  roomRates[index]?.[roomInd]
                                                    ?.RoomCost || ""
                                                )}
                                                readOnly
                                              />
                                            </div>
                                          </td>
                                        );
                                      })
                                      : alternateRoomDetails[index]?.Form[
                                        hotelIndex
                                      ]?.map((room, roomInd) => {
                                        return (
                                          room?.RoomType != "ExtraBed(A)" && (
                                            <td key={roomInd + 1}>
                                              <div>
                                                <input
                                                  id=""
                                                  className={`formControl1 width50px ${isFocus ==
                                                    index + "f" + roomInd &&
                                                    "focus-red"
                                                    }`}
                                                  onFocus={() =>
                                                    handleFocus(
                                                      index + "f" + roomInd
                                                    )
                                                  }
                                                  onBlur={handleBlur}
                                                  name="RoomCost"
                                                  value={
                                                    alternateRoomDetails[index]
                                                      ?.Form[hotelIndex][
                                                      roomInd
                                                    ]?.RoomCost
                                                  }
                                                  onChange={(e) =>
                                                    handleRoomTypeChange(
                                                      index,
                                                      hotelIndex,
                                                      roomInd,
                                                      "alternate",
                                                      e
                                                    )
                                                  }
                                                />
                                              </div>
                                            </td>
                                          )
                                        );
                                      })}
                                  </>
                                )}
                              {(OptionQoutationData?.TourSummary?.PaxTypeName ==
                                "GIT" ||
                                OptionQoutationData?.TourSummary?.PaxTypeName ==
                                "BOTH") && (
                                  <>
                                    {hotelCheckBox?.copy[index]?.includes(
                                      "extrabed"
                                    )
                                      ? alternateRoomDetails[index]?.Form[
                                        hotelIndex
                                      ]?.map((room, roomInd) => {
                                        return (
                                          <td key={roomInd + 1}>
                                            <div>
                                              <input
                                                id=""
                                                className={`formControl1 ${isFocus ==
                                                  index + "f" + roomInd &&
                                                  "focus-red"
                                                  }`}
                                                onFocus={() =>
                                                  handleFocus(
                                                    index + "f" + roomInd
                                                  )
                                                }
                                                onBlur={handleBlur}
                                                name="RoomCost"
                                                value={
                                                  alternateRoomDetails[index]
                                                    ?.Form[hotelIndex][roomInd]
                                                    ?.RoomCost
                                                }
                                                onChange={(e) =>
                                                  handleRoomTypeChange(
                                                    index,
                                                    hotelIndex,
                                                    roomInd,
                                                    "alternate",
                                                    e
                                                  )
                                                }
                                              />
                                            </div>
                                          </td>
                                        );
                                      })
                                      : alternateRoomDetails[index]?.Form[
                                        hotelIndex
                                      ]?.map((room, roomInd) => {
                                        return (
                                          room?.RoomType != "ExtraBed(A)" && (
                                            <td key={roomInd + 1}>
                                              <div>
                                                <input
                                                  id=""
                                                  className={`formControl1 width50px ${isFocus ==
                                                    index + "f" + roomInd &&
                                                    "focus-red"
                                                    }`}
                                                  onFocus={() =>
                                                    handleFocus(
                                                      index + "f" + roomInd
                                                    )
                                                  }
                                                  onBlur={handleBlur}
                                                  name="RoomCost"
                                                  value={
                                                    alternateRoomDetails[index]
                                                      ?.Form[hotelIndex][
                                                      roomInd
                                                    ]?.RoomCost
                                                  }
                                                  onChange={(e) =>
                                                    handleRoomTypeChange(
                                                      index,
                                                      hotelIndex,
                                                      roomInd,
                                                      "alternate",
                                                      e
                                                    )
                                                  }
                                                />
                                              </div>
                                            </td>
                                          )
                                        );
                                      })}
                                  </>
                                )}
                              {hotelCheckBox?.copy[index]?.includes(
                                "mealplan"
                              ) && (
                                  <td>
                                    <div>
                                      <select
                                        name="MealPlan"
                                        id=""
                                        className={`formControl1 ${isFocus == index + "j" && "focus-red"
                                          }`}
                                        onFocus={() => handleFocus(index + "j")}
                                        onBlur={handleBlur}
                                        value={
                                          alternateFormValue[index]?.Form[
                                            hotelIndex
                                          ]?.MealPlan
                                        }
                                        onChange={(e) =>
                                          handleHotelFormChange(
                                            index,
                                            hotelIndex,
                                            "alternate",
                                            e
                                          )
                                        }
                                      >
                                        <option value="">Select</option>
                                        {mealPlanList?.map((meal, index) => {
                                          return (
                                            <option
                                              value={meal?.id}
                                              key={index + "h"}
                                            >
                                              {meal?.ShortName}
                                            </option>
                                          );
                                        })}
                                      </select>
                                    </div>
                                  </td>
                                )}
                              {alternateMealDetails[index]?.Form[
                                hotelIndex
                              ]?.map((meal, mealIndex) => {
                                return (
                                  hotelCheckBox?.copy[index]?.includes(
                                    meal?.MealTypeId
                                  ) && (
                                    <td key={mealIndex}>
                                      <div className="form-check check-sm d-flex align-items-center justify-content-center gap-3">
                                        <input
                                          type="checkbox"
                                          className="form-check-input height-em-1 width-em-1"
                                          name="IsPrice"
                                          id={`breakfast${mealIndex}`}
                                          value="1"
                                          checked={
                                            alternateMealDetails[index]?.Form[
                                              hotelIndex
                                            ]?.[mealIndex]?.IsPrice || false
                                          }
                                          onChange={(e) =>
                                            handleMealFormChange(
                                              index,
                                              hotelIndex,
                                              mealIndex,
                                              "alternate",
                                              e
                                            )
                                          }
                                        />

                                        <input
                                          type="text"
                                          className={`formControl1 mt-1 ${isFocus ==
                                            `${index}+${mealIndex}` &&
                                            "focus-red"
                                            }`}
                                          onFocus={() =>
                                            handleFocus(`${index}+${mealIndex}`)
                                          }
                                          onBlur={handleBlur}
                                          name="MealCost"
                                          value={
                                            alternateMealDetails[index]?.Form[
                                              hotelIndex
                                            ]?.[mealIndex]?.MealCost || ""
                                          }
                                          onChange={(e) =>
                                            handleMealFormChange(
                                              index,
                                              hotelIndex,
                                              mealIndex,
                                              "alternate",
                                              e
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                  )
                                );
                              })}
                            </tr>
                          );
                        })}
                        <tr className="costing-td">
                          <td
                            colSpan={
                              Type == "Local" || Type == "Foreigner" ? 5 : 4
                            }
                            className="text-center fs-6"
                            rowSpan={3}
                          >
                            Total
                          </td>
                          <td>Hotel Cost</td>
                          {hotelCheckBox?.copy[index]?.includes("extrabed")
                            ? roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId ===
                                    rates?.RoomBedTypeId
                                );
                              return <td key={index}>{mathRoundHelper(rate?.RoomCost)}</td>;
                            })
                            : roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId ===
                                    rates?.RoomBedTypeId
                                );
                              return (
                                room?.RoomType !== "ExtraBed(A)" && (
                                  <td key={index}>
                                    {mathRoundHelper(rate?.RoomCost)}
                                  </td>
                                )
                              );
                            })}
                          {hotelCheckBox?.copy[index]?.includes("mealplan") && (
                            <td></td>
                          )}
                          {mealDetails[0]?.map((meal, index) => {
                            const rate = calculatedRateDetails?.MealRates?.find(
                              (rates) => meal?.MealTypeId == rates?.MealTypeId
                            );

                            return (
                              hotelCheckBox?.copy[0]?.includes(
                                meal?.MealTypeId
                              ) && <td>{mathRoundHelper(rate?.MealCost)}</td>
                            );
                          })}
                        </tr>
                        <tr className="costing-td">
                          <td>Markup(5) %</td>
                          {hotelCheckBox?.copy[index]?.includes("extrabed")
                            ? roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId ===
                                    rates?.RoomBedTypeId
                                );
                              return <td key={index}>{mathRoundHelper(rate?.Markup)}</td>;
                            })
                            : roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId ===
                                    rates?.RoomBedTypeId
                                );
                              return (
                                room?.RoomType !== "ExtraBed(A)" && (
                                  <td key={index}>{mathRoundHelper(rate?.Markup)}</td>
                                )
                              );
                            })}
                          {hotelCheckBox?.copy[index]?.includes("mealplan") && (
                            <td></td>
                          )}
                          {mealDetails[0]?.map((meal, index) => {
                            const rate = calculatedRateDetails?.MealRates?.find(
                              (rates) => meal?.MealTypeId == rates?.MealTypeId
                            );
                            return (
                              hotelCheckBox?.copy[0]?.includes(
                                meal?.MealTypeId
                              ) && <td>{mathRoundHelper(rate?.Markup)}</td>
                            );
                          })}
                        </tr>
                        <tr className="costing-td">
                          <td>Total</td>
                          {hotelCheckBox?.copy[index]?.includes("extrabed")
                            ? roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId ===
                                    rates?.RoomBedTypeId
                                );
                              return (
                                <td key={index}>
                                  {mathRoundHelper(parseInt(rate?.RoomCost) +
                                    parseInt(rate?.Markup))}
                                </td>
                              );
                            })
                            : roomDetails?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId ===
                                    rates?.RoomBedTypeId
                                );
                              return (
                                room?.RoomType != "ExtraBed(A)" && (
                                  <td key={index}>
                                    {mathRoundHelper(parseInt(rate?.RoomCost) +
                                      parseInt(rate?.Markup))}
                                  </td>
                                )
                              );
                            })}
                          {hotelCheckBox?.copy[index]?.includes("mealplan") && (
                            <td></td>
                          )}
                          {mealDetails[0]?.map((meal, index) => {
                            const rate = calculatedRateDetails?.MealRates?.find(
                              (rates) => meal?.MealTypeId === rates?.MealTypeId
                            );
                            return (
                              hotelCheckBox?.copy[0]?.includes(
                                meal?.MealTypeId
                              ) && (
                                <td key={index}>
                                  {mathRoundHelper(parseInt(rate?.MealCost) +
                                    parseInt(rate?.Markup))}
                                </td>
                              )
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </PerfectScrollbar>
                </div>
              </>
            )}
            {isOpen?.original && (
              <div className="row">
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
          </div>
        );
      })}
    </>
  );
};

export default React.memo(Hotel);
