import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { useTable, useSortBy } from "react-table";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../../css/custom_style";
import { NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Example using react-icons
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";

// deleteamenities

const InsuranceType = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
const navigate =useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // Page index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);
  const data = []; // Replace with your data
  const totalRows = 10; // Replace with your total rows count

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("bankmasterlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);

  useEffect(() => {
    const getMessage = localStorage.getItem("success-message");
    if (getMessage != null) {
      notifySuccess(getMessage);
      localStorage.removeItem("success-message");
    }
    //console.log("success-message", getMessage);
  }, []);
  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.BankName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.AccountNumber?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.BranchAddress?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.BeneficiaryName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.BranchIfsc?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.BranchSwiftCode?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.BranchIfsc?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        data?.UpiId?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
    },
    {
      name: "Currency",
      selector: (row) => row?.CurrencyName,
      cell: (row) => <span>{row?.CurrencyName}</span>,
      sortable: true,
    },
    {
      name: "Bank Name",
      selector: (row) => row?.BankName,
      cell: (row) => (
        <span>
          {row?.BankName}{" "}
          {row.SetDefault == "Yes" && (
            <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
          )}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Account No.",
      selector: (row) => row?.AccountNumber,
      cell: (row) => <span>{row?.AccountNumber}</span>,
      sortable: true,
    },
    {
      name: "Account Type",
      selector: (row) => row?.AccountType,
      cell: (row) => <span>{row?.AccountType}</span>,
      sortable: true,
    },
    {
      name: "Beneficiary Name",
      selector: (row) => row?.BeneficiaryName,
      cell: (row) => <span>{row?.BeneficiaryName}</span>,
      sortable: true,
    },
    {
      name: "IFSC Code",
      selector: (row) => row?.BranchIfsc,
      cell: (row) => <span>{row?.BranchIfsc}</span>,
      sortable: true,
    },
    {
      name: "Branch Address",
      selector: (row) => row?.BranchAddress,
      cell: (row) => <span>{row?.BranchAddress}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${
              row.Status == "Active"
                ? "badge-success light badge"
                : "badge-danger light badge"
            }`}
          >
            {row.Status}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex align-items-center gap-1 sweetalert">
            <i
              className="fa-solid fa-pencil cursor-pointer text-success action-icon"
              onClick={() => handleEdit(row)}
            ></i>
            <div className="sweetalert mt-5"></div>
            <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
              onClick={() => handleDelete(row?.id)}
            ></i>
          </div>
        );
      },
    },
  ];

  // handlign form changes
  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type == "file") {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
        setFormValue({
          ...formValue,
          ImageData: base64String,
          ImageName: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await countryValidationSchema.validate(formValue, {
  //       abortEarly: false,
  //     });
  //     setValidationErrors({});
  //     //  console.log(formValue);
  //     const { data } = await axiosOther.post("addupdatecountry", formValue);
  //     if (data?.Status == 1) {
  //       getListDataToServer();
  //       setFormValue(countryInitialValue);
  //       notifySuccess(data?.message || data?.Message);
  //       //   alert(data?.Message || data?.message);
  //     }

  //     if (data?.Status != 1) {
  //       notifyError(data?.message || data?.Message);
  //     }
  //   } catch (error) {
  //     if (error.inner) {
  //       const validationErrorss = error.inner.reduce((acc, curr) => {
  //         acc[curr.path] = curr.message;
  //         return acc;
  //       }, {});
  //       setValidationErrors(validationErrorss);
  //     }

  //     if (error.response?.data?.Errors) {
  //       const data = Object.entries(error.response?.data?.Errors);
  //       notifyError(data[0][1]);
  //     }
  //   }
  // };
  const handleEdit = (row) => {
    navigate("/add/bank", { state: row });
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
        const { data } = await axiosOther.post("deletebank", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message);
          //   alert(err?.message || err?.Message);
        }
      }
    }
  };
  // handlign form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSort = (column, direction) => {
    // Perform sorting manually or adjust your filterValue based on the sort direction
    const sortedData = [...filterValue].sort((a, b) => {
      const valueA = column.selector(a);
      const valueB = column.selector(b);
      if (direction === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    // Update your data with sorted results (assuming you manage the sorted data in state)
    setFilterValue(sortedData);
  };

  return (
    <>
      <Tab.Container defaultActiveKey="All">
        <ToastContainer />
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="card-action coin-tabs mb-2">
            <Nav as="ul" className="nav nav-tabs">
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="All">
                  All List
                </Nav.Link>
              </Nav.Item>
              {/* <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="Pending">
                  Active
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li" className="nav-item">
                <Nav.Link className="nav-link" eventKey="Booked">
                  Inactive
                </Nav.Link>
              </Nav.Item> */}
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
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="guest-calendar"></div>
            <div className="newest ms-3 d-flex gap-2">
            <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>

              <Link to={"/add/bank"} className="btn btn-primary btn-custom-size">
                Add Bank
              </Link>
            </div>
          </div>
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
export default InsuranceType;
