
import React, { useState, useEffect, useContext } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab, Nav, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url";
import { ThemeContext } from "../../../context/ThemeContext.jsx";
import ReservationStats from "./Dashboard/ReservationStats";
import PerfectScrollbar from "react-perfect-scrollbar";
import TodoList from "./Dashboard/TodoList.jsx";
import MonthSale from "./Dashboard/MonthSale.jsx";
import TopDestination from "./Dashboard/TopDestination.jsx";
import Totalmet from "./Dashboard/Totalmet.jsx";
import Conversation from "./Dashboard/Conversation.jsx";
import Destination from "./Dashboard/Destination.jsx";
import Process from "./Dashboard/Process.jsx";
import moment from "moment";
import styles from "../../pages/query-dashboard/quotation-third/quotationThird.module.css";
import TopHotels from "./Dashboard/TopHotels.jsx";
import TopFTO from "./Dashboard/TopFTO.jsx";

const Home = () => {
  const { changeBackground } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [queryStatusList, setQueryStatusList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusType, setStatusType] = useState("confirm");

  // useEffect(() => {
  //   changeBackground({ value: "dark", label: "Dark" });
  // }, []);

  const handleStatusClick = (filterType) => {
    let filterData = {};

    switch (filterType) {
      case 'today':
        filterData = {
          QueryDate: moment().format('YYYY-MM-DD'),
          // endDate: moment().format('YYYY-MM-DD')
        };
        break;
      case 'yesterday':
        filterData = {
          QueryDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          // endDate: moment().subtract(1, 'days').format('YYYY-MM-DD')
        };
        break;
      case 'month':
        // const startOfMonth = moment().startOf('month').format('MM');
        // const endOfMonth = moment().endOf('month').format('YYYY-MM');
        const monthName = moment().format('MMMM'); // Full month name like "april"
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        filterData = {
          QueryMonth: capitalizedMonth,
          // endDate: endOfMonth
        };
        break;
      case 'year':
        const currentYear = moment().format('YYYY');
        filterData = {
          QueryYear: currentYear,
        };
        break;
      case 'confirmed':
        filterData = { status: 5 };
        break;
      default:
        filterData = {};
    }

    navigate('/queries', { state: { filter: filterData } });
  };

  // const getListDataToServer = async (id) => {
  //   setIsLoading(false);
  //   try {
  //     const { data } = await axiosOther.post("dashboard-status-count",{
  //       Status: id,
  //     });
  //     setIsLoading(false);
  //     setInitialList(data?.data);
  //     setFilterValue(data?.data);
  //     console.log("dataDataLis",data?.data);
  //   } catch (error) {
  //     console.log("error",error);
  //   }
  // };

  const getStatusCounts = async () => {
    try {
      const { data } = await axiosOther.post("dashboard-status-count");
      setQueryStatusList(data?.data);
      console.error("data", data);
    } catch (error) {
      console.error("Error fetching status counts:", error);
    }
  };

  useEffect(() => {
    getStatusCounts();
  }, []);

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="row">
          <div className="col-xl-12">
            <div className="d-flex booking-status-scroll gap-3 cardPaddingRemove">
              <div className="col-xl-2 col-sm-6">
                <div className="card booking" onClick={() => handleStatusClick('today')} style={{ cursor: 'pointer' }}>
                  <div className="card-body p-0">
                    <div className="booking-status d-flex align-items-center booking-status-padding">
                      <span>
                        <i className="fa-brands fa-slack"></i>
                      </span>
                      <div className="ms-2">
                        <h3 className="mb-0 font-w600">{queryStatusList?.["TodayQueries"] || "0"}</h3>
                        <p className="mb-0 text-nowrap">Today's Queries</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-sm-6">
                <div className="card booking" onClick={() => handleStatusClick('yesterday')} style={{ cursor: 'pointer' }}>
                  <div className="card-body p-0">
                    <div className="booking-status d-flex align-items-center booking-status-padding">
                      <span>
                        <i className="fa-brands fa-squarespace"></i>
                      </span>
                      <div className="ms-2">
                        <h3 className="mb-0 font-w600">{queryStatusList?.["YesterdayQueries"] || "0"}</h3>
                        <p className="mb-0 text-nowrap">
                          Yesterday's Queries
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-sm-6">
                <div className="card booking" onClick={() => handleStatusClick('month')} style={{ cursor: 'pointer' }}>
                  <div className="card-body p-0">
                    <div className="booking-status d-flex align-items-center booking-status-padding">
                      <span>
                        <i className="fa-solid fa-calendar-week"></i>
                      </span>
                      <div className="ms-2">
                        <h3 className="mb-0 font-w600">{queryStatusList?.["MonthlyQueries"] || "0"}</h3>
                        <p className="mb-0">
                          {moment().format("MMMM")} Queries
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-sm-6">
                <div className="card booking" onClick={() => handleStatusClick('confirmed')} style={{ cursor: 'pointer' }}>
                  <div className="card-body p-0">
                    <div className="booking-status d-flex align-items-center booking-status-padding">
                      <span>
                        <i className="fa-solid fa-calendar-check"></i>
                      </span>
                      <div className="ms-2">
                        <h3 className="mb-0 font-w600">{queryStatusList?.["ConfirmedQueries"] || "0"}</h3>
                        <p className="mb-0">Confirmed Queries</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-sm-6">
                <div className="card booking" onClick={() => handleStatusClick('year')} style={{ cursor: 'pointer' }}>
                  <div className="card-body p-0">
                    <div className="booking-status d-flex align-items-center booking-status-padding">
                      <span>
                        <i className="fa-solid fa-calendar-days"></i>
                      </span>
                      <div className="ms-2">
                        <h3 className="mb-0 font-w600">{queryStatusList?.["YearlyQueries"] || "0"}</h3>
                        <p className="mb-0">{moment().format("YYYY")} Queries</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-sm-6">
                <div className="card booking">
                  <div className="card-body p-0">
                    <div className="booking-status d-flex align-items-center booking-status-padding">
                      <span>
                        <i className="fa-solid fa-earth-americas"></i>
                      </span>
                      <div className="ms-2">
                        <h3 className="mb-0 font-w600">{queryStatusList?.["TotalPaxTravelling"] || "0"}</h3>
                        <p className="mb-0">Total Pax Travelling</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Rest of your existing code remains the same */}
          <div className="col-xl-12">
            <div className="row">
              <div className="col-xl-4 " style={{ height: "450px" }}>
                <div className="card p-2 p-lg-0">
                  <div className="card-header p-0 py-2 px-3 d-flex justify-content-between mb-2">
                    <h4 className="fs-15">TO DO List</h4>
                    <div className="row d-flex justify-content-between">
                      <div className="col-6">
                        {/* <select
                          name="Status"
                          id="status"
                          className="form-control form-control-sm"
                          style={{ width: "140px" }}
                        >
                          <option value="">All Assignee</option>
                        </select> */}
                      </div>
                      <div className="col-12">
                        <select
                          name="Status"
                          id="status"
                          className="form-control form-control-sm"
                          style={{ width: "140px" }}
                        >
                          <option value="">All TO DO</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <TodoList />
                  {/* <PerfectScrollbar>
                    <table className={`${styles.table}`}>
                      <thead>
                        <tr>
                          <th style={{ fontSize: "12px" }}>QUERY ID</th>
                          <th style={{ fontSize: "12px" }}>Date / Time</th>
                          <th style={{ fontSize: "12px" }}>Assign By</th>
                          <th style={{ fontSize: "12px" }}>Assign To</th>
                          <th style={{ fontSize: "12px" }}>Detail</th>
                          <th style={{ fontSize: "12px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody className={styles.bgTable}>
                        <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td><span>18-06-2025</span>/<span>12:00</span></td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-success light badge"><span>Assigned</span></span></td>
                        </tr>



                        <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td>
                            <span>18-06-2025</span>/<span>12:00</span>

                          </td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-danger light badge"><span>not Assigned</span></span></td>
                        </tr>

                        <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td><span>18-06-2025</span>/<span>12:00</span></td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-success light badge"><span>Assigned</span></span></td>
                        </tr> <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td><span>18-06-2025</span>/<span>12:00</span></td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-success light badge"><span>Assigned</span></span></td>
                        </tr> <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td><span>18-06-2025</span>/<span>12:00</span></td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-success light badge"><span>Assigned</span></span></td>
                        </tr> <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td><span>18-06-2025</span>/<span>12:00</span></td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-success light badge"><span>Assigned</span></span></td>
                        </tr> <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td><span>18-06-2025</span>/<span>12:00</span></td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-success light badge"><span>Assigned</span></span></td>
                        </tr> <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td><span>18-06-2025</span>/<span>12:00</span></td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-success light badge"><span>Assigned</span></span></td>
                        </tr> <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td><span>18-06-2025</span>/<span>12:00</span></td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-success light badge"><span>Assigned</span></span></td>
                        </tr> <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td><span>18-06-2025</span>/<span>12:00</span></td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-success light badge"><span>Assigned</span></span></td>
                        </tr> <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td><span>18-06-2025</span>/<span>12:00</span></td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-success light badge"><span>Assigned</span></span></td>
                        </tr>

                        <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td>
                            <span>18-06-2025</span>/<span>12:00</span>

                          </td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-danger light badge"><span>not Assigned</span></span></td>
                        </tr>

                        <tr>
                          <td>
                            <a
                              href="#"
                              style={{ color: "#45b558", textDecoration: "none" }}
                            >
                              <span>L/000030</span>
                            </a>
                          </td>
                          <td>
                            <span>18-06-2025</span>/<span>12:00</span>

                          </td>
                          <td><span>sourav kumar</span></td>
                          <td><span>Kabeer</span></td>
                          <td><span>Lead</span></td>
                          <td><span className="badge badge-danger light badge"><span>not Assigned</span></span></td>
                        </tr>


                      </tbody>
                    </table>
                  </PerfectScrollbar> */}

                </div>
              </div>
              <div className="col-xl-4  " style={{ height: "450px" }}>
                <div className="card bg-transprent p-0">
                  <ReservationStats />
                </div>
              </div>
              <div className="col-xl-4 " style={{ height: "450px" }}>
                <div className="card p-0">
                  <div className="card-header p-0 py-2 mb-0 px-3 d-flex justify-content-between">
                    <h4 className="fs-15 pb-1">Top 5 Destinations</h4>
                  </div>
                  <MonthSale />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12">
            <div className="row">
              <div className="col-xl-4 h-75">
                <div className="card p-0">
                  <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                    <h4 className="fs-15">
                      {moment().format("MMMM")} Sales Data
                    </h4>
                  </div>
                  <TopDestination />
                </div>
              </div>
              <div className="col-xl-4 h-75">
                <div className="card p-0">
                  <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                    <h4 className="fs-15"> Top 5 FTO</h4>
                    {/* <select
                      name="Status"
                      id="status"
                      className="form-control form-control-sm"
                      style={{ width: "140px" }}
                    >
                      <option value="">Confirmed</option>
                      <option value="">Recieved</option>
                    </select> */}
                    <select
                      name="Status"
                      id="status"
                      className="form-control form-control-sm"
                      style={{ width: "140px" }}
                      value={statusType} // Bind to state
                      onChange={(e) => setStatusType(e.target.value)} // Update state on change
                    >
                      <option value="confirm">Confirmed</option> {/* Use distinct values */}
                      <option value="created">Received</option> {/* Use distinct values */}
                    </select>
                  </div>
                  {/* <Totalmet /> */}
                  {/* <TopFTO /> */}
                  <TopFTO statusType={statusType} setStatusType={setStatusType} />
                </div>
              </div>
              <div className="col-xl-4 h-75">
                <div className="card p-0">
                  <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                    {/* <h4 className="fs-15">Query Conversions</h4> */}
                    <h4 className="fs-15">Confirmed Queries</h4>
                  </div>
                  <Conversation />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12">
            <div className="row">
              <div className="col-xl-4 h-75">
                <div className="card p-0">
                  <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                    <h4 className="fs-15">Destination Chart</h4>
                  </div>
                  <Destination />
                </div>
              </div>
              <div className="col-xl-4 h-75">
                <div className="card p-0">
                  <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                    <h4 className="fs-15">Top 5 Hotels</h4>
                  </div>
                  <TopHotels />
                </div>
              </div>
              <div className="col-xl-4 h-75">
                <div className="card p-0">
                  <div className="card-header p-0 py-2 px-3 d-flex justify-content-between">
                    <h4 className="fs-15">Process Chart</h4>
                  </div>
                  <Process />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;