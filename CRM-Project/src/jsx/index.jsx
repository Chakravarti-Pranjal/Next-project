// @ts-nocheck
import React, { lazy, useContext, useEffect } from "react";

/// React router dom
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

/// Layout
import Nav from "./layouts/nav/Index.jsx";
import Footer from "./layouts/Footer.jsx";
import ScrollToTop from "./layouts/ScrollToTop";
/// Dashboard
import Home from "./components/Dashboard/Home";
import Sales from "./components/Dashboard/SalesDashboard/Sales.jsx";
import MasterDashboard from "./pages/master/masterDashboard/index.jsx";
import State from "./pages/masters/state/index.jsx";
import City from "./pages/masters/city/index.jsx";
import Protected from "./pages/auth/Protected.jsx";

import Setting from "./layouts/Setting.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import QuotationListsec from "./pages/query-dashboard/quotation-second/qoutationList/QuotationList.jsx";
import SupplierSelection from "./pages/supplierCommunication/SupplierConfirmation/SupplierSelection.jsx";
const AddUser = lazy(() => import("./pages/userManagement/addUser.jsx"));
const CompanyList = lazy(() => import("./pages/userManagement/company.jsx"));
const AddCompany = lazy(() => import("./pages/userManagement/addCompany.jsx"));
const Roles = lazy(() => import("./pages/userManagement/roles.jsx"));
const UserRoles = lazy(() => import("./pages/userManagement/UserRoles.jsx"));
const Permission = lazy(() => import("./pages/userManagement/permission.jsx"));
const UserList = lazy(() => import("./pages/userManagement/userList.jsx"));
const UserProfile = lazy(() =>
  import("./pages/userManagement/UserProfile.jsx")
);
const AddEditOffice = lazy(() =>
  import("./pages/userManagement/addEditOffice.jsx")
);

import OperationsDashboard from "./components/Dashboard/OperationsDashboard/OperationsDashboard.jsx";
import FinanceDashboard from "./components/Dashboard/FinanceDashboard/FinanceDashboard.jsx";
import ReportDashboard from "./components/Dashboard/ReportDashboard/ReportSideBar/ReportSideBar.jsx";
import Reservationrequest from "./pages/supplierCommunication/SupplierConfirmation/Reservationrequest.jsx";
import Finalprice from "./pages/supplierCommunication/SupplierConfirmation/Finalprice.jsx";
import Client from "./pages/masters/client/index.jsx";
import AddClient from "./pages/masters/client/addClient.jsx";
import ViewClient from "./pages/masters/client/viewClient.jsx";
import VouchersNavbar from "./pages/masters/voucher/index.jsx";
import ProfileList from "./pages/userManagement/ProfileList";
import AddRole from "./pages/userManagement/addRole.jsx";
import { useDispatch } from "react-redux";
import { resetQoutationData } from "../store/actions/queryAction.js";
import Notifications from "./pages/chatNotification/Notifications.jsx";
import Sent from "./mail/Sent.jsx";
import Important from "./mail/Important.jsx";
import Draft from "./mail/Draft.jsx";
// import { Support, Work } from "@mui/icons-material";
import Private from "./mail/Private.jsx";
import Support from "./mail/Support.jsx";
import Work from "./mail/Work.jsx";
import Social from "./mail/Social.jsx";
import ProfileUser from "./pages/auth/profile/ProfileUser.jsx";
import ProfileModule from "./pages/auth/profile/ProfileModule.jsx";
import ProfileUserRoles from "./pages/auth/profile/ProfileUserRoles.jsx";
import GlobalTooltip from "./components/GlobalTooltip.jsx";
import AddEmailTemplate from "./pages/emailManagement/AddEmailTemplate.jsx";
// import FeedbackForm from "./components/feedbackForm/FeedbackForm.jsx";
import AddGuest from "./pages/query-dashboard/Tourextension/AddGuest.jsx";
import TourDetails from "./components/tourDetails/TourDetails.jsx";
import BriefingSheet from "./pages/query-dashboard/Tourextension/BriefingSheet.jsx";
import FeedbackForm from "./pages/query-dashboard/Tourextension/FeedbackForm.jsx";
import NotificationComponent from "../hooks/custom_hooks/useNotification.jsx";
import UserDepartmentList from "./pages/userManagement/UserDepartmentList.jsx";
import ProfileDepartment from "./pages/auth/profile/ProfileDepartment.jsx";
import Profilelist from "./pages/auth/profile/Profilelist.jsx";
import EmailSettinglist from "./pages/auth/profile/EmailSettinglist.jsx";
import UserPermission from "./pages/userManagement/UserPermission.jsx";
import LogingLog from "./components/Dashboard/ReportDashboard/LogingLog.jsx";
import GenerateInvoiceIndoAsia from "./pages/query-dashboard/Invoices/GenerateInvoiceIndoAsia.jsx";

const Addperference = lazy(() =>
  import("./pages/query-dashboard/createQuery/addperference.jsx")
);
// import Payments from "./pages/query-dashboard/payment/Payments.jsx";

const Module = lazy(() => import("./pages/userManagement/module.jsx"));
const PaxSlab = lazy(() => import("./pages/masters/pax-slab/index.jsx"));
const AddOrganisation = lazy(() =>
  import("./pages/userManagement/addOrganisation.jsx")
);

const OrganisationList = lazy(() =>
  import("./pages/userManagement/organisation.jsx")
);

const SupplierCommunication = lazy(() =>
  import("./pages/supplierCommunication/index.jsx")
);
const Payments = lazy(() =>
  import("./pages/query-dashboard/payment/Payments.jsx")
);
const SupplierPaymentRequest = lazy(() =>
  import(
    "./pages/query-dashboard/payment/supplierPaymentRequest/SupplierPaymentRequest.jsx"
  )
);
const AgentPaymentRequest = lazy(() =>
  import(
    "./pages/query-dashboard/payment/agentPaymentRequest/AgentPaymentRequest.jsx"
  )
);
const ExpenseEntry = lazy(() =>
  import("./pages/query-dashboard/payment/ExpenseEntry.jsx")
);
const Invoices = lazy(() =>
  import("./pages/query-dashboard/Invoices/Invoices.jsx")
);
const InvoiceShow = lazy(() =>
  import("./pages/query-dashboard/Invoices/InvoiceTableList.jsx")
);
const InvoiceList = lazy(() =>
  import("./pages/query-dashboard/Invoices/InvoiceList.jsx")
);
const ManaulInvoice = lazy(() =>
  import("./pages/query-dashboard/Invoices/ManaulInvoice.jsx")
);
const ItemWiseInvoice = lazy(() =>
  import("./pages/query-dashboard/Invoices/ItemWiseInvoice.jsx")
);
const Tourextension = lazy(() =>
  import("./pages/query-dashboard/Tourextension/Tourextension.jsx")
);
const Guestlist = lazy(() =>
  import("./pages/query-dashboard/Tourextension/Guestlist.jsx")
);
const Taskscheduling = lazy(() =>
  import("./pages/query-dashboard/Tourextension/Taskscheduling.jsx")
);
const B2c = lazy(() => import("./pages/query-dashboard/Tourextension/B2c.jsx"));
const Employee = lazy(() =>
  import("./pages/query-dashboard/Tourextension/Employee.jsx")
);

const ClientCommunication = lazy(() =>
  import("./pages/clientCommunication/index.jsx")
);

const Preview = lazy(() =>
  import("./pages/query-dashboard/createQuery/preview.jsx")
);
const CreateQuery = lazy(() =>
  import("./pages/query-dashboard/createQuery/index.jsx")
);
const RateActivity = lazy(() =>
  import("./pages/masters/activity/rateActivity/index.jsx")
);
const RateHotel = lazy(() =>
  import("./pages/masters/hotel/rateHotel/index.jsx")
);
const BusinessType = lazy(() =>
  import("./pages/masters/businessType/index.jsx")
);
const Language = lazy(() => import("./pages/masters/language/index.jsx"));
const Division = lazy(() => import("./pages/masters/division/index.jsx"));
const TourType = lazy(() => import("./pages/masters/tourType/index.jsx"));
const LeadSource = lazy(() => import("./pages/masters/leadSource/index.jsx"));
const Destination = lazy(() => import("./pages/masters/destination/index.jsx"));
const Season = lazy(() => import("./pages/masters/season/index.jsx"));
const AddDocument = lazy(() =>
  import("./layouts/common/companyDocument/addDocument/index.jsx")
);
const AddBankDetail = lazy(() =>
  import("./layouts/common/bankDetail/addBankDetail/index.jsx")
);
const AddContact = lazy(() =>
  import("./layouts/common/contactPerson/addContact/index.jsx")
);
const AddMeeting = lazy(() =>
  import("./layouts/common/meetings/addMeeting/index.jsx")
);
const AddTask = lazy(() => import("./layouts/common/task/addTask/index.jsx"));
const AddCall = lazy(() => import("./layouts/common/call/addCall/index.jsx"));
const RateMonument = lazy(() =>
  import("./pages/masters/sightSeeing/monument/rateMonument/index.jsx")
);
const AddOffice = lazy(() =>
  import("./layouts/common/office/addOffice/index.jsx")
);
const ViewSupplier = lazy(() =>
  import("./pages/masters/supplier/viewSupplier/index.jsx")
);
const AddSupplier = lazy(() =>
  import("./pages/masters/supplier/addSupplier/index.jsx")
);
const Supplier = lazy(() => import("./pages/masters/supplier/index.jsx"));
const ViewAgent = lazy(() =>
  import("./pages/masters/guide/agent/viewAgent/index.jsx")
);
const AddAgent = lazy(() =>
  import("./pages/masters/guide/agent/addAgent/index.jsx")
);
const Agent = lazy(() => import("./pages/masters/guide/agent/index.jsx"));
const Train = lazy(() => import("./pages/masters/train/index.jsx"));
const Airline = lazy(() => import("./pages/masters/airline/index.jsx"));
const AddMonument = lazy(() =>
  import("./pages/masters/sightSeeing/monument/addMonument/index.jsx")
);
const Sightseeing = lazy(() =>
  import("./pages/masters/sightSeeing/sightseeingMaster/index.jsx")
);
const VisaType = lazy(() => import("./pages/masters/Visa/visaType/index.jsx"));
const VisaCost = lazy(() => import("./pages/masters/Visa/visaCost/index.jsx"));
const Monument = lazy(() =>
  import("./pages/masters/sightSeeing/monument/index.jsx")
);
const Country = lazy(() => import("./pages/masters/country/index.jsx"));
const Guide = lazy(() => import("./pages/masters/guide/index.jsx"));
const AddGuide = lazy(() => import("./pages/masters/guide/AddGuide.jsx"));
const Hotel = lazy(() => import("./pages/masters/hotel/index.jsx"));
const HotelAditional = lazy(() =>
  import("./pages/masters/hoteladditional/index.jsx")
);
const AddHotel = lazy(() => import("./pages/masters/hotel/AddHotel.jsx"));
const RoomType = lazy(() => import("./pages/masters/roomtype/index.jsx"));
const AddRoomType = lazy(() =>
  import("./pages/masters/roomtype/AddRoomType.jsx")
);
const Amenities = lazy(() => import("./pages/masters/amenities/index.jsx"));
const HotelType = lazy(() => import("./pages/masters/hoteltype/index.jsx"));
const HotelMeal = lazy(() => import("./pages/masters/hotelmeal/index.jsx"));
const Weekend = lazy(() => import("./pages/masters/weekend/index.jsx"));
const HotelCategory = lazy(() =>
  import("./pages/masters/hotelcategory/index.jsx")
);
const Room = lazy(() => import("./pages/masters/room/index.jsx"));
const HotelChain = lazy(() => import("./pages/masters/hotelchain/index.jsx"));
const AddHotelChain = lazy(() => import("./pages/masters/hotelchain/Add.jsx"));
const Restaurant = lazy(() => import("./pages/masters/restaurant/index.jsx"));
const AddRestaurant = lazy(() => import("./pages/masters/restaurant/Add.jsx"));
const RestaurantMeal = lazy(() =>
  import("./pages/masters/restaurantmeal/index.jsx")
);
const TransferType = lazy(() =>
  import("./pages/masters/transfertype/index.jsx")
);
const VehicleType = lazy(() => import("./pages/masters/vehicletype/index.jsx"));
const Vehicle = lazy(() => import("./pages/masters/vehicle/index.jsx"));
const VehicleBrand = lazy(() =>
  import("./pages/masters/vehiclebrand/index.jsx")
);
const Transfer = lazy(() => import("./pages/masters/transfer/index.jsx"));
const TransferAdd = lazy(() => import("./pages/masters/transfer/Add.jsx"));
const Transport = lazy(() => import("./pages/masters/transport/index.jsx"));
const TransportAdd = lazy(() => import("./pages/masters/transport/Add.jsx"));
const Activity = lazy(() => import("./pages/masters/activity/index.jsx"));
const AddActivity = lazy(() => import("./pages/masters/activity/Add.jsx"));

const CruiseCompany = lazy(() =>
  import("./pages/masters/CRUISEMASTER/index.jsx")
);

const ActivityRate = lazy(() =>
  import("./pages/masters/activity/rateActivity/index.jsx")
);
const GuideService = lazy(() =>
  import("./pages/masters/guideservice/index.jsx")
);
const AddGuideService = lazy(() =>
  import("./pages/masters/guideservice/Add.jsx")
);
const InsuranceType = lazy(() =>
  import("./pages/masters/insurance/insurancetype/index.jsx")
);
const InsuranceCost = lazy(() =>
  import("./pages/masters/insurance/insurancecost/index.jsx")
);
const OperationRestricted = lazy(() =>
  import("./pages/masters/operationRestricted/index.jsx")
);
const Error404 = lazy(() => import("./pages/Error404/index.jsx"));
const CurrencyList = lazy(() => import("./pages/masters/currency/index.jsx"));
const AddCurrency = lazy(() => import("./pages/masters/currency/Add.jsx"));
const TaxMasterList = lazy(() => import("./pages/masters/taxmaster/index.jsx"));
const AddTaxMaster = lazy(() => import("./pages/masters/taxmaster/Add.jsx"));
const ExpenceHead = lazy(() => import("./pages/masters/expencehead/index.jsx"));
const ExpenceType = lazy(() => import("./pages/masters/expencetype/index.jsx"));
const MonumentPackage = lazy(() =>
  import("./pages/masters/monument-package/index.jsx")
);
const AddMonumentPackage = lazy(() =>
  import("./pages/masters/monument-package/Add.jsx")
);
const Mail = lazy(() => import("./mail/index.jsx"));
const Compose = lazy(() => import("./mail/Compose.jsx"));
const QueryList = lazy(() => import("./pages/query-dashboard/QueryList.jsx"));
const GuideServiceRate = lazy(() =>
  import("./pages/masters/guideservice/rate/index.jsx")
);
const MarketType = lazy(() => import("./pages/masters/markettype/index.jsx"));
const PassportType = lazy(() => import("./pages/masters/passport/index.jsx"));
const PassportCost = lazy(() =>
  import("./pages/masters/passport/Passportcost.jsx")
);
const Commision = lazy(() => import("./pages/masters/commision/index.jsx"));
const TransportRate = lazy(() =>
  import("./pages/masters/transport/rate/index.jsx")
);
const TranferRate = lazy(() =>
  import("./pages/masters/transfer/rate/index.jsx")
);
const RestaurantRate = lazy(() =>
  import("./pages/masters/restaurant/rate/index.jsx")
);
const TrainRate = lazy(() => import("./pages/masters/train/rate/index.jsx"));
const AirMeal = lazy(() => import("./pages/masters/airmeal/index.jsx"));
const SeatPreference = lazy(() =>
  import("./pages/masters/seatpreference/index.jsx")
);
const ClassPreference = lazy(() =>
  import("./pages/masters/classpreferences/index.jsx")
);
const PaymentType = lazy(() => import("./pages/masters/paymenttype/index.jsx"));
const Ferry = lazy(() => import("./pages/masters/ferry/index.jsx"));
const SacCode = lazy(() => import("./pages/masters/saccode/index.jsx"));
const Bank = lazy(() => import("./pages/masters/bank/index.jsx"));
const AdditionalRequirement = lazy(() =>
  import("./pages/masters/additionalRequirement/index.jsx")
);
const BankAdd = lazy(() => import("./pages/masters/bank/add.jsx"));
const AirlineRate = lazy(() =>
  import("./pages/masters/airline/rate/index.jsx")
);
const File = lazy(() => import("./components/Document/File.jsx"));
const QueryDashboard = lazy(() =>
  import("./pages/query-dashboard/QueryDashboard.jsx")
);
const Quotation = lazy(() =>
  import("./pages/query-dashboard/qoutation-first/Quotation.jsx")
);
const QuotationList = lazy(() =>
  import("./pages/query-dashboard/qoutation-first/QoutationList.jsx")
);
// const QuotationListsec = lazy(() =>
//   import("./pages/query-dashboard/quotation-second/qoutationList/QuotationList.jsx")
// );

const Qoutation = lazy(() =>
  import("./pages/query-dashboard/quotation-second/Quotation.jsx")
);

const QoutationThird = lazy(() =>
  import("./pages/query-dashboard/quotation-third/Quotation.jsx")
);
const QoutationFour = lazy(() =>
  import("./pages/query-dashboard/quotation-four/Quotation.jsx")
);
const FinalQoutation = lazy(() =>
  import("./pages/query-dashboard/quotation-four/FinalQoutation.jsx")
);
const EditableCostsheet = lazy(() =>
  import("./pages/query-dashboard/quotation-four/costsheet/Costsheet.jsx")
);

const FarryCompany = lazy(() =>
  import("./pages/masters/ferryCompany/index.jsx")
);

const NotFound = lazy(() => import("./pages/Error404/index.jsx"));
const FerrySeat = lazy(() => import("./pages/masters/ferrySeat/index.jsx"));
const FerryPrice = lazy(() => import("./pages/masters/ferryPrice/index.jsx"));
const ItenaryRequirement = lazy(() =>
  import("./pages/masters/itineraryRequirement/index.jsx")
);
const ItenaryOverview = lazy(() =>
  import("./pages/masters/itineraryOverview/index.jsx")
);
const Cruisenamecompany = lazy(() =>
  import("./pages/masters/CRUISEMASTER/CruiseNameCompany/index.jsx")
);
const LetterMaster = lazy(() =>
  import("./pages/masters/letterMaster/index.jsx")
);
const FleetMaster = lazy(() => import("./pages/masters/fleet/index.jsx"));
const DriverMaster = lazy(() => import("./pages/masters/driver/index.jsx"));
const Fit = lazy(() => import("./pages/masters/fit/index.jsx"));
const Add = lazy(() => import("./pages/masters/fit/add.jsx"));
const Git = lazy(() => import("./pages/masters/git/index.jsx"));
const GitAdd = lazy(() => import("./pages/masters/git/add.jsx"));

const Cabintype = lazy(() =>
  import("./pages/masters/CRUISEMASTER/cabintype/Cabintype.jsx")
);
const Cabincategory = lazy(() =>
  import("./pages/masters/CRUISEMASTER/cabincategory/Cabincategory.jsx")
);
const Cruisemaster = lazy(() =>
  import("./pages/masters/CRUISEMASTER/cruisemaster/Cruisemaster.jsx")
);

const Proposal = lazy(() =>
  import("./pages/query-dashboard/Proposal/Proposal.jsx")
);
// const AddRateUploadField = lazy(() =>
//   import("./pages/masters/rateFileTemplete/index.jsx")
// );
// const Costsheet = lazy(() =>
//   import("./pages/query-dashboard/costsheet/Costsheet.jsx")
// );
// const Proposal = lazy(() =>
//   import("./pages/query-dashboard/Proposal/Proposal.jsx")
// );
const Crmrate = lazy(() =>
  import("./pages/query-dashboard/crmrate/Crmrate.jsx")
);
const AddRateUploadField = lazy(() =>
  import("./pages/masters/rateFileTemplete/index.jsx")
);
const TaskSchedulingTemplate = lazy(() =>
  import("./pages/masters/taskSchedulingTemplate/index.jsx")
);
const TaskSchedulingTemplateAdd = lazy(() =>
  import("./pages/masters/taskSchedulingTemplate/add.jsx")
);
const TaskSchedulingTemplateView = lazy(() =>
  import("./pages/masters/taskSchedulingTemplate/view.jsx")
);
const Costsheet = lazy(() =>
  import("./pages/query-dashboard/costsheet/Costsheet.jsx")
);
const CostSheetList = lazy(() =>
  import("./pages/query-dashboard/costsheet/CostSheetList.jsx")
);
const ClientVouchers = lazy(() =>
  import("./pages/query-dashboard/vouchers/ClientVouchers.jsx")
);
const SupplierVouchers = lazy(() =>
  import("./pages/query-dashboard/vouchers/SupplierVouchers.jsx")
);
const TaskScheduling = lazy(() =>
  import("./pages/query-dashboard/task-scheduling/TaskScheduling.jsx")
);
const ProposalList = lazy(() =>
  import("./pages/query-dashboard/Proposal/ProposalList.jsx")
);

const AgentTurnOverRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/AgentTurnOverRep/AgentTurnOverRep.jsx"
  )
);
const ArrivalReport = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/ArrivalReport/ArrivalReport.jsx"
  )
);
const AgentWiseQueryRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/AgentWiseQueryRep/AgentWiseQueryRep.jsx"
  )
);
const AuditLog = lazy(() =>
  import("./components/Dashboard/ReportDashboard/AuditLog/AuditLog.jsx")
);
const BirthdayAnniversaryRem = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/BirthdayAnniversaryRem/BirthdayAnniversaryRem.jsx"
  )
);
const CityWiseBookingRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/CityWiseBookingRep/CityWiseBookingRep.jsx"
  )
);
const ClientWiseQueryRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/ClientWiseQueryRep/ClientWiseQueryRep.jsx"
  )
);
const DailyMovementChartRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/DailyMovementChartRep/DailyMovementChartRep.jsx"
  )
);
const TransferMovementChartRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/TransferMovementChartRep/TransferMovementChartRep.jsx"
  )
);
const TourWiseServiceStatusRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/TourWiseServiceStatusRep/TourWiseServiceStatusRep.jsx"
  )
);
const FeedbackReportMobile = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/FeedbackReportMobile/FeedbackReportMobile.jsx"
  )
);
const OnlineFeedbackRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/OnlineFeedbackRep/OnlineFeedbackRep.jsx"
  )
);
const FileWiseLiabilityRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/FileWiseLiabilityRep/FileWiseLiabilityRep.jsx"
  )
);
const FixDepartureRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/FixDepartureRep/FixDepartureRep.jsx"
  )
);
const GuestListRep = lazy(() =>
  import("./components/Dashboard/ReportDashboard/GuestListRep/GuestListRep.jsx")
);
const GuideAllocationRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/GuideAllocationRep/GuideAllocationRep.jsx"
  )
);
const HotelBookingRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/HotelBookingRep/HotelBookingRep.jsx"
  )
);
const HotelChainRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/HotelChainRep/HotelChainRep.jsx"
  )
);
const HotelRoomNightAnalRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/HotelRoomNightAnalRep/HotelRoomNightAnalRep.jsx"
  )
);
const HotelWaitListRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/HotelWaitListRep/HotelWaitListRep.jsx"
  )
);
const IncomingTourStatusRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/IncomingTourStatusRep/IncomingTourStatusRep.jsx"
  )
);
const NewsLetterRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/NewsLetterRep/NewsLetterRep.jsx"
  )
);
const LoginRep = lazy(() =>
  import("./components/Dashboard/ReportDashboard/LoginRep/LoginRep.jsx")
);
const SalesRep = lazy(() =>
  import("./components/Dashboard/ReportDashboard/SalesRep/SalesRep.jsx")
);
const TourExtensionRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/TourExtensionRep/TourExtensionRep.jsx"
  )
);
const TourRegistrationRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/TourRegistrationRep/TourRegistrationRep.jsx"
  )
);
const TurnoverStatementProformCountryWise = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/TurnoverStatementProformCountryWise/TurnoverStatementProformCountryWise.jsx"
  )
);
const TurnoverStatementProformExecutiveWise = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/TurnoverStatementProformExecutiveWise/TurnoverStatementProformExecutiveWise.jsx"
  )
);
const UserWiseQueryRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/UserWiseQueryRep/UserWiseQueryRep.jsx"
  )
);
const LuxuryTrainRep = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/LuxuryTrainRep/LuxuryTrainRep.jsx"
  )
);

const Pinnumber = lazy(() => import("./pages/Pinnumber.jsx"));
const Viewhotel = lazy(() =>
  import("./pages/masters/hotel/viewhotel/Viewhotel.jsx")
);
const ViewTransport = lazy(() =>
  import("./pages/masters/transport/ViewTransport/ViewTransport.jsx")
);
const Salesreports = lazy(() =>
  import("./components/Dashboard/ReportDashboard/Salesreports/Salesreports.jsx")
);
const Operationreports = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/Operationreports/Operationreports.jsx"
  )
);
const Financereports = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/Finanacereport/Financereports.jsx"
  )
);
const InvoiceTurnOverReport = lazy(() =>
  import(
    "./components/Dashboard/ReportDashboard/InvoiceTurnOverReport/InvoiceTurnOverReport.jsx"
  )
);
const Misreports = lazy(() =>
  import("./components/Dashboard/ReportDashboard/Misreports/Misreports.jsx")
);
const Visasummary = lazy(() =>
  import("./pages/masters/Visa/visaSummary/Visasummary.jsx")
);
const Destinationsadd = lazy(() =>
  import("./pages/masters/destination/Destinationsadd.jsx")
);
const Distancelist = lazy(() =>
  import("./pages/masters/distance/Distancelist.jsx")
);
const Distance = lazy(() => import("./pages/masters/distance/Distance.jsx"));
const Reportchart = lazy(() =>
  import("./pages/userManagement/Reportchart.jsx")
);
const Proposals = lazy(() => import("./components/Proposal/Proposal.jsx"));
const Profile = lazy(() => import("./pages/auth/profile/Profile.jsx"));
const ProfileEmailTemplates = lazy(() =>
  import("./pages/auth/profile/ProfileEmailTemplates.jsx")
);
const Prosonalinfo = lazy(() =>
  import("./pages/auth/profile/Prosonalinfo.jsx")
);
const Changepassword = lazy(() =>
  import("./pages/auth/profile/Changepassword.jsx")
);
const Localescortslab = lazy(() =>
  import("./pages/masters/localescortslab/index.jsx")
);

const ProfileCompanySetting = lazy(() =>
  import("./pages/auth/profile/ProfileCompanySetting.jsx")
);
const Profilestagemaster = lazy(() =>
  import("./pages/auth/profile/Profilestagemaster.jsx")
);

const InvoicesAllList = lazy(() =>
  import("./pages/query-dashboard/InvoicesAllList/InvoiceList.jsx")
);
const InvoicesShow = lazy(() =>
  import("./pages/query-dashboard/InvoicesAllList/Invoices.jsx")
);

const Markup = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const allroutes = [
    /// Dashboard
    { url: "/", component: <Home /> },
    { url: "/admin-dashboard", component: <Home /> },
    { url: "/sales-dashboard", component: <Sales /> },
    { url: "/operations-dashboard", component: <OperationsDashboard /> },
    { url: "/finance-dashboard", component: <FinanceDashboard /> },
    { url: "/countries", component: <Country /> },
    { url: "/sightseeingMaster", component: <Sightseeing /> },
    { url: "/guide", component: <Guide /> },
    { url: "/guide/add", component: <AddGuide /> },
    { url: "/masters", component: <MasterDashboard /> },
    { url: "/states", component: <State /> },
    { url: "/cities", component: <City /> },
    { url: "/ferry", component: <Ferry /> },
    { url: "/ferry-seat", component: <FerrySeat /> },
    { url: "/ferry-company", component: <FarryCompany /> },
    { url: "/additional-requirement", component: <AdditionalRequirement /> },
    { url: "/businesstype", component: <BusinessType /> },
    { url: "/languages", component: <Language /> },
    { url: "/division", component: <Division /> },
    { url: "/tourType", component: <TourType /> },
    { url: "/leadSource", component: <LeadSource /> },
    { url: "/destinations", component: <Destination /> },
    { url: "/season", component: <Season /> },
    { url: "/country", component: <Country /> },
    { url: "/hotel", component: <Hotel /> },
    { url: "/hotel/add", component: <AddHotel /> },
    { url: "/roomtype", component: <RoomType /> },
    { url: "/roomtype/add", component: <AddRoomType /> },
    { url: "/amenities", component: <Amenities /> },
    { url: "/hotel-type", component: <HotelType /> },
    { url: "/hotelmeal", component: <HotelMeal /> },
    { url: "/weekend", component: <Weekend /> },
    { url: "/hotelcategory", component: <HotelCategory /> },
    { url: "/room-type", component: <Room /> },
    { url: "/hotelchain", component: <HotelChain /> },
    // { url: "/Voucher", component: <Abc />},
    { url: "/hotel-additional", component: <HotelAditional /> },
    { url: "/hotelchain/add", component: <AddHotelChain /> },
    { url: "/restaurant", component: <Restaurant /> },
    { url: "/restaurant/rate/:id", component: <RestaurantRate /> },
    { url: "/restaurant/add", component: <AddRestaurant /> },
    { url: "/restaurantmeal", component: <RestaurantMeal /> },
    { url: "/transfertype", component: <TransferType /> },
    { url: "/vehicletype", component: <VehicleType /> },
    { url: "/vehicle", component: <Vehicle /> },
    { url: "/vehiclebrand", component: <VehicleBrand /> },
    { url: "/transfer", component: <Transfer /> },
    { url: "/transfer/rate/:id", component: <TranferRate /> },
    { url: "/transfer/add", component: <TransferAdd /> },
    { url: "/transport", component: <Transport /> },
    { url: "/transport/rate/:id", component: <TransportRate /> },
    { url: "/transport/add", component: <TransportAdd /> },
    { url: "/activity", component: <Activity /> },
    { url: "/activity/rate/:id", component: <ActivityRate /> },
    { url: "/activity/add", component: <AddActivity /> },
    { url: "/guide-service", component: <GuideService /> },
    { url: "/guide-service/rate/:id", component: <GuideServiceRate /> },
    { url: "/guide-service/add", component: <AddGuideService /> },
    { url: "/visaType", component: <VisaType /> },
    { url: "/visaCost", component: <VisaCost /> },
    { url: "/monument", component: <Monument /> },
    { url: "/add/monument", component: <AddMonument /> },
    { url: "/train", component: <Train /> },
    { url: "/train/rate/:id", component: <TrainRate /> },
    { url: "/airline", component: <Airline /> },
    { url: "/airline/rate/:id", component: <AirlineRate /> },
    { url: "/agent", component: <Agent /> },
    { url: "/add/agent", component: <AddAgent /> },
    { url: "/view/agent/:id", component: <ViewAgent /> },
    { url: "/supplier", component: <Supplier /> },
    { url: "/add/supplier", component: <AddSupplier /> },
    { url: "/view/supplier/:id", component: <ViewSupplier /> },
    { url: "/add/office/:id", component: <AddOffice /> },
    { url: "/add/document/:id", component: <AddDocument /> },
    { url: "/add/bank/:id", component: <AddBankDetail /> },
    { url: "/add/contact/:id", component: <AddContact /> },
    { url: "/insurance-type", component: <InsuranceType /> },
    { url: "/insurance-cost", component: <InsuranceCost /> },
    { url: "/add/meeting/:id", component: <AddMeeting /> },
    { url: "/add/task/:id", component: <AddTask /> },
    { url: "/add/call/:id", component: <AddCall /> },
    { url: "/currency-list", component: <CurrencyList /> },
    { url: "/currency/add", component: <AddCurrency /> },
    { url: "/monument-package", component: <MonumentPackage /> },
    { url: "/monument-package/add", component: <AddMonumentPackage /> },
    { url: "/monument/rate/:id", component: <RateMonument /> },
    { url: "/hotel/rate/:id", component: <RateHotel /> },
    { url: "/activity/rate/:id", component: <RateActivity /> },
    { url: "/mails", component: <Mail /> },
    { url: "/mails/compose", component: <Compose /> },
    { url: "/notifications", component: <Notifications /> },
    { url: "/queries", component: <QueryList /> },
    { url: "/costsheet", component: <CostSheetList /> },
    { url: "/client-vouchers", component: <ClientVouchers /> },
    { url: "/supplier-vouchers", component: <SupplierVouchers /> },
    { url: "/task-scheduling", component: <TaskScheduling /> },
    { url: "/proposals-itineraries", component: <ProposalList /> },
    { url: "/tax-master-list", component: <TaxMasterList /> },
    { url: "/taxmaster/add", component: <AddTaxMaster /> },
    { url: "/expence-head-list", component: <ExpenceHead /> },
    { url: "/expence-type-list", component: <ExpenceType /> },
    { url: "/market-type", component: <MarketType /> },
    { url: "/passport-type", component: <PassportType /> },
    { url: "/passport-cost", component: <PassportCost /> },
    { url: "/commision-list", component: <Commision /> },
    { url: "/airmeal-list", component: <AirMeal /> },
    { url: "/seat-preferences", component: <SeatPreference /> },
    { url: "/class-preferences", component: <ClassPreference /> },
    { url: "/payment-type", component: <PaymentType /> },
    { url: "/SAC-Code-List", component: <SacCode /> },
    { url: "/bank-list", component: <Bank /> },
    { url: "/add/bank", component: <BankAdd /> },
    { url: "/query/preview/:id", component: <Preview /> },
    { url: "/operation-restricted", component: <OperationRestricted /> },
    { url: "/documents", component: <File /> },
    { url: "/user-profile/user", component: <ProfileUser /> },
    { url: "/create-user", component: <AddUser /> },
    { url: "/company", component: <CompanyList /> },
    { url: "/create-company", component: <AddCompany /> },
    { url: "/user-profile/roles", component: <ProfileUserRoles /> },
    { url: "/user-profile/email-setting", component: <EmailSettinglist /> },
    { url: "/role-permission", component: <UserProfile /> },
    { url: "/add-permission", component: <Permission /> },
    { url: "/direct-client", component: <Client /> },
    { url: "/add-client", component: <AddClient /> },
    { url: "/view/client/:id", component: <ViewClient /> },
    { url: "/permission", component: <ProfileList /> },
    { url: "/add-role", component: <AddRole /> },
    { url: "/organisation", component: <OrganisationList /> },
    { url: "/create-organisation", component: <AddOrganisation /> },
    { url: "/pax-slab", component: <PaxSlab /> },
    { url: "/user-profile/module", component: <ProfileModule /> },
    { url: "/user-profile/department", component: <ProfileDepartment /> },
    { url: "/user-profile/profile-list", component: <Profilelist /> },
    { url: "/update-preference", component: <Addperference /> },
    { url: "/ferry-price", component: <FerryPrice /> },
    { url: "/itinerary-requirement", component: <ItenaryRequirement /> },
    { url: "/itinerary-overview", component: <ItenaryOverview /> },
    { url: "/cruise-company", component: <CruiseCompany /> },
    { url: "/cruise-name-company", component: <Cruisenamecompany /> },
    { url: "/letter-master", component: <LetterMaster /> },
    { url: "/fleet-master", component: <FleetMaster /> },
    { url: "/driver-master", component: <DriverMaster /> },
    { url: "/fit-master", component: <Fit /> },
    { url: "fit/add", component: <Add /> },
    { url: "/git-master", component: <Git /> },
    { url: "git/add", component: <GitAdd /> },
    { url: "/cabin-type", component: <Cabintype /> },
    { url: "/cabin-category", component: <Cabincategory /> },
    { url: "/cruise-master", component: <Cruisemaster /> },
    { url: "/rate-template", component: <AddRateUploadField /> },
    { url: "/crm-rate", component: <Crmrate /> },
    { url: "/pinnumber", component: <Pinnumber /> },
    { url: "/view-hotel", component: <Viewhotel /> },
    { url: "/view-transport", component: <ViewTransport /> },
    { url: "/visa-summary", component: <Visasummary /> },
    { url: "/destinations-add", component: <Destinationsadd /> },
    { url: "/distance-add", component: <Distance /> },
    { url: "/distance-master", component: <Distancelist /> },
    { url: "/report-chart", component: <Reportchart /> },
    { url: "/user-profile", component: <Profile /> },
    { url: "/user-profile/profile-info", component: <Prosonalinfo /> },
    { url: "/user-profile/change-password", component: <Changepassword /> },
    { url: "/mails/compose/sent", component: <Sent /> },
    { url: "/mails/compose/important", component: <Important /> },
    { url: "/mails/compose/draft", component: <Draft /> },
    { url: "/mails/compose/trash", component: <Draft /> },
    { url: "/mails/compose/work", component: <Work /> },
    { url: "/mails/compose/private", component: <Private /> },
    { url: "/mails/compose/support", component: <Support /> },
    { url: "/mails/compose/social", component: <Social /> },
    { url: "/add-edit-office", component: <AddEditOffice /> },
    { url: "/local-Slab-Escort-Cost", component: <Localescortslab /> },
    {
      url: "/user-profile/email-templates",
      component: <ProfileEmailTemplates />,
    },
    { url: "/create-email-template", component: <AddEmailTemplate /> },
    {
      url: "/user-profile/company-setting",
      component: <ProfileCompanySetting />,
    },
    {
      url: "/user-profile/stage-master",
      component: <Profilestagemaster />,
    },
    // { url: "/feedback-form", component: <FeedbackForm /> },
    { url: "/user", component: <UserList /> },
    { url: "/roles", component: <UserRoles /> },
    { url: "/module", component: <Module /> },
    { url: "/user-permission", component: <UserPermission /> },
    // { url: "/tour-details", component: <TourDetails /> },
    { url: "/task-scheduling-template", component: <TaskSchedulingTemplate /> },
    {
      url: "/task-scheduling-template/add",
      component: <TaskSchedulingTemplateAdd />,
    },
    {
      url: "/task-scheduling-template/view",
      component: <TaskSchedulingTemplateView />,
    },
    {
      url: "/invoices",
      component: <InvoicesAllList />,
    },
    {
      url: "/invoices/invoice-show",
      component: <InvoicesShow />,
    },
    {
      url: "/department",
      component: <UserDepartmentList />,
    },
  ];

  const queryRoutes = [
    {
      url: "/query/quotation",
      component: <Qoutation />,
    },
    {
      url: "/query/quotation-third",
      component: <QoutationThird />,
    },
    {
      url: "/query/quotation-four",
      component: <QoutationFour />,
    },
    {
      url: "/query/quotation-four/final-qoutation",
      component: <FinalQoutation />,
    },
    {
      url: "/query/quotation-four/costsheet",
      component: <EditableCostsheet />,
    },
    {
      url: "/query/vouchers",
      component: <VouchersNavbar />,
    },
    {
      url: "/query/costsheet-list",
      component: <Costsheet />,
    },
    {
      url: "/query/proposal-list",
      component: <Proposal />,
    },
    {
      url: "/query/quotation-list",
      component: <QuotationListsec />,
    },
    { url: "/query/quotation-list/tour-details", component: <TourDetails /> },

    { url: "/query/client-communication", component: <ClientCommunication /> },
    {
      url: "/query/supplier-communication",
      component: <SupplierCommunication />,
    },
    {
      url: "/query/supplier-communication/supplier-selection",
      component: <SupplierSelection />,
    },
    {
      url: "/query/supplier-communication/reservation-request",
      component: <Reservationrequest />,
    },
    {
      url: "/query/supplier-communication/Final-price",
      component: <Finalprice />,
    },
    {
      url: "/query/payments",
      component: <Payments />,
    },
    {
      url: "/query/payments/supplierpayment-request",
      component: <SupplierPaymentRequest />,
    },
    {
      url: "/query/payments/agentpayment-request",
      component: <AgentPaymentRequest />,
    },
    {
      url: "/query/payments/expense-entry",
      component: <ExpenseEntry />,
    },
    {
      url: "/query/invoice-show",
      component: <Invoices />,
    },
    {
      url: "/query/generate-invoice",
      component: <GenerateInvoiceIndoAsia />,
    },
    {
      url: "/query/invoices",
      component: <InvoiceShow />,
    },
    {
      url: "/query/invoice-list",
      component: <InvoiceList />,
    },
    {
      url: "/query/invoices/manaul-invoice",
      component: <ManaulInvoice />,
    },
    {
      url: "/query/invoices/itemwise-invoice",
      component: <ItemWiseInvoice />,
    },
    {
      url: "/query/tour-execution",
      component: <Tourextension />,
    },
    {
      url: "/query/tour-execution/guest-list",
      component: <Guestlist />,
    },
    {
      url: "/query/tour-execution/brifing-sheet",
      component: <BriefingSheet />,
    },
    {
      url: "/query/tour-execution/feedback-form",
      component: <FeedbackForm />,
    },
    {
      url: "/query/tour-execution/guest-list/add-guest",
      component: <AddGuest />,
    },
    {
      url: "/query/tour-execution/task-scheduling",
      component: <Taskscheduling />,
    },
    {
      url: "/query/tour-execution/guest-list/B2c",
      component: <B2c />,
    },
    {
      url: "/query/tour-execution/guest-list/Employee",
      component: <Employee />,
    },
  ];

  useEffect(() => {
    const allRoute = queryRoutes?.map((query) => query?.url);
    if (!allRoute.includes(location.pathname)) {
      dispatch(resetQoutationData());
    }
  }, [location, dispatch]);

  const reportRoutes = [
    { url: "/report-dashboard/sales-reports", component: <Salesreports /> },
    {
      url: "/report-dashboard/operation-reports",
      component: <Operationreports />,
    },
    { url: "/report-dashboard/finance-reports", component: <Financereports /> },
    { url: "/report-dashboard/mis-reports", component: <Misreports /> },
    { url: "/report-dashboard/arrival-report", component: <ArrivalReport /> },
    { url: "/report-dashboard/logingLog-report", component: <LogingLog /> },
    {
      url: "/report-dashboard/agentwise-query-rep",
      component: <AgentWiseQueryRep />,
    },
    { url: "/report-dashboard/auditlog", component: <AuditLog /> },
    {
      url: "/report-dashboard/birthday-anniversary-rem",
      component: <BirthdayAnniversaryRem />,
    },
    {
      url: "/report-dashboard/invoice-turnover-report",
      component: <InvoiceTurnOverReport />,
    },
    {
      url: "/report-dashboard/citywise-booking-rep",
      component: <CityWiseBookingRep />,
    },
    {
      url: "/report-dashboard/client-wise-query-report",
      component: <ClientWiseQueryRep />,
    },
    {
      url: "/report-dashboard/daily-movement-chart-report",
      component: <DailyMovementChartRep />,
    },
    {
      url: "/report-dashboard/transfer-movement-chart-report",
      component: <TransferMovementChartRep />,
    },
    {
      url: "/report-dashboard/tour-wise-service-status-report",
      component: <TourWiseServiceStatusRep />,
    },
    {
      url: "/report-dashboard/feedback-report-mobile",
      component: <FeedbackReportMobile />,
    },
    {
      url: "/report-dashboard/online-feedback-report",
      component: <OnlineFeedbackRep />,
    },
    {
      url: "/report-dashboard/file-wise-liability-report",
      component: <FileWiseLiabilityRep />,
    },
    {
      url: "/report-dashboard/fix-departure-report",
      component: <FixDepartureRep />,
    },
    { url: "/report-dashboard/guest-list-report", component: <GuestListRep /> },
    {
      url: "/report-dashboard/guide-allocation-report",
      component: <GuideAllocationRep />,
    },
    {
      url: "/report-dashboard/hotel-booking-report",
      component: <HotelBookingRep />,
    },
    {
      url: "/report-dashboard/hotel-chain-report",
      component: <HotelChainRep />,
    },
    {
      url: "/report-dashboard/hotel-room-night-analysis-report",
      component: <HotelRoomNightAnalRep />,
    },
    {
      url: "/report-dashboard/hotel-wait-list-report",
      component: <HotelWaitListRep />,
    },
    {
      url: "/report-dashboard/incoming-tour-status-report",
      component: <IncomingTourStatusRep />,
    },
    {
      url: "/report-dashboard/news-letter-report",
      component: <NewsLetterRep />,
    },
    { url: "/report-dashboard/login-report", component: <LoginRep /> },
    { url: "/report-dashboard/sales-report", component: <SalesRep /> },
    {
      url: "/report-dashboard/tour-extension-report",
      component: <TourExtensionRep />,
    },
    {
      url: "/report-dashboard/tour-registration-report",
      component: <TourRegistrationRep />,
    },
    {
      url: "/report-dashboard/turnover-statement-perform-coutry-wise-report",
      component: <TurnoverStatementProformCountryWise />,
    },
    {
      url: "/report-dashboard/turnover-statement-perform-executive-wise-report",
      component: <TurnoverStatementProformExecutiveWise />,
    },
    {
      url: "/report-dashboard/user-wise-report",
      component: <UserWiseQueryRep />,
    },
    {
      url: "/report-dashboard/luxury-train-report",
      component: <LuxuryTrainRep />,
    },
  ];

  return (
    <>
      <Routes>
        <Route path="/query/Proposals" element={<Proposals />} />
        <Route element={<MainLayout />}>
          {allroutes.map((data, i) => (
            <Route
              key={i}
              path={data?.url}
              element={<Protected>{data.component}</Protected>}
            />
          ))}
          <Route path="/query" element={<QueryDashboard />}>
            <Route index element={<CreateQuery />} />
            {queryRoutes.map((data, i) => (
              <Route
                key={i}
                path={data?.url}
                element={<Protected>{data.component}</Protected>}
              />
            ))}
          </Route>

          <Route path="/report-dashboard" element={<ReportDashboard />}>
            <Route index element={<AgentTurnOverRep />} />
            {reportRoutes.map((data, i) => (
              <Route
                key={i}
                path={data?.url}
                element={<Protected>{data.component}</Protected>}
              />
            ))}
          </Route>
        </Route>
      </Routes>
      <Setting />
      <ScrollToTop />
    </>
  );
};

function MainLayout() {
  const { menuToggle, sidebariconHover } = useContext(ThemeContext);
  return (
    <div
      id="main-wrapper"
      className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${menuToggle ? "menu-toggle" : ""
        }`}
    >
      {/* <GlobalTooltip /> */}
      <Nav />
      <div
        className="content-body"
        style={{ minHeight: window.screen.height - 45 }}
      >
        <div className="container-fluid cardPadding">
          <Outlet />
          <NotificationComponent />
        </div>
      </div>

      <Footer />
    </div>
  );
}
export default Markup;
