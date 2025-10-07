import React, { useContext, useMemo, useRef } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { axiosOther } from "../../../../../http/axios_base_url";
import { hotelItineraryValue } from "../qoutation_initial_value";
import { notifySuccess, notifyError } from "../../../../../helper/notify";
import { ToastContainer } from "react-toastify";
import { hotelValidation } from "../../query_validation";
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
  setHotelFinalValue,
  setQueryData,
} from "../../../../../store/actions/queryAction";
import { setItineraryHotelserviceData } from "../../../../../store/actions/itineraryDataAction";
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
import HotelUpgrade from "./HotelUpgrade";
import moment from "moment";
import IsDataLoading from "../IsDataLoading";
import mathRoundHelper from "../../helper-methods/math.round";
import HotelDetailModel from "./HotelDetailModel";
import { customStylesForhotel } from "../../../supplierCommunication/SupplierConfirmation/customStyle";
import { select_customStyles } from "../../../../../css/custom_style";
import { ThemeContext } from "../../../../../context/ThemeContext";

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const Hotel = ({ headerDropdown, Type, ActiveOptionId }) => {
  const [hotelCheckBox, setHotelCheckBox] = useState({
    original: ["mealplan"],
    copy: [],
    copy_hotel_form: false,
  });
  const BlackoutDatess = {
    BlackoutDates: [
      {
        BlackoutDatesFrom: "",
        BlackoutDatesTo: "",
        BlackoutDatesRemark: "",
      },
    ],
  };
  console.log(headerDropdown, "ActiveOptionId");

  const [hotelFormValue, setHotelFormValue] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [originalRoomDetails, setOriginalRoomDetails] = useState([]);
  const [mealDetails, setMealDetails] = useState([]);
  const [originalMealDetails, setOriginalMealDetails] = useState([]);
  const [BlackoutDates, setBlackoutDates] = useState([BlackoutDatess]);
  const [isCopyHotel, setIsCopyHotel] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [hotelCopy, setHotelCopy] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rowDestination, setrowDestination] = useState("");
  const [hotelName, setHotelName] = useState({});
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
  console.log(qoutationData, "isItineraryEditing");

  console.log(BlackoutDates, "itineraryHotelValue");
  // console.log(localHotelValue, 'localHotelValue')

  const dispatch = useDispatch();
  const [fromToDestinationList, setFromToDestinationList] = useState([]);
  const [mealPlanList, setMealPlanList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [hotelcatogory, sethotelcatogory] = useState(false);
  const [hotelFullList, setHotelFullList] = useState([]);
  const [hotelSearchList, setHotelSearchList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [RoomSearchList, setRoomSearchList] = useState([]);
  const [RoomRoomFullList, setRoomFullList] = useState([]);
  const isServiceIdChangeFromHandle = useRef(false);
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
  const [isDataLoading, setIsDataLoading] = useState(true);
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
  const { background } = useContext(ThemeContext);
  const hasInitialized = useRef(false);
  const handleFocus = (index) => {
    setIsFocus(index);
  };

  const handleBlur = () => {
    setIsFocus(null);
  };

  // console.log(hotelFormValue, "hotelFormValue3434");

  const itinerarayTab = useSelector(
    (state) => state.tabWiseDataLoadReducer.tab
  );
  //  Change Markup
  const [markupArray, setMarkupArray] = useState({
    Markup: { Data: [] },
  });

  const hotelData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Hotel"
  );

  // console.log(+hotelData, "hotelData")
  const hasHotelGuest = quotationData?.Days?.flatMap((day) =>
    Array.isArray(day?.DayServices)
      ? day.DayServices.filter(
          (service) =>
            service?.ServiceType === "Hotel" &&
            service?.ServiceMainType === "Guest"
        ).map((service) => service?.HotelCategoryId)
      : []
  );

  useEffect(() => {
    previousHotelFormValue.current = hotelFormValue;
  }, [hotelFormValue]);

  useEffect(() => {
    // console.log(hasInitialized.current, "hasInitialized.current");

    if (qoutationData?.Days) {
      const hasMonumentService = qoutationData?.Days.some((day) =>
        day?.DayServices?.some(
          (service) =>
            service.ServiceType === "Hotel" &&
            service.ServiceMainType === "Guest"
        )
      );

      if (hasMonumentService) {
        // const initialFormValue = qoutationData?.Days?.filter(
        //   (day, index, daysArray) => {
        //     const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
        //     if (
        //       previousEnrouteId != null &&
        //       previousEnrouteId !== "" &&
        //       previousEnrouteId === day?.DestinationId
        //     ) {
        //       return false;
        //     }
        //     return true;
        //   }
        // )
        //   ?.map((day) => {
        //     const service = day?.DayServices?.filter(
        //       (service) => service?.ServiceType == "Hotel" && service.ServiceMainType === "Guest"
        //     )[0];
        //     return {
        //       id: queryData?.QueryId,
        //       DayType: Type,
        //       DayNo: day.Day,
        //       Date: day?.Date,
        //       Escort: 1,
        //       EnrouteName: day?.EnrouteName,
        //       EnrouteId: day?.EnrouteId,
        //       Destination: day?.DestinationId,
        //       DestinationUniqueId: day?.DestinationUniqueId,
        //       QuatationNo: qoutationData?.QuotationNumber,
        //       DayUniqueId: day?.DayUniqueId,
        //       ItemFromDate: qoutationData?.TourSummary?.FromDate,
        //       ItemToDate: qoutationData?.TourSummary?.ToDate,
        //       ServiceId: service != undefined ? service?.ServiceId : "",
        //       OverNight: service != undefined ? service?.OvernightId : "",
        //       RoomCategory: service != undefined ? service?.RoomCategoryId : "",
        //       Supplier: service
        //         ? service?.ServiceDetails[0]?.ItemSupplierDetail?.ItemSupplierId
        //         : "",
        //       RateUniqueId: "",
        //       HotelCategory: service?.HotelCategoryId || headerDropdown?.Hotel,
        //       FromDay: "",
        //       ToDay: "",
        //       ItemFromTime: "",
        //       ItemToTime: "",
        //       PaxSlab: day?.PaxDetails?.TotalNoOfPax,
        //       MealPlan: service?.MealPlanId
        //         ? service?.MealPlanId
        //         : headerDropdown?.MealPlan,
        //       ServiceMainType: "No",
        //       PaxInfo: {
        //         Adults: qoutationData?.Pax?.AdultCount,
        //         Child: qoutationData?.Pax?.ChildCount,
        //         Infant: qoutationData?.Pax?.Infant,
        //         Escort: day?.PaxDetails?.PaxInfo?.Escort,
        //       },
        //       ForiegnerPaxInfo: {
        //         Adults: "",
        //         Child: "",
        //         Infant: "",
        //         Escort: "",
        //       },
        //       DayServices: day?.DayServices || [],
        //     };
        //   })
        //   ?.filter((item) => {
        //     return !item.EnrouteId;
        //   });
        // setHotelFormValue(initialFormValue);
        const initialFormValue = [];

        qoutationData?.Days?.forEach((day, index, daysArray) => {
          const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
          if (
            previousEnrouteId != null &&
            previousEnrouteId !== "" &&
            previousEnrouteId === day?.DestinationId
          ) {
            return;
          }

          const hotelServices = day?.DayServices?.filter(
            (service) =>
              service?.ServiceType === "Hotel" &&
              service?.ServiceMainType === "Guest"
          );
          console.log(hotelServices, "service?.RoomCategoryId");

          hotelServices?.forEach((service) => {
            initialFormValue.push({
              id: queryData?.QueryId,
              DayType: Type,
              DayNo: day.Day,
              Date: day?.Date,
              Escort: 1,
              EnrouteName: day?.EnrouteName,
              EnrouteId: day?.EnrouteId,
              Destination: service?.DestinationId,
              DestinationUniqueId: day?.DestinationUniqueId,
              QuatationNo: qoutationData?.QuotationNumber,
              DayUniqueId: day?.DayUniqueId,
              ItemFromDate: qoutationData?.TourSummary?.FromDate,
              ItemToDate: qoutationData?.TourSummary?.ToDate,
              ServiceId: service?.ServiceId || "",
              OverNight: service?.OvernightId || "",
              RoomCategory: service?.RoomCategoryId || "",
              Supplier:
                service?.ServiceDetails?.[0]?.ItemSupplierDetail
                  ?.ItemSupplierId || "",
              RateUniqueId: "",
              HotelCategory: headerDropdown?.Hotel,
              FromDay: "",
              ToDay: "",
              ItemFromTime: "",
              ItemToTime: "",
              PaxSlab: day?.PaxDetails?.TotalNoOfPax,
              MealPlan: service?.MealPlanId || headerDropdown?.MealPlan,
              ServiceMainType: "No",
              PaxInfo: {
                Adults: qoutationData?.Pax?.AdultCount,
                Child: qoutationData?.Pax?.ChildCount,
                Infant: qoutationData?.Pax?.Infant,
                Escort: day?.PaxDetails?.PaxInfo?.Escort,
              },
              ForiegnerPaxInfo: {
                Adults: "",
                Child: "",
                Infant: "",
                Escort: "",
              },
              DayServices: [service], // individual service for tracking
            });
          });
        });
        console.log("it is trigger");
        if (!headerDropdown?.HotelData) {
          setHotelFormValue(initialFormValue);
        }

        // const servicesRoom = qoutationData?.Days?.filter(
        //   (day, index, daysArray) => {
        //     const previousEnrouteId = daysArray[index - 1]?.EnrouteId;
        //     if (
        //       previousEnrouteId != null &&
        //       previousEnrouteId !== "" &&
        //       previousEnrouteId === day?.DestinationId
        //     ) {
        //       return false;
        //     }
        //     return true;
        //   }
        // )?.map((day) => {
        //   const serv = day?.DayServices?.map((service) => {
        //     return service?.ServiceType?.includes("Hotel")
        //       ? service
        //       : undefined;
        //   }).filter((data) => data != undefined);
        //   const result = serv?.length > 0 ? serv[0]?.ServiceDetails.flat() : [];
        //   const final = result?.map((item) => item?.ItemUnitCost?.RoomBedType);
        //   return final;
        // });
        const servicesRoom = initialFormValue?.map((formItem) => {
          const hotelService = formItem?.DayServices?.[0]; // one service per form item now
          const serviceDetails = hotelService?.ServiceDetails?.flat() || [];
          return serviceDetails.map((item) => item?.ItemUnitCost?.RoomBedType);
        });

        const staticRoom = initialFormValue?.map(() => {
          const details =
            qoutationData?.QueryInfo?.Accomondation?.RoomInfo?.filter(
              (room) => room?.NoOfPax != null
            );

          const defaultDBLRoom = {
            RoomType: "DBL Room",
            RoomBedTypeId: 4,
            RoomCost: "",
          };

          const defaultSGLRoom = {
            RoomType: "SGL Room",
            RoomBedTypeId: 3,
            RoomCost: "",
          };

          // Find DBL Room
          const equalToDBLRoom = details?.find(
            (room) => room?.RoomType === "DBL Room"
          );

          // Find non-DBL Rooms (basically SGL)
          const notEqualToDBLRoom =
            details?.filter((room) => room?.RoomType !== "DBL Room") || [];

          // Build orderedRoom
          let orderedRoom = [];
          if (equalToDBLRoom) {
            // Case: DBL found → DBL first + SGL(s) if any, else default SGL
            orderedRoom = [
              equalToDBLRoom,
              ...(notEqualToDBLRoom.length
                ? notEqualToDBLRoom
                : [defaultSGLRoom]),
            ];
          } else {
            // Case: No DBL → fallback to both defaults
            orderedRoom = [defaultDBLRoom, defaultSGLRoom];
          }

          const isExtraBedAvailable = orderedRoom?.some((rooms) =>
            rooms?.RoomType?.includes("ExtraBed(A)")
          );

          if (isExtraBedAvailable) {
            return orderedRoom?.map((room) => ({
              RoomBedTypeId: room?.RoomBedTypeId ?? room?.id,
              RoomCost: "",
              RoomType: room?.RoomType,
            }));
          } else {
            const extraBed = {
              RoomType: "ExtraBed(A)",
              RoomBedTypeId: 7, // ✅ consistent with others
              RoomCost: "",
            };
            const orderedRoomWithExtraBed = [...orderedRoom, extraBed];
            return orderedRoomWithExtraBed?.map((room) => ({
              RoomBedTypeId: room?.RoomBedTypeId ?? room?.id,
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
        console.log(finalRoomJson, "finalRoomJson");

        setRoomDetails(finalRoomJson);
        setOriginalRoomDetails(finalRoomJson);

        const servicesMeal = initialFormValue?.map((formItem) => {
          const hotelService = formItem?.DayServices?.[0];
          const serviceDetails = hotelService?.ServiceDetails?.flat() || [];
          return serviceDetails.map((item) => item?.ItemUnitCost?.MealType);
        });

        // Build staticMeal from initialFormValue (not Days)
        const staticMeal = initialFormValue?.map(() => [
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
              ?.find((meal) => meal?.MealTypeId === mealObj?.MealTypeId);

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

        dispatch(
          setLocalHotelFormValue({
            HotelForm: initialFormValue,
            MealType: finalMealJson,
            RoomBedType: finalRoomJson,
          })
        );
      } else {
        // if (hasInitialized.current) return;
        console.log("calltimes");

        const initialFormValue = qoutationData?.Days?.filter(
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
            DayType: Type,
            DayNo: day.Day,
            Date: day?.Date,
            EnrouteName: day?.EnrouteName,
            EnrouteId: day?.EnrouteId,
            Destination: day.DestinationId || "",
            DestinationUniqueId: day?.DestinationUniqueId,

            QuatationNo: qoutationData?.QuotationNumber,
            DayUniqueId: day?.DayUniqueId,
            ItemFromDate: qoutationData?.TourSummary?.FromDate,
            ItemToDate: qoutationData?.TourSummary?.ToDate,
            RateUniqueId: "",
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: qoutationData?.Pax?.Infant,
              Escort: "",
            },
          }))
          ?.filter((item) => {
            return !item.EnrouteId;
          });
        console.log(initialFormValue, "initialFormValue");

        setHotelFormValue(initialFormValue);
        setFormIsEmpty(true);

        // creating room details array
        console.log();

        const roomJson = qoutationData?.Days?.filter(
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
            qoutationData?.QueryInfo?.Accomondation?.RoomInfo?.filter(
              (room) => room?.NoOfPax != null
            );

          // Assuming details is an array of room objects
          // Define defaults separately
          const defaultDBLRoom = {
            RoomType: "DBL Room",
            RoomBedTypeId: 4,
            // add other default properties...
          };

          const defaultSGLRoom = {
            RoomType: "SGL Room",
            RoomBedTypeId: 3,
            // add other default properties...
          };

          // Find DBL Room
          const equalToDBLRoom = details?.find(
            (room) => room?.RoomType === "DBL Room"
          );

          // Find non-DBL Rooms (basically SGL)
          const notEqualToDBLRoom =
            details?.filter((room) => room?.RoomType !== "DBL Room") || [];

          // Log for debugging
          console.log(equalToDBLRoom, "equalToDBLRoom");
          console.log(notEqualToDBLRoom, "notEqualToDBLRoom");

          // Build orderedRoom
          let orderedRoom = [];
          if (equalToDBLRoom) {
            // Case: DBL found → put DBL first, then SGLs (if any), or default SGL
            orderedRoom = [
              equalToDBLRoom,
              ...(notEqualToDBLRoom.length
                ? notEqualToDBLRoom
                : [defaultSGLRoom]),
            ];
          } else {
            // Case: No DBL → fallback to defaults
            orderedRoom = [defaultDBLRoom, defaultSGLRoom];
          }

          console.log(orderedRoom, "orderedRoom");

          console.log();

          const isExtraBedAvailable = orderedRoom?.some((rooms) =>
            rooms?.RoomType?.includes("ExtraBed(A)")
          );

          if (isExtraBedAvailable) {
            return orderedRoom?.map((room) => ({
              RoomBedTypeId: room?.RoomBedTypeId ?? room?.id,
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
              RoomBedTypeId: room?.RoomBedTypeId ?? room?.id,
              RoomCost: "",
              RoomType: room?.RoomType,
            }));
          }
        });
        setRoomDetails(roomJson);
        console.log(roomJson, "TEST66555");
        setOriginalRoomDetails(roomJson);

        // creating meal details array
        const mealJson = qoutationData?.Days?.filter(
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
        console.log(mealJson, "mealJson");

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
        setHasSetFirstValues(true);
      }
    }

    // Add a ref to track if ServiceId change is from handleHotelFormChange
    isServiceIdChangeFromHandle.current = true;
  }, [JSON.stringify(qoutationData)]);

  // setting meal plan from header to form
  useEffect(() => {
    let updatedForm = hotelFormValue?.map((form, index) => {
      return {
        ...form,
        MealPlan: headerDropdown?.MealPlan,
      };
    });
    if (hotelFormValue?.length > 0) {
      setHotelFormValue(updatedForm);
    }
  }, [headerDropdown?.MealPlan]);

  useEffect(() => {
    prevHotelFormValue.current = hotelFormValue;
  }, [hotelFormValue]);

  console.log(hotelFormValue, "Hldkfjd44");

  const getSupplierList = async (ServiceId, Destination, index) => {
    const hotelObject = hotelList
      ?.flat()
      ?.find((hotel) => Number(hotel.id) === Number(ServiceId));

    const hotelName = hotelObject?.HotelName;
    console.log(hotelObject, "Matched Hotel Object");
    console.log(hotelName, "Hotel Name");
    if (!hotelName || !Destination) return;

    try {
      const { data } = await axiosOther.post("supplierlistforselect", {
        Name: hotelName, // ✅ Corrected
        id: "",
        SupplierService: [12],
        DestinationId: [parseInt(Destination)],
      });

      console.log(data, "datasupplier");

      setSupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
      const supplier = data?.DataList?.[0]?.id;
      console.log(supplier, "supplier");

      setHotelFormValue((prevValue) => {
        const newArr = [...prevValue];
        newArr[index] = {
          ...newArr[index],
          Supplier: supplier || " ",
        };
        console.log(newArr, "newArr");

        return newArr;
      });

      // setHasSetFirstValues(true);

      return data;
    } catch (error) {
      console.log("error", error);
    }
  };
  console.log(hotelFormValue, "hotelformvalue");

  useEffect(() => {
    hotelFormValue?.map((hotel, index) => {
      // console.log(hotel,"hotel11");

      getSupplierList(hotel?.ServiceId, hotel?.Destination, index);
    });
  }, [hotelFormValue?.map((hotel) => hotel?.ServiceId).join(",")]);

  const postDataToServer = async () => {
    try {
      setIsDataLoading(true);
      try {
        const { data } = await axiosOther.post("destinationlist");
        setDestinationList(data?.DataList);
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

        // setRoomSearchList(data?.DataList);
        // console.log(data?.DataList,"data?.DataList");
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
        const { data } = await axiosOther.post("hotelmealplanlist");
        setMealPlanList(data?.DataList);
      } catch (error) {
        console.log("error", error);
      }
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
        // console.log(value,"value222");
      } catch (error) {
        console.error(error);
      }
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (destinationList.length == 0) postDataToServer();
  }, []);
  const getRoomList = async (roomcatogary, index) => {
    try {
      const { data } = await axiosOther.post("roomtypelist", {
        name: roomcatogary,
        id: "",
        status: 1,
      });
      // setRoomList(data?.DataList);

      setRoomSearchList((prev) => {
        const newarr = [...prev];
        newarr[index] = data?.DataList || [];
        return newarr;
      });
      // console.log(data?.DataList,"data?.DataList");
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    hotelFormValue?.map((room, index) => {
      getRoomList(room?.roomCategory, index);
    });
  }, [hotelFormValue?.map((room) => room?.roomCategory).join(",")]);
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
  const setupdateratechanges = async (
    serviceId,
    destinationUniqueId,
    index,
    MealPlan,
    RoomCategory
  ) => {
    console.log("this functioncalss");
    console.log(hasSetFirstValues, "hasSetFirstValues");

    // if (!hasSetFirstValues) {
    // Fetch hotel rates only if initial values haven't been set
    const hotelOptions = hotelList?.[index] || [];
    const matchedHotel = hotelOptions.find((hotel) => hotel?.id === serviceId);
    console.log(matchedHotel?.HotelUniqueID, "HotelUniqueID9999");

    if (matchedHotel && destinationUniqueId) {
      // console.log(hotelcatogory, "hotelcatogory");

      console.log(
        matchedHotel.HotelUniqueID,
        destinationUniqueId,
        index,
        "1111111calss"
      );

      await getHotelRateApi(
        matchedHotel.HotelUniqueID,
        destinationUniqueId,
        index,
        "",
        "",
        "",
        "",
        ""

        // headerDropdown?.MealPlan || ""
      );
      // }
      // Optionally set hasSetFirstValues to true after fetching rates
      // setHasSetFirstValues(true);
    }
  };
  console.log(headerDropdown?.MealPlan, "headerDropdown?.MealPlan");
  console.log(headerDropdown, "HotelData1111");
  const serviceid = useMemo(() =>
    hotelFormValue?.map((service) => service?.ServiceId).join(",")
  );

  useEffect(() => {
    // if (headerDropdown?.HotelData == null && undefined) return;
    if (isServiceIdChangeFromHandle.current) {
      isServiceIdChangeFromHandle.current = false; // Reset the flag
      return;
    }
    if (headerDropdown?.HotelData == false) {
      // Reset when HotelData is false
      setRoomDetails((prev) =>
        prev.map(
          (roomArray) =>
            roomArray?.map((room) => ({ ...room, RoomCost: "" })) || []
        )
      );
      setOriginalRoomDetails((prev) =>
        prev.map(
          (roomArray) =>
            roomArray?.map((room) => ({ ...room, RoomCost: "" })) || []
        )
      );
      return;
    }

    // ✅ Run only when form value actually changes
    if (hotelFormValue?.length && headerDropdown?.HotelData) {
      hotelFormValue.forEach((hotel, index) => {
        if (hotel?.ServiceId && hotel?.DestinationUniqueId) {
          setupdateratechanges(
            hotel.ServiceId,
            hotel.DestinationUniqueId,
            index,
            hotel?.MealPlan,
            hotel?.RoomCategory
          );
          console.log(
            hotel.ServiceId,
            hotel.DestinationUniqueId,
            index,
            hotel?.MealPlan,
            hotel?.RoomCategory,
            "checkhttt"
          );
        }
      });
    }
  }, [
    JSON.stringify(serviceid), // 👈 watch form values directly
    headerDropdown?.HotelData, // true/false mode
    headerDropdown?.MealPlan, // if mealplan changes
  ]);

  //  console.log();

  // getting rate data form api
  const getHotelRateApi = async (
    hotel,
    destination,
    index,
    gettingCalledFrom,

    QuatationNo,
    date,
    mealPlan,
    roomCategory,
    empty
  ) => {
    try {
      console.log(hotel, destination, index, "functioncalss");

      const storedData = localStorage.getItem("token");
      const parsedData = JSON.parse(storedData);

      const queryDataFromLocalStroage = JSON.parse(
        localStorage.getItem("query-data")
      );
      console.log(queryDataFromLocalStroage, "queryDataFromLocalStroage");

      const paxType = parsedData?.PaxInfo?.PaxType; // "1"
      const companyId = parsedData?.companyKey;
      const queryId = parsedData?.QueryID;
      const supplieruniqueid = supplierList[index]?.find(
        (supplier) => supplier.id === hotelFormValue[index]?.Supplier
      )?.UniqueID;
      console.log(empty, "empty");

      if (
        hotel &&
        companyId &&
        destination &&
        queryDataFromLocalStroage
        // supplieruniqueid &&
        // headerDropdown?.Hotel != "0"
      ) {
        const { data } = await axiosOther.post("priceEditHotelRatesJson", {
          Id: "",
          HotelID: hotel ? hotel : "",
          HotelName: "",
          DestinationID: destination ? destination : "",
          CompanyId: companyId ? companyId : "",
          Date: "",
          Year: queryDataFromLocalStroage?.TravelDateInfo?.SeasonYear,
          MealPlanId: mealPlan || headerDropdown?.MealPlan || "",
          CurrencyId: "",
          TariffTypeId: "",
          RoomTypeId: roomCategory,
          MarketTypeId: "",
          HotelCategoryId:
            headerDropdown?.Hotel == "0" ? "" : headerDropdown?.Hotel,
          SupplierID: "",
          PaxType: queryDataFromLocalStroage?.PaxInfo?.PaxType,
          ValidFrom:
            queryDataFromLocalStroage?.TravelDateInfo?.ScheduleType ==
            "Date Wise"
              ? queryDataFromLocalStroage?.TravelDateInfo?.FromDateDateWise
              : queryDataFromLocalStroage?.TravelDateInfo?.FromDate,
          ValidTo:
            queryDataFromLocalStroage?.TravelDateInfo?.ScheduleType ==
            "Date Wise"
              ? queryDataFromLocalStroage?.TravelDateInfo?.FromDateDateWise
              : queryDataFromLocalStroage?.TravelDateInfo?.ToDate,
          QueryId: "",
          QuatationNo: "",
        });

        if (data?.Status === 1 && data?.Data?.length > 0) {
          const rateData = data.Data[0];
          console.log("callls12");

          const updatedRoomArray = roomDetails[index]?.map((roomObj) => {
            const matchedRoom = rateData?.RateJson?.RoomBedType?.find(
              (r) => r.RoomBedTypeId === roomObj.RoomBedTypeId
            );

            return {
              ...roomObj,
              RoomCost: matchedRoom
                ? mathRoundHelper(matchedRoom.RoomTotalCost)
                : mathRoundHelper(roomObj.RoomTotalCost),
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
          setBlackoutDates((prevValue) => {
            console.log("callls1");

            const newArr = [...prevValue];
            newArr[index] = {
              ...newArr[index], // keep other properties at that index
              BlackoutDates: [
                {
                  BlackoutDatesFrom:
                    rateData?.RateJson?.BlackoutDates?.[0]?.BlackoutDatesFrom,
                  BlackoutDatesTo:
                    rateData?.RateJson?.BlackoutDates?.[0]?.BlackoutDatesTo,
                  BlackoutDatesRemark:
                    rateData?.RateJson?.BlackoutDates?.[0]?.BlackoutDatesRemark,
                },
              ],
            };
            return newArr;
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

          // hotelFormValue[index]?.RoomCategory;
          console.log(
            rateData?.RateJson?.RoomTypeId,
            "rateData?.RateJson?.RoomTypeId"
          );

          setHotelFormValue((prevValue) => {
            const newArr = [...prevValue];
            newArr[index] = {
              ...hotelFormValue[index],
              RoomCategory:
                rateData?.RateJson?.RoomTypeId ||
                rateData?.RateJson?.RoomTypeID,
            };
            return newArr;
          });
          // console.log(
          //   rateData?.RateJson?.RoomTypeId,
          //   "rateData?.RateJson?.RoomTypeId"
          // );

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
          console.log(fallbackMealArray, "fallbackMealArray");

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
          setHotelFormValue((prevValue) => {
            const newArr = [...prevValue];
            newArr[index] = {
              ...hotelFormValue[index],
              RoomCategory: roomCategory ? roomCategory : "",
            };
            return newArr;
          });
        }
        if (data?.Status == 1) {
          console.log("this function Calls22223");
          console.log(data, " data.Data");

          const rateData = data.Data[0];
          console.log(rateData, "rateData1234");

          // const updatedMealArray = mealDetails[index]?.map((mealObj) => {
          //   const matchedMeal = rateData?.RateJson?.MealType?.find(
          //     (r) => r.MealTypeId === mealObj.MealTypeId
          //   );

          //   return {
          //     ...mealObj,
          //     MealCost: matchedMeal ? matchedMeal.MealCost : mealObj.MealCost,
          //   };
          // });

          // hotelFormValue[index]?.RoomCategory;
          // console.log(
          //   rateData?.RateJson?.BlackoutDates?.=======,
          //   "rateData?.RateJson?.BlackoutDates?.BlackoutDatesFrom"
          // );

          // console.log(
          //   rateData?.RateJson?.RoomTypeId,
          //   "rateData?.RateJson?.RoomTypeId"
          // );

          // setMealDetails((prev) => {
          //   const updated = [...prev];
          //   updated[index] = updatedMealArray;
          //   return updated;
          // });

          // setOriginalMealDetails((prev) => {
          //   const updated = [...prev];
          //   updated[index] = updatedMealArray;
          //   return updated;
          // });
        } else {
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
    const allDaysEmpty =
      Array.isArray(qoutationData?.Days) &&
      qoutationData.Days.every((day) => {
        if (!Array.isArray(day.DayServices)) return true;
        const guideServices = day.DayServices.filter(
          (service) =>
            service.ServiceType === "Hotel" &&
            service?.ServiceMainType === "Guest"
        );
        return guideServices.length === 0;
      });
    // console.log("All days empty:",allDaysEmpty);

    if (!allDaysEmpty) return;
    const runRateApiForSelectedHotels = async () => {
      if (hasSetFirstValues && supplierList.length > 0) {
        // Check if supplierList is populated
        for (let index = 0; index < hotelFormValue.length; index++) {
          const form = hotelFormValue[index];
          const hotelOptions = hotelList?.[index] || [];

          const matchedHotel = hotelOptions.find(
            (hotel) => hotel?.id === form?.ServiceId
          );
          const gettingCalledFrom = "useEffect";
          console.log(form?.RoomCategory, "form?.RoomCategory");

          if (matchedHotel && form?.ServiceId) {
            await getHotelRateApi(
              matchedHotel?.HotelUniqueID,
              form?.DestinationUniqueId,
              index,
              gettingCalledFrom
            );
          }
        }
      }
      setHasSetFirstValues(false);
    };

    if (hotelFormValue?.length && hotelList?.length && supplierList.length) {
      runRateApiForSelectedHotels();
    }
    // console.log(supplierList, "supplierList in useEffect");
  }, [
    hasSetFirstValues,
    headerDropdown?.Year,
    hotelList,
    hotelFormValue?.map((form) => form?.Supplier)?.join(","),
    hotelFormValue?.map((form) => form?.RoomCategory)?.join(","),
  ]); // Add supplierList
  console.log(hotelFormValue, "RoomCategory");
  console.log(hotelFormValue?.Mealplan, "RoomCategory2");

  useEffect(() => {
    // Collect all ServiceIds from hotelFormValue for all indices
    const serviceIds = hotelFormValue
      .map((hotel, index) => ({
        serviceId: hotel?.ServiceId || null,
      }))
      .filter((item) => item.serviceId !== null); // Filter out null/undefined ServiceIds

    // console.log(serviceIds, "serviceIds with indices from hotelFormValue");

    // Dispatch the array of ServiceIds with their indices
    dispatch(
      setItineraryHotelserviceData(
        serviceIds // Array of objects with index and serviceId
      )
    );
  }, [hotelFormValue?.map((form) => form?.ServiceId)?.join(","), dispatch]);

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
    console.log("Effect triggered", {
      hotelList,
      overnightList,
      roomList,
      formIsEmpty,
      headerDropdown,
      isItineraryEditing,
    });
    if (
      hotelList?.length > 0 &&
      overnightList.length > 0 &&
      roomList.length > 0
    ) {
      hotelList?.forEach((list, index) => {
        if (formIsEmpty) {
          setFirstValueIntoForm(index);
          sethotelcatogory(true);
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
    quotationData,
  ]);
  const setFirstValueIntoForm = (index) => {
    console.log(index, "indexindex");

    const hotelNameId = hotelList[index]?.[0]?.id || "";
    // const supplier = supplierList[index]?.[0]?.id || "";
    const overnightId = overnightList?.[0]?.Id || "";
    const roomCategoryId = roomList?.[0]?.id || "";
    console.log(
      hotelNameId,
      overnightId,
      roomCategoryId,
      hotelFormValue[index]?.id,
      "hotelFormValue[index]?.id"
    );
    console.log(headerDropdown, "headerDropdown22");

    if (hotelFormValue[index]?.id) {
      setHotelFormValue((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = {
          ...newArr[index],
          ServiceId:
            hotelFormValue?.length - 1 === index || headerDropdown?.Hotel == "0"
              ? " "
              : hotelNameId,
          OverNight: hotelFormValue?.length - 1 === index ? 9 : overnightId,
          // RoomCategory:
          //   hotelFormValue?.length - 1 === index ? " " : roomCategoryId,
          MealPlan: headerDropdown?.MealPlan,
        };
        console.log(newArr, "newArr");

        return newArr;
      });
    }
    console.log(hotelFormValue, "hotelFormValue2222");

    // setHasSetFirstValues(true);
  };
  console.log(hotelFormValue, "hotelFormValue3333");

  const getHotelListDependently = async (
    city,
    hotelCategory,
    index,
    hotelname,
    headerDropdown
  ) => {
    console.log(
      city,
      hotelCategory,
      index,
      hotelname,
      "getHotelListDependently"
    );

    if (!city) return;
    try {
      const limit = "2500";
      const { data } = await axiosOther.post("hotellist", {
        HotelName: hotelname || "",
        DestinationId: city,
        HotelCategoryId: hotelCategory || " ",
        Default: "Yes",
        perPage: limit,
      });

      console.log(data, "HOTELIsT56215");

      if (hotelname) {
        // 🔍 hotel search mode
        setHotelSearchList((prev) => {
          const newList = [...prev];
          newList[index] = data?.DataList || [];
          return newList;
        });
      } else {
        // 🔍 update full lists
        setHotelFullList((prev) => {
          const newList = [...prev];
          newList[index] = data?.DataList || [];
          return newList;
        });

        setHotelList((prevList) => {
          const newList = [...prevList];
          newList[index] = data?.DataList || [];
          return newList;
        });

        if (qoutationData?.Days) {
          const hasHotelService = qoutationData?.Days.some((day) =>
            day?.DayServices?.some(
              (service) =>
                service.ServiceType === "Hotel" &&
                service.ServiceMainType === "Guest"
            )
          );

          if (hasHotelService) {
            if (headerDropdown?.HotelData) {
              const hotelNameId = data?.DataList?.[0]?.id || "";
              console.log(headerDropdown, "headerDropdown?.HotelData");
              console.log(hotelNameId, "hotelNameId");

              setHotelFormValue((prevArr) => {
                console.log("callllsfunction");

                const newArr = [...prevArr];
                newArr[index] = {
                  ...newArr[index],
                  ServiceId:
                    hotelFormValue?.length - 1 === index ||
                    headerDropdown?.Hotel == "0"
                      ? " "
                      : hotelNameId,
                  RoomCategory: headerDropdown?.Hotel == "0" ? "" : "",
                };
                console.log(newArr, "newArr after update ✅");
                return newArr;
              });

              sethotelcatogory(true);
            } else if (headerDropdown?.HotelData == false) {
              setHotelFormValue((prevArr) => {
                console.log("callllsfunction");

                const newArr = [...prevArr];
                newArr[index] = {
                  ...newArr[index],
                  ServiceId:
                    hotelFormValue?.length - 1 === index ||
                    headerDropdown?.Hotel == "0"
                      ? " "
                      : "",
                  RoomCategory: headerDropdown?.Hotel == "0" ? "" : "",
                };
                console.log(newArr, "newArr after update ✅");
                return newArr;
              });
            }
          }
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  // useEffect(()=>{
  //    setHotelFormValue((prevArr) => {
  //                 console.log("callllsfunction");

  //                 const newArr = [...prevArr];
  //                 newArr[index] = {
  //                   ...newArr[index],
  //                   ServiceId:
  //                     hotelFormValue?.length - 1 === index ||
  //                     headerDropdown?.Hotel == "0"
  //                       ? " "
  //                       : "",
  //                   RoomCategory: headerDropdown?.Hotel == "0" ? "" : "",
  //                 };
  //                 console.log(newArr, "newArr after update ✅");
  //                 return newArr;
  //               });

  // }

  // ,[headerDropdown?.HotelData])
  console.log(hotelFormValue, "hotelFormValue2");
  // useEffect(()=>{
  //   console.log(headerDropdown?.HotelData,"headerDropdown?.HotelData");

  // },[headerDropdown?.Hotel])

  useEffect(() => {
    if (!headerDropdown?.Hotel) return;

    hotelFormValue?.forEach((row, index) => {
      getHotelListDependently(
        row?.Destination,
        headerDropdown?.Hotel,
        index,
        "",
        headerDropdown // ✅ pass full object, not .hotelData
      );
    });
  }, [
    JSON.stringify(hotelFormValue?.map((row) => row?.Destination)),
    headerDropdown?.Hotel,
    headerDropdown?.HotelData, // ✅ fix case mismatch
  ]);

  const handleUpdateRowData = async (hotelRowData) => {
    // console.log(rowDestination,"rowDestination");
    // console.log(hotelRowData,"hotelRowData");
    const { dayNo, dayIndex, destId, hotelCategoryId } = rowDestination;
    const hotelname = hotelRowData?.HotelName;
    // console.log(typeof hotelRowData.HotelId, 'ksdfklsd322')

    // Update hotelFormValue
    const updatedHotelFormValue = hotelFormValue?.map((item) => {
      if (item?.DayNo === dayNo) {
        const service = item?.DayServices?.[0] || {};
        const serviceDetails = service?.ServiceDetails?.[0] || {};
        const itemUnitCost = serviceDetails?.ItemUnitCost || {};

        return {
          ...item,
          Supplier: hotelRowData?.SupplierId || item?.Supplier,
          HotelCategory: hotelRowData?.HotelCategoryId || item?.HotelCategory,
          MealPlan: hotelRowData?.RateDetail?.MealPlanId || item?.MealPlan,
          RoomCategory:
            hotelRowData?.RateDetail?.RoomTypeID || item?.RoomCategory,
          ServiceId: Number(hotelRowData?.HotelId) || item?.ServiceId,
          DayServices: [
            {
              ...service,
              HotelUniqueId: hotelRowData?.HotelUUID || service?.HotelUniqueId,
              DestinationId:
                hotelRowData?.DestinationID || service?.DestinationId,
              DestinationName:
                hotelRowData?.DestinationName || service?.DestinationName,
              MealPlanId:
                hotelRowData?.RateDetail?.MealPlanId || service?.MealPlanId,
              MealPlanName:
                hotelRowData?.RateDetail?.MealPlanName || service?.MealPlanName,
              RoomCategoryId:
                hotelRowData?.RateDetail?.RoomTypeID || service?.RoomCategoryId,
              RoomCategoryName:
                hotelRowData?.RateDetail?.RoomTypeName ||
                service?.RoomCategoryName,
              HotelCategoryId:
                hotelRowData?.HotelCategoryId || service?.HotelCategoryId,
              HotelCategoryName:
                hotelRowData?.HotelCategoryName || service?.HotelCategoryName,
              ServiceDetails: [
                {
                  ...serviceDetails,
                  ItemName: hotelRowData?.HotelName || serviceDetails?.ItemName,
                  ItemSupplierDetail: {
                    ...serviceDetails?.ItemSupplierDetail,
                    ItemSupplierId:
                      hotelRowData?.SupplierId ||
                      serviceDetails?.ItemSupplierDetail?.ItemSupplierId,
                    ItemSupplierName:
                      hotelRowData?.SupplierName ||
                      serviceDetails?.ItemSupplierDetail?.ItemSupplierName,
                    ItemSupplierCurrency:
                      hotelRowData?.RateDetail?.CurrencyName ||
                      serviceDetails?.ItemSupplierDetail?.ItemSupplierCurrency,
                  },
                  ItemUnitCost: {
                    ...itemUnitCost,
                    RoomBedType:
                      hotelRowData?.RateDetail?.RoomBedType?.map((room) => ({
                        ...room,
                        RoomCost: room?.RoomCost || "",
                      })) ||
                      itemUnitCost?.RoomBedType ||
                      [],
                    MealType:
                      hotelRowData?.RateDetail?.MealType?.map((meal) => ({
                        ...meal,
                        MealCost: meal?.MealCost || "",
                        MealTaxValue: meal?.MealTaxValue || "",
                      })) ||
                      itemUnitCost?.MealType ||
                      [],
                  },
                  ItemCurrency:
                    hotelRowData?.RateDetail?.CurrencyName ||
                    serviceDetails?.ItemCurrency,
                },
              ],
              TotalCosting:
                service?.TotalCosting?.map((cost) => ({
                  ...cost,
                  HotelRoomBedType:
                    hotelRowData?.RateDetail?.RoomBedType?.map((room) => ({
                      ...room,
                      ServiceCost: room?.RoomCost || "",
                      TotalServiceCost: room?.RoomTotalCost || "",
                    })) ||
                    cost?.HotelRoomBedType ||
                    [],
                  HotelMealType:
                    hotelRowData?.RateDetail?.MealType?.map((meal) => ({
                      ...meal,
                      MealTypeName: meal?.MealTypeName || "",
                      ServiceCost: meal?.MealCost || "",
                      TotalServiceCost: meal?.MealTotalCost || "",
                    })) ||
                    cost?.HotelMealType ||
                    [],
                })) || [],
            },
          ],
        };
      }
      return item;
    });

    // Build room details (finalRoomJson)
    const staticRoom = updatedHotelFormValue?.map((item) => {
      const details = qoutationData?.QueryInfo?.Accomondation?.RoomInfo?.filter(
        (room) => room?.NoOfPax != null
      );

      const equalToDBLRoom = details?.filter(
        (room) => room?.RoomType === "DBL Room"
      )[0];

      const notEqualToDBLRoom = details?.filter(
        (room) => room?.RoomType !== "DBL Room"
      );

      const orderedRoom = equalToDBLRoom
        ? [equalToDBLRoom, ...notEqualToDBLRoom]
        : notEqualToDBLRoom;

      const isExtraBedAvailable = orderedRoom?.some((room) =>
        room?.RoomType?.includes("ExtraBed(A)")
      );

      if (isExtraBedAvailable) {
        return orderedRoom?.map((room) => ({
          RoomBedTypeId: room?.id,
          RoomCost: "",
          RoomType: room?.RoomType,
        }));
      } else {
        const extraBed = {
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

    const finalRoomJson = updatedHotelFormValue?.map((formItem, dayIndex) => {
      if (formItem?.DayNo === dayNo) {
        const hotelService = formItem?.DayServices?.[0];
        const serviceDetails = hotelService?.ServiceDetails?.[0] || {};
        const roomBedTypes = serviceDetails?.ItemUnitCost?.RoomBedType || [];

        return staticRoom[dayIndex]?.map((roomObj) => {
          const matchingRoom = roomBedTypes.find(
            (room) => room?.RoomBedTypeId === roomObj?.RoomBedTypeId
          );
          return {
            ...roomObj,
            RoomCost: matchingRoom ? matchingRoom.RoomCost || "" : "",
          };
        });
      }
      return roomDetails[dayIndex] || [];
    });

    // Build meal details (finalMealJson)
    const staticMeal = updatedHotelFormValue?.map(() => [
      { MealTypeId: "1", MealCost: "", IsPrice: true },
      { MealTypeId: "2", MealCost: "", IsPrice: true },
      { MealTypeId: "3", MealCost: "", IsPrice: true },
    ]);

    const finalMealJson = updatedHotelFormValue?.map((formItem, dayIndex) => {
      if (formItem?.DayNo === dayNo) {
        const hotelService = formItem?.DayServices?.[0];
        const serviceDetails = hotelService?.ServiceDetails?.[0] || {};
        const mealTypes = serviceDetails?.ItemUnitCost?.MealType || [];

        return staticMeal[dayIndex]?.map((mealObj) => {
          const matchingMeal = mealTypes.find(
            (meal) => meal?.MealTypeId === mealObj?.MealTypeId
          );
          return {
            ...mealObj,
            MealCost: matchingMeal ? matchingMeal.MealCost || "" : "",
            MealTaxValue: matchingMeal ? matchingMeal.MealTaxValue || "" : "",
          };
        });
      }
      return mealDetails[dayIndex] || [];
    });

    // Update states
    // console.log(updatedHotelFormValue, 'Updated hotelFormValue');
    setHotelFormValue(updatedHotelFormValue);
    setRoomDetails(finalRoomJson);
    setOriginalRoomDetails(finalRoomJson);
    setMealDetails(finalMealJson);
    setOriginalMealDetails(finalMealJson);

    // Dispatch updated values
    dispatch(
      setLocalHotelFormValue({
        HotelForm: updatedHotelFormValue,
        MealType: finalMealJson,
        RoomBedType: finalRoomJson,
      })
    );
  };

  const handleHotelCheckBox = (e, type, index) => {
    const { value, checked, name } = e.target;

    if (name == "copy_hotel_form" && checked) {
      setHotelCheckBox({ ...hotelCheckBox, copy_hotel_form: true });
      const newArr = [
        ...JSON.parse(JSON.stringify(hotelFormValue)),
        ...JSON.parse(JSON.stringify(localHotelValue?.HotelForm || [])),
      ];
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
        // console.log(checkedValues, "checkedValues");
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

  const handleHotelTableDecrement = (index, item) => {
    if (
      index < 0 ||
      index >= hotelFormValue.length ||
      index >= roomDetails.length ||
      index >= mealDetails.length
    ) {
      // console.warn("Invalid index for decrement:", index);
      return;
    }

    // console.log(
    //   "hotelFOrmVallll",
    //   hotelFormValue?.filter((_, ind) => ind !== index)
    // );
    // setHotelFormValue((prev) => prev.filter((_, ind) => ind !== index));
    const updatedFormValue = hotelFormValue?.filter((_, ind) => ind !== index);
    setHotelFormValue(updatedFormValue);

    // setRoomDetails((prev) => prev.filter((_, ind) => ind !== index))
    const updatedRoomValue = roomDetails?.filter((_, ind) => ind !== index);
    setRoomDetails(updatedRoomValue);

    // setOriginalRoomDetails((prev) => prev.filter((_, ind) => ind !== index));

    const updatedMealValue = mealDetails?.filter((_, ind) => ind !== index);
    setMealDetails(updatedMealValue);

    // setMealDetails((prev) => prev.filter((_, ind) => ind !== index));
    // setOriginalMealDetails((prev) => prev.filter((_, ind) => ind !== index));
  };

  useEffect(() => {
    const { index, field, value } = selectedInd;
    console.log(index, field, value, "index, field, value ");

    if (index === undefined || !field) return;

    const hotelForm = hotelFormValue[index];
    const currentServiceId = hotelForm?.ServiceId;
    const selectedHotel = hotelList[index]?.find(
      (hotel) => hotel?.id == currentServiceId
    );
    if (!selectedHotel) return;

    if (["Destination", "ServiceId", "MealPlan"].includes(field)) {
      console.log("calllshai");

      getHotelRateApi(
        selectedHotel.HotelUniqueID,
        selectedHotel.HotelDestination?.DestinationUniqueId,
        index,
        "",
        hotelForm?.QuatationNo || "",
        hotelForm?.Date || "",
        hotelForm?.MealPlan || "",
        "",
        ""
      );
    }
  }, [selectedInd]);
  useEffect(() => {
    const { index, field, value } = selectedInd;
    if (index === undefined || !field) return;

    const hotelForm = hotelFormValue[index];
    const currentServiceId = hotelForm?.ServiceId;
    const selectedHotel = hotelList[index]?.find(
      (hotel) => hotel?.id == currentServiceId
    );
    if (!selectedHotel) return;

    if (["RoomCategory"].includes(field)) {
      getHotelRateApi(
        selectedHotel.HotelUniqueID,
        selectedHotel.HotelDestination?.DestinationUniqueId,
        index,
        "",
        hotelForm?.QuatationNo || "",
        hotelForm?.Date || "",
        hotelForm?.MealPlan || "",
        hotelForm?.RoomCategory || ""
      );
    }
  }, [selectedInd]);

  // hotel table forms onchange handler
  // Add a ref to track if ServiceId change is from handleHotelFormChange

  const handleHotelFormChange = (ind, subIndex, formType, e) => {
    const { name, value, checked, type } = e.target;
    console.log(name, value, checked, type, "name, value, checked, type");

    if (name === "ServiceId") {
      isServiceIdChangeFromHandle.current = true;
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
  const seperatefunction = () => {
    const finalRoomDetails = hotelFormValue?.map((_, index) => {
      return roomDetails[index]?.map((room) => ({
        RoomBedTypeId: room?.RoomBedTypeId,
        RoomCost: mathRoundHelper(room?.RoomCost),
      }));
    });
    // console.log("finalRoomDetails", finalRoomDetails);

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
    // console.log("finalMealDetails", finalMealDetails);
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
    // console.log("mergedBedPrice", mergedBedPrice);
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
      // if (row?.ServiceId != "") {
      return {
        ...row,
        ...(ActiveOptionId ? { OptionId: ActiveOptionId } : {}),
        Hike: hikePercent,
        RoomBedType: finalRoomDetails[index],
        MealType: finalMealDetails[index],
        DayType: "Main",
        ServiceMainType: "No",
        HotelCategory: headerDropdown?.Hotel,
        HotelRoomBedType: mergedBedPrice,
        HotelMealType: mealRates,
        Sector: fromToDestinationList[index],
      };
    });

    let filteredFinalJson = finalJson?.filter((form) => form != null);
    dispatch(setHotelFinalValue(filteredFinalJson));
    return filteredFinalJson;

    console.log(filteredFinalJson, "filteredFinalJson");
  };
  useEffect(() => {
    seperatefunction();
  }, [
    hotelFormValue,
    roomDetails,
    mealDetails,
    calculatedRateDetails,
    hikePercent,
    ActiveOptionId,
    headerDropdown,
    fromToDestinationList,
    checkIncludes,
  ]);
  // console.log(hotelFormValue, "hotelFormValue");

  const handleFinalSave = async () => {
    // if (
    //   !hotelFormValue.length ||
    //   !roomDetails.length ||
    //   !mealDetails.length ||
    //   hotelFormValue.some((row) => !row.ServiceId)
    // ) {
    //   // console.log("Please select all required hotel, room, and meal details before saving.");
    //   return;
    // }
    const finalRoomDetails = hotelFormValue?.map((_, index) => {
      return roomDetails[index]?.map((room) => ({
        RoomBedTypeId: room?.RoomBedTypeId,
        RoomCost: mathRoundHelper(room?.RoomCost),
      }));
    });
    // console.log("finalRoomDetails", finalRoomDetails);

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
    // console.log("finalMealDetails", finalMealDetails);
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
    // console.log("mergedBedPrice", mergedBedPrice);
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
      // if (row?.ServiceId != "") {
      return {
        ...row,
        ...(ActiveOptionId ? { OptionId: ActiveOptionId } : {}),
        Hike: hikePercent,
        RoomBedType: finalRoomDetails[index],
        MealType: finalMealDetails[index],
        DayType: "Main",
        ServiceMainType: "No",
        HotelCategory: headerDropdown?.Hotel,
        HotelRoomBedType: mergedBedPrice,
        HotelMealType: mealRates,
        Sector: fromToDestinationList[index],
      };
      // } else {
      //   return null;
      // }
    });

    // console.log(finalJson, 'finaljsondkfkd')

    let filteredFinalJson = finalJson?.filter((form) => form != null);
    // console.log("filteredFinalJson", filteredFinalJson);
    // if (alternateFormValue.length > 0) {
    //   const supplementForm = alternateFormValue?.map(
    //     (alternate) => alternate?.Form
    //   )[0];
    //   const supplementRoom = alternateRoomDetails?.map(
    //     (alter) => alter?.Form
    //   )[0];
    //   const supplementMeal = alternateMealDetails?.map(
    //     (alter) => alter?.Form
    //   )[0];
    //   const finalSupplement = supplementForm?.map((form, index) => {
    //     if (form?.ServiceId != "") {
    //       return {
    //         ...form,
    //         ServiceMainType: "No",
    //         RoomBedType: supplementRoom[index],
    //         MealType: supplementMeal[index],
    //         Sector: fromToDestinationList[index],
    //       };
    //     } else {
    //       return null;
    //     }
    //   });

    //   const filteredSupplement = finalSupplement?.filter(
    //     (form) => form != null
    //   );

    //   finalJson = [...filteredFinalJson, ...filteredSupplement];
    // }
    console.log(filteredFinalJson, "filteredFinalJson");

    try {
      await hotelValidation.validate(filteredFinalJson, { abortEarly: false });

      // console.log(...filteredFinalJson,"filteredFinalJson");

      setValidationErrors({});
      const { data } = await axiosOther.post(
        ActiveOptionId
          ? "update-multiple-quatation-hotel"
          : "update-quotation-hotel",
        filteredFinalJson
      );

      if (data?.status == 1) {
        // notifySuccess("Services Added !");
        notifySuccess(data.message);
        // getQoutationList();
        dispatch(setQoutationResponseData(data?.data));
        dispatch(setTogglePriceState());
      }
    } catch (error) {
      // console.log("error", error);
      notifyError(error?.message);

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
        setValidationErrors(data[0][1]);
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

  const handleHotelCopy = (e) => {
    const { checked } = e.target;
    if (checked) {
      if (
        !itineraryHotelValue?.HotelForm?.length ||
        !itineraryHotelValue?.MealType?.length ||
        !itineraryHotelValue?.RoomBedType?.length
      ) {
        // console.log("No copy data available yet.");
        return;
      }
      setIsCopyHotel(true);
      setHotelFormValue(
        JSON.parse(JSON.stringify(itineraryHotelValue?.HotelForm || []))
      );
      setMealDetails(
        JSON.parse(JSON.stringify(itineraryHotelValue?.MealType || []))
      );
      setOriginalMealDetails(
        JSON.parse(JSON.stringify(itineraryHotelValue?.MealType || []))
      );
      setRoomDetails(
        JSON.parse(JSON.stringify(itineraryHotelValue?.RoomBedType || []))
      );
      setOriginalRoomDetails(
        JSON.parse(JSON.stringify(itineraryHotelValue?.RoomBedType || []))
      );
    } else {
      setIsCopyHotel(false);
      setHotelFormValue(
        JSON.parse(JSON.stringify(localHotelValue?.HotelForm || []))
      );
      setMealDetails(
        JSON.parse(JSON.stringify(localHotelValue?.MealType || []))
      );
      setOriginalMealDetails(
        JSON.parse(JSON.stringify(localHotelValue?.MealType || []))
      );
      setRoomDetails(
        JSON.parse(JSON.stringify(localHotelValue?.RoomBedType || []))
      );
      setOriginalRoomDetails(
        JSON.parse(JSON.stringify(localHotelValue?.RoomBedType || []))
      );
    }
  };

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
    setHotelCopy(true);
    // if (alternateFormValue.length <= 0) {
    //   // setAlternateFormValue([
    //   //   ...alternateFormValue,
    //   //   {
    //   //     AlternateId: alternateFormValue.length + 1,
    //   //     Form: localHotelValue?.HotelForm,
    //   //   },
    //   // ]);
    //   // setAlternateRoomDetails([
    //   //   ...alternateRoomDetails,
    //   //   {
    //   //     AlternateId: alternateFormValue.length + 1,
    //   //     Form: localHotelValue?.RoomBedType,
    //   //   },
    //   // ]);
    //   // setAlternateMealDetails([
    //   //   ...alternateMealDetails,
    //   //   {
    //   //     AlternateId: alternateFormValue.length + 1,
    //   //     Form: localHotelValue?.MealType,
    //   //   },
    //   // ]);
    //   // setHotelCheckBox({
    //   //   ...hotelCheckBox,
    //   //   copy: [...hotelCheckBox?.copy, []],
    //   // });
    //   setIsOpen({ ...isOpen, copy: [...isOpen?.copy, false] });
    // }
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
      roomDetails?.flat().forEach((room) => {
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
        const mrkp = (room.RoomCost * hotelData?.Value) / 100 || 0; //change markup value  room type
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
  }, [roomDetails, hikePercent, hotelData?.Value]); // Add dependency to react to markup changes

  useEffect(() => {
    const calculateMealCosts = (mealDetails) => {
      const mealCostMap = {};

      mealDetails?.flat().forEach((meal) => {
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
        const markupValue = (meal.MealCost * markupPercent) / 100 || 0;
        const markedUpCost = meal.MealCost + markupValue;
        const mrkp = (meal?.MealCost * hotelData?.Value) / 100 || 0; // Change Markup Lunch Breakfast dinner
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
  }, [mealDetails, hikePercent, hotelData?.Value]); // Add dependency to react to markup changes

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
  // useEffect(() => {
  //   const destinations = hotelFormValue?.map((hotel, index, hotelArr) => {
  //     return {
  //       From: hotel?.Destination,
  //       To: hotelArr[index + 1]?.Destination,
  //     };
  //   });

  //   const currAndPrevDest = destinations?.map((dest, ind) => {
  //     const currentAndPrev =
  //       dest?.From == destinations[ind - 1]?.From
  //         ? { From: dest?.From, To: "" }
  //         : { From: dest?.From, To: destinations[ind - 1]?.From };
  //     return currentAndPrev;
  //   });

  //   const FromToDestination = currAndPrevDest?.map((item) => {
  //     const filteredFromDest = destinationList.find(
  //       (dests) => dests?.id == item?.From
  //     );
  //     const filteredToDest = destinationList.find(
  //       (dests) => dests?.id == item?.To
  //     );

  //     if (filteredToDest != undefined) {
  //       return `${filteredToDest?.Name} To ${filteredFromDest?.Name}`;
  //     } else {
  //       return filteredFromDest?.Name;
  //     }
  //   });

  //   setFromToDestinationList(FromToDestination);
  // }, [
  //   hotelFormValue?.map((hotel) => hotel?.Destination).join(","),
  //   destinationList,
  // ]);

  // =========================

  const mainHotelCheckBox = useSelector(
    (state) => state.itineraryServiceCopyReducer.hotelCheckbox
  );

  useEffect(() => {
    // console.log("IUY", mainHotelCheckBox.local && mainHotelCheckBox.foreigner);
    if (mainHotelCheckBox.local && mainHotelCheckBox.foreigner) {
      const updatedMealType = JSON.parse(JSON.stringify(mealDetails));
      dispatch(
        setItineraryCopyHotelFormData({
          HotelForm: hotelFormValue,
          MealType: updatedMealType,
          RoomBedType: roomDetails,
        })
      );
    }
  }, [hotelFormValue, roomDetails, mealDetails, mainHotelCheckBox]);

  useEffect(() => {
    return () => {
      dispatch(
        setItineraryCopyHotelFormDataCheckbox({ local: true, foreigner: true })
      );
    };
  }, []);

  // useEffect(() => {
  //   return () => {
  //     dispatch(setItinerayTabChange("main-itinerary"));
  //   };
  // });

  // --- Handlers --- //
  const handleMenuOpen = (index) => {
    // Reset search list when menu opens
    setHotelSearchList((prev) => {
      const newList = [...prev];
      newList[index] = null;
      return newList;
    });

    // Restore full list if needed
    setHotelList((prev) => {
      const newList = [...prev];
      if (
        JSON.stringify(newList[index]) !== JSON.stringify(hotelFullList[index])
      ) {
        newList[index] = hotelFullList[index] || [];
        return newList;
      }
      return prev;
    });
  };
  const handleSearchOpen = (index) => {
    // Reset search list when menu open
    setRoomSearchList((prev) => {
      const newList = [...prev];
      newList[index] = null;
      return newList;
    });

    // Restore full list if needed
    setRoomList((prev) => {
      const newList = [...prev];
      if (
        JSON.stringify(newList[index]) !== JSON.stringify(hotelFullList[index])
      ) {
        newList[index] = hotelFullList[index] || [];
        return newList;
      }
      return prev;
    });
  };

  const handleChange = (index, selected) => {
    // Reset search list when selection changes
    setHotelSearchList((prev) => {
      const newList = [...prev];
      newList[index] = null;
      return newList;
    });

    handleHotelFormChange(index, "", "original", {
      target: {
        name: "ServiceId",
        value: selected?.value || "",
      },
    });
  };
  const handleRoomChange = (index, selected) => {
    // Reset search list when selection changes
    setHotelSearchList((prev) => {
      const newList = [...prev];
      newList[index] = null;
      return newList;
    });

    handleHotelFormChange(index, "", "original", {
      target: {
        name: "RoomCategory",
        value: selected?.value || "",
      },
    });
  };

  const handleInputChange = (index, newValue, action) => {
    if (action === "input-change") {
      // Clear previous timeout
      if (window.hotelSearchTimeout) {
        clearTimeout(window.hotelSearchTimeout);
      }

      // Set new timeout
      window.hotelSearchTimeout = setTimeout(() => {
        setHotelName((prev) => ({
          ...prev,
          [index]: newValue,
        }));

        getHotelListDependently(
          hotelFormValue[index]?.Destination,
          headerDropdown?.Hotel,
          index,
          newValue
        );
      }, 500);
    }
  };
  const handleSearchInputChange = (index, newValue, action) => {
    if (action === "input-change") {
      // Clear previous timeout
      if (window.hotelSearchTimeout) {
        clearTimeout(window.hotelSearchTimeout);
      }

      // Set new timeout
      window.hotelSearchTimeout = setTimeout(() => {
        setRoomList((prev) => ({
          ...prev,
          [index]: newValue,
        }));

        getRoomList(index, newValue);
      }, 500);
    }
  };

  const getSelectedHotel = (index) => {
    const serviceId = hotelFormValue[index]?.ServiceId;
    if (!serviceId) return null;

    const selectedHotel =
      (hotelSearchList[index] || hotelList[index] || []).find(
        (hotel) => hotel.id === serviceId
      ) || hotelFullList[index]?.find((hotel) => hotel.id === serviceId);

    if (!selectedHotel) return null; // 👈 important: fallback to null

    return {
      value: selectedHotel.id,
      label: selectedHotel.HotelName,
    };
  };
  const getSelectedRoom = (index) => {
    const RoomCategory = hotelFormValue[index]?.RoomCategory;
    if (!RoomCategory) return null;

    const selectedHotel =
      (RoomSearchList[index] || roomList[index] || []).find(
        (hotel) => hotel.id == RoomCategory
      ) || hotelFullList[index]?.find((hotel) => hotel.id == RoomCategory);

    if (!selectedHotel) return null; // 👈 important: fallback to null
    console.log(selectedHotel, "selectedHotel");

    return {
      value: selectedHotel.id,
      label: selectedHotel.Name,
    };
  };

  const currencyType = {
    currencyId: qoutationData?.CurrencyId,
    currencyName: qoutationData?.CurrencyName,
  };

  const paxType = {
    name: qoutationData?.TourSummary?.PaxTypeName,
    id: qoutationData?.TourSummary?.PaxTypeId,
  };

  const mealPlan = {
    MealPlanId: qoutationData?.Days?.[0]?.DayServices?.[0]?.MealPlanId ?? null,
    MealPlanName:
      qoutationData?.Days?.[0]?.DayServices?.[0]?.MealPlanName ?? "",
  };

  console.log(mealPlan, "sFSDf45");

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
            {/* {Type !== "Main" && ( */}
            {/* <div
                className="d-flex gap-1 form-check"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  className="form-check-input check-md"
                  id="copy-hotel"
                  value="extrabed"
                  checked={isCopyHotel}
                  onChange={handleHotelCopy}
                />
                <label className="fontSize11px m-0 ms-1 " htmlFor="copy-hotel">
                  Copyeeeeeeeeeeeeeeeeeee
                </label>
              </div> */}
            {/* )} */}
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
                  min="0"
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
            {isDataLoading ? (
              <IsDataLoading />
            ) : (
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
                          Room Type
                        </th>
                        <th
                          style={{ display: "none" }}
                          // style={{ visibility: "hidden" }}
                          rowSpan={2}
                          className="py-1 align-middle"
                        >
                          Supplier
                        </th>
                        {(qoutationData?.TourSummary?.PaxTypeName === "FIT" ||
                          qoutationData?.TourSummary?.PaxTypeName === "BOTH") &&
                          roomDetails &&
                          roomDetails[0]?.length > 1 && (
                            <th
                              colSpan={
                                roomDetails &&
                                roomDetails[0]
                                  ?.map((room) => room?.RoomType)
                                  ?.includes("ExtraBed(A)")
                                  ? hotelCheckBox?.original?.includes(
                                      "extrabed"
                                    )
                                    ? roomDetails[0]?.length
                                    : roomDetails[0]?.length - 1
                                  : roomDetails?.[0]?.length || 0
                              }
                              className="py-1 align-middle"
                            >
                              FIT
                            </th>
                          )}
                        {(qoutationData?.TourSummary?.PaxTypeName === "FIT" ||
                          qoutationData?.TourSummary?.PaxTypeName === "BOTH") &&
                          roomDetails &&
                          roomDetails[0]?.length == 1 &&
                          hotelCheckBox?.original?.includes("extrabed") && (
                            <th
                              colSpan={
                                roomDetails &&
                                roomDetails[0]
                                  ?.map((room) => room?.RoomType)
                                  ?.includes("ExtraBed(A)")
                                  ? hotelCheckBox?.original?.includes(
                                      "extrabed"
                                    )
                                    ? roomDetails[0]?.length
                                    : roomDetails[0]?.length - 1
                                  : roomDetails?.[0]?.length || 0
                              }
                              className="py-1 align-middle"
                            >
                              FIT
                            </th>
                          )}
                        {console.log(
                          qoutationData?.TourSummary?.PaxTypeName,
                          "qoutationData?.TourSummary?.PaxTypeName"
                        )}
                        {(qoutationData?.TourSummary?.PaxTypeName === "GIT" ||
                          qoutationData?.TourSummary?.PaxTypeName === "BOTH") &&
                          roomDetails &&
                          roomDetails[0]?.length > 1 && (
                            <th
                              colSpan={
                                roomDetails &&
                                roomDetails[0]
                                  ?.map((room) => room?.RoomType)
                                  ?.includes("ExtraBed(A)")
                                  ? hotelCheckBox?.original?.includes(
                                      "extrabed"
                                    )
                                    ? roomDetails[0]?.length
                                    : roomDetails[0]?.length - 1
                                  : roomDetails?.[0]?.length || 0
                              }
                              className="py-1 align-middle"
                            >
                              GIT
                            </th>
                          )}
                        {(qoutationData?.TourSummary?.PaxTypeName === "GIT" ||
                          qoutationData?.TourSummary?.PaxTypeName === "BOTH") &&
                          roomDetails &&
                          roomDetails[0]?.length == 1 &&
                          hotelCheckBox?.original?.includes("extrabed") && (
                            <th
                              colSpan={
                                roomDetails &&
                                roomDetails[0]
                                  ?.map((room) => room?.RoomType)
                                  ?.includes("ExtraBed(A)")
                                  ? hotelCheckBox?.original?.includes(
                                      "extrabed"
                                    )
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
                        {(qoutationData?.TourSummary?.PaxTypeName == "FIT" ||
                          qoutationData?.TourSummary?.PaxTypeName == "BOTH") &&
                          (hotelCheckBox?.original?.includes("extrabed")
                            ? roomDetails &&
                              roomDetails[0]?.map((room, index) => {
                                return (
                                  <th className="py-1" key={index}>
                                    {room?.RoomType}
                                  </th>
                                );
                              })
                            : roomDetails &&
                              roomDetails[0]?.map((room, index) => {
                                return (
                                  room?.RoomType != "ExtraBed(A)" && (
                                    <th className="py-1" key={index}>
                                      {room?.RoomType}
                                    </th>
                                  )
                                );
                              }))}
                        {(qoutationData?.TourSummary?.PaxTypeName == "GIT" ||
                          qoutationData?.TourSummary?.PaxTypeName == "BOTH") &&
                          (hotelCheckBox?.original?.includes("extrabed")
                            ? roomDetails &&
                              roomDetails[0]?.map((room, index) => {
                                return (
                                  <th className="py-1" key={index}>
                                    {room?.RoomType}
                                  </th>
                                );
                              })
                            : roomDetails &&
                              roomDetails[0]?.map((room, index) => {
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
                                checked={mealDetails?.every((set) => {
                                  const data = set.find(
                                    (item) => item.MealTypeId === "1"
                                  );
                                  return data ? data.IsPrice === true : false;
                                })}
                                onChange={(e) =>
                                  handleSupplementAllCheck("1", e)
                                }
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
                          <th rowSpan={2} className="py-1 align-middle">
                            <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                name="Includes"
                                id={`dinner_check`}
                                value={"Yes"}
                                checked={mealDetails?.every((set) => {
                                  const data = set.find(
                                    (item) => item.MealTypeId === "2"
                                  );
                                  return data ? data.IsPrice === true : false;
                                })}
                                onChange={(e) =>
                                  handleSupplementAllCheck("2", e)
                                }
                                // checked={checkIncludes === "Yes"}
                                // onChange={(e) =>
                                //   setCheckIncludes(
                                //     e.target.checked ? "Yes" : "No"
                                //   )
                                // }
                              />
                              <label htmlFor="dinner_check" className="mt-1">
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
                                checked={mealDetails?.every((set) => {
                                  const data = set.find(
                                    (item) => item.MealTypeId === "3"
                                  );
                                  return data ? data.IsPrice === true : false;
                                })}
                                onChange={(e) =>
                                  handleSupplementAllCheck("3", e)
                                }
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
                      {hotelFormValue?.map((item, index) => {
                        // console.log("hotelFooormmValll", item, index);
                        return (
                          <tr key={index}>
                            <td className="days-width-9">
                              <div className={`d-flex gap-2 `}>
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
                                      handleHotelTableDecrement(index, item)
                                    }
                                  >
                                    <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                  </span>
                                </div>
                                {item?.Date ? (
                                  <span
                                    style={{
                                      textWrap: "nowrap",
                                      marginRight: "4px",
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
                                    min="0"
                                    style={{ width: "30px" }}
                                    className={`formControl1 ${
                                      isFocus == index + "a" && "focus-red"
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
                                  className={`formControl1 ${
                                    isFocus == index + "b" && "focus-red"
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
                                  required
                                >
                                  <option value="">Select</option>;
                                  {qoutationData?.Days?.map((qout, index) => {
                                    return (
                                      <option
                                        value={qout?.DestinationId}
                                        key={index + 1}
                                      >
                                        {qout?.DestinationName}
                                      </option>
                                    );
                                  })}
                                </select>
                                <span
                                  className="ms-2"
                                  onClick={() => {
                                    setShowModal(true);
                                    const selectedId =
                                      hotelFormValue[index]?.Destination;
                                    const selectedName =
                                      qoutationData?.Days?.find(
                                        (q) => q.DestinationId === selectedId
                                      )?.DestinationName || "";
                                    const destId =
                                      hotelFormValue[index]?.Destination;
                                    const hotelCategoryId =
                                      hotelFormValue[index]?.HotelCategoryId;
                                    const dayNo = item?.DayNo;
                                    const dayIndex =
                                      qoutationData?.Days?.findIndex(
                                        (q) => q.DestinationId === selectedId
                                      );

                                    console.log(
                                      hotelFormValue[index],
                                      "KJJJFH"
                                    );

                                    const data = {
                                      dayNo,
                                      selectedId,
                                      selectedName,
                                      dayIndex,
                                      destId,
                                      hotelCategoryId,
                                    };
                                    setrowDestination(data);
                                  }}
                                >
                                  <i class="fa-solid fa-circle-info"></i>
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex gap-1 align-items-center justify-content-center">
                                <Select
                                  menuPortalTarget={document.body}
                                  placeholder="Select"
                                  styles={customStylesForhotel(background)}
                                  className={`customSelectLightTheame formControl1 ${
                                    isFocus == index + "c" && "focus-red"
                                  }`}
                                  classNamePrefix="custom"
                                  options={[
                                    { value: "", label: "Select" },
                                    ...(
                                      hotelSearchList[index] ||
                                      hotelList[index] ||
                                      []
                                    ).map((hotel) => ({
                                      value: hotel.id,
                                      label: hotel.HotelName,
                                    })),
                                  ]}
                                  onMenuOpen={() => handleMenuOpen(index)}
                                  value={getSelectedHotel(index)}
                                  onChange={(selected) =>
                                    handleChange(index, selected)
                                  }
                                  onInputChange={(newValue, { action }) =>
                                    handleInputChange(index, newValue, action)
                                  }
                                  onFocus={() => handleFocus(index + "c")}
                                  onBlur={handleBlur}
                                />
                                {console.log(
                                  BlackoutDates[index],
                                  "BlackoutDates[index]"
                                )}
                                {BlackoutDates[index]?.BlackoutDates?.length >
                                  0 &&
                                BlackoutDates[index]?.BlackoutDates?.some(
                                  (date) =>
                                    (date.BlackoutDatesFrom != null &&
                                      date.BlackoutDatesFrom.trim() !== "") ||
                                    (date.BlackoutDatesTo != null &&
                                      date.BlackoutDatesTo.trim() !== "") ||
                                    (date.BlackoutDatesRemark != null &&
                                      date.BlackoutDatesRemark.trim() !== "")
                                ) ? (
                                  <div className="icon-container">
                                    <span className="newQuotationIconButton ms-2">
                                      <i className="fa-solid fa-circle-info"></i>
                                    </span>

                                    {BlackoutDates[index]?.BlackoutDates
                                      ?.length > 0 && (
                                      <p className="tooltip-text py-1 px-1 d-flex flex-column">
                                        {BlackoutDates[index].BlackoutDates.map(
                                          (date, dateIndex) => (
                                            <div
                                              key={dateIndex}
                                              className="blackout-date"
                                            >
                                              {/* {console.log(
                                                  date.BlackoutDatesTo,
                                                  "date.BlackoutDatesTo"
                                                )} */}

                                              <span>
                                                From:{" "}
                                                {date.BlackoutDatesFrom?.trim() ||
                                                  "N/A"}
                                                , To:{" "}
                                                {date.BlackoutDatesTo?.trim() ||
                                                  "N/A"}
                                              </span>
                                              {date.BlackoutDatesRemark?.trim() && (
                                                <span>
                                                  Remark:{" "}
                                                  {date.BlackoutDatesRemark}
                                                </span>
                                              )}
                                            </div>
                                          )
                                        )}

                                        {BlackoutDates[index]?.hotel && (
                                          <span>
                                            Hotel: {BlackoutDates[index].hotel}
                                          </span>
                                        )}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  // Empty placeholder to keep same space
                                  <div
                                    className="icon-container"
                                    style={{ visibility: "hidden" }}
                                  >
                                    <span className="newQuotationIconButton ms-2">
                                      <i className="fa-solid fa-circle-info"></i>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <select
                                  name="OverNight"
                                  id=""
                                  className={`formControl1 ${
                                    isFocus == index + "d" && "focus-red"
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
                                <Select
                                  menuPortalTarget={document.body}
                                  placeholder="Select"
                                  styles={customStylesForhotel(background)}
                                  className={`mx-auto customSelectLightTheame formControl1 ${
                                    isFocus == index + "roomCategory" &&
                                    "focus-red"
                                  }`}
                                  classNamePrefix="custom"
                                  options={[
                                    { value: "", label: "Select" },
                                    ...(
                                      RoomSearchList[index] ||
                                      roomList ||
                                      []
                                    ).map((hotel) => ({
                                      value: hotel.id,
                                      label: hotel.Name,
                                    })),
                                  ]}
                                  // {console.log(RoomSearchList,"RoomSearchList")
                                  // }

                                  onMenuOpen={() => handleSearchOpen(index)}
                                  value={getSelectedRoom(index)}
                                  onChange={(selected) =>
                                    handleRoomChange(index, selected)
                                  }
                                  onInputChange={(newValue, { action }) =>
                                    handleSearchInputChange(
                                      index,
                                      newValue,
                                      action
                                    )
                                  }
                                  onFocus={() =>
                                    handleFocus(index + "roomCategory")
                                  }
                                  onBlur={handleBlur}
                                />
                                {/* <select
                                  name="RoomCategory"
                                  id=""
                                  className={`formControl1 ${
                                    isFocus == index + "roomCategory" &&
                                    "focus-red"
                                  }`}
                                  value={hotelFormValue[index]?.RoomCategory}
                                 
                                 
                                  // onBlur={handleBlur}
                                 
                                >
                                  <option value="">Select</option>
                                  {roomList?.map((room, index) => {
                                    <option value="">Select</option>;
                                    return (
                                      <option
                                        value={room?.id}
                                        key={index + "h"}
                                      >
                                        {room?.Name}
                                      </option>
                                    );
                                  })}
                                </select> */}
                              </div>
                            </td>
                            <td style={{ display: "none" }}>
                              <div>
                                <select
                                  name="Supplier"
                                  id=""
                                  className={`formControl1 ${
                                    isFocus == index + "supplier" && "focus-red"
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
                                  onFocus={() =>
                                    handleFocus(index + "supplier")
                                  }
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

                            {(qoutationData?.TourSummary?.PaxTypeName ==
                              "FIT" ||
                              qoutationData?.TourSummary?.PaxTypeName ==
                                "BOTH") && (
                              <>
                                {hotelCheckBox?.original?.includes("extrabed")
                                  ? roomDetails[index]?.map((room, ind) => {
                                      return (
                                        <td key={ind + 1}>
                                          <div>
                                            <input
                                              id=""
                                              type="number"
                                              min="0" // add only type name
                                              className={`formControl1 width50px ${
                                                isFocus == index + "f" + ind &&
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
                                                type="number"
                                                min="0" // add only type name
                                                id=""
                                                className={`formControl1 width50px ${
                                                  isFocus ==
                                                    index + "f" + ind &&
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
                            {(qoutationData?.TourSummary?.PaxTypeName ==
                              "GIT" ||
                              qoutationData?.TourSummary?.PaxTypeName ==
                                "BOTH") && (
                              <>
                                {hotelCheckBox?.original?.includes("extrabed")
                                  ? roomDetails[index]?.map((room, ind) => {
                                      return (
                                        <td key={ind + 1}>
                                          <div>
                                            <input
                                              type="number"
                                              min="0" // add only type name
                                              id=""
                                              className={`formControl1 width50px ${
                                                isFocus == index + "f" + ind &&
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
                                      );
                                    })
                                  : roomDetails[index]?.map((room, ind) => {
                                      return (
                                        room?.RoomType != "ExtraBed(A)" && (
                                          <td key={ind + 1}>
                                            <div>
                                              <input
                                                id=""
                                                type="number"
                                                min="0" // add only type name
                                                className={`formControl1 width50px ${
                                                  isFocus ==
                                                    index + "f" + ind &&
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
                                    className={`formControl1 ${
                                      isFocus == index + "j" && "focus-red"
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
                                        type="number"
                                        min="0" // chnage type to number
                                        className={`formControl1 width50px ${
                                          isFocus == `${index}+${mealIndex}` &&
                                          "focus-red"
                                        }`}
                                        onFocus={() =>
                                          handleFocus(`${index}+${mealIndex}`)
                                        }
                                        onBlur={handleBlur}
                                        value={
                                          mealDetails[index][mealIndex]
                                            ?.MealCost
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
                          colSpan={
                            Type == "Local" || Type == "Foreigner" ? 5 : 4
                          }
                          className="text-center fs-6"
                          rowSpan={3}
                        >
                          Total
                        </td>
                        <td>Hotel Cost</td>
                        {hotelCheckBox?.original?.includes("extrabed")
                          ? roomDetails &&
                            roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId === rates?.RoomBedTypeId
                                );
                              return (
                                <td key={index}>
                                  {mathRoundHelper(rate?.RoomCost)}
                                </td>
                              );
                            })
                          : roomDetails &&
                            roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId === rates?.RoomBedTypeId
                                );
                              return (
                                room?.RoomType !== "ExtraBed(A)" && (
                                  <td key={index}>
                                    {mathRoundHelper(rate?.RoomCost)}
                                  </td>
                                )
                              );
                            })}
                        {hotelCheckBox?.original?.includes("mealplan") && (
                          <td></td>
                        )}
                        {mealDetails &&
                          mealDetails[0]?.map((meal, index) => {
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
                        <td>
                          Markup({hotelData?.Value}) {hotelData?.Markup}
                        </td>
                        {hotelCheckBox?.original?.includes("extrabed")
                          ? roomDetails &&
                            roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId === rates?.RoomBedTypeId
                                );
                              return (
                                <td key={index}>
                                  {mathRoundHelper(rate?.Markup)}
                                </td>
                              );
                            })
                          : roomDetails &&
                            roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId === rates?.RoomBedTypeId
                                );
                              return (
                                room?.RoomType !== "ExtraBed(A)" && (
                                  <td key={index}>
                                    {mathRoundHelper(rate?.Markup)}
                                  </td>
                                )
                              );
                            })}
                        {hotelCheckBox?.original?.includes("mealplan") && (
                          <td></td>
                        )}
                        {mealDetails &&
                          mealDetails[0]?.map((meal, index) => {
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
                          ? roomDetails &&
                            roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId === rates?.RoomBedTypeId
                                );
                              return (
                                <td key={index}>
                                  {mathRoundHelper(
                                    (
                                      mathRoundHelper(rate?.RoomCost || 0) +
                                      mathRoundHelper(rate?.Markup || 0)
                                    ).toFixed(2)
                                  )}
                                </td>
                              );
                            })
                          : roomDetails &&
                            roomDetails[0]?.map((room, index) => {
                              const rate =
                                calculatedRateDetails?.RoomRates?.find(
                                  (rates) =>
                                    room?.RoomBedTypeId === rates?.RoomBedTypeId
                                );
                              return (
                                room?.RoomType !== "ExtraBed(A)" && (
                                  <td key={index}>
                                    {mathRoundHelper(
                                      (
                                        mathRoundHelper(rate?.RoomCost || 0) +
                                        mathRoundHelper(rate?.Markup || 0)
                                      ).toFixed(2)
                                    )}
                                  </td>
                                )
                              );
                            })}
                        {hotelCheckBox?.original?.includes("mealplan") && (
                          <td></td>
                        )}
                        {mealDetails &&
                          mealDetails[0]?.map((meal, index) => {
                            const rate = calculatedRateDetails?.MealRates?.find(
                              (rates) => meal?.MealTypeId === rates?.MealTypeId
                            );
                            return (
                              hotelCheckBox?.original?.includes(
                                meal?.MealTypeId
                              ) && (
                                <td key={index}>
                                  {mathRoundHelper(
                                    (
                                      mathRoundHelper(rate?.MealCost || 0) +
                                      mathRoundHelper(rate?.Markup || 0)
                                    ).toFixed(2)
                                  )}
                                </td>
                              )
                            );
                          })}
                      </tr>
                    </tbody>
                  </table>
                </PerfectScrollbar>
              </div>
            )}
          </>
        )}
        {isOpen?.original &&
          (isDataLoading ? (
            ""
          ) : (
            <div className="row">
              <div className="col-12 d-flex justify-content-end align-items-end">
                <button
                  className="btn btn-primary py-1 px-2 radius-4 d-flex align-items-center gap-1"
                  onClick={handleFinalSave}
                >
                  <i className="fa-solid fa-floppy-disk fs-4 "></i> Save
                </button>
              </div>
            </div>
          ))}
      </div>

      {hotelCopy ? <HotelUpgrade remove={setHotelCopy} /> : ""}

      <HotelDetailModel
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleUpdateRowData}
        destination={rowDestination}
        category={headerDropdown?.Hotel}
        mealPlan={mealPlan}
        paxType={paxType}
        fromDate={qoutationData?.TravelDateInfo?.FromDate}
        toDate={qoutationData?.TravelDateInfo?.ToDate}
        currency={currencyType}
      />
    </>
  );
};

export default React.memo(Hotel);
