import * as yup from "yup";
import Destination from "./destination";

// guide validation
export const guideMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter name"),
  MobileNumber: yup.string().required("Please enter mobile"),
  Country: yup.string().required("Please select country"),
  Status: yup.string().required("Please select state"),
  Default: yup.string().required("Please check default"),
  Destination: yup
    .array()
    .min(1, "Please select destination")
    .required("Please select destination"),
});

// guide service validatino
export const guideServiceValidationSchema = yup.object().shape({
  ServiceType: yup.string().required("Please select service type"),
  Destination: yup.string().required("Please select destination"),
  Guide_Porter_Service: yup.string().required("Please enter guide service"),
});
// hotel validation
const hotelContact = yup.object().shape({
  Email: yup.string().required("Required"),
});
export const hotelAddContactArraySchema = yup.array().of(hotelContact);
export const hotelAddValidationSchema = yup.object().shape({
  HotelName: yup.string().required("Please enter hotel name"),
  Destination: yup.string().required("Please select destination"),
  HotelCountry: yup.string().required("Plaese select country"),
  // HotelRoomType: yup
  //   .array()
  //   .min(1, "Please select room type")
  //   .required("Please select room type"),
});

// room type validation
export const roomTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter room name"),
  // MaximumOccupancy: yup.string().required("Please enter maximum occupancy "),
  // Bedding: yup.string().required("Please enter bedding"),
  // Size: yup.string().required("Please enter size"),
});

// amenities validation
export const amentiesValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter name"),
  ImageData: yup.string().when("$isEditMode", {
    is: false, // When isEditMode is false (add mode)
    then: yup.string().required("Please choose image"),
    otherwise: yup.string().notRequired(), // ImageData is optional in edit mode
  }),
});
export const hotelAditionalListValidaitionSchema = yup.object().shape({
  Name: yup.string().required("Please enter name"),
  Details: yup.string().required("Please enter Details"),
  ImageName: yup.string().when("$isEditMode", {
    is: false, // When isEditMode is false (add mode)
    then: yup.string().required("Please choose image"),
    otherwise: yup.string().notRequired(), // ImageData is optional in edit mode
  }),
});

// hotel type validation
export const hotelTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter name"),
  UploadKeyword: yup.string().required("Please enter keyword"),
});

// hotel meal validation
export const hotelMealValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter meal name"),
  ShortName: yup.string().required("Please enter voucher"),
});

// wekeend validation
export const weekendValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter weekend"),
});

// hotel category validation
export const hotelCategoryValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter category name"),
  UploadKeyword: yup.string().required("Please enter keyword"),
});
// hotel room validation
export const roomMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
// hotel chain validation
export const hotelChainValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter name"),
  ContactEmail: yup
    .string()
    .email("Please enter valid email")
    .required("Please enter email"),
});
// restaurant validation
export const resturantValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter name"),
  Country: yup.string().required("Please select country"),
  ContactEmail: yup.string().required("Please enter email"),
  Address: yup.string().required("Please enter address"),
  PinCode: yup.string().required("Please  enter pincode"),
  GSTN: yup.string().required("Please enter GST"),
});

// restaurant meal validation
export const restaurantMealPlanValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter meal name"),
});
// transfer type validation
export const transferTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter transfer type"),
});
// vehicle type validation
export const vehicleTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter vehicle type"),
});
// vehicle validation
export const vehicleMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter vehicle name"),
});
// vehicle brand validation
export const vehicleBrandValidationSchema = yup.object().shape({
  VehicleType: yup.string().required("Please select vehicle type"),
  Name: yup.string().required("Please enter brand"),
});
// transfer validation
export const transferMasterValidationSchema = yup.object().shape({
  TransferName: yup.string().required("Please enter transfer name"),
});
// transport validation
export const transportMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter transport name"),
  DestinationId: yup
    .array()
    .min(1, "Please select destination")
    .required("Please select destination"),
});
// activity validation
export const activityMasterValidationSchema = yup.object().shape({
  ServiceName: yup.string().required("Please enter service"),
  Destination: yup.string().required("Please select destinaion"),
});

export const countryValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter name"),
  ShortName: yup.string().required("Please enter country code"),
});
export const stateValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter state name"),
  CountryId: yup.string().required("Please select country "),
});
export const cityValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter name"),
  CountryId: yup.string().required("Please select country "),
  StateId: yup.string().required("Please select state "),
});
export const businessTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter business type"),
});
export const languageValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter language name"),
});
export const divisionValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter division"),
});
export const tourtypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter tour type"),
});
export const leadSourceValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter lead source"),
});
export const destinationValidationSchema = yup.object().shape({
  CountryId: yup.string().required("Please select country"),
  StateId: yup.string().required("Please select state"),
  Name: yup.string().required("Please enter destination name"),
});
export const seasonTypeValidationSchema = yup.object().shape({
  SeasonName: yup.string().required("Please select Season Type"),
  FromDate: yup.string().required("Please select from date"),
  ToDate: yup.string().required("Please select to date"),
});
export const visaTypeValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const visaCostValidationSchema = yup.object().shape({
  VisaType: yup.string().required("Required"),
});
export const VisasummaryeValidationSchema = yup.object().shape({
  Description: yup.string().required("Required"),
});
export const monumentValidatinSchema = yup.object().shape({
  MonumentName: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
  // falseUnder: yup.string().required("Required"),
});
export const trainMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter train name"),
});
export const airlineMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});

// agent master
export const agentMasterValidationSchema = yup.object().shape({
  BussinessType: yup.string().required("Please enter Bussiness type"),
  SalesPerson: yup.string().required("Please enter Sales Person"),
  CompanyName: yup.string().required("Please Enter Company Name"),
  CompanyEmailAddress: yup.string().required("Please Enter Company Email Address"),
  CompanyPhoneNumber: yup
    .string()
    .required("Please Enter Company Phone Number"),
  // AgentHeaderImageData: yup
  //   .string()
  //   .required("Please enter Agent Header Image"),
  // AgentFooterImageName: yup
  // .string()
  // .required("Please enter Agent Footer Image"),
  MarketType: yup.string().required("Please enter MarketType"),
  Nationality: yup.string().required("Please enter Nationality"),
  Status: yup.string().required("Please enter Status"),
  Country: yup.string().required("Please select country "),
});
//supplier master
export const supplierValidationSchema = yup.object().shape({
  Name: yup
    .string()
    .min(1, "Please Select Name")
    .required("Please Select Name"),
  AliasName: yup
    .string()
    .min(1, "Please Select Alias Name")
    .required("Please Select Alias Name"),
  Status: yup.string().required("Required"),
  Destination: yup
    .array()
    .min(1, "Please Select Destination")
    .required("Please Select Destination"),
  SupplierService: yup
    .array()
    .min(1, "Please select at least one service") // 👈 Validation here
    .required("Please select at least one service"),
});

// Insurance type validation
export const insuranceTypeValidationSchema = yup.object().shape({
  InsuranceType: yup.string().required("Please enter name"),
});

// Insurance Cost validation
export const insuranceCostValidationSchema = yup.object().shape({
  InsuranceName: yup.string().required("Please enter name"),
});
// address validation
export const addAddressValidationSchema = yup.object().shape({
  // Name: yup.string().required("Required"),
  Country: yup.string().required("Please select country "),
  City: yup.string().required("Please select City "),
  PinCode: yup.string().required("Please Enter ZIP Code "),
});
// document validation
export const companyDocumentValidationSchema = yup.object().shape({
  DocumentName: yup.string().required("Required"),
  // DocumentImageData: yup.string().required("Required"),
  // DocumentImageName: yup.string().required("Required"),
});
// bank '
export const bankDetailsValidationSchema = yup.object().shape({
  BankName: yup.string().required("Required"),
  BankBranch: yup.string().required("Required"),
  BenificiryName: yup.string().required("Required"),
  AccountNumber: yup.string().required("Required"),
  IfscCode: yup.string().required("Required"),
});
// contact
export const addContactPersonValidationSchema = yup.object().shape({
  //OfficeName: yup.string().required("Required"),
  // Title: yup.string().required("Required"),
  FirstName: yup.string().required("Please enter first name"),
  // Division: yup.string().required("Required"),
  //Designation: yup.string().required("Required"),
  // CountryCode: yup.string().required("Required"),
  // Phone: yup.string().required("Required"),
  Email: yup.string().email("Invalid Email Required"),
});

// Passport Type validation
export const passportTypeValidationSchema = yup.object().shape({
  PassportType: yup.string().required("Please enter name"),
});

// Currency validation
export const currencyValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter Currnecy name"),
  CountryCode: yup.string().required("Please enter Currnecy Code"),
  ConversionRate: yup.string().required("Please enter conversion rate"),
});
// meeting
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
// task
export const taskValidationSchema = yup.object().shape({
  Fk_Leadsource: yup.string().required("Lead Source Required"),
  BusinessType: yup.string().required(" BusinessType Required"),
  AgentName: yup.string().required("AgentName Required"),
  AgentContactPerson: yup.string().required("AgentContactPerson Required"),
  EmailId: yup.string().required("EmailId Required"),
  CountryId: yup.string().required("CountryId Required"),
  Destination: yup.array().min(1, "Required").required("Destination Required"),
  SalesPerson: yup.string().required("SalesPerson Required"),
  // MobileNumber: yup.string().required("Required"),
  // Startdate: yup.string().required("Required"),
  // NextFollowUpdate: yup.string().required("Required"),
  TaskSubject: yup.string().required("Required"),
});
// call
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

// Tax Master validation
export const taxValidationSchema = yup.object().shape({
  ServiceType: yup.string().required("Please select service type"),
  TaxValue: yup.string().required("Please enter Tax Value in %"),
  Currency: yup.string().required("Please enter currency"),
});
// Expence Head validation
export const expenceHeadValidationSchema = yup.object().shape({
  ExpenseHead: yup.string().required("Please enter name"),
});
// rate monument
export const monumnetRateValidationSchema = yup.object().shape({
  SupplierId: yup.string().required("Required"),
  ValidFrom: yup.string().required("Required"),
  ValidTo: yup.string().required("Required"),
  CurrencyId: yup.string().required("Required"),
  TaxSlabId: yup.string().required("Required"),
});
// rate hotel
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

export const expenceTypeValidationSchema = yup.object().shape({
  ExpenseHead: yup.string().required("Please Select Expense Head"),
  ExpenseType: yup.string().required("Please enter Expense Type"),
});
// monument package validation

export const monumentPackageValidationSchema = yup.object().shape({
  package_name: yup.string().required("Please enter package name"),
  day_type: yup.string().required("Please select day type"),
});

// guide service rate validation
export const gudieServiceRateValidationSchema = yup.object().shape({
  // SupplierId: yup.string().required("Please select supplier"),
  // ValidFrom: yup.string().required("Please select from date"),
  // ValidTo: yup.string().required("Please select to date"),
  // // PaxRange: yup.string().required("Please select Pax Range"),
  // DayType: yup.string().required("Please select day type"),
  // UniversalCost: yup.string().required("Please enter universal cost"),
  // Currency: yup.string().required("Please select currency"),
});

// Market Type
export const marketValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter name"),
});

// Passport Cost validation
export const passportCostValidationSchema = yup.object().shape({
  PassportName: yup.string().required("Please enter name"),
  PassportType: yup.string().required("Please select passport type"),
});

// Commision validation
export const commisionValidationSchema = yup.object().shape({
  CommissionName: yup.string().required("Please enter commission name"),
  CommissionPercentage: yup
    .string()
    .required("Please enter commision percentage"),
});
// activity rate validation
export const activityRateValidationSchema = yup.object().shape({
  // SupplierId: yup.string().required("Please select supplier"),
  ValidFrom: yup.string().required("Please select from date"),
  ValidTo: yup.string().required("Please select to date"),
  // CurrencyId: yup.string().required("Please select currency"),
  // Service: yup.string().required("Required"),
  // TaxSlabId: yup.string().required("Please select tax"),
});

// transport rate validation
export const transportRateValidationSchema = yup.object().shape({
  SupplierId: yup.string().required("Please select supplier"),
  DestinationID: yup.string().required("Please select destination"),
  ValidFrom: yup.string().required("Please  select from date"),
  ValidTo: yup.string().required("Please select to date"),
  Type: yup.string().required("Please select type"),
  TaxSlabId: yup.string().required("Please select tax"),
  CurrencyId: yup.string().required("Please select currency"),
});

// transfer rate validation
export const transferRateValidationSchema = yup.object().shape({
  SupplierId: yup.string().required("Please select supplier"),
  DestinationID: yup.string().required("Please select destination"),
  ValidFrom: yup.string().required("Please select from date"),
  ValidTo: yup.string().required("Please select to date"),
  CurrencyId: yup.string().required("Please select currency"),
  TaxSlabId: yup.string().required("Please select tax "),
});

// restaurant rate validation
export const restaurantRateValidationSchema = yup.object().shape({
  SupplierId: yup.string().required("Please select supplier"),
  MealTypeId: yup.string().required("Please select meal"),
  Currency: yup.string().required("Please select currency"),
  AdultCost: yup.string().required("Please enter adult"),
  GstSlabId: yup.string().required("Please select GST"),
});

// train rate validation
export const trainRateValidationShema = yup.object().shape({
  TrainNumber: yup.string().required("Please enter train number"),
  JourneyType: yup.string().required("Please select journey type"),
  Currency: yup.string().required("Please select currency"),
  SupplierId: yup.string().required("Please select supplier"),
  AdultCost: yup.string().required("Please enter adult cost"),
});
// Payment Type Validation
export const paymentTypeValidationSchema = yup.object().shape({
  PaymentTypeName: yup.string().required("Please enter name"),
});

// Saas Code Validation
export const saasCodeValidationSchema = yup.object().shape({
  ServiceTypeId: yup.string().required("Please select service type"),
  SacCode: yup.string().required("Please enter saas code"),
  TaxSlabId: yup.string().required("Please Select Tax Slab"),
});

// Bank Master validation
export const bankValidationSchema = yup.object().shape({
  BankName: yup.string().required("Please Enter bank name"),
  currencyid: yup.string().required("Please Select Currency"),
  AccountNumber: yup.string().required("Please enter account no."),
  BeneficiaryName: yup.string().required("Please enter beneficiary name"),
  BranchIfsc: yup.string().required("Please enter branch IFSC code"),
  AccountType: yup.string().required("Please select account type"),
  BranchSwiftCode: yup.string().required("Please enter branch SWIFT code"),
  BranchAddress: yup.string().required("Please enter branch address"),
});
// airline rate validation
export const airlineRateValidationSchema = yup.object().shape({
  FlightNumber: yup.string().required("Required"),
  FlightClass: yup.string().required("Required"),
  Currency: yup.string().required("Required"),
  AdultCost: yup.object().shape({
    base_fare: yup.string().required("Base Fare Required"),
  }),
});
// operation restricted
export const OperationRestrictedValidationSchema = yup.object().shape({
  restriction_json: yup.object().shape({
    FromDate: yup.string().required("Required"),
    ToDate: yup.string().required("Required"),
    Reason: yup.string().required("Required"),
  }),
});
export const direcetClientValidationSchema = yup.object().shape({
  Title: yup.string().required("Please select title"),
  LastName: yup.string().required("Please enter last name"),
  FirstName: yup.string().required("Please enter first name"),
  Nationality: yup.string().required("Please select nationality"),
  Contactinfo: yup.array().of(
    yup.object().shape({
      Email: yup
        .string()
        .email("Invalid email format")
        .required("Please enter your Email"),
    })
  ),
});
export const sightseeingValidationSchema = yup.object().shape({
  Status: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
  SightseeingName: yup.string().required("Required"),
});
export const additionaRequirementValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const ferryMasterValidationSchema = yup.object().shape({
  FerryName: yup.string().required("Required"),
});
//pax slab validation schema
export const paxSlabValidationSchema = yup.object().shape({
  Min: yup
    .number()
    .min(0)
    .typeError("Please enter min pax or 0")
    .required("Please enter min pax"),
  Max: yup
    .number()
    .min(0)
    .typeError("Please enter max pax or 0")
    .required("Please enter max pax"),
  DividingFactor: yup
    .number()
    .min(0)
    .typeError("Please enter factor or 0")
  //   .required("Please enter factor"),
  // NoOfAdults: yup
  //   .number()
  //   .min(0)
  //   .typeError("Please enter adults or 0")
  //   .required("Please enter adults"),
  // NoOfChilds: yup
  //   .number()
  //   .min(0)
  //   .typeError("Please enter childs or 0")
  //   .required("Please enter childs"),
  // SingleRoom: yup
  //   .number()
  //   .min(0)
  //   .typeError("Please enter single or 0")
  //   .required("Please enter single room"),
  // DoubleRoom: yup
  //   .number()
  //   .min(0)
  //   .typeError("Please enter double or 0")
  //   .required("Please enter double room"),
  // TripleRoom: yup
  //   .number()
  //   .min(0)
  //   .typeError("Please enter triple or 0")
  //   .required("Please enter triple room"),
  // TwinRoom: yup
  //   .number()
  //   .min(0)
  //   .typeError("Please enter twin or 0")
  //   .required("Please enter twin room"),
  // ExtraBed: yup
  //   .number()
  //   .min(0)
  //   .typeError("Please enter extra bed or 0")
  //   .required("Please enter extra bed"),
  // ChildWithBed: yup
  //   .number()
  //   .min(0)
  //   .typeError("Please enter child or 0")
  //   .required("Please enter child bed"),
  // CnBed: yup
  //   .number()
  //   .min(0)
  //   .typeError("Please enter CN or 0")
  //   .required("Please enter CN bed"),
});
export const cruisecompanymasterValidationSchema = yup.object().shape({
  Status: yup.string().required("Required"),
  CruiseCompanyName: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
  Country: yup.string().required("Please select country "),
  State: yup.string().required("Please select state "),
  City: yup.string().required("Please select City "),
  PinCode: yup.string().required("Required "),
  Address: yup.string().required("Required "),
  Website: yup.string().required("Required "),
  GST: yup.string().required("Required "),
  SelfSupplier: yup.string().required("Required "),
  Type: yup.string().required("Required "),
  Phone: yup.string().required("Required "),
});
export const CruisenamecompanyValidationSchema = yup.object().shape({
  Status: yup.string().required("Required"),
  CruiseCompany: yup.string().required("Required"),
  CruiseName: yup.string().required("Required"),
  ImageName: yup.string().required("Please select ImageName "),
});
export const ferryCompanyValidationSchema = yup.object().shape({
  FerryCompanyName: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
});
export const itineraryRequirementValidationSchema = yup.object().shape({
  FromDestination: yup.string().required("Required"),
  ToDestination: yup.string().required("Required"),
});
export const itenararyOverviewValidationSchema = yup.object().shape({
  OverviewName: yup.string().required("Required"),
});
export const letterMasterValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),

  GreetingNote: yup.string().required("Required"),
});
export const fitValidationSchema = yup.object().shape({
  Name: yup.string().required("Name Required "),
  // Destination: yup.array().required("Required"),
  // Destination: yup.array().min(1, 'At least one destination is required'),
  Type: yup.string().required('Type is required'),
});
export const fleetValidationSchema = yup.object().shape({
  RegistrationNumber: yup.string().required("Required"),
  // Destination: yup.array().required("Required"),
});
export const driverMasterValidationSchema = yup.object().shape({
  DriverName: yup.string().required("Required"),
  // Destination: yup.array().required("Required"),
});
export const CabintypeValidationSchema = yup.object().shape({
  CruiseName: yup.string().required("Required"),
  CabinType: yup.string().required("Required"),
  Status: yup.string().required("Required"),
});
export const CabincategoryValidationSchema = yup.object().shape({
  Name: yup.string().required("Required"),
});
export const CruisemasterValidationSchema = yup.object().shape({
  CruisePackageName: yup.string().required("Required"),
  Destination: yup.string().required("Required"),
  RunningDays: yup.string().required("Required"),
  ArrivalTime: yup.string().required("Required"),
  DepartureTime: yup.string().required("Required"),
});
export const DistanceValidationSchema = yup.object().shape({
  FromDestination: yup.string().required("Required"),
});
export const addEditOfficeValidationSchema = yup.object().shape({
  Name: yup.string().required("Please enter name"),
});