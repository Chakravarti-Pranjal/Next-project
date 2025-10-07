import React, { useState, useEffect } from "react";
import { axiosOther } from "../../../../http/axios_base_url";
import PerfectScrollbar from "react-perfect-scrollbar";
import styles from "../../../pages/query-dashboard/quotation-third/quotationThird.module.css";

function ToDoList() {
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodoList = async () => {
    try {
      const { data } = await axiosOther.post("todolist");
      // console.log(data, "sdkjfhhdj");

      if (data.Status == 1) {
        setTodoList(data?.Data);
      } else {
        setError("Failed to retrieve todo list");
      }
    } catch (err) {
      setError("Error fetching todo list");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoList();
  }, []);

  return (
    <PerfectScrollbar
    // options={{ suppressScrollY: true }}
    >
      <div className="">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <table className={`${styles.table}`}>
            <thead >
              <tr>
                {/* <th style={{ fontSize: "12px" }}>Sr No.</th> */}
                <th style={{ fontSize: "12px" }}>Query <br /> Id</th>
                <th style={{ fontSize: "12px" }}>Date/Time</th>
                <th style={{ fontSize: "12px" }}>Assigned To</th>
                <th style={{ fontSize: "12px" }}>Task <br /> Title</th>
                <th style={{ fontSize: "12px" }}>Service <br /> Type</th>
                {/* <th style={{ fontSize: "12px" }}>Remark</th> */}
                <th style={{ fontSize: "12px" }}>Status</th>
                {/* <th style={{ fontSize: "12px" }}>Completed <br /> Date</th> */}
              </tr>
            </thead>
            <tbody className={styles.bgTable}>
              {todoList?.length > 0 ? (
                todoList?.map((item, idx) => (
                  <tr key={item.Id}>
                    {/* <td>{idx + 1}</td> */}
                    <td>
                      <a
                        href="#"
                        style={{ color: "#45b558", textDecoration: "none" }}
                      >
                        <span>{item.QueryId}</span>
                      </a>
                    </td>
                    <td> <span>{item.TaskDate} <br />{item.TaskTime} </span> </td>
                    <td> <span>{item.AssignTo}</span> </td>
                    <td> <span>{item.TaskTitle}</span> </td>
                    <td> <span>{item.ServiceType}</span> </td>
                    {/* <td><span>{item.Remark || "N/A"}</span></td> */}
                    <td>
                      <span
                        // className={`badge px-2 py-1 rounded-full text-xs ${item.Status === "In Progress"
                        //   ? "bg-yellow-100 text-yellow-800"
                        //   : "bg-green-100 text-green-800"
                        //   }`}
                        className="badge badge-success light badge"
                      >
                        <span>{item.Status}</span>
                      </span>
                    </td>
                    {/* <td>
                      <span>{item.CompletedDate ? `${item.CompletedDate} ${item.CompletedTime}` : "N/A"}</span>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-2 text-center text-sm text-gray-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </PerfectScrollbar>
  );
}

export default ToDoList;



// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Modal } from "react-bootstrap";
// import { nanoid } from "nanoid";
// import swal from "sweetalert";
// import PerfectScrollbar from "react-perfect-scrollbar";
// import { Dropdown, Nav, Tab } from "react-bootstrap";

// // import PageTitle from "../layouts/PageTitle";
// // import pic1 from "./../../images/profile/small/pic1.jpg";
// // import Editable from "./Editable";

// const tableList = [
//   {
//     id: "1",
//     name: "DB24-25/002311",
//     department: "Architect",
//     gender: "Male",
//     education: "M.COM., M.B.A",
//     mobile: "12345 67890",
//     email: "info1@example.com",
//   },
//   {
//     id: "2",
//     name: "Gloria Little",
//     department: " Administrator",
//     gender: "Male",
//     education: "BTech, MTech",
//     mobile: "09876 54321",
//     email: "info2@example.com",
//   },
//   {
//     id: "3",
//     name: "Bradley Greer",
//     department: "Software Engineer",
//     gender: "Male",
//     education: "B.CA M.CA",
//     mobile: "98765 67890",
//     email: "info3@example.com",
//   },
//   {
//     id: "4",
//     name: "Gloria Little",
//     department: " Administrator",
//     gender: "Male",
//     education: "BTech, MTech",
//     mobile: "09876 54321",
//     email: "info4@example.com",
//   },
//   {
//     id: "5",
//     name: "Tiger Nixon",
//     department: "Architect",
//     gender: "Male",
//     education: "M.COM., M.B.A",
//     mobile: "12345 67890",
//     email: "info5@example.com",
//   },
//   {
//     id: "6",
//     name: "Bradley Greer",
//     department: "Software Engineer",
//     gender: "Male",
//     education: "B.CA M.CA",
//     mobile: "98765 67890",
//     email: "info6@example.com",
//   },
// ];

// const Todo = () => {
//   return (
//     <>
//       {/* <PageTitle activeMenu="Table" motherMenu="Post" /> */}
//       <div className="card-body">
//         <PerfectScrollbar
//           // style={{ height: "40vh" }}
//           id="DZ_W_Todo4"
//           className="widget-media dlab-scroll height370 ps ps--active-y"
//         >
//           <ul className="timeline">
//             <li>
//               <div className="timeline-panel">
//                 <div className="form-check custom-checkbox checkbox-success check-lg me-3">
//                   <input
//                     type="checkbox"
//                     className="form-check-input "
//                     id="customCheckBox1"
//                     required=""
//                   />
//                   <label
//                     className="form-check-label"
//                     htmlFor="customCheckBox1"
//                   ></label>
//                 </div>
//                 <div className="media-body d-flex gap-4">
//                   <div>
//                     <p className="mb-0">DB24-25/002311</p>
//                     <small className="text-muted">10-11-2024 - 10:15 PM</small>
//                   </div>
//                   <div>
//                     <p className="text-success">Internal Note</p>
//                   </div>
//                 </div>
//                 <Dropdown className="dropdown me-4">
//                   <Dropdown.Toggle
//                     variant="primary light"
//                     className=" i-false p-0 sharp"
//                   >
//                     <svg
//                       width="18px"
//                       height="18px"
//                       viewBox="0 0 24 24"
//                       version="1.1"
//                     >
//                       <g
//                         stroke="none"
//                         strokeWidth="1"
//                         fill="none"
//                         fillRule="evenodd"
//                       >
//                         <rect x="0" y="0" width="24" height="24" />
//                         <circle fill="#000000" cx="5" cy="12" r="2" />
//                         <circle fill="#000000" cx="12" cy="12" r="2" />
//                         <circle fill="#000000" cx="19" cy="12" r="2" />
//                       </g>
//                     </svg>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu className="dropdown-menu">
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Edit
//                     </Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Delete
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//             </li>
//             <li>
//               <div className="timeline-panel">
//                 <div className="form-check custom-checkbox checkbox-success check-lg me-3">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="customCheckBox1"
//                     required=""
//                   />
//                   <label
//                     className="form-check-label"
//                     htmlFor="customCheckBox1"
//                   ></label>
//                 </div>
//                 <div className="media-body d-flex gap-4">
//                   <div>
//                     <p className="mb-0">DB24-25/002311</p>
//                     <small className="text-muted">10-11-2024 - 10:15 PM</small>
//                   </div>
//                   <div>
//                     <p className="text-success">Internal Note</p>
//                   </div>
//                 </div>
//                 <Dropdown className="dropdown me-4">
//                   <Dropdown.Toggle
//                     variant="primary light"
//                     className=" i-false p-0 sharp"
//                   >
//                     <svg
//                       width="18px"
//                       height="18px"
//                       viewBox="0 0 24 24"
//                       version="1.1"
//                     >
//                       <g
//                         stroke="none"
//                         strokeWidth="1"
//                         fill="none"
//                         fillRule="evenodd"
//                       >
//                         <rect x="0" y="0" width="24" height="24" />
//                         <circle fill="#000000" cx="5" cy="12" r="2" />
//                         <circle fill="#000000" cx="12" cy="12" r="2" />
//                         <circle fill="#000000" cx="19" cy="12" r="2" />
//                       </g>
//                     </svg>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu className="dropdown-menu">
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Edit
//                     </Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Delete
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//             </li>
//             <li>
//               <div className="timeline-panel">
//                 <div className="form-check custom-checkbox checkbox-success check-lg me-3">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="customCheckBox1"
//                     required=""
//                   />
//                   <label
//                     className="form-check-label"
//                     htmlFor="customCheckBox1"
//                   ></label>
//                 </div>
//                 <div className="media-body d-flex gap-4">
//                   <div>
//                     <p className="mb-0">DB24-25/002311</p>
//                     <small className="text-muted">10-11-2024 - 10:15 PM</small>
//                   </div>
//                   <div>
//                     <p className="text-success">Internal Note</p>
//                   </div>
//                 </div>
//                 <Dropdown className="dropdown me-4">
//                   <Dropdown.Toggle
//                     variant="primary light"
//                     className=" i-false p-0 sharp"
//                   >
//                     <svg
//                       width="18px"
//                       height="18px"
//                       viewBox="0 0 24 24"
//                       version="1.1"
//                     >
//                       <g
//                         stroke="none"
//                         strokeWidth="1"
//                         fill="none"
//                         fillRule="evenodd"
//                       >
//                         <rect x="0" y="0" width="24" height="24" />
//                         <circle fill="#000000" cx="5" cy="12" r="2" />
//                         <circle fill="#000000" cx="12" cy="12" r="2" />
//                         <circle fill="#000000" cx="19" cy="12" r="2" />
//                       </g>
//                     </svg>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu className="dropdown-menu">
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Edit
//                     </Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Delete
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//             </li>
//             <li>
//               <div className="timeline-panel">
//                 <div className="form-check custom-checkbox checkbox-success check-lg me-3">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="customCheckBox1"
//                     required=""
//                   />
//                   <label
//                     className="form-check-label"
//                     htmlFor="customCheckBox1"
//                   ></label>
//                 </div>
//                 <div className="media-body d-flex gap-4">
//                   <div>
//                     <p className="mb-0">DB24-25/002311</p>
//                     <small className="text-muted">10-11-2024 - 10:15 PM</small>
//                   </div>
//                   <div>
//                     <p className="text-success">Internal Note</p>
//                   </div>
//                 </div>
//                 <Dropdown className="dropdown me-4">
//                   <Dropdown.Toggle
//                     variant="primary light"
//                     className=" i-false p-0 sharp"
//                   >
//                     <svg
//                       width="18px"
//                       height="18px"
//                       viewBox="0 0 24 24"
//                       version="1.1"
//                     >
//                       <g
//                         stroke="none"
//                         strokeWidth="1"
//                         fill="none"
//                         fillRule="evenodd"
//                       >
//                         <rect x="0" y="0" width="24" height="24" />
//                         <circle fill="#000000" cx="5" cy="12" r="2" />
//                         <circle fill="#000000" cx="12" cy="12" r="2" />
//                         <circle fill="#000000" cx="19" cy="12" r="2" />
//                       </g>
//                     </svg>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu className="dropdown-menu">
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Edit
//                     </Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Delete
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//             </li>
//             <li>
//               <div className="timeline-panel">
//                 <div className="form-check custom-checkbox checkbox-success check-lg me-3">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="customCheckBox1"
//                     required=""
//                   />
//                   <label
//                     className="form-check-label"
//                     htmlFor="customCheckBox1"
//                   ></label>
//                 </div>
//                 <div className="media-body d-flex gap-4">
//                   <div>
//                     <p className="mb-0">DB24-25/002311</p>
//                     <small className="text-muted">10-11-2024 - 10:15 PM</small>
//                   </div>
//                   <div>
//                     <p className="text-success">Internal Note</p>
//                   </div>
//                 </div>
//                 <Dropdown className="dropdown me-4">
//                   <Dropdown.Toggle
//                     variant="primary light"
//                     className=" i-false p-0 sharp"
//                   >
//                     <svg
//                       width="18px"
//                       height="18px"
//                       viewBox="0 0 24 24"
//                       version="1.1"
//                     >
//                       <g
//                         stroke="none"
//                         strokeWidth="1"
//                         fill="none"
//                         fillRule="evenodd"
//                       >
//                         <rect x="0" y="0" width="24" height="24" />
//                         <circle fill="#000000" cx="5" cy="12" r="2" />
//                         <circle fill="#000000" cx="12" cy="12" r="2" />
//                         <circle fill="#000000" cx="19" cy="12" r="2" />
//                       </g>
//                     </svg>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu className="dropdown-menu">
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Edit
//                     </Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Delete
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//             </li>
//             <li>
//               <div className="timeline-panel">
//                 <div className="form-check custom-checkbox checkbox-success check-lg me-3">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="customCheckBox1"
//                     required=""
//                   />
//                   <label
//                     className="form-check-label"
//                     htmlFor="customCheckBox1"
//                   ></label>
//                 </div>
//                 <div className="media-body d-flex gap-4">
//                   <div>
//                     <p className="mb-0">DB24-25/002311</p>
//                     <small className="text-muted">10-11-2024 - 10:15 PM</small>
//                   </div>
//                   <div>
//                     <p className="text-success">Internal Note</p>
//                   </div>
//                 </div>
//                 <Dropdown className="dropdown me-4">
//                   <Dropdown.Toggle
//                     variant="primary light"
//                     className=" i-false p-0 sharp"
//                   >
//                     <svg
//                       width="18px"
//                       height="18px"
//                       viewBox="0 0 24 24"
//                       version="1.1"
//                     >
//                       <g
//                         stroke="none"
//                         strokeWidth="1"
//                         fill="none"
//                         fillRule="evenodd"
//                       >
//                         <rect x="0" y="0" width="24" height="24" />
//                         <circle fill="#000000" cx="5" cy="12" r="2" />
//                         <circle fill="#000000" cx="12" cy="12" r="2" />
//                         <circle fill="#000000" cx="19" cy="12" r="2" />
//                       </g>
//                     </svg>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu className="dropdown-menu">
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Edit
//                     </Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Delete
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//             </li>
//             <li>
//               <div className="timeline-panel">
//                 <div className="form-check custom-checkbox checkbox-success check-lg me-3">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="customCheckBox1"
//                     required=""
//                   />
//                   <label
//                     className="form-check-label"
//                     htmlFor="customCheckBox1"
//                   ></label>
//                 </div>
//                 <div className="media-body d-flex gap-4">
//                   <div>
//                     <p className="mb-0">DB24-25/002311</p>
//                     <small className="text-muted">10-11-2024 - 10:15 PM</small>
//                   </div>
//                   <div>
//                     <p className="text-success">Internal Note</p>
//                   </div>
//                 </div>
//                 <Dropdown className="dropdown me-4">
//                   <Dropdown.Toggle
//                     variant="primary light"
//                     className=" i-false p-0 sharp"
//                   >
//                     <svg
//                       width="18px"
//                       height="18px"
//                       viewBox="0 0 24 24"
//                       version="1.1"
//                     >
//                       <g
//                         stroke="none"
//                         strokeWidth="1"
//                         fill="none"
//                         fillRule="evenodd"
//                       >
//                         <rect x="0" y="0" width="24" height="24" />
//                         <circle fill="#000000" cx="5" cy="12" r="2" />
//                         <circle fill="#000000" cx="12" cy="12" r="2" />
//                         <circle fill="#000000" cx="19" cy="12" r="2" />
//                       </g>
//                     </svg>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu className="dropdown-menu">
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Edit
//                     </Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" to="/widget-basic">
//                       Delete
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//             </li>
//           </ul>
//         </PerfectScrollbar>
//       </div>
//     </>
//   );
// };
// export default Todo;
