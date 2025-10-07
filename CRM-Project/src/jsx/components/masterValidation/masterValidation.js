import * as yup from "yup";

export const countryInitialValue = {
  id: "",
  Name: "",
  ShortName: "",
  SetDefault: "1",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const stateInitialValue = {
  id: "",
  Name: "",
  CountryId: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const TourDetailsValidation = yup.object().shape({
  PaxSlab: yup.string().required("PaxSlab is required"),
  TourEndDate: yup
    .string()
    .required("Tour End Date is required")
    .test(
      "is-valid-end-date",
      "Tour End Date must be Tour Start Date plus No of Days",
      function (value, context) {
        const { TourStartDate, NoOfDays } = context.parent;

        // Skip validation if TourStartDate or NoOfDays is missing
        if (!TourStartDate || !NoOfDays || isNaN(Number(NoOfDays))) {
          return true; // Let required validation handle empty fields
        }

        try {
          // Parse TourStartDate (format: dd-MM-yyyy)
          const [startDay, startMonth, startYear] =
            TourStartDate.split("-").map(Number);
          const startDate = new Date(startYear, startMonth - 1, startDay);

          // Parse TourEndDate (format: dd-MM-yyyy)
          const [endDay, endMonth, endYear] = value.split("-").map(Number);
          const endDate = new Date(endYear, endMonth - 1, endDay);

          // Validate dates
          if (isNaN(startDate) || isNaN(endDate)) {
            return false; // Invalid date format
          }

          // Calculate expected end date
          const expectedEndDate = new Date(startDate);
          expectedEndDate.setDate(startDate.getDate() + Number(NoOfDays));

          // Compare dates (ignoring time)
          return (
            endDate.getFullYear() === expectedEndDate.getFullYear() &&
            endDate.getMonth() === expectedEndDate.getMonth() &&
            endDate.getDate() === expectedEndDate.getDate()
          );
        } catch (error) {
          console.error("Error validating TourEndDate:", error);
          return false;
        }
      }
    ),
});

export const cityInitialValue = {
  id: "",
  CountryId: 1,
  StateId: 1,
  Name: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const leadSourceInitialValue = {
  id: "",
  Name: "",
  SetDefault: 0,
  Status: 1,
  AddedBy: 2,
  UpdatedBy: 0,
};

export const businessTypeInitialValue = {
  id: "",
  Name: "",
  SetDefault: 0,
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const divisionInitialValue = {
  id: "",
  Name: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const marketTypeInitialValue = {
  id: "",
  Name: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const languageInitialValue = {
  id: "",
  Name: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const destinationInitialValue = {
  id: "",
  Name: "",
  CountryId: "",
  StateId: "",
  Description: "",
  SetDefault: 0,
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};
export const transferMasterInitialValue = {
  TransferName: "",
  Destinations: [1, 2, 3],
  TransferType: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const tourtypeInitialValue = {
  id: "",
  Name: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};

export const seasonTypeInitialValue = {
  id: "",
  SeasonName: "1",
  FromDate: "",
  ToDate: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const hotelMasterCreateInitialValue = {
  HotelChain: "",
  HotelName: "",
  HotelCode: "",
  HotelCategory: "",
  HotelType: "",
  HotelDestination: "",
  HotelCountry: "",
  HotelState: "",
  HotelCity: "",
  HotelPinCode: "",
  HotelAddress: "",
  HotelLocality: "",
  HotelGSTN: "",
  HotelWeekend: "",
  CheckIn: "",
  CheckOut: "",
  HotelLink: "",
  HotelInfo: "",
  HotelPolicy: "",
  HotelTC: "",
  HotelAmenties: "",
  HotelRoomType: "",
  HotelStatus: 1,
  SelfSupplier: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const hotelMasterInitialValue = {
  HotelExcelFile: undefined,
};

export const hotelCategoryInitialValue = {
  id: "",
  Name: "",
  UploadKeyword: "",
  Status: "Active",
  AddedBy: "1",
  UpdatedBy: "0",
};

export const hotelAdditonalInitialValue = {
  id: "",
  Name: "",
  Details: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};

export const roomMasterInitialValue = {
  id: "",
  Name: "",
  Status: 1,
  AddedBy: 0,
  UpdatedBy: 0,
};

export const hotelChainInitialValue = {
  id: "",
  Name: "",
  Destination: "",
  HotelWebsite: "",
  ContactType: "",
  ContactName: "",
  ContactDesignation: "",
  ContactCountryCode: "",
  ContactMobile: "",
  ContactEmail: "",
  Status: "Active",
  AddedBy: "1",
  UpdatedBy: "0",
};

export const resturantInitialValue = {
  id: "",
  Name: "",
  Destination: "",
  Address: "",
  Country: "",
  State: "",
  City: "",
  SelfSupplier: "No",
  PinCode: "",
  GSTN: "",
  ContactType: "",
  ContactName: "",
  ContactDesignation: "",
  CountryCode: "+91",
  Phone1: "",
  Phone2: "",
  Phone3: "",
  ContactEmail: "",
  Status: "Active",
  AddedBy: 1,
  UpdatedBy: 0,
};

export const restaurantMealInitialValue = {
  id: "",
  Name: "",
  Status: "Active",
  AddedBy: 1,
  UpdatedBy: 0,
};

export const amentiesInitialValue = {
  id: "",
  Name: "",
  SetDefault: 0,
  Status: "Active",
  AddedBy: 1,
  UpdatedBy: 0,
};

export const hotelTypeInitialValue = {
  id: "",
  Name: "",
  UploadKeyword: "",
  IsHouseBoat: "Yes",
  Status: "Active",
  AddedBy: 1,
  UpdatedBy: 0,
};

export const weekendInitialValue = {
  id: "",
  Name: "",
  WeekendDays: [],
  Status: "Active",
  AddedBy: 1,
  UpdatedBy: 0,
};

export const hotelMealInitialValue = {
  id: "",
  Name: "",
  ShortName: "",
  SetDefault: "Yes",
  Status: "Active",
  AddedBy: 1,
  UpdatedBy: 0,
};

export const monumentInitialValue = {
  id: "",
  MonumentName: "",
  Destination: "",
  TransferType: "",
  ClosedOnDays: "",
  DefaultQuotation: "1",
  DefaultProposal: "0",
  WeekendDays: "",
  Description: "",
  Status: "1",
  AddedBy: 1,
  UpdatedBy: "0",
};

export const sightseeingInitialValue = {
  id: "",
  SightseeingName: "",
  Destination: "",
  Description: "AHJADKH",
  TransferType: "",
  DefaultQuotation: 0,
  DefaultProposal: 0,
  InclusionsExclusionsTiming: "JKDHAKDH",
  ImportantNote: "JKDAKDA",
  Status: "1",
  AddedBy: 1,
  UpdatedBy: 0,
};

export const visaCostInitialValue = {
  id: "",
  Country: "",
  VisaType: "",
  Status: "1",
  AddedBy: 1,
  UpdatedBy: 0,
};

export const visaTypeInitialValue = {
  id: "",
  Name: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};

export const insuranceTypeInitialValue = {
  id: "",
  InsuranceType: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const insuranceCostInitialValue = {
  id: "",
  InsuranceName: "",
  InsuranceType: 1,
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};

export const tourEscortPriceInitialValue = {
  id: "",
  ServiceType: "",
  Destination: "",
  TourEscortService: "",
  Status: 1,
  Default: "0",
  AddedBy: 1,
  UpdatedBy: 0,
};

export const tourEscortInitialValue = {
  id: "",
  ServiceType: 1,
  Name: "",
  MobileNumber: "",
  WhatsAppNumber: "",
  AlternateNumber: "",
  Email: "",
  TourEscortLicenseOne: "",
  LicenseExpiry: "",
  Destination: "",
  Language: "",
  Supplier: 1,
  TourEscortLicenseTwo: "",
  ContactPerson: "",
  Designation: "",
  Country: 1,
  State: 1,
  City: 1,
  PinCode: "",
  Detail: "",
  Address: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};

export const vehicleTypeInitialValue = {
  id: "",
  Name: "",
  PaxCapacity: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};
export const vehicleBrandInitialValue = {
  id: "",
  VehicleType: "",
  Name: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};
export const vehicleMasterInitialValue = {
  id: "",
  Name: "",
  VehicleType: "",
  Capacity: "",
  VehicleBrand: "",
  ImageName: "",
  ImageData: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};

export const additionalRequiremntInitialValue = {
  id: "",
  Name: "",
  DestinationId: [1, 2, 3],
  TaxSlab: "",
  MarkupApply: 1,
  CurrencyId: "",
  CostType: 1,
  AdultCost: "",
  ChildCost: "",
  InfantCost: "",
  ShowInProposal: 1,
  Details: "",
  Status: 1,
  AddedBy: 1,
};

export const driverMasterInitialValue = {
  id: "",
  Country: "",
  DriverName: "",
  MobileNumber: "",
  AlternateMobileNo: "",
  WhatsappNumber: "",
  LicenseNumber: "",
  BirthDate: "",
  ValidUpto: "",
  PassportNumber: "",
  LicenseName: "",
  LicenseData: "",
  Address: "",
  Status: 1,
  UpdatedBy: 1,
  AddedBy: 1,
};

export const trainMasterInitialValue = {
  id: "",
  Name: "",
  ImageName: "",
  ImageData: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};

export const airlineMasterInitialValue = {
  id: "",
  Name: "",
  ImageName: "",
  ImageData: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};

export const ferryMasterInitialValue = {
  id: "",
  FerryCompany: 1,
  FerryName: "",
  Capacity: "",
  Status: 1,
  ImageName: "hhhh.png",
  ImageData: "",
  AddedBy: 1,
  UpdatedBy: 1,
};

export const ferrySeatMasterInitialValue = {
  id: "",
  FerrySeat: "",
  Status: 0,
  UpdatedBy: 1,
  AddedBy: 1,
};

export const currencyMasterInitialValue = {
  id: "",
  CountryId: "",
  CountryCode: "",
  Name: "",
  Status: "1",
  SetDefault: "1",
  AddedBy: 1,
  UpdatedBy: "0",
  ConversionRate: "",
};

export const roomTypeInitialValue = {
  id: "",
  Name: "",
  MaximumOccupancy: "",
  Bedding: "",
  Size: "",
  Status: "Active",
  AddedBy: "1",
  UpdatedBy: "0",
};

export const cruiseCompanyInitialValue = {
  id: "",
  CruiseCompanyName: "",
  Destination: "",
  Country: "",
  State: "",
  City: "",
  PinCode: "",
  Address: "",
  Website: "",
  GST: "",
  SelfSupplier: "Yes",
  Type: "afdafd",
  Phone: "",
  Email: "",
  Status: 1,
  UpdatedBy: 0,
  AddedBy: 1,
};
export const cruiseNameCompanyInitialValue = {
  id: "",
  CruiseCompany: "",
  CruiseName: "",
  Status: "1",
  ImageName: "",
  ImageData: "",
  AddedBy: "1",
  UpdatedBy: "1",
};
export const cruiseMasterInitialValue = {
  id: "",
  CruisePackageName: "",
  Destination: "",
  RunningDays: "",
  ArrivalTime: "",
  DepartureTime: "",
  Details: "",
  Status: "1",
  AddedBy: 1,
  UpdatedBy: 1,
};

export const ferryCompanyInitialValue = {
  id: "",
  FerryCompanyName: "",
  Destination: "",
  Website: "",
  SelfSupplier: "1",
  Type: "0",
  ContactPers: "",
  Designation: "",
  Phone: "",
  Email: "",
  Status: "0",
  UpdatedBy: "1",
  AddedBy: "1",
};

export const letterMasterInitialValue = {
  id: "",
  Name: "",
  GreetingNote: "",
  WelcomeNote: "",
  Status: "1",
  AddedBy: "1",
};

export const taxMasterInitialValue = {
  id: "",
  ServiceType: "",
  TaxSlabName: "",
  TaxValue: "",
  Status: "0",
  SetDefault: "1",
  AddedBy: "1",
  UpdatedBy: "0",
};

export const expenseTypeInitialValue = {
  id: "",
  ExpenseHead: "",
  ExpenseType: "",
  Status: "0",
  AddedBy: "1",
  UpdatedBy: "0",
};

export const expenseHeadInitialValue = {
  id: "",
  ExpenseHead: "",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "0",
};

export const sacCodeInitialValue = {
  id: "",
  ServiceType: "",
  SacCode: "",
  Status: "1",
  SetDefault: "0",
  AddedBy: "1",
  UpdatedBy: "0",
};

export const paymentTypeInitialValue = {
  id: "",
  PaymentTypeName: "",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "0",
};

export const fitInitialValue = {
  id: "",
  Name: "",
  Destination: [1, 2, 3],
  Inclusion: "",
  Exclusion: "",
  TermsCondition: "",
  Cancelation: "",
  ServiceUpgradation: "",
  OptionalTour: "",
  PaymentPolicy: "",
  Remarks: "",
  SetDefault: "1",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "0",
};

export const gitInitialValue = {
  id: "",
  Name: "",
  Destination: [1, 2, 3],
  Inclusion: "",
  Exclusion: "",
  TermsCondition: "",
  Cancelation: "",
  ServiceUpgradation: "",
  OptionalTour: "",
  PaymentPolicy: "",
  Remarks: "",
  SetDefault: "1",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "0",
};

export const bankInitialValue = {
  id: "",
  BankName: "",
  AccountNumber: "",
  BranchAddress: "",
  UpiId: "",
  AccountType: "1",
  BeneficiaryName: "",
  BranchIfsc: "",
  BranchSwiftCode: "",
  ImageName: "",
  ImageData: "",
  ShowHide: "1",
  SetDefault: "1",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "1",
};
export const cabinTypeInitialValue = {
  id: "",
  CruiseName: "",
  CabinType: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};
export const cabinCategoryInitialValue = {
  id: "",
  Name: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};
export const itenararyOverviewInitialValue = {
  id: "",
  OverviewName: "",
  OverviewInformation: "",
  HighlightInformation: "",
  ItineraryIntroduction: "",
  ItinerarySummary: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 1,
};
export const transferTypeInitialValue = {
  id: "",
  Name: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};
export const transportMasterInitialValue = {
  id: "",
  Name: "",
  Destinations: "",
  TransferType: "",
  Detail: "",
  Default: 0,
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};
export const itineraryRequirementInitialValue = {
  id: "",
  FromDestination: "",
  ToDestination: "",
  TransferMode: "",
  Title: "",
  Description: "",
  DrivingDistance: "",
  Status: 1,
  AddedBy: 1,
  UpdatedBy: 0,
};

export const guideMasterInitialValue = {
  Name: "",
  ServiceType: "Guide",
  Rating: "",
  Email: "",
  Address: "",
  Languages: [],
  Destination: [],
  Phone: "",
  MobileNumber: "",
  WhatsappNumber: "",
  AlternateNumber: "",
  GuideLicense: "",
  LicenseExpiry: "",
  PAN: "",
  GST: "",
  guide_image: "",
  ImageData: "",
  Supplier: "1",
  ContactPerson: "",
  Designation: "",
  Country: "",
  State: "",
  City: "",
  Pincode: "",
  Remark: "",
  Feedback: "",
  Default: "0",
  VaccinationStatus: "1",
  Details: "",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "",
};
export const guidePriceMasterInititalValue = {
  ServiceType: "",
  Destination: "",
  Guide_Porter_Service: "",
  Default: "No",
  Status: "1",
  AddedBy: "1",
  CompanyId: "Debox-01",
};

export const hotelAddInitialValue = {
  id: "",
  HotelName: "",
  SelfSupplier: "0",
  HotelCountry: "",
  HotelCity: "",
  Destination: "",
  AddedBy: "1",
  UpdatedBy: "0",
  HotelPinCode: "",
  HotelAddress: "",
  HotelGSTN: "",
  HotelType: "",
  HotelCategory: "",
  HotelLink: "",
  HotelInfo: "",
  HotelPolicy: "",
  HotelTC: "",
  HotelRoomType: [],
  HotelState: "",
  HotelWeekend: "",
  HotelChain: "",
  HotelAmenities: [],
  Days: "",
  CheckInTime: "11:00",
  CheckOutTime: "12:00",
  PaymentType: " ",
  Status: "1",
  Verified: "",
  InternalNote: "",
  contacts: [],
  ImageName: "",
  ImageData: "",
};

export const hotelAddContactInitialValue = {
  Division: "11",
  Title: "Mr",
  FirstName: "",
  LastName: "",
  Designation: "",
  CountryCode: "",
  Phone1: "",
  Phone2: "",
  Phone3: "",
  Email: "",
  SecondaryEmail: "",
};

export const monumentRateInitialValue = {
  MonumentId: "",
  DestinationID: "",
  CompanyId: "De-b000000002",
  SupplierId: "",
  NationalityId: "",
  ValidFrom: "",
  ValidTo: "",
  CurrencyId: "",
  AdultEntFee: "",
  ChildEntFee: "",
  TaxSlabId: "",
  Policy: "",
  TAC: "",
  Remarks: "",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "0",
  AddedDate: "2024-09-11",
  UpdatedDate: "2024-09-11",
};
export const guideRateInitialValue = {
  id: "",
  DestinationID: "33",
  CompanyId: "De-b000000002",
  SupplierId: "",
  ValidFrom: "",
  ValidTo: "",
  PaxRange: "",
  DayType: "Half Day",
  UniversalCost: "Yes",
  GuideId: "",
  Currency: "",
  ServiceCost: "",
  LangAllowance: "",
  OtherCost: "",
  GstSlabid: "",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "0",
  AddedDate: "2024-09-23",
  UpdatedDate: "2024-09-23",
};
export const hotelRateAddInitialValue = {
  CompanyId: "1",
  HotelId: "",
  HotelUUID: "HL00001",
  HotelTypeId: "",
  HotelCategoryId: "",
  DestinationID: "33",
  SupplierId: "",
  ValidFrom: "",
  ValidTo: "",
  MarketTypeId: "",
  PaxTypeId: "",
  TarrifeTypeId: "",
  SeasonTypeID: "",
  SeasonYear: "",
  RoomCost: "",
  MealCost: "",
  CurrencyId: "",
  RoomTypeID: "",
  MealPlanId: "",
  RoomBedType: "",
  MealType: "",
  RoomTaxSlabId: "",
  MealSlabId: "",
  MarkupType: "percentage",
  MarkupCost: "",
  Remarks: "",
  Status: "Active",
  AddedBy: 1,
  UpdatedBy: 1,
  AddedDate: "2024-08-30",
  UpdatedDate: "2024-08-30",
};
export const transportRateAddInitialValue = {
  TransportId: "",
  DestinationID: "",
  SupplierId: "",
  ValidFrom: "",
  ValidTo: "",
  Type: "Package Cost",
  VehicleTypeId: "",
  CompanyId: "COMP0001",
  TaxSlabId: "",
  CurrencyId: "",
  VehicleCost: "",
  ParkingFee: "",
  RapEntryFee: "",
  Assistance: "",
  AdtnlAllowance: "",
  InterStateToll: "",
  MiscCost: "",
  Remarks: "",
  Status: "1",
  AddedBy: 1,
  UpdatedBy: 1,
};
export const transferRateAddInitialValue = {
  TransferId: "",
  CompanyId: "COMP0001",
  DestinationID: "",
  SupplierId: "",
  ValidFrom: "",
  ValidTo: "",
  CurrencyId: "",
  VehicleTypeId: "",
  VehicleCost: "",
  ParkingFee: "",
  RapEntryFee: "",
  Assistance: "",
  AdtnlAllowance: "",
  InterStateToll: "",
  MiscCost: "",
  TaxSlabId: "",
  Remarks: "",
  Status: "1",
  AddedBy: 1,
  UpdatedBy: 1,
  AddedDate: "2024-09-11",
  UpdatedDate: "2024-09-11",
};
export const trainRateAddInitialValue = {
  TrainId: "",
  CompanyId: "COMP0001",
  SupplierId: 34,
  TrainNumber: "",
  JourneyType: "day_journey",
  TrainClassId: "",
  Currency: "",
  AdultCost: "",
  ChildCost: "",
  InfantCost: "",
  Remarks: "",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "0",
};
export const restaurantRateAddInitialValue = {
  RestaurantId: "",
  DestinationID: "33",
  SupplierId: "",
  MealTypeId: "",
  Currency: "",
  AdultCost: "",
  ChildCost: "",
  GstSlabId: "",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "1",
  AddedDate: "2024-09-12",
  UpdatedDate: "2024-09-12",
};
export const airlineRateAddInitialValue = {
  id: "",
  FlightNumber: "",
  FlightClass: "",
  Currency: "",
  AdultCost: { base_fare: "", airline_tax: "" },
  ChildCost: { base_fare: "", airline_tax: "" },
  InfantCost: { base_fare: "", airline_tax: "" },
  BaggageAllowance: "",
  CancallationPolicy: "",
  Remarks: "",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "0",
  AddedDate: "2024-10-11",
  UpdatedDate: "2024-10-12",
};
export const activityMasterInitialValue = {
  Type: "",
  ServiceName: "",
  UniqueID: "",
  Destination: "",
  Default: "1",
  Supplier: "",
  Description: "",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "0",
};
export const activityRateAddInitialValue = {
  ActivityId: "",
  DestinationID: "33",
  SupplierId: "",
  Service: "",
  ValidFrom: "",
  ValidTo: "",
  CurrencyId: "",
  PaxRange: "",
  PaxCost: "",
  TotalCost: "",
  TaxSlabId: "",
  Remarks: "",
  CompanyId: "COMP0001",
  Status: "1",
  AddedBy: "1",
  UpdatedBy: "1",
  AddedDate: "2024-10-15",
  UpdatedDate: "2024-08-16",
};

// ------------------------VALIDATION SCHEMAS-------------------------- //

export const transferMasterValidationSchema = yup.object().shape({
  TransferName: yup.string().required("Required"),
});

export const activityRateValidationSchema = yup.object().shape({
  SupplierId: yup.string().required("Required"),
  ValidFrom: yup.string().required("Required"),
  ValidTo: yup.string().required("Required"),
  CurrencyId: yup.string().required("Required"),
  Service: yup.string().required("Required"),
  TaxSlabId: yup.string().required("Required"),
});

export const activityMasterValidationSchema = yup.object().shape({
  ServiceName: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
});

export const airlineRateValidationSchema = yup.object().shape({
  FlightNumber: yup.string().required("Required"),
  FlightClass: yup.string().required("Required"),
  Currency: yup.string().required("Required"),
  AdultCost: yup.object().shape({
    base_fare: yup.string().required("Base Fare Required"),
  }),
});

export const restaurantRateValidationSchema = yup.object().shape({
  SupplierId: yup.string().required("Required"),
  MealTypeId: yup.string().required("Required"),
  Currency: yup.string().required("Required"),
  AdultCost: yup.string().required("Required"),
  GstSlabId: yup.string().required("Required"),
});

export const trainRateValidationShema = yup.object().shape({
  TrainNumber: yup.string().required("Required"),
  JourneyType: yup.string().required("Required"),
  Currency: yup.string().required("Required"),
  SupplierId: yup.string().required("Required"),
  AdultCost: yup.string().required("Required"),
});

export const transferRateValidationSchema = yup.object().shape({
  SupplierId: yup.string().required("Required"),
  DestinationID: yup.string().required("Required"),
  ValidFrom: yup.string().required("Required"),
  ValidTo: yup.string().required("Required"),
  CurrencyId: yup.string().required("Required"),
  TaxSlabId: yup.string().required("Required"),
});
export const transportRateValidationSchema = yup.object().shape({
  SupplierId: yup.string().required("Required"),
  DestinationID: yup.string().required("Required"),
  ValidFrom: yup.string().required("Required"),
  ValidTo: yup.string().required("Required"),
  Type: yup.string().required("Required"),
  TaxSlabId: yup.string().required("Required"),
  CurrencyId: yup.string().required("Required"),
});

export const hotelRateAddValidationSchema = yup.object().shape({
  MarketTypeId: yup.string().required("Required"),
  SupplierId: yup.string().required("Required"),
  TarrifeTypeId: yup.string().required("Required"),
  SeasonTypeID: yup.string().required("Required"),
  SeasonYear: yup.string().required("Required"),
  ValidFrom: yup.string().required("Required"),
  ValidTo: yup.string().required("Required"),
  RoomTypeID: yup.string().required("Required"),
  MealPlanId: yup.string().required("Required"),
  CurrencyId: yup.string().required("Required"),
  RoomTaxSlabId: yup.string().required("Required"),
  MealSlabId: yup.string().required("Required"),
});

export const guideRateValidationSchema = yup.object().shape({
  SupplierId: yup.string().required("Required"),
  ValidFrom: yup.string().required("Required"),
  ValidTo: yup.string().required("Required"),
  PaxRange: yup.string().required("Required"),
  DayType: yup.string().required("Required"),
  UniversalCost: yup.string().required("Required"),
  Currency: yup.string().required("Required"),
});
export const monumnetRateValidationSchema = yup.object().shape({
  SupplierId: yup.string().required("Required"),
  NationalityId: yup.string().required("Required"),
  ValidFrom: yup.string().required("Required"),
  ValidTo: yup.string().required("Required"),
  CurrencyId: yup.string().required("Required"),
  TaxSlabId: yup.string().required("Required"),
});

export const guideMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  MobileNumber: yup.string().required("Required"),
  Country: yup.string().required("Required"),
  Status: yup.string().required("Required"),
  Default: yup.string().required("Required"),
  // Destination: yup.array().min(1).required("Required")
});

export const guidePriceValidationSchema = yup.object().shape({
  ServiceType: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
  Guide_Porter_Service: yup.string().required("Required"),
});

export const countryValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  ShortName: yup.string().required("Required"),
});
export const stateValidationSchema = yup.object().shape({
  Name: yup.string().min(3).max(20).required("Required"),
});
export const cityValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const leadSourceValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const businessTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const divisionValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const marketTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const languageValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const destinationValidationSchema = yup.object().shape({
  CountryId: yup.string().required("Required"),
  Name: yup.string().required("Required"),
});
export const tourtypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const seasonTypeValidationSchema = yup.object().shape({
  FromDate: yup.string().required("Required"),
  ToDate: yup.string().required("Required"),
});
export const hotelMasterCreateValidationSchema = yup.object().shape({
  HotelName: yup.string().required("Required"),
  HotelDestination: yup.string().required("Required"),
  HotelRoomType: yup.string().required("Required"),
});
export const hotelMasterValidationSchema = yup.object().shape({
  HotelExcelFile: yup.mixed().required("Required"),
});
export const hotelCategoryValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  UploadKeyword: yup.string().required("Required"),
});
export const hotelAdditionalValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  Details: yup.string().required("Required"),
});
export const roomMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const roomTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  MaximumOccupancy: yup.string().required("Required"),
  Bedding: yup.number("Numeric Value").required("Required"),
  Size: yup.string().required("Required"),
});
export const hotelChainValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  ContactEmail: yup.string().required("Required"),
});
export const resturantValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  Country: yup.string().required("Required"),
  ContactEmail: yup.string().required("Required"),
  Address: yup.string().required("Required"),
  PinCode: yup.string().required("Required"),
  GSTN: yup.string().required("Required"),
  ContactName: yup.string().required("Required"),
  ContactDesignation: yup.string().required("Required"),
});
export const restaurantMealValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const amentiesValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const hotelTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  UploadKeyword: yup.string().required("Required"),
});
export const weekendValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const hotelMealValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  ShortName: yup.string().required("Required"),
});
export const monumentValidatinSchema = yup.object().shape({
  MonumentName: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
});
export const sightseeingValidationSchema = yup.object().shape({
  SightseeingName: yup.string().required("Required"),
});
export const visaTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const insuranceTypeValidationSchema = yup.object().shape({
  InsuranceType: yup.string().required("Required"),
});
export const insuranceCostValidationSchema = yup.object().shape({
  InsuranceName: yup.string().required("Required"),
});
export const tourEscortPriceValidationSchema = yup.object().shape({
  TourEscortService: yup.string().required("Required"),
});
export const tourEscortValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  MobileNumber: yup.number().required("Required"),
  Email: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
  Address: yup.string().required("Required"),
});
export const vehicleTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const vehicleBrandValidationSchema = yup.object().shape({
  VehicleType: yup.string().required("Required"),
  Name: yup.string().required("Required"),
});
export const additionaRequirementValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const driverMasterValidationSchema = yup.object().shape({
  Country: yup.string().required("Required"),
  DriverName: yup.string().required("Required"),
  MobileNumber: yup.number().required("Required"),
  WhatsappNumber: yup.number().required("Required"),
  Address: yup.string().required("Address"),
});
export const trainMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const airlineMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const ferryMasterValidationSchema = yup.object().shape({
  FerryName: yup.string().required("Required"),
});
export const currencyMasterValidationSchema = yup.object().shape({
  CountryCode: yup.string().required("Required"),
  Name: yup.string().required("Required"),
});
export const ferryCompanyValidationSchema = yup.object().shape({
  FerryCompanyName: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
});
export const ferrySeatValidationSchema = yup.object().shape({
  FerrySeat: yup.string().required("Required"),
});
export const taxMasterValidationSchema = yup.object().shape({
  ServiceType: yup.string().required("Required"),
  TaxSlabName: yup.string().required("Required"),
  TaxValue: yup.string().required("Required"),
});
export const expenseTypeValidationSchema = yup.object().shape({
  ExpenseType: yup.string().required("Required"),
  ExpenseHead: yup.string().required("Required"),
});
export const expenseHeadValidationSchema = yup.object().shape({
  ExpenseHead: yup.string().required("Required"),
});
export const sacCodeValidationSchema = yup.object().shape({
  ServiceType: yup.string().required("Required"),
  SacCode: yup.string().required("Required"),
});
export const paymentTypeValidationSchema = yup.object().shape({
  PaymentTypeName: yup.string().required("Required"),
});
export const fitValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  // Destination: yup.array().required("Required"),
});
export const gitValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  // Destination: yup.string().required("Required"),
  // Inclusion: yup.string().required("Required"),
});
export const letterMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  // WelcomeNote: yup.string().required("Required"),
  GreetingNote: yup.string().required("Required"),
});
export const bankMasterValidationSchema = yup.object().shape({
  BankName: yup.string().required("Required"),
  AccountNumber: yup.string().required("Required"),
});
export const cruiseNameCompanyValidationSchema = yup.object().shape({
  CruiseCompany: yup.string().required("Required"),
  CruiseName: yup.string().required("Required"),
});
export const cruiseCompanyValidationSchema = yup.object().shape({
  CruiseCompanyName: yup.string().required("Required"),
});
export const cabinTypeValidationSchema = yup.object().shape({
  CruiseName: yup.string().required("Required"),
  CabinType: yup.string().required("Required"),
});
export const cabinCategoryValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const itenararyOverviewValidationSchema = yup.object().shape({
  OverviewName: yup.string().required("Required"),
});
export const transferTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const transportMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const vehicleMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const cruiseMasterValidationSchema = yup.object().shape({
  CruisePackageName: yup.string().required("Required"),
});
export const itineraryRequirementValidationSchema = yup.object().shape({
  FromDestination: yup.string().required("Required"),
  ToDestination: yup.string().required("Required"),
});

export const direcetClientValidationSchema = yup.object().shape({
  Status: yup.string().required("Required"),
  DOB: yup.string().required("Required"),
  Gender: yup.string().required("Required"),
  LastName: yup.string().required("Required"),
  FirstName: yup.string().required("Required"),
  Title: yup.string().required("Required"),
  Nationality: yup.string().required("Required"),
});

export const agentMasterValidationSchema = yup.object().shape({
  BussinessType: yup.string().required("Required"),
  SalesPerson: yup.string().required("Required"),
  CompanyName: yup.string().required("Required"),
  CompanyEmailAddress: yup.string().required("Required"),
  CompanyPhoneNumber: yup.string().required("Required"),
  AgentHeaderImageData: yup.object().required("Required"),
  AgentFooterImageData: yup.object().required("Required"),
  MarketType: yup.string().required("Required"),
  Nationality: yup.string().required("Required"),
  Status: yup.string().required("Requried"),
});

export const supplierValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  Status: yup.string().required("Required"),
  SupplierService: yup.array().min(1, "Required").required("Required"),
  Destination: yup.array().min(1, "Required").required("Required"),
  DefaultDestination: yup.array().min(1, "Required").required("Required"),
});

export const addAddressValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
  Country: yup.string().required("Required"),
});

export const addContactPersonValidationSchema = yup.object().shape({
  OfficeName: yup.string().required("Required"),
  Title: yup.string().required("Required"),
  FirstName: yup.string().required("Required"),
  Division: yup.string().required("Required"),
  Designation: yup.string().required("Required"),
  CountryCode: yup.string().required("Required"),
  Phone: yup.string().required("Required"),
  Email: yup.string().email().required("Required"),
});

export const companyDocumentValidationSchema = yup.object().shape({
  DocumentName: yup.string().required("Required"),
  DocumentImageData: yup.string().required("Required"),
  DocumentImageName: yup.string().required("Required"),
});

export const bankDetailsValidationSchema = yup.object().shape({
  BankName: yup.string().required("Required"),
  BankBranch: yup.string().required("Required"),
  BenificiryName: yup.string().required("Required"),
  AccountNumber: yup.string().required("Required"),
  IfscCode: yup.string().required("Required"),
});

export const callsValidationSchema = yup.object().shape({
  Fk_Leadsource: yup.string().required("Required"),
  BusinessType: yup.string().required("Required"),
  AgentName: yup.string().required("Required"),
  AgentContactPerson: yup.string().required("Required"),
  EmailId: yup.string().required("Required"),
  CountryId: yup.string().required("Required"),
  Destination: yup.array().min(1, "Required").required("Required"),
  SalesPerson: yup.string().required("Required"),
  MobileNumber: yup.string().required("Required"),
  Startdate: yup.string().required("Required"),
  NextFollowUpdate: yup.string().required("Required"),
  CallAgenda: yup.string().required("Required"),
});
export const meetingsValidationSchema = yup.object().shape({
  Fk_Leadsource: yup.string().required("Required"),
  BusinessType: yup.string().required("Required"),
  AgentName: yup.string().required("Required"),
  AgentContactPerson: yup.string().required("Required"),
  EmailId: yup.string().required("Required"),
  CountryId: yup.string().required("Required"),
  Destination: yup.array().min(1, "Required").required("Required"),
  SalesPerson: yup.string().required("Required"),
  MobileNumber: yup.string().required("Required"),
  Startdate: yup.string().required("Required"),
  NextFollowUpdate: yup.string().required("Required"),
  MeetingAgenda: yup.string().required("Required"),
});
export const taskValidationSchema = yup.object().shape({
  Fk_Leadsource: yup.string().required("Required"),
  BusinessType: yup.string().required("Required"),
  AgentName: yup.string().required("Required"),
  AgentContactPerson: yup.string().required("Required"),
  EmailId: yup.string().required("Required"),
  CountryId: yup.string().required("Required"),
  Destination: yup.array().min(1, "Required").required("Required"),
  SalesPerson: yup.string().required("Required"),
  MobileNumber: yup.string().required("Required"),
  Startdate: yup.string().required("Required"),
  NextFollowUpdate: yup.string().required("Required"),
  TaskSubject: yup.string().required("Required"),
});
const hotelContact = yup.object().shape({
  Email: yup.string().required("Required"),
});
export const hotelAddContactArraySchema = yup.array().of(hotelContact);
export const hotelAddValidationSchema = yup.object().shape({
  HotelName: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
  HotelCountry: yup.string().required("Required"),
  Status: yup.string().required("Required"),
  Days: yup.string().required("Required"),
  PaymentType: yup.string().required("Required"),
});

// Hotel Master Table Value in JSON-----------------------------------

export const hotelMasterValue = [
  {
    HotelChain: "None",
    HotelName: "Blue Lotus Hotel",
    Destination: "Delhi",
    ContactPerson: "Ansar",
    Category: "5Star",
    Status: "Active",
    RoomType: "Classic",
    Gallery: "Gallery",
    RateSheet: "RateSheet",
  },
  {
    HotelChain: "None",
    HotelName: "Hotel Nikko",
    Destination: "Mumbai",
    ContactPerson: "Ansar",
    Category: "2Star",
    Status: "Active",
    RoomType: "Classic",
    Gallery: "Gallery",
    RateSheet: "RateSheet",
  },
  {
    HotelChain: "None",
    HotelName: "Hotel Nikko",
    Destination: "Mumbai",
    ContactPerson: "Ansar",
    Category: "2Star",
    Status: "Active",
    RoomType: "Classic",
    Gallery: "Gallery",
    RateSheet: "RateSheet",
  },
  {
    HotelChain: "None",
    HotelName: "Hotel Nikko",
    Destination: "Mumbai",
    ContactPerson: "Ansar",
    Category: "2Star",
    Status: "Active",
    RoomType: "Classic",
    Gallery: "Gallery",
    RateSheet: "RateSheet",
  },
  {
    HotelChain: "None",
    HotelName: "Hotel Nikko",
    Destination: "Mumbai",
    ContactPerson: "Ansar",
    Category: "2Star",
    Status: "Active",
    RoomType: "Classic",
    Gallery: "Gallery",
    RateSheet: "RateSheet",
  },
];
