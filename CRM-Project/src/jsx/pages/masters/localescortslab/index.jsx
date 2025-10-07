import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";

const paxSlabInitialValue = {
  id: "",
  StartPax: "0",
  EndPax: "0",
  Fee: "0",
  Default: "Yes",
  PaxSlab: "FIT",
  Status: "Active",
};

const Localescortslab = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(paxSlabInitialValue);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("localescortslab");
      // console.log("API Response:", data);
      setInitialList(data?.Data || []);
      setFilterValue(data?.Data || []);
    } catch (error) {
      console.log("pax-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.StartPax?.toString()?.includes(filterInput?.toLowerCase()) ||
        data?.EndPax?.toString()?.includes(filterInput?.toLowerCase()) ||
        data?.Fee?.toString()?.includes(filterInput?.toLowerCase()) ||
        data?.Default?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.PaxSlab?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput, initialList]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let Id = null;
    try {
      const token = localStorage.getItem("token");
      const persed = JSON.parse(token);
      Id = persed?.companyKey;
    } catch (error) {
      console.log(error, "error");
    }

    try {
      const endpoint = isEditing ? "updatelocalescortslab" : "addlocalescortslab";

      const payload = {
        ...formValue,
        CompanyId: Id,
        // ...(isEditing && { UpdatedBy: "1" }  : { AddedBy: "1" })
        ...(isEditing ? { UpdatedBy: "1" } : { AddedBy: "1" })
      };

      const { data } = await axiosOther.post(endpoint, payload);
      if (data?.Status === 1) {
        getListDataToServer();
        setIsEditing(false);
        setFormValue(paxSlabInitialValue);
        notifySuccess(data?.message || data?.Message);
      } else {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
    }
  };


  const handleEdit = (value) => {
    setFormValue({
      id: value?.Id,
      StartPax: value?.StartPax,
      EndPax: value?.EndPax,
      Fee: value?.Fee,
      Default: value?.Default,
      PaxSlab: value?.PaxSlab,
      Status: value?.Status === "Active" ? "Active" : "Inactive",
    });
    setIsEditing(true);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deletelocalescortslab", { id });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };

  const handleReset = () => {
    setFormValue(paxSlabInitialValue);
    setIsEditing(false);
  };

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      width: "5rem",
    },
    {
      name: "StartPax",
      selector: (row) => row?.StartPax,
      cell: (row) => <span>{row?.StartPax}</span>,
      sortable: true,
    },
    {
      name: "EndPax",
      selector: (row) => row?.EndPax,
      cell: (row) => <span>{row?.EndPax}</span>,
      sortable: true,
    },
    {
      name: "PerDay Fee",
      selector: (row) => row?.Fee,
      cell: (row) => <span>{row?.Fee}</span>,
      sortable: true,
    },
    {
      name: "Default",
      selector: (row) => row?.Default,
      cell: (row) => <span>{row?.Default}</span>,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row?.PaxSlab,
      cell: (row) => <span>{row?.PaxSlab}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => (
        <span
          className={`badge ${row.Status === "Active"
            ? "badge-success light badge"
            : "badge-danger light badge"
            }`}
        >
          {row.Status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex align-items-center gap-1 sweetalert">
          <i
            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
            onClick={() => handleEdit(row)}
          ></i>
          <i
            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
            onClick={() => handleDelete(row?.Id)}
          ></i>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing ? "Update Local Ecort Slab " : "Add Local Ecort Slab"}
              </h4>
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
            </div>
            <div className="card-body">
              <div className="form-validation" ref={formRef}>
                <ToastContainer />
                <form className="form-valide" onSubmit={handleSubmit}>
                  <div className="row ">
                    <div className="col-12 d-flex">
                      <div className="row form-row-gap">
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            StartPax
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="StartPax"
                            placeholder="Start Pax"
                            value={formValue?.StartPax}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            EndPax
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="EndPax"
                            placeholder="End Pax"
                            value={formValue?.EndPax}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label htmlFor="name">
                            PerDay Fee
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="Fee"
                            placeholder="Fee"
                            value={formValue?.Fee}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label>Default</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Default"
                                id="default_yes"
                                value="Yes"
                                checked={formValue?.Default.includes("Yes")}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="default_yes"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Default"
                                id="default_no"
                                value="No"
                                checked={formValue?.Default?.includes("No")}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="default_no"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label>Type</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="PaxSlab"
                                id="default_GIT"
                                value="GIT"
                                checked={formValue?.PaxSlab.includes("GIT")}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="GIT"
                              >
                                GIT
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="PaxSlab"
                                id="default_FIT"
                                value="FIT"
                                checked={formValue?.PaxSlab?.includes("FIT")}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="FIT"
                              >
                                FIT
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-4 col-sm-3 col-md-2">
                          <label>Status</label>
                          <select
                            name="Status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>

                          </select>
                        </div>
                        {/* <div className="col-2 d-flex align-items-end">
                          <button
                            type="submit"
                            className="btn btn-primary btn-custom-size"
                          >
                            {isEditing ? "Update" : "Submit"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-dark btn-custom-size ms-2"
                            onClick={handleReset}
                          >
                            Reset
                          </button>
                        </div> */}
                      </div>
                      <div className="col-2 d-flex align-items-end justify-content-end ms-auto">
                        <button
                          type="submit"
                          className="btn btn-primary btn-custom-size"
                        >
                          {isEditing ? "Update" : "Submit"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-dark btn-custom-size ms-2"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tab.Container defaultActiveKey="All">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="card-action coin-tabs mb-2">
            <Nav as="ul" className="nav nav-tabs">
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="All">
                  All List
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div className="col-md-4">
            <div className="nav-item d-flex align-items-center">
              <div className="input-group search-area">
                <input
                  type="text"
                  className="form-control border"
                  placeholder="Search.."
                  onChange={(e) => setFiterInput(e.target.value)}
                />
                <span className="input-group-text border">
                  <i className="flaticon-381-search-2 cursor-pointer"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-2 flex-wrap"></div>
        </div>
        <UseTable
          table_columns={table_columns}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          rowsPerPage={rowsPerPage}
          handlePage={handlePageChange}
          handleRowsPerPage={handleRowsPerPageChange}
        />
      </Tab.Container>
    </>
  );
};

export default Localescortslab;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap-daterangepicker/daterangepicker.css";
// import { Tab, Nav } from "react-bootstrap";
// import { axiosOther } from "../../../../http/axios_base_url";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import swal from "sweetalert";
// import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
// import UseTable from "../../../../helper/UseTable.jsx";
// import { scrollToTop } from "../../../../helper/scrollToTop.js";

// const paxSlabInitialValue = {
//   id: "",
//   StartPax: "0",
//   EndPax: "0",
//   Fee: "0",
//   Default: "Yes",
//   Type: "FIT",
//   Status: "1",
// };

// const PaxSlab = () => {
//   const [selectBtn, setSelectBtn] = useState("Newest");
//   const [initialList, setInitialList] = useState([]);
//   const [formValue, setFormValue] = useState(paxSlabInitialValue);
//   const [filterValue, setFilterValue] = useState([]);
//   const [filterInput, setFiterInput] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [errors, setErrors] = useState({});
//   const formRef = useRef(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formValue.StartPax || formValue.StartPax === "") {
//       newErrors.StartPax = "Start Pax is required";
//     } else if (isNaN(formValue.StartPax)) {
//       newErrors.StartPax = "Start Pax must be a number";
//     } else if (parseInt(formValue.StartPax) < 0) {
//       newErrors.StartPax = "Start Pax cannot be negative";
//     }

//     if (!formValue.EndPax || formValue.EndPax === "") {
//       newErrors.EndPax = "End Pax is required";
//     } else if (isNaN(formValue.EndPax)) {
//       newErrors.EndPax = "End Pax must be a number";
//     } else if (parseInt(formValue.EndPax) < 0) {
//       newErrors.EndPax = "End Pax cannot be negative";
//     } else if (parseInt(formValue.EndPax) <= parseInt(formValue.StartPax)) {
//       newErrors.EndPax = "End Pax must be greater than Start Pax";
//     }

//     if (!formValue.Fee || formValue.Fee === "") {
//       newErrors.Fee = "Fee is required";
//     } else if (isNaN(formValue.Fee)) {
//       newErrors.Fee = "Fee must be a number";
//     } else if (parseFloat(formValue.Fee) < 0) {
//       newErrors.Fee = "Fee cannot be negative";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handlePageChange = (page) => setCurrentPage(page - 1);
//   const handleRowsPerPageChange = (newRowsPerPage) =>
//     setRowsPerPage(newRowsPerPage);

//   const getListDataToServer = async () => {
//     try {
//       const { data } = await axiosOther.post("localescortslab");
//       console.log("API Response:", data);
//       setInitialList(data?.Data || []);
//       setFilterValue(data?.Data || []);
//     } catch (error) {
//       console.log("pax-error", error);
//     }
//   };

//   useEffect(() => {
//     getListDataToServer();
//   }, []);

//   useEffect(() => {
//     const filteredList = initialList?.filter(
//       (data) =>
//         data?.StartPax?.toString()?.includes(filterInput?.toLowerCase()) ||
//         data?.EndPax?.toString()?.includes(filterInput?.toLowerCase()) ||
//         data?.Fee?.toString()?.includes(filterInput?.toLowerCase()) ||
//         data?.Default?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
//         data?.Type?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
//         data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
//     );
//     setFilterValue(filteredList);
//   }, [filterInput, initialList]);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormValue((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return;
//     }
//     let Id = null;
//     try {
//       const token = localStorage.getItem("token");
//       const persed = JSON.parse(token);
//       Id = persed?.companyKey;
//     } catch (error) {
//       console.log(error, "error");
//     }

//     try {
//       const endpoint = isEditing ? "updatelocalescortslab" : "addlocalescortslab";

//       const payload = {
//         ...formValue,
//         CompanyId: Id,
//         ...(isEditing ? { UpdatedBy: "1" } : { AddedBy: "1" })
//       };

//       const { data } = await axiosOther.post(endpoint, payload);
//       if (data?.Status === 1) {
//         getListDataToServer();
//         setIsEditing(false);
//         setFormValue(paxSlabInitialValue);
//         notifySuccess(data?.message || data?.Message);
//       } else {
//         notifyError(data?.message || data?.Message);
//       }
//     } catch (error) {
//       if (error.response?.data?.Errors || error.response?.data?.errors) {
//         const data = Object.entries(
//           error.response?.data?.Errors || error.response?.data?.errors
//         );
//         notifyError(data[0][1]);
//       }
//     }
//   };

//   const handleEdit = (value) => {
//     setFormValue({
//       id: value?.Id,
//       StartPax: value?.StartPax,
//       EndPax: value?.EndPax,
//       Fee: value?.Fee,
//       Default: value?.Default,
//       Type: value?.Type,
//       Status: value?.Status === "Active" ? "1" : "0",
//     });
//     setIsEditing(true);
//     formRef.current.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleDelete = async (id) => {
//     const confirmation = await swal({
//       title: "Are you sure want to Delete?",
//       icon: "warning",
//       buttons: true,
//       dangerMode: true,
//     });
//     if (confirmation) {
//       try {
//         const { data } = await axiosOther.post("deletelocalescortslab", { id });
//         if (data?.Status == 1 || data?.status == 1 || data?.result) {
//           notifySuccess(data?.Message || data?.message || data?.result);
//           getListDataToServer();
//         }
//       } catch (err) {
//         notifyError(err?.message || err?.Message);
//       }
//     }
//   };

//   const handleReset = () => {
//     setFormValue(paxSlabInitialValue);
//     setIsEditing(false);
//     setErrors({});
//   };

//   const table_columns = [
//     {
//       name: "Sr. No.",
//       selector: (row, index) => (
//         <span className="font-size-11">
//           {currentPage * rowsPerPage + index + 1}
//         </span>
//       ),
//       sortable: true,
//       width: "5rem",
//     },
//     {
//       name: "StartPax",
//       selector: (row) => <span>{row?.StartPax}</span>,
//       sortable: true,
//     },
//     {
//       name: "EndPax",
//       selector: (row) => <span>{row?.EndPax}</span>,
//       sortable: true,
//     },
//     {
//       name: "Fee",
//       selector: (row) => <span>{row?.Fee}</span>,
//       sortable: true,
//     },
//     {
//       name: "Default",
//       selector: (row) => <span>{row?.Default}</span>,
//       sortable: true,
//     },
//     {
//       name: "Type",
//       selector: (row) => <span>{row?.Type}</span>,
//       sortable: true,
//     },
//     {
//       name: "Status",
//       selector: (row) => (
//         <span
//           className={`badge ${row.Status === "Active"
//             ? "badge-success light badge"
//             : "badge-danger light badge"
//             }`}
//         >
//           {row.Status}
//         </span>
//       ),
//       sortable: true,
//     },
//     {
//       name: "Action",
//       selector: (row) => (
//         <div className="d-flex align-items-center gap-1 sweetalert">
//           <i
//             className="fa-solid fa-pencil cursor-pointer text-success action-icon"
//             onClick={() => handleEdit(row)}
//           ></i>
//           <i
//             className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
//             onClick={() => handleDelete(row?.Id)}
//           ></i>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="row">
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="card-header">
//               <h4 className="card-title">
//                 {isEditing ? "Update Local EcortSlab " : "Add Local EcortSlab"}
//               </h4>
//               <button
//                 className="btn btn-dark btn-custom-size"
//                 name="SaveButton"
//                 onClick={() => navigate(-1)}
//               >
//                 <span className="me-1">Back</span>
//                 <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
//               </button>
//             </div>
//             <div className="card-body">
//               <div className="form-validation" ref={formRef}>
//                 <ToastContainer />
//                 <form className="form-valide" onSubmit={handleSubmit}>
//                   <div className="row ">
//                     <div className="col-12 d-flex">
//                       <div className="row form-row-gap">
//                         <div className="col-4 col-sm-3 col-md-2">
//                           <label htmlFor="name">
//                             StartPax
//                             <span className="text-danger">*</span>
//                           </label>
//                           <input
//                             type="number"
//                             className={`form-control form-control-sm ${errors.StartPax ? 'is-invalid' : ''}`}
//                             name="StartPax"
//                             placeholder="Start Pax"
//                             value={formValue?.StartPax}
//                             onChange={handleFormChange}
//                             min="0"
//                           />
//                           {errors.StartPax && (
//                             <div className="invalid-feedback">{errors.StartPax}</div>
//                           )}
//                         </div>
//                         <div className="col-4 col-sm-3 col-md-2">
//                           <label htmlFor="name">
//                             EndPax
//                             <span className="text-danger">*</span>
//                           </label>
//                           <input
//                             type="number"
//                             className={`form-control form-control-sm ${errors.EndPax ? 'is-invalid' : ''}`}
//                             name="EndPax"
//                             placeholder="End Pax"
//                             value={formValue?.EndPax}
//                             onChange={handleFormChange}
//                             min="0"
//                           />
//                           {errors.EndPax && (
//                             <div className="invalid-feedback">{errors.EndPax}</div>
//                           )}
//                         </div>
//                         <div className="col-4 col-sm-3 col-md-2">
//                           <label htmlFor="name">
//                             Fee
//                             <span className="text-danger">*</span>
//                           </label>
//                           <input
//                             type="number"
//                             className={`form-control form-control-sm ${errors.Fee ? 'is-invalid' : ''}`}
//                             name="Fee"
//                             placeholder="Fee"
//                             value={formValue?.Fee}
//                             onChange={handleFormChange}
//                             min="0"
//                             step="0.01"
//                           />
//                           {errors.Fee && (
//                             <div className="invalid-feedback">{errors.Fee}</div>
//                           )}
//                         </div>
//                         <div className="col-md-6 col-lg-2">
//                           <label>Default</label>
//                           <div className="d-flex gap-3">
//                             <div className="form-check">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="Default"
//                                 id="default_yes"
//                                 value="Yes"
//                                 checked={formValue?.Default.includes("Yes")}
//                                 onChange={handleFormChange}
//                               />
//                               <label
//                                 className="form-check-label"
//                                 htmlFor="default_yes"
//                               >
//                                 Yes
//                               </label>
//                             </div>
//                             <div className="form-check">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="Default"
//                                 id="default_no"
//                                 value="No"
//                                 checked={formValue?.Default?.includes("No")}
//                                 onChange={handleFormChange}
//                               />
//                               <label
//                                 className="form-check-label"
//                                 htmlFor="default_no"
//                               >
//                                 No
//                               </label>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-md-6 col-lg-2">
//                           <label>Type</label>
//                           <div className="d-flex gap-3">
//                             <div className="form-check">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="Type"
//                                 id="default_GIT"
//                                 value="GIT"
//                                 checked={formValue?.Type === "GIT"}
//                                 onChange={handleFormChange}
//                               />
//                               <label
//                                 className="form-check-label"
//                                 htmlFor="default_GIT"
//                               >
//                                 GIT
//                               </label>
//                             </div>
//                             <div className="form-check">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="Type"
//                                 id="default_FIT"
//                                 value="FIT"
//                                 checked={formValue?.Type === "FIT"}
//                                 onChange={handleFormChange}
//                               />
//                               <label
//                                 className="form-check-label"
//                                 htmlFor="default_FIT"
//                               >
//                                 FIT
//                               </label>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-4 col-sm-3 col-md-2">
//                           <label>Status</label>
//                           <select
//                             name="Status"
//                             className="form-control form-control-sm"
//                             value={formValue?.Status}
//                             onChange={handleFormChange}
//                           >
//                             <option value="1">Active</option>
//                             <option value="0">Inactive</option>
//                           </select>
//                         </div>
//                       </div>
//                       <div className="col-2 d-flex align-items-end justify-content-end ms-auto">
//                         <button
//                           type="submit"
//                           className="btn btn-primary btn-custom-size"
//                         >
//                           {isEditing ? "Update" : "Submit"}
//                         </button>
//                         <button
//                           type="button"
//                           className="btn btn-dark btn-custom-size ms-2"
//                           onClick={handleReset}
//                         >
//                           Reset
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Tab.Container defaultActiveKey="All">
//         <div className="d-flex justify-content-between align-items-center flex-wrap">
//           <div className="card-action coin-tabs mb-2">
//             <Nav as="ul" className="nav nav-tabs">
//               <Nav.Item as="li" className="nav-item">
//                 <Nav.Link className="nav-link" eventKey="All">
//                   All List
//                 </Nav.Link>
//               </Nav.Item>
//             </Nav>
//           </div>
//           <div className="col-md-4">
//             <div className="nav-item d-flex align-items-center">
//               <div className="input-group search-area">
//                 <input
//                   type="text"
//                   className="form-control border"
//                   placeholder="Search.."
//                   onChange={(e) => setFiterInput(e.target.value)}
//                 />
//                 <span className="input-group-text border">
//                   <i className="flaticon-381-search-2 cursor-pointer"></i>
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="d-flex align-items-center mb-2 flex-wrap"></div>
//         </div>
//         <UseTable
//           table_columns={table_columns}
//           filterValue={filterValue}
//           setFilterValue={setFilterValue}
//           rowsPerPage={rowsPerPage}
//           handlePage={handlePageChange}
//           handleRowsPerPage={handleRowsPerPageChange}
//         />
//       </Tab.Container>
//     </>
//   );
// };

// export default PaxSlab;
