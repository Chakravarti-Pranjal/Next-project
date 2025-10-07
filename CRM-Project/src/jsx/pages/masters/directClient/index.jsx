import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { useTable, useSortBy } from "react-table";



const DropdownBlog = ({ rowData, listFunction }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/add/supplier", { state: rowData });
  };

  const handleDelete = async () => {
    try {
      const { data } = await axiosOther.post("destroysupplier", {
        id: rowData?.id,
      });

      if (data?.Status == 1 || data?.status == 1) {
        alert(data?.Message || data?.message);
        listFunction();
      }
    } catch (err) {
      if (err) {
        alert(err?.message || err?.Message);
      }
    }
  };

  return (
    <>
      <Dropdown className="dropdown">
        <Dropdown.Toggle
          as="div"
          className="btn-link i-false"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu">
          <Dropdown.Item className="dropdown-item" onClick={handleEdit}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item className="dropdown-item" onClick={handleDelete}>
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

const DirectClient = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [supplierList, setSupplierList] = useState([]);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("directClientlist");
      setSupplierList(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };

  const desiredColumns = ["UniqueID", "Name", "AliasName", "Type", "ContactPerson", "Phone", "Email", "AddedBy", "Status"];

  const columns = useMemo(() => {
    if (!supplierList || supplierList.length === 0) return [];

    const dynamicColumns = Object.keys(supplierList[0])
      .filter((key) => desiredColumns.includes(key)) // Only include keys in `desiredColumns`
      .map((key) => ({
        Header: key, // Use the key as the column header
        accessor: key, // Accessor matches the key in data
      }));

    // Add a static 'Action' column at the end
    const actionColumn = {
      Header: "Action",
      accessor: "Action",
      Cell: ({ row }) => (
        <button onClick={() => handleActionClick(row.original)}>Action</button>
      ),
    };

    return [...dynamicColumns, actionColumn];
  }, [supplierList]);

  const tableInstance = useTable({ columns, data: supplierList }, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  useEffect(() => {
    getListDataToServer();
  }, []);

  const [data, setData] = useState(
    document.querySelectorAll("#example2_wrapper tbody tr")
  );

  const sort = 8;
  const activePag = useRef(0);
  const [test, settest] = useState(0);

  // Active data
  const chageData = (frist, sec) => {
    for (var i = 0; i < data.length; ++i) {
      if (i >= frist && i < sec) {
        data[i].classList.remove("d-none");
      } else {
        data[i].classList.add("d-none");
      }
    }
  };

  // use effect
  useEffect(() => {
    setData(document.querySelectorAll("#example2_wrapper tbody tr"));
    //chackboxFun();
  }, [test, rows]);

  // Active pagginarion
  activePag.current === 0 && chageData(0, sort);
  // paggination
  let paggination = Array(Math.ceil(data.length / sort))
    .fill()
    .map((_, i) => i + 1);

  // Active paggination & chage data
  const onClick = (i) => {
    activePag.current = i;
    chageData(activePag.current * sort, (activePag.current + 1) * sort);
    settest(i);
  };

  const chackbox = document.querySelectorAll(".sorting_1 input");
  const motherChackBox = document.querySelector(".sorting_asc input");
  // console.log(document.querySelectorAll(".sorting_1 input")[0].checked);

  const chackboxFun = (type) => {
    for (let i = 0; i < chackbox.length; i++) {
      const element = chackbox[i];
      if (type === "all") {
        if (motherChackBox.checked) {
          element.checked = true;
        } else {
          element.checked = false;
        }
      } else {
        if (!element.checked) {
          motherChackBox.checked = false;
          break;
        } else {
          motherChackBox.checked = true;
        }
      }
    }
  };

  const [state, setState] = useState({

  });
  const { start, end } = state;
  const handleCallback = (start, end) => {
    setState({ start, end });
  };
  const label =
    start?.format("MMMM D, YYYY") + " - " + end?.format("MMMM D, YYYY");

  console.log("clint-list", supplierList);

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
          <div className="d-flex align-items-center mb-2 flex-wrap flex-column flex-sm-row gap-1">
            <div className="guest-calendar">

            </div>
            <div className="newest ms-lg-3 d-flex gap-2">

              <Link to={"/add/supplier"} className="btn btn-primary">
                Add Supplier
              </Link>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <Tab.Content>
                  <Tab.Pane eventKey="All">
                    <div className="table-responsive">
                      <div
                        id="example2_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        <table
                          id="example2"
                          className="table card-table display mb-4 shadow-hover default-table dataTablesCard dataTable no-footer"
                          {...getTableProps()}
                        >
                          <thead>
                            {headerGroups.map((headerGroup) => (
                              <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                  <th
                                    {...column.getHeaderProps(
                                      column.getSortByToggleProps()
                                    )}
                                  >
                                    {column.render("Header")}
                                    <span className="ml-1">
                                      {column.isSorted ? (
                                        column.isSortedDesc ? (
                                          <i
                                            className="fa fa-arrow-down ms-2 fs-14"
                                            style={{ opacity: "0.7" }}
                                          />
                                        ) : (
                                          <i
                                            className="fa fa-arrow-up ms-2 fs-14"
                                            style={{ opacity: "0.7" }}
                                          />
                                        )
                                      ) : (
                                        <i
                                          className="fa fa-sort ms-2 fs-14"
                                          style={{ opacity: "0.3" }}
                                        />
                                      )}
                                    </span>
                                  </th>
                                ))}
                              </tr>
                            ))}
                          </thead>
                          <tbody {...getTableBodyProps()}>
                            {/* {guideList?.map((country, index) => {
                              return (
                                <tr role="row" className="odd" key={index}>
                                  <td>
                                    <div>
                                      <h5 className="text-wrap">
                                        {country?.Name}
                                      </h5>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="text-nowrap font-w500">
                                      {country?.ShortName}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="btn btn-md btn-success">
                                      {country?.Status}
                                    </div>
                                  </td>
                                  <td>
                                    <span className="font-w500">
                                      {country?.AddedBy}
                                    </span>
                                  </td>
                                  <td>
                                    <DropdownBlog />
                                  </td>
                                </tr>
                                
                              );
                            })} */}
                            {rows?.map((row, index) => {
                              prepareRow(row);
                              return (
                                <tr
                                  role="row"
                                  className={`odd ${index % 2 === 0 ? "even-row" : ""
                                    }`} // Add conditional class for styling
                                  {...row.getRowProps()}
                                >
                                  {row.cells.map((cell) => {
                                    const columnId = cell.column.id; // To apply specific styling per column
                                    return (
                                      <td
                                        className={`text-nowrap font-w500 ${columnId === "Status"
                                          ? "status-column"
                                          : ""
                                          }`}
                                        {...cell.getCellProps()}
                                      >
                                        {columnId === "Status" ? (
                                          <div
                                            className={`${cell.value === "Active"
                                              ? "badge-success light badge"
                                              : "badge-danger light badge"
                                              }`}
                                          >
                                            {cell.value}
                                          </div>
                                        ) : columnId === "Action" ? (
                                          <DropdownBlog
                                            rowData={row?.original}
                                            listFunction={getListDataToServer}
                                          />
                                        ) : (
                                          cell.render("Cell")
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="d-sm-flex text-center justify-content-between align-items-center mt-3 mb-3">
                          <div className="dataTables_info">
                            Showing {activePag.current * sort + 1} to{" "}
                            {data.length > (activePag.current + 1) * sort
                              ? (activePag.current + 1) * sort
                              : data.length}{" "}
                            of {data.length} entries
                          </div>
                          <div
                            className="dataTables_paginate paging_simple_numbers mb-0"
                            id="example2_paginate"
                          >
                            <Link
                              className="paginate_button previous disabled"
                              to="/guide"
                              onClick={() =>
                                activePag.current > 0 &&
                                onClick(activePag.current - 1)
                              }
                            >
                              <i
                                className="fa fa-angle-double-left"
                                aria-hidden="true"
                              ></i>
                            </Link>
                            <span>
                              {paggination.map((number, i) => (
                                <Link
                                  key={i}
                                  to="/guide"
                                  className={`paginate_button ${activePag.current === i ? "current" : ""
                                    } `}
                                  onClick={() => onClick(i)}
                                >
                                  {number}
                                </Link>
                              ))}
                            </span>

                            <Link
                              className="paginate_button next"
                              to="/guide"
                              onClick={() =>
                                activePag.current + 1 < paggination.length &&
                                onClick(activePag.current + 1)
                              }
                            >
                              <i
                                className="fa fa-angle-double-right"
                                aria-hidden="true"
                              ></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Pending">
                    <h1>Active User List</h1>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Booked">
                    <h1>Inactive User List</h1>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </div>
          </div>
        </div>
      </Tab.Container>
    </>
  );
};
export { DropdownBlog };
export default DirectClient;
