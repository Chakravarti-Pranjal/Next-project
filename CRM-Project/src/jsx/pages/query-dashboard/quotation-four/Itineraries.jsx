import React, { useRef, useState, useEffect } from "react";
import { Card, Tab, Nav } from "react-bootstrap";
import styles from "./quotationFour.module.css";
import Modal from "react-bootstrap/Modal";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
  FaSlidersH,
} from "react-icons/fa";
import HotelIcon from "../../../../images/quotationFour/hotelNew.svg";
import MonumentIcon from "../../../../images/quotationFour/MonumentNew.svg";
import GuideIcon from "../../../../images/quotationFour/GuideNew.svg";
import ActivityIcon from "../../../../images/quotationFour/ActivityNew.svg";
import RestaurantIcon from "../../../../images/quotationFour/RestaurantNew.svg";
import TransportIcon from "../../../../images/quotationFour/TransportNew.svg";
import FlightIcon from "../../../../images/quotationFour/FlightNew.svg";
import TrainIcon from "../../../../images/quotationFour/TrainNew.svg";
import AdditionalIcon from "../../../../images/quotationFour/Additional.svg";
import SearchIcon from "../../../../images/quotationFour/SearchNew.svg";
import SetPreferenceIcon from "../../../../images/quotationFour/SetPreferenceNew.svg";
import SaveButton from "../../../../images/quotationFour/saveNew.svg";
import EditButton from "../../../../images/quotationFour/editNew.svg";
import ItinerariesHotel from "./itinerary-hotel/index";
import ItinerariesMonument from "./itinerary-monument/index";
import ItinerariesActivity from "./itinerary-activity/index";
import ItinerariesRestaurant from "./itinerary-restaurant/index";
import ItinerariesGuide from "./itinerary-guide/index";
import ItinerariesTransport from "./itinerary-transport/index";
import ItinerariesTrain from "./itinerary-train/index";
import ItinerariesFlight from "./itinerary-flight/index";
import ItinerariesAdditional from "./itinerary-additional/index";
import PerfectScrollbar from "react-perfect-scrollbar";
import ItinerarySlider from "./ItinerariesSlider";
import Demo from "./Demo";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  getHotelSupplierList,
  getQueryDataFromApi,
  getQuotationDataFromApi,
  getSectorData,
  getServicePayload,
  getSupplierList,
} from "./utils/helper.method";
import { useDispatch, useSelector } from "react-redux";
import {
  setQueryFourDataRedux,
  setQueryQuotationFourData,
} from "../../../../store/itineraryFourAction/QueryQuotation.action";
import { notifySuccess, notifyError } from "../../../../helper/notify";
import { axiosOther } from "../../../../http/axios_base_url";
import IsDataLoading from "./IsDataLoading";

// Inline CSS to restore slider styling
const localStyles = `
  .sliderCard {
    border: 1px solid #ddd;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .sliderCard-head {
    background: #f8f9fa;
    border-bottom: 1px solid #ddd;
  }
  .sliderButtons {
    background: transparent;
  }
`;

const tabItems = [
  { key: "Hotel", label: "Hotel", icon: HotelIcon },
  { key: "Monument", label: "Monument", icon: MonumentIcon },
  { key: "Guide", label: "Guide", icon: GuideIcon },
  { key: "Activity", label: "Activity", icon: ActivityIcon },
  { key: "Restaurant", label: "Restaurant", icon: RestaurantIcon },
  { key: "Transport", label: "Transport", icon: TransportIcon },
  { key: "Flight", label: "Flight", icon: FlightIcon },
  { key: "Train", label: "Train", icon: TrainIcon },
  { key: "Additional", label: "Additional", icon: AdditionalIcon },
];

const Itineraries = () => {
  const QueryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Hotel");
  const [isOpen, setIsOpen] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [color, setColor] = useState("#1DB8CE");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dayWiseFormValue, setDayWiseFormValue] = useState([
    {
      "Day 1": {
        hotels: [],
        monuments: [],
        guide: [],
        activity: [],
        transport: [],
        flight: [],
        train: [],
        additional: [],
        restaurant: [],
      },
    },
  ]);
  const [hotelCategoryColors, setHotelCategoryColors] = useState({});
  const [hotelCategoryColorId, setHotelCategoryColorId] = useState({});
  console.log(hotelCategoryColorId, "hotelCategoryColors");

  const [searchClicked, setSearchClicked] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const debounceRef = useRef(null);
  const [quotationFourData, setQuotationFourData] = useState([]);
  const dispatch = useDispatch();
  const { queryQuotationData, queryFourDataRedux } = useSelector(
    (state) => state.queryQuotationFourReducer
  );

  const [guideData, setGuideData] = useState([]);
  const [guideSelectedData, setGuideSelectedData] = useState([]);
  const [selectedRestaurantIcons, setSelectedRestaurantIcons] = useState({});
  const [selectedIcons, setSelectedIcons] = useState({});
  const CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;
  const [companySettingData, setCompanySettingData] = useState(null);

  // Fetch hotel category colors from listCompanySetting API
  useEffect(() => {
    const fetchHotelCategoryColors = async () => {
      try {
        const { data } = await axiosOther.post("listCompanySetting", {
          Key: "HotelCategoryColour",
          CompanyId: CompanyUniqueId,
        });

        if (data?.Status === 200 && data?.DataList?.length > 0) {
          const colors = data.DataList[0].Value.reduce((acc, item) => {
            acc[item.HotelCategoryName] = item.Color;
            return acc;
          }, {});
          const colorsId = data.DataList[0].Value.reduce((acc, item) => {
            acc[item.HotelCategoryId] = item.Color;
            return acc;
          }, {});
          setHotelCategoryColors(colors);
          setHotelCategoryColorId(colorsId);
          setCompanySettingData(data.DataList[0]);
        }
      } catch (error) {
        console.error("Error fetching hotel category colors:", error);
        notifyError("Failed to fetch hotel category colors.");
      }
    };

    fetchHotelCategoryColors();
  }, []);

  // Handle color update submission
  const handleColorSubmit = async () => {
    try {
      const payload = {
        id: "23", // Adjust based on your requirements
        CompanyId: CompanyUniqueId,
        Key: "HotelCategoryColour",
        Value: Object.entries(hotelCategoryColorId).map(
          ([categoryId, color]) => ({
            HotelCategoryId: parseInt(categoryId),
            Color: color,
          })
        ),
        Status: 1,
        AddedBy: "1",
        UpdatedBy: "1",
      };

      const { data } = await axiosOther.post(
        "craeteupdatecompanySetting",
        payload
      );

      if (data?.Status === 1) {
        notifySuccess(data?.Message);
        setLgShow(false); // Close the modal on success
      } else {
        notifyError("Failed to update hotel category colors.");
      }
    } catch (error) {
      console.error("Error updating hotel category colors:", error);
    }
  };

  useEffect(() => {
    const runApi = async () => {
      const filteredData = dayWiseFormValue?.map((item) => {
        const key = Object.keys(item)[0];
        const dayData = item[key];
        return {
          monuments: dayData.monuments,
          Day: dayData.Day,
          DayUniqueId: dayData.DayUniqueId,
          DestinationName: dayData.DestinationName,
          DestinationId: dayData.DestinationId,
          DestinationUniqueId: dayData.DestinationUniqueId,
        };
      });

      const monumentData = filteredData?.find(
        (item) => item.DayUniqueId === selectedCard
      );

      if (monumentData?.monuments?.length > 0) {
        const promises = monumentData.monuments.map((data) => {
          const serviceId = parseInt(data.split("-")[0]);
          return getMonumentList(serviceId);
        });

        const responseguideData = await Promise.all(promises);
        setDayWiseFormValue((prev) =>
          prev.map((item) => {
            const key = Object.keys(item)[0];
            if (item[key].DayUniqueId === selectedCard) {
              return {
                ...item,
                [key]: {
                  ...item[key],
                  guide: [...responseguideData],
                },
              };
            }
            return item;
          })
        );
        setGuideSelectedData(responseguideData);
      }
    };

    runApi();
  }, [
    JSON.stringify(
      dayWiseFormValue?.map((day) => {
        const key = Object.keys(day)[0];
        return day[key].monuments;
      })
    ),
  ]);

  const getMonumentList = async (serviceId) => {
    try {
      const { data } = await axiosOther.post("monument-package-list", {
        id: serviceId,
        Default: "Yes",
      });
      if (data?.Status === 200) {
        const res = data?.DataList?.[0];
        return `${res?.id}-${res.DayType}`;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (queryQuotationData?.length > 0) {
      console.log(queryQuotationData?.[0]?.Days, "VCGDHCN877");
      const updatedDayWiseFormValue = queryQuotationData?.[0]?.Days.map(
        (day) => {
          let hotels = [];
          let monument = [];
          let activity = [];
          let transport = [];
          let flight = [];
          let train = [];
          let additional = [];
          let guide = [];
          let restaurent = [];

          let hotelResult = {};
          let activityResult = {};
          let transportResult = {};
          let flightResult = {};
          let trainResult = {};
          let additionalResult = {};
          let guideResult = {};

          if (day.DayServices?.length > 0) {
            const hotelData = day.DayServices.filter(
              (service) => service.ServiceType === "Hotel"
            );

            hotels = hotelData?.map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            hotelData.forEach((service) => {
              const itemName = service.ServiceDetails?.[0]?.ItemName || "";
              if (!itemName) return;
              const typeCode = service.ServiceMainType === "Guest" ? "M" : "S";
              hotelResult[`${day.Day}-${itemName}`] = typeCode;
            });

            monument = day.DayServices.filter(
              (service) => service.ServiceType === "Monument"
            ).map((service) => `${service.ServiceId}-${service.ServiceName}`);

            const activityData = day.DayServices.filter(
              (service) => service.ServiceType === "Activity"
            );
            activity = activityData?.map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            activityData.forEach((service) => {
              const itemName = service.ServiceDetails?.[0]?.ItemName || "";
              if (!itemName) return;
              const typeCode = service.ServiceMainType === "Guest" ? "M" : "S";
              activityResult[`${day.Day}-${itemName}`] = typeCode;
            });

            const transportData = day.DayServices.filter(
              (service) => service.ServiceType === "Transport"
            );

            transport = transportData?.map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            transportData?.forEach((service) => {
              const itemName = service.ServiceDetails?.[0]?.ItemName || "";
              if (!itemName) return;
              const typeCode = service.ServiceMainType === "Guest" ? "M" : "S";
              transportResult[`${day.Day}-${itemName}`] = typeCode;
            });

            const flightData = day.DayServices.filter(
              (service) => service.ServiceType === "Flight"
            );

            flight = flightData?.map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            flightData?.forEach((service) => {
              const itemName = service.ServiceDetails?.[0]?.ItemName || "";
              if (!itemName) return;
              const typeCode = service.ServiceMainType === "Guest" ? "M" : "S";
              flightResult[`${day.Day}-${itemName}`] = typeCode;
            });

            const trainData = day.DayServices.filter(
              (service) => service.ServiceType === "Train"
            );

            train = trainData.map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            trainData?.forEach((service) => {
              const itemName = service.ServiceDetails?.[0]?.ItemName || "";
              if (!itemName) return;
              const typeCode = service.ServiceMainType === "Guest" ? "M" : "S";
              trainResult[`${day.Day}-${itemName}`] = typeCode;
            });

            const additionalData = day.DayServices.filter(
              (service) => service.ServiceType === "Additional"
            );
            additional = additionalData.map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            additionalData?.forEach((service) => {
              const itemName = service.ServiceDetails?.[0]?.ItemName || "";
              if (!itemName) return;
              const typeCode = service.ServiceMainType === "Guest" ? "M" : "S";
              additionalResult[`${day.Day}-${itemName}`] = typeCode;
            });

            const guideData = day.DayServices.filter(
              (service) => service.ServiceType === "Guide"
            );
            guide = guideData.map(
              (service) => `${service.ServiceId}-${service.DayType}`
            );

            guideData?.forEach((service) => {
              const itemName = service.ServiceDetails?.[0]?.ItemName || "";
              if (!itemName) return;
              const typeCode = service.ServiceMainType === "Guest" ? "M" : "S";
              guideResult[`${day.Day}-${itemName}`] = typeCode;
            });

            const findRestaurent = day.DayServices.filter(
              (service) => service.ServiceType === "Restaurant"
            );
            restaurent = findRestaurent?.map(
              (service) =>
                `${service.ServiceId}-${service.ServiceDetails[0].ItemName}`
            );

            const result = {};
            findRestaurent?.forEach((service) => {
              if (service.MealPlan && service.MealPlan.length > 0) {
                const serviceName = service.MealPlan[0].ServiceName;
                const mealTypes = service.MealPlan.map((meal) => meal.MealType);
                result[`${day.Day}-${serviceName}`] = mealTypes;
              }
            });

            setSelectedIcons((prev) => ({
              ...prev,
              ...hotelResult,
              ...activityResult,
              ...flightResult,
              ...transportResult,
              ...trainResult,
              ...additionalResult,
              ...guideResult,
            }));

            setSelectedRestaurantIcons((prev) => ({
              ...prev,
              ...result,
            }));
          }

          return {
            [day.DayUniqueId]: {
              hotels: hotels,
              monuments: monument,
              guide: guide,
              activity: activity,
              transport: transport,
              flight: flight,
              restaurant: restaurent,
              train: train,
              additional: additional,
              Day: day?.Day,
              DayUniqueId: day?.DayUniqueId,
              DestinationName: day?.DestinationName,
              DestinationId: day?.DestinationId,
              DestinationUniqueId: day?.DestinationUniqueId,
            },
          };
        }
      );
      setDayWiseFormValue(updatedDayWiseFormValue);
    }
  }, [queryQuotationData]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getQuotationDataFromApi(QueryQuotation);
      const queryResponse = await getQueryDataFromApi(QueryQuotation);
      console.log(queryResponse, "response");

      if (queryResponse?.length > 0) {
        //     console.log(queryResponse[0], "queryResponse");
        dispatch(setQueryFourDataRedux(queryResponse[0]));
      }

      if (response?.length > 0) {
        setQuotationFourData(response);
        await getSectorData(response[0]);
        dispatch(setQueryQuotationFourData(response));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery?.trim() === "") return;

    if (debounceRef?.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setSearchClicked(true);
    }, 500);
  }, [searchQuery]);

  const handleSearch = () => {
    if (debounceRef?.current) {
      clearTimeout(debounceRef.current);
    }
    setSearchClicked(true);
  };

  const handleDragStart = (event) => {
    const { text, type, color } = event.active.data.current || {};
    setActiveItem({ text, type, color });
    event.active.data.current = {
      text,
      type:
        type === "monument"
          ? "monuments"
          : type === "guide"
          ? "guide"
          : type || "hotels",
    };
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (!over) {
      setActiveItem(null);
      return;
    }
    const dayKey = over.id;
    const { text, type } = active.data.current || {};
    if (!text || !type) {
      setActiveItem(null);
      return;
    }

    const isHotelEnroute = queryQuotationData[0]?.Days?.find(
      (list) => list.DayUniqueId === dayKey
    );

    if (isHotelEnroute.EnrouteId !== "" && type === "hotels") {
      swal({
        title: `Selected destination is Enroute`,
        icon: "warning",
        buttons: {
          confirm: {
            text: "Ok",
            value: true,
            visible: true,
            className: "btn-custom-size btn btn-primary",
            closeModal: true,
          },
        },
        dangerMode: true,
      });
      return;
    }

    setDayWiseFormValue((prev) => {
      const updatedFormValue = prev.map((dayObj) => {
        const [currentDayKey, dayData] = Object.entries(dayObj)[0];
        if (currentDayKey === dayKey) {
          const existing = dayData[type] || [];
          if (!existing.includes(text)) {
            return {
              ...dayObj,
              [dayKey]: {
                ...dayData,
                [type]: [...existing, text],
              },
            };
          }
        }
        return dayObj;
      });
      return updatedFormValue;
    });
    setActiveItem(null);
  };

  const [colors, setColors] = useState({
    color5star: "#1DB8CE",
    color4star: "#FF5657",
    color3star: "#FF5657",
    colorLuxury: "#0T6750",
    colorFavourite: "#566cffff",
  });

  const handleChangeColorPicker = (e) => {
    const { name, value } = e.target;
    setColors((prev) => ({ ...prev, [name]: value }));
  };

  // Handler
  // const handleFinalSave = async () => {
  //   console.log(quotationFourData, "Final-Submit", dayWiseFormValue);
  //   try {
  //     setIsDataLoading(true);

  //     const {
  //       hotelPayload,
  //       monumentPayload,
  //       activityPayload,
  //       transportPayload,
  //       flightPayload,
  //       trainPayload,
  //       additionalPayload,
  //       guidePayload,
  //       restaurantPayload,
  //     } = await getServicePayload(
  //       queryFourDataRedux,
  //       queryQuotationData[0],
  //       dayWiseFormValue,
  //       selectedRestaurantIcons,
  //       selectedIcons
  //     );

  //     // Collect API calls only if payload has data
  //     const apiCalls = [];

  //     if (restaurantPayload?.length > 0) {
  //       apiCalls.push(
  //         axiosOther.post("update-quotation-restaurent", restaurantPayload)
  //       );
  //     }
  //     if (guidePayload?.length > 0) {
  //       apiCalls.push(axiosOther.post("updateguidequatation", guidePayload));
  //     }
  //     if (hotelPayload?.length > 0) {
  //       apiCalls.push(axiosOther.post("update-quotation-hotel", hotelPayload));
  //     }
  //     if (monumentPayload?.length > 0) {
  //       apiCalls.push(
  //         axiosOther.post("update-quotation-monument", monumentPayload)
  //       );
  //     }
  //     if (activityPayload?.length > 0) {
  //       apiCalls.push(
  //         axiosOther.post("update-quotation-activity", activityPayload)
  //       );
  //     }
  //     if (transportPayload?.length > 0) {
  //       apiCalls.push(
  //         axiosOther.post("updateTransportQuatation", transportPayload)
  //       );
  //     }
  //     if (flightPayload?.length > 0) {
  //       apiCalls.push(
  //         axiosOther.post("update-quotation-flight", flightPayload)
  //       );
  //     }
  //     if (trainPayload?.length > 0) {
  //       apiCalls.push(axiosOther.post("update-quotation-train", trainPayload));
  //     }
  //     if (additionalPayload?.length > 0) {
  //       apiCalls.push(
  //         axiosOther.post("update-quotation-additional", additionalPayload)
  //       );
  //     }

  //     // Run all required APIs
  //     const responses = await Promise.allSettled(apiCalls);

  //     console.log(responses, "responses7644");

  //     // Check if all succeeded
  //     const allSuccess = responses.every(
  //       (res) => res.status === "fulfilled" && res.value?.data?.status === 1
  //     );

  //     if (allSuccess && apiCalls.length > 0) {
  //       notifySuccess("All services updated successfully!");
  //     }

  //     setEditMode(false);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsDataLoading(false);
  //   }
  // };

  const handleFinalSave = async () => {
    try {
      // setIsDataLoading(true);
      setIsDataLoading(true);
      const {
        hotelPayload,
        monumentPayload,
        activityPayload,
        transportPayload,
        flightPayload,
        trainPayload,
        additionalPayload,
        guidePayload,
        restaurantPayload,
      } = await getServicePayload(
        queryFourDataRedux,
        queryQuotationData[0],
        dayWiseFormValue,
        selectedRestaurantIcons,
        selectedIcons
      );

      const apiCalls = [];

      // Restaurent
      try {
        const { data } = await axiosOther.post(
          "update-quotation-restaurent",
          restaurantPayload
        );
        if (data?.status === 1) {
          // notifySuccess(data.message);
        }
      } catch (error) {
        console.log(error);
      }

      // Guide
      try {
        const { data } = await axiosOther.post(
          "updateguidequatation",
          guidePayload
        );

        if (data?.status == 1) {
          // notifySuccess(data.message);
        }
      } catch (error) {
        console.log(error);
      }

      // Hotel
      try {
        const { data } = await axiosOther.post(
          "update-quotation-hotel",
          hotelPayload
        );

        if (data?.status == 1) {
          // notifySuccess(data.message);
        }
      } catch (error) {
        console.log(error);
      }

      // Monument
      try {
        const { data } = await axiosOther.post(
          "update-quotation-monument",
          monumentPayload
        );
        if (data?.status == 1) {
          // notifySuccess(data.message);
        }
      } catch (error) {
        console.log(error);
      }

      // Activity
      try {
        const { data } = await axiosOther.post(
          "update-quotation-activity",
          activityPayload
        );
        if (data?.status == 1) {
          // notifySuccess(data?.message);
        }
      } catch (error) {
        console.log(error);
      }

      // Transport
      try {
        const { data } = await axiosOther.post(
          "updateTransportQuatation",
          transportPayload
        );

        if (data?.status == 1) {
          // notifySuccess("Services Added !");
        }
      } catch (error) {
        console.log(error);
      }

      // Flight
      try {
        const { data } = await axiosOther.post(
          "update-quotation-flight",
          flightPayload
        );
        if (data?.status == 1) {
          // notifySuccess(data.message);
        }
      } catch (error) {
        console.log(error);
      }

      // Train
      try {
        const { data } = await axiosOther.post(
          "update-quotation-train",
          trainPayload
        );
        if (data?.status == 1) {
          // notifySuccess(data.message);
        }
      } catch (error) {
        console.log(error);
      }

      // Additional
      try {
        const { data } = await axiosOther.post(
          "update-quotation-additional",
          additionalPayload
        );

        if (data?.status == 1) {
          // notifySuccess(data?.message);
        }
      } catch (error) {
        console.log(error);
      }
      notifySuccess("All Service Added !!");
      setEditMode(false);
    } finally {
      setIsDataLoading(false);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <style>{localStyles}</style>
      <div>
        <div className={styles.navbar} onClick={() => setIsOpen(!isOpen)}>
          {window.innerWidth > 1024 ? (
            <div
              className="d-flex gap-3 pe-2"
              onClick={(e) => e.stopPropagation()}
            >
              {tabItems.map((item) => (
                <div
                  key={item.key}
                  className={`${styles.navItem} ${
                    activeTab === item.key ? styles.active : ""
                  }`}
                  onClick={() => {
                    setActiveTab(item.key);
                    setIsOpen(true);
                  }}
                >
                  <img
                    className={styles.icon}
                    src={item.icon}
                    alt={item.label}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <PerfectScrollbar
              className="d-flex gap-3 pe-2 overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {tabItems.map((item) => (
                <div
                  key={item.key}
                  className={`${styles.navItem} ${
                    activeTab === item.key ? styles.active : ""
                  }`}
                  onClick={() => {
                    setActiveTab(item.key);
                    setIsOpen(true);
                  }}
                >
                  <img
                    className={styles.icon}
                    src={item.icon}
                    alt={item.label}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </PerfectScrollbar>
          )}

          <div className={styles.rightSection}>
            <button
              className={styles.searchBtn}
              onClick={(e) => {
                e.stopPropagation();
                setShowSearchBar(!showSearchBar);
                if (!showSearchBar) {
                  setIsOpen(true);
                }
              }}
            >
              {showSearchBar ? (
                <i
                  className={`fa-regular fa-circle-xmark ${styles.circleXmark}`}
                ></i>
              ) : (
                <img
                  className={styles.icon}
                  src={SearchIcon}
                  alt="SearchIcon"
                />
              )}
            </button>
            <div
              className="d-flex align-items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setLgShow(true);
              }}
            >
              <span className={styles.preferenceText}>Set Preference</span>
              <img
                className={styles.filterIcon}
                src={SetPreferenceIcon}
                alt="SetPreferenceIcon"
              />
            </div>
            <span className="cursor-pointer fs-5">
              {isOpen ? (
                <FaChevronCircleUp
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                  }}
                />
              ) : (
                <FaChevronCircleDown
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                  }}
                />
              )}
            </span>
          </div>
        </div>
        {isOpen && (
          <div className="flex">
            {showSearchBar && (
              <div
                className={`d-flex align-items-center gap-2 p-2 ${styles.searchContainer}`}
              >
                <h6 className="mb-0">{`Search ${activeTab}`}</h6>
                <div className="position-relative w-25">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${styles.searchInput} form-control form-control-sm`}
                    placeholder={`Search ${activeTab} Name`}
                  />
                  <img
                    className={`position-absolute top-50 translate-middle-y ${styles.icon}`}
                    src={SearchIcon}
                    alt="SearchIcon"
                    style={{ left: "10px" }}
                  />
                </div>
                <div className="nav-item d-flex justify-content-start align-items-center">
                  <button
                    className="btn btn-primary btn-custom-size flex-shrink-0 flex-grow-0"
                    onClick={handleSearch}
                  >
                    <i className="fa-brands fa-searchengin me-2"></i>Search
                  </button>
                </div>
              </div>
            )}
            <div className="">
              {activeTab === "Hotel" && (
                <ItinerariesHotel
                  editMode={editMode}
                  searchQuery={searchQuery}
                  searchClicked={searchClicked}
                  setSearchClicked={setSearchClicked}
                  selectedDestinationId={selectedDestinationId}
                  hotelCategoryColors={hotelCategoryColors}
                />
              )}
              {activeTab === "Monument" && (
                <ItinerariesMonument
                  editMode={editMode}
                  searchQuery={searchQuery}
                  searchClicked={searchClicked}
                  setSearchClicked={setSearchClicked}
                  selectedDestinationId={selectedDestinationId}
                />
              )}
              {activeTab === "Guide" && (
                <ItinerariesGuide
                  editMode={editMode}
                  searchQuery={searchQuery}
                  searchClicked={searchClicked}
                  setSearchClicked={setSearchClicked}
                  selectedDestinationId={selectedDestinationId}
                  selectedCard={selectedCard}
                  dayWiseFormValue={dayWiseFormValue}
                  setGuideData={setGuideData}
                  guideData={guideData}
                  guideSelectedData={guideSelectedData}
                />
              )}
              {activeTab === "Activity" && (
                <ItinerariesActivity
                  editMode={editMode}
                  searchQuery={searchQuery}
                  searchClicked={searchClicked}
                  setSearchClicked={setSearchClicked}
                  selectedDestinationId={selectedDestinationId}
                />
              )}
              {activeTab === "Restaurant" && (
                <ItinerariesRestaurant
                  editMode={editMode}
                  searchQuery={searchQuery}
                  searchClicked={searchClicked}
                  setSearchClicked={setSearchClicked}
                  selectedDestinationId={selectedDestinationId}
                />
              )}
              {activeTab === "Transport" && (
                <ItinerariesTransport
                  editMode={editMode}
                  searchQuery={searchQuery}
                  searchClicked={searchClicked}
                  setSearchClicked={setSearchClicked}
                  selectedDestinationId={selectedDestinationId}
                />
              )}
              {activeTab === "Flight" && (
                <ItinerariesFlight
                  editMode={editMode}
                  searchQuery={searchQuery}
                  searchClicked={searchClicked}
                  setSearchClicked={setSearchClicked}
                  selectedDestinationId={selectedDestinationId}
                />
              )}
              {activeTab === "Train" && (
                <ItinerariesTrain
                  editMode={editMode}
                  searchQuery={searchQuery}
                  searchClicked={searchClicked}
                  setSearchClicked={setSearchClicked}
                  selectedDestinationId={selectedDestinationId}
                />
              )}
              {activeTab === "Additional" && (
                <ItinerariesAdditional
                  editMode={editMode}
                  searchQuery={searchQuery}
                  searchClicked={searchClicked}
                  setSearchClicked={setSearchClicked}
                  selectedDestinationId={selectedDestinationId}
                />
              )}
            </div>
          </div>
        )}

        <div style={{ paddingTop: "80px" }}>
          <div className="d-flex align-content-center justify-content-end me-2">
            {editMode ? (
              <button
                className="btn btn-primary btn-custom-size p-0"
                onClick={handleFinalSave}
              >
                <img src={SaveButton} alt="SaveButton" />
              </button>
            ) : (
              <button
                className="btn btn-primary btn-custom-size p-0"
                onClick={() => setEditMode(true)}
              >
                <img src={EditButton} alt="EditButton" />
              </button>
            )}
          </div>
          {isDataLoading ? <IsDataLoading /> : ""}
          <ItinerarySlider
            editMode={editMode}
            dayWiseFormValue={dayWiseFormValue}
            setDayWiseFormValue={setDayWiseFormValue}
            setSelectedCard={setSelectedCard}
            selectedCard={selectedCard}
            setSelectedDestinationId={setSelectedDestinationId}
            setSelectedRestaurantIcons={setSelectedRestaurantIcons}
            selectedRestaurantIcons={selectedRestaurantIcons}
            setSelectedIcons={setSelectedIcons}
            selectedIcons={selectedIcons}
            setEditMode={setEditMode}
            handleFinalSave={handleFinalSave}
          />
          <DragOverlay>
            {activeItem ? (
              <span
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                  borderRadius: "6px",
                  border: `1px solid ${activeItem.color || "#00ffff"}`,
                  color: activeItem.color || "#00ffff",
                  backgroundColor: "#fff",
                  zIndex: 9999,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                {activeItem.text}
              </span>
            ) : null}
          </DragOverlay>
        </div>

        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
          className="preferenceList"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Set Preferences
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "20px" }}>
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div
                  className="border rounded position-relative px-2 p-2 mt-2"
                  style={{ minHeight: "6rem" }}
                >
                  <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold">
                    Destination Selection
                  </label>
                  <div className="d-flex gap-3 mt-1 flex-wrap"></div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="border rounded position-relative px-2 p-2 mt-2"
                  style={{ minHeight: "6rem" }}
                >
                  <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold">
                    Hotel Category Color Selection
                  </label>
                  <div className="d-flex gap-3 mt-1 flex-wrap">
                    {Object.entries(hotelCategoryColors).map(
                      ([categoryName, color]) => {
                        // Find the corresponding HotelCategoryId
                        const categoryId = companySettingData?.Value?.find(
                          (item) => item.HotelCategoryName === categoryName
                        )?.HotelCategoryId;

                        return (
                          <div
                            key={categoryName}
                            className="d-flex align-items-center gap-3"
                          >
                            <div className="d-flex gap-2">
                              <label
                                className="form-check-label"
                                htmlFor={`colorPicker-${categoryName}`}
                              >
                                {categoryName} Star :
                              </label>
                              <div className="color-picker">
                                <input
                                  type="color"
                                  id={`colorPicker-${categoryName}`}
                                  name={`colorCategory${categoryName}`}
                                  value={color}
                                  onChange={(e) => {
                                    const newColor = e.target.value;
                                    setHotelCategoryColors((prev) => ({
                                      ...prev,
                                      [categoryName]: newColor,
                                    }));
                                    if (categoryId) {
                                      setHotelCategoryColorId((prev) => ({
                                        ...prev,
                                        [categoryId]: newColor,
                                      }));
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`colorPicker-${categoryName}`}
                                  style={{ margin: "0 10px", display: "block" }}
                                >
                                  {color}
                                </label>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div
                  className="border rounded position-relative px-2 p-2 mt-2"
                  style={{ minHeight: "6rem" }}
                >
                  <label className="mb-1 m-0 position-absolute form-label-position-1 bg-label-border px-1 font-weight-bold">
                    Tab Names
                  </label>
                  <div className="d-flex gap-3 mt-1 flex-wrap">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="HotelCategoryId"
                        id="businessType"
                        style={{ height: "1rem", width: "1rem" }}
                      />
                      <label className="form-check-label" htmlFor="daywise">
                        Hotel + Monument
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="HotelCategoryId"
                        id="businessType"
                        style={{ height: "1rem", width: "1rem" }}
                      />
                      <label className="form-check-label" htmlFor="daywise">
                        Activity
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="HotelCategoryId"
                        id="businessType"
                        style={{ height: "1rem", width: "1rem" }}
                      />
                      <label className="form-check-label" htmlFor="daywise">
                        Monument + Activity
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="HotelCategoryId"
                        id="businessType"
                        style={{ height: "1rem", width: "1rem" }}
                      />
                      <label className="form-check-label" htmlFor="daywise">
                        Monument + Guide
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="HotelCategoryId"
                        id="businessType"
                        style={{ height: "1rem", width: "1rem" }}
                      />
                      <label className="form-check-label" htmlFor="daywise">
                        Train
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="HotelCategoryId"
                        id="businessType"
                        style={{ height: "1rem", width: "1rem" }}
                      />
                      <label className="form-check-label" htmlFor="daywise">
                        Additional
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex mt-3 justify-content-end">
              <button
                className="btn btn-primary btn-custom-size"
                onClick={handleColorSubmit}
              >
                Submit
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </DndContext>
  );
};

export default Itineraries;
