import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { useTable, useSortBy } from "react-table";
import { table_custom_style } from "../../../../css/custom_style";
import { NavLink } from "react-router-dom";
import DataTable from "react-data-table-component";
import { formatDate } from "../../../../helper/formatDate";
import UseTable from "../../../../helper/UseTable.jsx";

// const DropdownBlog = ({ rowData, listFunction }) => {
//   const handleDelete = async () => {
//     try {
//       const { data } = await axiosOther.post("deleterestaurant", {
//         id: rowData?.Id,
//       });

//       if (data?.Status == 1 || data?.status == 1 || data?.result) {
//         alert(data?.Message || data?.message || data?.result);
//         listFunction();
//       }
//     } catch (err) {
//       if (err) {
//         alert(err?.message || err?.Message);
//       }
//     }
//   };

//   return (
//     <>
//       <Dropdown className="dropdown">
//         <Dropdown.Toggle
//           as="div"
//           className="btn-link i-false"
//           data-bs-toggle="dropdown"
//           aria-expanded="false"
//         >
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
//               stroke="#262626"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//             <path
//               d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
//               stroke="#262626"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//             <path
//               d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
//               stroke="#262626"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </Dropdown.Toggle>
//         <Dropdown.Menu className="dropdown-menu">
//           <Dropdown.Item className="dropdown-item" onClick={handleEdit}>
//             Edit
//           </Dropdown.Item>
//           <Dropdown.Item className="dropdown-item" onClick={handleDelete}>
//             Delete
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//     </>
//   );
// };

const HotelChain = () => {
  const navigate = useNavigate();
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [intitialList, setIntitialList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("restaurantmasterlist");
      // console.log("hotel-list", data);

      setFilterValue(data?.DataList);
      setIntitialList(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);
  useEffect(() => {
    const filteredList = intitialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        ) ||
        data?.DestinationName?.toLowerCase()?.includes(
          filterInput?.toLowerCase()
        )
    );

    setFilterValue(filteredList);
  }, [filterInput]);
  const handleEditClick = (rowData) => {
    // console.log("edit", rowData);
    navigate("/restaurant/add", { state: rowData });
  };

  const handleDelete = async (id) => {
    // console.log("row-data", id);
    const confirmation = await swal({
      title: "Are you sure you want to delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deleterestaurant", {
          id,
        });

        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          alert(data?.Message || data?.message || data?.result);
          listFunction();
        }
      } catch (err) {
        if (err) {
          alert(err?.message || err?.Message);
        }
      }
    }
  };
  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      sortable: false,
      width: "6rem",
    },
    {
      name: "Image",
      selector: (row) => row?.ImageName,
      cell: (row) => (
        <span>
          <img
            src={row?.ImageName}
            alt="image"
            className=""
            style={{ height: "50px", width: "50px", objectFit: "contain" }}
          ></img>
        </span>
      ),
      sortable: true,
    },
    {
      name: "Resturant Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row.Name}{" "}
        {row.Default == "Yes" && (
          <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
        )}
      </span>,
      sortable: true,
    },
    {
      name: "Destination",
      selector: (row) => row?.DestinationName,
      cell: (row) => <span>{row.DestinationName}</span>,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row?.Address,
      cell: (row) => <span>{row.Address}</span>,
      sortable: true,
    },
    {
      name: "Rate Sheet",
      selector: (row) => (
        <NavLink
          to={`/restaurant/rate/${row?.Id}`}
          state={{
            Name: row?.Name,
            DestinatinoId: row?.DestinationId,
            Destination: row?.DestinationName,
            Master: "Restaurant",
          }}
        >
          <Button variant="dark light py-1 rounded-pill">View/Add</Button>
        </NavLink>
      ),
      sortable: false,
    },
    {
      name: "Status",
      selector: (row) => row?.Status,
      cell: (row) => {
        return (
          <span
            className={`badge ${row.Status == "Active" ? "bg-success light badge" : "bg-danger "
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
          <div className="d-flex gap-1">
            <i
              className="fa-solid fa-pencil action-icon text-success cursor-pointer"
              data-toggle="modal"
              data-target="#modal_form_vertical"
              onClick={() => handleEditClick(row)}
            ></i>
            <i
              className="fa-solid fa-trash-can action-icon cursor-pointer text-danger sweet-confirm"
              onClick={() => handleDelete(row?.Id)}
            ></i>
          </div>
        );
      },
      sortable: false,
    },
  ];

  return (
    <>
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
          <div className="d-flex align-items-center mb-2 flex-wrap flex-column flex-sm-row gap-1">
            <div className="newest ms-lg-3 d-flex gap-2">
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
              <Link
                to={"/restaurant/add"}
                className="btn btn-primary btn-custom-size"
              >
                Add Restaurant
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
// export { DropdownBlog };
export default HotelChain;
