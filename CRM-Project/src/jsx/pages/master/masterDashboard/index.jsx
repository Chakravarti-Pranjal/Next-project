// @ts-nocheck
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Row, Card, Col, Container } from "react-bootstrap";
import General from "../../../../../public/assets/icons/main-menu.png";
import Hotel from "../../../../../public/assets/icons/hotel.png";
import Country from "../../../../../public/assets/icons/countries.png";
import State from "../../../../../public/assets/icons/united-states.png";
import Business from "../../../../../public/assets/icons/process.png";
import Language from "../../../../../public/assets/icons/languages.png";
import City from "../../../../../public/assets/icons/city.png";
import Division from "../../../../../public/assets/icons/split.png";
import Lead from "../../../../../public/assets/icons/conversion-rate.png";
import Destination from "../../../../../public/assets/icons/destination.png";
import Tour from "../../../../../public/assets/icons/tourtype.png";
import Season from "../../../../../public/assets/icons/season.png";
import Sight from "../../../../../public/assets/icons/sightseeing.png";
import Passport from "../../../../../public/assets/icons/passport8.png";
import TourGuide from "../../../../../public/assets/icons/tour-guide.png";
import Visa from "../../../../../public/assets/icons/passport9.png";
import Insurance from "../../../../../public/assets/icons/health-ins.png";
import Others from "../../../../../public/assets/icons/other.png";
import Transport from "../../../../../public/assets/icons/sep.png";
import Cruise from "../../../../../public/assets/icons/ship1.png";
import Ferry from "../../../../../public/assets/icons/cruise4.png";
import ITINERARY from "../../../../../public/assets/icons/itinerary3.png";
import FINANCE from "../../../../../public/assets/icons/budget1.png";
import Guide from "../../../../../public/assets/icons/budget1.png";
import Template from "../../../../../public/assets/icons/budget1.png";

import HotelMaster from "../../../../../public/assets/icons/document.png";
import RoomTypeMaster from "../../../../../public/assets/icons/living-room.png";
import HotelCategoryMaster from "../../../../../public/assets/icons/hotel1.png";
import HotelAdditionalMaster from "../../../../../public/assets/icons/hotel3.png";
import AmenitiesMaster from "../../../../../public/assets/icons/amenities.png";
import HotelTypeMaster from "../../../../../public/assets/icons/hotel2.png";
import RoomMaster from "../../../../../public/assets/icons/room.png";
import HotelChainMaster from "../../../../../public/assets/icons/building.png";
import HotelMealMaster from "../../../../../public/assets/icons/restaurant.png";
import RestaurantMaster from "../../../../../public/assets/icons/process.png";
import MonumentMaster from "../../../../../public/assets/icons/monument.png";
import SightseeingMaster from "../../../../../public/assets/icons/binocular.png";
import TourEscortMaster from "../../../../../public/assets/icons/customer.png";
import TourEscortPriceMaster from "../../../../../public/assets/icons/technical-support.png";
import VisaType from "../../../../../public/assets/icons/boarding-pass.png";
import VisaCost from "../../../../../public/assets/icons/visa.png";
import InsuranceType from "../../../../../public/assets/icons/family.png";
import InsuranceCost from "../../../../../public/assets/icons/insur.png";
import PassportType from "../../../../../public/assets/icons/passport5.png";
import PassportCost from "../../../../../public/assets/icons/passport7.png";
import TrainMaster from "../../../../../public/assets/icons/rail.png";
import AirlineMaster from "../../../../../public/assets/icons/travelling.png";
import AdditionalRequirement from "../../../../../public/assets/icons/gear.png";
import OperationRestriction from "../../../../../public/assets/icons/hotel1.png";
import TransferMaster from "../../../../../public/assets/icons/document.png";
import TransferType from "../../../../../public/assets/icons/living-room.png";
import VehicleTypeMaster from "../../../../../public/assets/icons/hotel1.png";
import VehicleBrandMaster from "../../../../../public/assets/icons/hotel3.png";
import CruiseCompany from "../../../../../public/assets/icons/enterprise.png";
import CruiseNameCompany from "../../../../../public/assets/icons/cruise1.png";
import CabinType from "../../../../../public/assets/icons/cabin.png";
import CabinCategory from "../../../../../public/assets/icons/cabin1.png";
import CruiseMaster from "../../../../../public/assets/icons/ship.png";
import FerryCompany from "../../../../../public/assets/icons/ferry.png";
import FerryMaster from "../../../../../public/assets/icons/ferry2.png";
import FerrySeatMaster from "../../../../../public/assets/icons/cruise2.png";
import FerryPriceMaster from "../../../../../public/assets/icons/cruise3.png";
import { useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { ThemeContext } from "../../../../context/ThemeContext";

const MasterDashboard = () => {
  const { changeBackground } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState("");
  // useEffect(() => {
  //   changeBackground({ value: "dark", label: "Dark" });
  // }, []);

  const [finalMasterList, setFinalMasterList] = useState([]);
  const [filterMasterList, setFilterMasterList] = useState([]);
  const masterList = [
    {
      category: "GENERAL MASTER",
      icon: General,
      subCategory: [
        {
          name: "Countries",
          link: "/countries",
          icon: Country,
          countName: "COUNTRY_MASTER",
        },
        {
          name: "States",
          link: "/states",
          icon: State,
          countName: "STATE_MASTER",
        },
        { name: "Cities", link: "/cities", icon: City, countName: "CITY_MASTER" },
        {
          name: "Business Type",
          link: "/businesstype",
          icon: Business,
          countName: "BUSINESS_TYPE_MASTER",
        },
        {
          name: "Languages",
          link: "/languages",
          icon: Language,
          countName: "LANGUAGE_MASTER",
        },
        {
          name: "Division",
          link: "/division",
          icon: Division,
          countName: "DIVISION_MASTER",
        },
        {
          name: "Lead Source",
          link: "/leadSource",
          icon: Lead,
          countName: "LEAD_SOURCE_MASTER",
        },
        {
          name: "Destinations",
          link: "/destinations",
          icon: Destination,
          countName: "DESTINATION_MASTER",
        },
        {
          name: "Tour Type",
          link: "/tourType",
          icon: Tour,
          countName: "TOUR_TYPE_MASTER",
        },
        {
          name: "Season",
          link: "/season",
          icon: Season,
          countName: "SEASON_MASTER",
        },
        {
          name: "Market Type",
          link: "/market-type",
          icon: Season,
          countName: "MARKET_TYPE_MASTER",
        },
      ],
    },
    {
      category: "HOTEL MASTER",
      icon: Hotel,
      subCategory: [
        {
          name: "Hotel",
          link: "/hotel",
          icon: HotelMaster,
          countName: "HOTEL_MASTER",
        },
        {
          name: "Room Type",
          link: "/roomtype",
          icon: RoomTypeMaster,
          countName: "ROOM_TYPE",
        },
        {
          name: "Hotel Category",
          link: "/hotelcategory",
          icon: HotelCategoryMaster,
          countName: "HOTEL_CATEGORY_MASTER",
        },
        {
          name: "Hotel Additional",
          link: "/hotel-additional",
          icon: HotelAdditionalMaster,
          countName: "HOTEL_ADDITIONAL_MASTER",
        },
        {
          name: "Amenities",
          link: "/amenities",
          icon: AmenitiesMaster,
          countName: "AMENITIES_MASTER",
        },
        {
          name: "Hotel Type",
          link: "/hotel-type",
          icon: HotelTypeMaster,
          countName: "HOTEL_TYPE_MASTER",
        },
        // { name: "Room", link: "/room-type", icon: RoomMaster },
        {
          name: "Hotel Chain",
          link: "/hotelchain",
          icon: HotelChainMaster,
          countName: "HOTEL_CHAIN_MASTER",
        },
        {
          name: "Hotel Meal",
          link: "/hotelmeal",
          icon: HotelMealMaster,
          countName: "HOTEL_MEAL_PLAN",
        },
        {
          name: "Weekend",
          link: "/weekend",
          icon: Country,
          countName: "WEEKEND_MASTER",
        },
        {
          name: "Restaurant",
          link: "/restaurant",
          icon: HotelMealMaster,
          countName: "RESTURENT_MASTER",
        },
        {
          name: "Restaurant Meal Plan",
          link: "/restaurantmeal",
          icon: RestaurantMaster,
          countName: "RESTURENT_MEALPLAN",
        },
        {
          name: "Operation Restriction",
          link: "/operation-restricted",
          icon: OperationRestriction,
          countName: "OPERATION_RESTRICTION",
        },
      ],
    },
    {
      category: "SIGHTSEEING/ACTIVITY MASTER",
      icon: Sight,
      subCategory: [
        {
          name: "Monument",
          link: "/monument",
          icon: MonumentMaster,
          countName: "MONUMENT_MASTER",
        },
        {
          name: "Sightseeing",
          link: "/sightseeingMaster",
          icon: SightseeingMaster,
          countName: "SIGHTSEEING_MASTER",
        },
        {
          name: "Monument Package",
          link: "/monument-package",
          icon: SightseeingMaster,
          countName: "MONUMENT_PACKAGE",
        },

        {
          name: "Guide",
          link: "/guide",
          icon: City,
          countName: "GUIDE_MASTERS",
        },
        {
          name: "Guide Service",
          link: "/guide-service",
          icon: HotelCategoryMaster,
          countName: "GUIDE_SERVICE_MASTER",
        },
        {
          name: "Activity",
          link: "/activity",
          icon: CabinCategory,
          countName: "ACTIVITY_MASTER",
        },
      ],
    },
    {
      category: "AGENT SUPPLIER CLIENT",
      icon: Guide,
      subCategory: [
        {
          name: "Agent",
          link: "/agent",
          icon: RoomMaster,
          countName: "AGENT_MASTER",
        },
        {
          name: "Supplier",
          link: "/supplier",
          icon: HotelTypeMaster,
          countName: "SUPPLIER",
        },
        {
          name: "Client",
          link: "/direct-client",
          icon: RestaurantMaster,
          countName: "DIRECT_CLIENT",
        },
        {
          name: "Pax Slab",
          link: "/pax-slab",
          icon: RestaurantMaster,
          countName: "Pax_Slab",
        },
        {
          name: "Local Escort Slab",
          link: "/local-Slab-Escort-Cost",
          icon: RestaurantMaster,
          countName: "Pax_Slab",
        },
      ],
    },
    {
      category: "TRANSPORT MASTERS",
      icon: Transport,
      subCategory: [
        {
          name: "Transfer",
          link: "/transfer",
          icon: TransferMaster,
          countName: "TRANSFER_MASTER",
        },
        {
          name: "Transfer Type",
          link: "/transfertype",
          icon: TransferType,
          countName: "TRANSFER_TYPE_MASTER",
        },
        {
          name: "Vehicle Type",
          link: "/vehicletype",
          icon: VehicleTypeMaster,
          countName: "VEHICLE_TYPE_MASTER",
        },
        {
          name: "Vehicle Brand",
          link: "/vehiclebrand",
          icon: VehicleBrandMaster,
          countName: "VEHICLE_BRAND_MASTER",
        },
        {
          name: "Transport",
          link: "/transport",
          icon: AmenitiesMaster,
          countName: "TRANSPORT_MASTER",
        },
        {
          name: "Vehicle",
          link: "/vehicle",
          icon: HotelTypeMaster,
          countName: "VEHICLE_MASTER",
        },
        {
          name: "Driver",
          link: "/driver-master",
          icon: RoomMaster,
          countName: "DRIVER_MASTER",
        },
        {
          name: "Fleet",
          link: "/fleet-master",
          icon: HotelChainMaster,
          countName: "FLEET_MASTER",
        },
        {
          name: "Distance",
          link: "/distance-master",
          icon: HotelChainMaster,
          countName: "DISTANCE_MASTER",
        },
      ],
    },
    {
      category: "AIRLINE/TRAIN MASTER",
      icon: TourGuide,
      subCategory: [
        {
          name: "Train",
          link: "/train",
          icon: TrainMaster,
          countName: "TRAIN_MASTER",
        },
        {
          name: "Air Meal Choice",
          link: "/airmeal-list",
          icon: TrainMaster,
          countName: "TRAIN_MASTER",
        },
        {
          name: "Seat Preference",
          link: "/seat-preferences",
          icon: TrainMaster,
          countName: "SEAT_PREFERENCE",
        },
        {
          name: "Airline",
          link: "/airline",
          icon: AirlineMaster,
          countName: "AIRLINE_MASTER",
        },
        {
          name: "Class Preference",
          link: "/class-preferences",
          icon: AirlineMaster,
          countName: "CLASS_PREFERENCE",
        },
      ],
    },
    {
      category: "PASSPORT MASTER",
      icon: Passport,
      subCategory: [
        {
          name: "Passport Type",
          link: "/passport-type",
          icon: PassportType,
          countName: "PASSPORT_TYPE_MASTER",
        },
        {
          name: "Passport Cost",
          link: "/passport-cost",
          icon: PassportCost,
          countName: "PASSPORT_COST_MASTER",
        },
      ],
    },
    {
      category: "INSURANCE MASTER",
      icon: Insurance,
      subCategory: [
        {
          name: "Insurance Type",
          link: "/insurance-type",
          icon: InsuranceType,
          countName: "INSURANCE_TYPE_MASTER",
        },
        {
          name: "Insurance Cost",
          link: "/insurance-cost",
          icon: InsuranceCost,
          countName: "INSURANCE_COST_MASTER",
        },
      ],
    },
    {
      category: "OTHERS MASTERS",
      icon: Others,
      subCategory: [
        {
          name: "Additional Requirement",
          link: "/additional-requirement",
          icon: AdditionalRequirement,
          countName: "ADDITIONAL_REQUIREMENT_MASTER",
        },
        {
          name: "Preference",
          link: "/update-preference",
          icon: AdditionalRequirement,
          countName: "PREFERENCE",
        },
      ],
    },
    {
      category: "VISA MASTER",
      icon: Visa,
      subCategory: [
        {
          name: "Visa Cost",
          link: "/visaCost",
          icon: VisaCost,
          countName: "VISA_COST_MASTER",
        },
        {
          name: "Visa Type",
          link: "/visaType",
          icon: VisaType,
          countName: "VISA_TYPE_MASTER",
        },
        {
          name: "Visa Summary",
          link: "/visa-summary",
          icon: VisaType,
          countName: "VISA_SUMMARY_MASTER",
        },
      ],
    },
    {
      category: "CRUISE MASTER",
      icon: Cruise,
      subCategory: [
        {
          name: "Cruise Company",
          link: "/cruise-company",
          icon: CruiseCompany,
          countName: "CRUISE_COMPANY_MASTER",
        },
        {
          name: "Cruise Name Company",
          link: "/cruise-name-company",
          icon: CruiseNameCompany,
          countName: "CRUISE_NAME_MASTER",
        },
        {
          name: "Cabin Type",
          link: "/cabin-type",
          icon: CabinType,
          countName: "CABIN_TYPE_MASTER",
        },
        {
          name: "Cabin Category",
          link: "/cabin-category",
          icon: CabinCategory,
          countName: "CABIN_CATEGORY_MASTER",
        },
        {
          name: "Cruise Master",
          link: "/cruise-master",
          icon: CruiseMaster,
          countName: "CRUISE_MASTER",
        },
      ],
    },
    {
      category: "FERRY MASTER",
      icon: Ferry,
      subCategory: [
        {
          name: "Ferry Company",
          link: "/ferry-company",
          icon: FerryCompany,
          countName: "FERRY_COMPANY_MASTER",
        },
        {
          name: "Ferry",
          link: "/ferry",
          icon: FerryMaster,
          countName: "FERRY_NAME_MASTER",
        },
        {
          name: "Ferry Seat",
          link: "/ferry-seat",
          icon: FerrySeatMaster,
          countName: "FERRY_SEAR_MASTER",
        },
        {
          name: "Ferry Price",
          link: "/ferry-price",
          icon: Country,
          countName: "FERRY_PRICE_MASTER",
        },
      ],
    },
    {
      category: "ITINERARY PROPOSAL SETTING MASTER",
      icon: ITINERARY,
      subCategory: [
        {
          name: "Itinerary Requirement",
          link: "/itinerary-requirement",
          icon: CabinCategory,
          countName: "ITINERARY_REQUIREMENT_MASTER",
        },
        {
          name: "Itinerary Overview",
          link: "/itinerary-overview",
          icon: CabinType,
          countName: "ITINERARY_OVERVIEW",
        },
        {
          name: "Emergency Details",
          link: "",
          icon: Cruise,
          countName: "EMERGENCY_CONTACT_DETAILS",
        },
        // { name: "Fit", link: "/fit-master", icon: CruiseCompany, countName: "FIT_MASTER" },
        { name: "FIT & GIT Policies", link: "/git-master", icon: CruiseMaster, countName: "GIT_MASTER" },
        { name: "Letter", link: "/letter-master", icon: Country, countName: "LETTER_MASTER" },
        {
          name: "Proposal Setting",
          link: "",
          icon: Destination,
          countName: "PROPOSAL_TEMPLATE",
        },
      ],
    },
    {
      category: "FINANCE MASTER",
      icon: FINANCE,
      subCategory: [
        {
          name: "Currency",
          link: "/currency-list",
          icon: State,
          countName: "CURRENCY_MASTER",
        },
        {
          name: "Commission",
          link: "/commision-list",
          icon: City,
          countName: "COMMISSION_MASTER",
        },
        {
          name: "Tax",
          link: "/tax-master-list",
          icon: Hotel,
          countName: "TAX_MASTER",
        },
        {
          name: "Expense Head",
          link: "/expence-head-list",
          icon: Country,
          countName: "EXPENSE_HEAD_MASTER",
        },
        {
          name: "Expense Type",
          link: "/expence-type-list",
          icon: CabinCategory,
          countName: "EXPENSE_TYPE_MASTER",
        },
        {
          name: "Bank",
          link: "/bank-list",
          icon: AmenitiesMaster,
          countName: "BANK_MASTER",
        },
        {
          name: "Sac Code",
          link: "/SAC-Code-List",
          icon: RoomMaster,
          countName: "SAC_CODE_MASTER",
        },
        {
          name: "Payment Type",
          link: "/payment-type",
          icon: Country,
          countName: "PAYMENT_TYPE_MASTER",
        },
      ],
    },
    {
      category: "TEMPLATE MASTER",
      icon: Template,
      subCategory: [
        {
          name: "Email Template",
          link: "",
          icon: PassportCost,
          countName: "EMAIL_MASTER",
        },
        {
          name: "Rate Upload template",
          link: "/rate-template",
          icon: PassportType,
          countName: "TEMP_UPLOAD_DATA",
        },
        {
          name: "Task Scheduling Template",
          link: "/task-scheduling-template",
          icon: CabinCategory,
          countName: "TASK_SCHEDULING_TEMPLATE",
        },
      ],
    },
    {
      category: "User Management",
      icon: TourGuide,
      subCategory: [
        {
          name: "Companies",
          link: "/company",
          icon: CabinType,
          // countName: "EMAIL_MASTER",
        },
        {
          name: "Roles",
          link: "/roles",
          icon: RoomMaster,
          // countName: "TEMP_UPLOAD_DATA",
        },
        {
          name: "Users",
          link: "/user",
          icon: InsuranceType,
          // countName: "TEMP_UPLOAD_DATA",
        },
        {
          name: "Create Department",
          link: "/department",
          icon: InsuranceType,
        },
        {
          name: "Modules",
          link: "/module",
          icon: Business,
          // countName: "TEMP_UPLOAD_DATA",
        },
        {
          name: "Report Chat",
          link: "/report-chart",
          icon: PassportType,
          // countName: "TEMP_UPLOAD_DATA",
        },
      ],
    },
  ];

  const navigate = useNavigate();

  const handleNavigate = (link) => {
    navigate(link);
  };

  const getDataToServer = async () => {
    try {
      const response = await axiosOther.post("master-table-counts");

      const mergedArray = masterList.map((item1) => {
        const updatedSubCategory = item1.subCategory.map((data) => {
          const match = response?.data?.Data.find(
            (item2) => item2.TableName === data.countName
          );
          return match ? { ...data, ...match } : data;
        });
        return { ...item1, subCategory: updatedSubCategory };
      });
      setFinalMasterList(mergedArray);
    } catch (error) {
      console.log("count-error");
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  // const filteredList = finalMasterList?.map((data) => {
  //   const filteredSubCategories = data.subCategory?.filter((item) =>
  //     item.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   if (filteredSubCategories.length > 0) {
  //     return { ...data,subCategory: filteredSubCategories };
  //   }
  //   return null; // return null if no subcategories match
  // }).filter(item => item !== null);

  const filteringMaster = useCallback(() => {
    if (!searchTerm) {
      setFilterMasterList(finalMasterList); // Show full list when search is empty
      return;
    }

    const filtering = finalMasterList.map((list) => ({
      ...list,
      subCategory: list.subCategory.filter((category) =>
        category.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      ),
    }));

    setFilterMasterList(filtering);
  }, [searchTerm, finalMasterList]);

  useEffect(() => {
    filteringMaster();
  }, [filteringMaster]);





  return (
    <>  <div className="row my-3">
      <div className="col-md-6 col-lg-3">
        <input
          type="text"
          className="form-control form-control-sm"
          name="search"
          placeholder="Enter search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>
    </div>
      <Row>
        {filterMasterList &&
          filterMasterList?.length > 0 &&
          filterMasterList?.map((data, index) => {
            return (
              <Col lg="2">
                <div className="card">
                  <Card.Header className=" border-1 pb-0  p-1 masterdashoboardheading" >
                    <Card.Title>{data?.category}</Card.Title>
                    <Card.Img
                      variant="right"
                      src={data?.icon}
                      style={{ width: "2rem" }}
                    />
                  </Card.Header>
                  <Card.Body>
                    <Row>

                      {
                        data?.subCategory?.map((item, i) => {


                          return (
                            <Col
                              sm={12}
                              key={i}
                              className="d-flex align-items-center gap-2 justify-content-xs-center justify-content-start my-2 cursor-pointer" //bell bell-link i-false
                              onClick={() => handleNavigate(item?.link)}

                            >
                              <img
                                src={item.icon}
                                alt={item.name}
                                style={{ width: "1rem" }}
                              />
                              <p className="m-0 notification_dropdown position-relative">
                                {item?.name}


                                <span
                                  className=" ms-1"
                                  style={{ width: item?.Count > 100 && "20px" }}
                                >
                                  ({item?.Count ? item?.Count : "0"})

                                </span>
                              </p>
                            </Col>
                          );
                        })}
                    </Row>
                  </Card.Body>
                  {/* <Card.Footer className=" border-0 pt-0">
                      <Card.Text className=" d-inline">Card footer</Card.Text>
                      <Card.Link href="#" className="float-end">
                        Card link
                      </Card.Link>
                    </Card.Footer> */}
                </div>
              </Col>
            );
          })}
      </Row>
      {/* <Container>
      </Container> */}
    </>
  );
};
export default MasterDashboard;
