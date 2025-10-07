import React, { useContext, useState } from 'react'
import "./ReportSideBar.css"
import AgentTurnoverReport from "../../../../../images/report/AgentTurnoverReport..svg"
import preferencered from "../../../../../images/svg/preferencered.svg"
import AgentWiseQueryReport from "../../../../../images/report/AgentWiseQueryReport.svg"
import ArrivalReport from "../../../../../images/report/Arrival Report.svg"
import audit from "../../../../../images/report/audit.svg"
import BirthdayAnniversaryReminderReport from "../../../../../images/report/Birthday & Anniversary Reminder Report.svg"
import CityWiseBookingReport from "../../../../../images/report/City Wise Booking Report.svg"
import ClientWiseQuery from "../../../../../images/report/Client Wise Query.svg"
import TransferMovementChartReport from "../../../../../images/report/Transfer Movement Chart Report.svg"
import DailyMovementChartReport from "../../../../../images/report/Daily Movement Chart Report.svg"
import TourWiseServiceStatusReport from "../../../../../images/report/Tour Wise Service Status Report.svg"
import FeedbackReportMobile from "../../../../../images/report/Feedback Report Mobile.svg"
import OnlineFeedbackReport from "../../../../../images/report/Online Feedback Report.svg"
import FileWiseLiabilityReport from "../../../../../images/report/File Wise Liability Report.svg"
import GuestListReport from "../../../../../images/report/Guest List Report.svg"
import GuideAllocationReport from "../../../../../images/report/Guide Allocation Report.svg"
import HotelBookingReport from "../../../../../images/report/Hotel Booking Report.svg"
import HotelChainReport from "../../../../../images/report/Hotel Chain Report.svg"
import HotelRoomNightAnalysisReport from "../../../../../images/report/Hotel Room Night Analysis Report.svg"
import HotelWaitListReport from "../../../../../images/report/Hotel Wait List Report.svg"
import IncomingTourStatusReport from "../../../../../images/report/Incoming Tour Status Report.svg"
import LoginReport from "../../../../../images/report/Login Report.svg"
import NewsLetterReport from "../../../../../images/report/News Letter Report.svg"
import TourExtensionReport from "../../../../../images/report/Tour Extension Report.svg"
import TourRegistrationReport from "../../../../../images/report/Tour Registration Report.svg"
import TurnoverStatementCountryWise from "../../../../../images/report/Turnover Statement Country Wise.svg"
import TurnoverStatementExecutiveWise from "../../../../../images/report/Turnover Statement Executive Wise.svg"
import UserWiseQueryReport from "../../../../../images/report/User Wise Query Report.svg"
import LuxuryTrainReport from "../../../../../images/report/Luxury Train Report.svg"
// import SalesReport from "../../../../../images/report/Sales Report.svg"
import { MyContext } from '../ReportDashboardContext';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Height } from '@mui/icons-material'
// import 



function ReportDashboard() {

    const { reportShow, setReportShow } = useContext(MyContext);
    const [activeReport, setActiveReport] = useState("");
    const [isExpanded, setIsExpanded] = useState({
        first: false,
        second: false,
        third: false,
        four: false,
    })

    const navigate = useNavigate();

    function handleReportShow() {

        setReportShow(!reportShow)
    }

    function handleNavigateReport(link, event) {
        // event.preventDefault();
        navigate(link)
        setActiveReport(link)

    }
    const salesReports = [

        { img: <img src={AgentTurnoverReport} style={{ width: "1.25rem", height: "1.25rem" }} alt="Agent Turnover Report " />, name: "Agent Turnover Report", path: "/report-dashboard" },
        { img: <img src={ArrivalReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Arrival Report", path: "/report-dashboard/arrival-report" },
        { img: <img src={AgentWiseQueryReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Agent Wise Query Report", path: "/report-dashboard/agentwise-query-rep" },
        { img: <img src={audit} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Audit Log", path: "/report-dashboard/auditlog" },
        { img: <img src={BirthdayAnniversaryReminderReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Birthday & Anniversary Reminder Rep", path: "/report-dashboard/birthday-anniversary-rem" },
        { img: <img src={audit} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Loging Log", path: "/report-dashboard/logingLog-report" },
    ];
    const OperationReports = [

        { img: <img src={CityWiseBookingReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "City Wise Booking Report", path: "/report-dashboard/citywise-booking-rep" },
        { img: <img src={ClientWiseQuery} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Client Wise Querry", path: "/report-dashboard/client-wise-query-report" },
        { img: <img src={DailyMovementChartReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Daily Movemnt Chart", path: "/report-dashboard/daily-movement-chart-report" },
        { img: <img src={TransferMovementChartReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Transfer Movement Chart Report", path: "/report-dashboard/transfer-movement-chart-report" },
        { img: <img src={TourWiseServiceStatusReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Tour Wise Service Status Report", path: "/report-dashboard/tour-wise-service-status-report" },
    ];
    const FinanceReports = [

        { img: <img src={FeedbackReportMobile} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Feedback Report Mobile", path: "/report-dashboard/feedback-report-mobile" },
        { img: <img src={OnlineFeedbackReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Online Feedback Report", path: "/report-dashboard/online-feedback-report" },
        { img: <img src={FeedbackReportMobile} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "File Wise Liability Report", path: "/report-dashboard/file-wise-liability-report" },
        { img: <img src={FileWiseLiabilityReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Fixed Departure Report", path: "/report-dashboard/fix-departure-report" },
        { img: <img src={GuestListReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Guest List Report", path: "/report-dashboard/guest-list-report" },
        { img: <img src={GuideAllocationReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Guide Allocation Report", path: "/report-dashboard/guide-allocation-report" },
        { img: <img src={HotelBookingReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Hotel Booking Report", path: "/report-dashboard/hotel-booking-report" },
        { img: <img src={HotelChainReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Hotel Chain Report", path: "/report-dashboard/hotel-chain-report" },
        { img: <img src={HotelRoomNightAnalysisReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Hotel Room Night Analysis Report", path: "/report-dashboard/hotel-room-night-analysis-report" },
        { img: <img src={HotelWaitListReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Hotel Wait List Report", path: "/report-dashboard/hotel-wait-list-report" },
        { img: <img src={IncomingTourStatusReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Incoming Tour Status Report", path: "/report-dashboard/incoming-tour-status-report" },
    ];
    const MisReports = [

        { img: <img src={LoginReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Login Report", path: "/report-dashboard/login-report" },
        { img: <img src={NewsLetterReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "News Letter Report", path: "/report-dashboard/news-letter-report" },
        { img: <img src={NewsLetterReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Sales Report", path: "/report-dashboard/sales-report" },
        { img: <img src={TourExtensionReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Tour Extension Report", path: "/report-dashboard/tour-extension-report" },
        { img: <img src={TourRegistrationReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Tour Registration Report", path: "/report-dashboard/tour-registration-report" },
        { img: <img src={TurnoverStatementCountryWise} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Turnover Statement Country Wise", path: "/report-dashboard/turnover-statement-perform-coutry-wise-report" },
        { img: <img src={TurnoverStatementExecutiveWise} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Turnover Statement Executive Wise", path: "/report-dashboard/turnover-statement-perform-executive-wise-report" },
        { img: <img src={UserWiseQueryReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "User Wise Query Report", path: "/report-dashboard/user-wise-report" },
        { img: <img src={LuxuryTrainReport} style={{ width: "1.25rem", height: "1.25rem" }} />, name: "Luxury Train Report", path: "/report-dashboard/luxury-train-report" },
    ];

    return (
        <> <div

            onClick={handleReportShow}
        >
            <img
                src={preferencered}
                style={{
                    height: "25px",
                    width: "auto",
                    cursor: "pointer",
                    paddingTop: "5px",
                }}
                className="pb-2"
                alt="Preference Red Icon"
            />
        </div>




            <div className="reportDashboard-main">
                <div className={reportShow ? "reportDashboard-sidebar" : "reportDashboard-sidebar-rmv"}>
                    <div className="reportDashboard-sidebar-crss">
                        <svg className='reportDashboard-sidebar-crss-mrk' onClick={handleReportShow} xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" width="20" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </div>

                    <div className="reportDashboard-sidebar-report">
                        <div className={`reportDashboard-sidebar-report-icn-txt  d-flex justify-content-between align-items-center ${activeReport === "/report-dashboard/sales-reports" ? "active" : ""} `}
                            onClick={() => setIsExpanded({ ...isExpanded, first: !isExpanded?.first })} >
                            <div className="">
                                <img src={AgentTurnoverReport} alt="agentTurnOverRep" className='agentTurnOverRep' />
                                <a className='reportDashboard-sidebar-report-txt'>Sales Reports</a> </div>
                            <div className="">
                                <span className="toggle-icon  pe-2 ">{isExpanded?.first ? "▼" : "▶"}</span> </div>
                        </div>
                        {isExpanded?.first && (
                            <div className="reportDashboard-sidebar-submenu ">
                                {salesReports.map((report) => (
                                    <div
                                        key={report.path}
                                        className={`reportDashboard-sidebar-report-icn-txt  ps-4 ${activeReport === report.path ? "active" : ""}`}
                                        onClick={() => handleNavigateReport(report.path)}
                                    >
                                        {report.img}
                                        <a className='reportDashboard-sidebar-report-txt'>{report.name}</a>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="reportDashboard-sidebar-report-icn-txt d-flex justify-content-between align-items-center" onClick={() => setIsExpanded({ ...isExpanded, second: !isExpanded?.second })} >
                            <div className="">
                                <img src={AgentTurnoverReport} alt="agentTurnOverRep" className='agentTurnOverRep' />
                                <a className='reportDashboard-sidebar-report-txt'>Operation Reports</a></div>
                            <div className="">
                                <span className="toggle-icon  pe-2">{isExpanded?.second ? "▼" : "▶"}</span></div>
                        </div>
                        {isExpanded?.second && (
                            <div className="reportDashboard-sidebar-submenu ">
                                {OperationReports.map((report) => (
                                    <div
                                        key={report.path}
                                        className={`reportDashboard-sidebar-report-icn-txt ps-4 ${activeReport === report.path ? "active" : ""}`}
                                        onClick={() => handleNavigateReport(report.path)}
                                    >
                                        {report.img}<a className='reportDashboard-sidebar-report-txt'>{report.name}</a>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="reportDashboard-sidebar-report-icn-txt d-flex justify-content-between align-items-center" onClick={() => setIsExpanded({ ...isExpanded, third: !isExpanded?.third })}>
                            <div className="">
                                <img src={AgentTurnoverReport} alt="agentTurnOverRep" className='agentTurnOverRep' />
                                <a className='reportDashboard-sidebar-report-txt'>Finance Reports</a></div>
                            <div className="">
                                <span className="toggle-icon pe-2 ">{isExpanded?.third ? "▼" : "▶"}</span></div>
                        </div>
                        {isExpanded?.third && (
                            <div className="reportDashboard-sidebar-submenu ">
                                {FinanceReports.map((report) => (
                                    <div
                                        key={report.path}
                                        className={`reportDashboard-sidebar-report-icn-txt ps-4 ${activeReport === report.path ? "active" : ""}`}
                                        onClick={() => handleNavigateReport(report.path)}
                                    >
                                        {report.img}<a className='reportDashboard-sidebar-report-txt'>{report.name}</a>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="reportDashboard-sidebar-report-icn-txt d-flex justify-content-between align-items-center" onClick={() => setIsExpanded({ ...isExpanded, four: !isExpanded?.four })}>
                            <div className="">
                                <img src={AgentTurnoverReport} alt="agentTurnOverRep" className='agentTurnOverRep' />
                                <a className='reportDashboard-sidebar-report-txt'>MIS Reports</a></div>
                            <div className="">
                                <span className="toggle-icon  pe-2 ">{isExpanded?.four ? "▼" : "▶"}</span></div>
                        </div>
                        {
                            isExpanded?.four && (
                                <div className="reportDashboard-sidebar-submenu">
                                    {
                                        MisReports.map((report) => (
                                            <div
                                                key={report.path}
                                                className={`reportDashboard-sidebar-report-icn-txt ps-4 ${activeReport === report.path ? "active" : ""}`}
                                                onClick={() => handleNavigateReport(report.path)}
                                            >
                                                {report.img}<a className='reportDashboard-sidebar-report-txt'>{report.name}</a>
                                            </div>

                                        ))
                                    }

                                </div>
                            )
                        }

                        {/* add single row for invoice-turn-over-report */}
                        <div
                            className={`reportDashboard-sidebar-report-icn-txt ${activeReport === "/report-dashboard/invoice-turnover-report" ? "active" : ""}`}
                            onClick={() => handleNavigateReport("/report-dashboard/invoice-turnover-report")}
                        >
                            <img src={AgentTurnoverReport} alt="agentTurnOverRep" className='agentTurnOverRep' /><a className='reportDashboard-sidebar-report-txt'>Invoice Turn Over Report</a>
                        </div>


                    </div>
                </div>
                <div className={reportShow ? "reportDashboard-with-sidebar" : "reportDashboard-withot-sidebar"}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default ReportDashboard