import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../http/axios_base_url.js";
import { defaultemailsInitialValue } from "./emailTemplate-intial-values"
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../helper/notify.jsx";
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../css/custom_style.js";

const EmailTemplates = () => {
    // const { background } = useContext(ThemeContext);
    const [initialList, setInitialList] = useState([]);
    const [formValue, setFormValue] = useState(defaultemailsInitialValue);
    const [validationErrors, setValidationErrors] = useState({});
    const [filterValue, setFilterValue] = useState([]);
    const [filterInput, setFiterInput] = useState("");
    const [countryList, setCountryList] = useState([]);
    const [DestinationList, setDestinationList] = useState([]);
    const [cityList, setCitylist] = useState([]);
    const [stateList, setStatelist] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPage, setTotalPage] = useState("");
    const [currenctlist, setCurrencylist] = useState([]);
    const [nationalitylist, setNationalitylist] = useState([]);
    const navigate = useNavigate();
    const { state } = useLocation();

    // console.log(state, "manish");


    const getListDataToServer = async () => {
        try {
            const { data } = await axiosOther.get("defaultemails");
            // console.log(data?.data, "manish");
            setInitialList(data?.data);
            setFilterValue(data?.data);
            setFormValue(data?.data)
        } catch (error) {
            console.log("city-error", error);
        }
    };

    useEffect(() => {
        getListDataToServer();
    }, [defaultemailsInitialValue]);


    const handleEdit = (data) => {
        navigate("/create-email-template", { state: { data: data } })
    }

    const handleDelete = async (id) => {
        const confirmation = await swal({
            title: "Are you sure want to Delete?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (confirmation) {
            try {
                const { data } = await axiosOther.post("delete-email-template", {
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

    // useEffect(() => {
    //     const filteredList = initialList?.filter(
    //         (data) =>
    //             data?.id.includes(filterInput) ||
    //             data?.title?.toLowerCase().includes(
    //                 filterInput?.toLowerCase()
    //             )
    //     );
    //     setFilterValue(filteredList);
    // }, [filterInput]);

    useEffect(() => {
        const input = filterInput.trim().toLowerCase();
        const filteredList = initialList?.filter((data) =>
            data?.id?.toString().toLowerCase().includes(input) ||
            data?.title?.toLowerCase().includes(input)
        );
        setFilterValue(filteredList);
    }, [filterInput, initialList]);


    const table_columns = [
        {
            name: "Sr.No.",
            selector: (row, index) => (
                <span className="font-size-11">
                    {currentPage * rowsPerPage + index + 1}
                </span>
            ),
            sortable: true,
            width: "6rem",
        },
        // {
        //     name: "Id.",
        //     selector: (row) => row?.id,
        //     cell: (row) => <span>{row?.id}</span>,
        //     sortable: true,
        //     width: "5rem",
        // },
        // {
        //     name: "User Id",
        //     selector: (row) => row?.user_id,
        //     cell: (row) => <span>{row?.user_id}</span>,
        //     sortable: true,
        // },
        {
            name: "Title",
            selector: (row) => row?.title,
            cell: (row) => <span>{row?.title}</span>,
            sortable: true,
        },
        {
            name: "Subject",
            selector: (row) => row?.subject,
            cell: (row) => <span>{row?.subject}</span>,
            sortable: true,
        },
        {
            name: "Body",
            selector: (row) => row?.body, // ✅ used for sorting
            cell: (row) => (
                <div className="CKEditor_textEdit"
                    dangerouslySetInnerHTML={{ __html: row?.body }}
                    style={{ maxHeight: '5rem', overflow: 'hidden', fontSize: "10px" }}
                />
            ),
            sortable: true,
            width: "12rem"
        },
        {
            name: "Signature",
            selector: (row) => row?.signature, // ✅ used for sorting
            cell: (row) => (
                <div className="CKEditor_textEdit"
                    dangerouslySetInnerHTML={{ __html: row?.signature }}
                    style={{ maxHeight: '5rem', overflow: 'hidden', fontSize: "10px" }}
                />
            ),
            sortable: true,
        },
        {
            name: "Email Key",
            selector: (row) => row?.email_key,
            cell: (row) => {
                console.log("Email Key:", row);

                console.log("Email Key:", row?.email_key); // 👈 Console log here
                return <span>{row?.email_key}</span>;
            },
            sortable: true,
            width: "8rem"
        },
        {
            name: "User Type",
            selector: (row) => row?.usertype,
            cell: (row) => <span>{row?.usertype}</span>,
            sortable: true,
            width: "8rem"
        },
        // {
        //     name: "Company Id",
        //     selector: (row) => row?.company_id,
        //     cell: (row) => <span>{row?.company_id}</span>,
        //     sortable: true,
        // },
        {
            name: "Status",
            selector: (row) => row.status, // ✅ used for sorting
            cell: (row) => <span
                className={`badge text-center mx-auto ${row.status === "Active" ? "badge-success light badge" : "badge-danger light badge"}`}
            >
                {row.status === "Active" ? "Active" : "Inactive"}
            </span>,
            sortable: true,
        },

        {
            name: "Action",
            selector: (row) => {
                return (
                    <div className="d-flex align-items-center gap-1 sweetalert">
                        <i role="button"
                            tabIndex={0}
                            aria-label="Edit"
                            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
                            onClick={() => handleEdit(row)}
                        ></i>
                        <div className="sweetalert mt-5"></div>
                        <i role="button"
                            tabIndex={0}
                            aria-label="Delete"
                            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
                            onClick={() => handleDelete(row?.id)}
                        ></i>
                    </div>
                );
            },
        },
    ];


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
    };

    const CustomPagination = () => {
        return (
            <div className="custom-pagination d-flex gap-3 py-2 justify-content-end align-items-center mb-5 shadow border-bottom">
                <div className="d-flex gap-3 align-items-center">
                    <label htmlFor="" className="fs-6">
                        Rows per page
                    </label>
                    <select
                        name="PerPage"
                        id=""
                        className="pagination-select"
                        value={rowsPerPage}
                        onChange={(e) => {
                            handleRowsPerPageChange(e.target.value);
                        }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    <MdOutlineSkipPrevious />
                </button>
                <button
                    onClick={() =>
                        handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    <GrFormPrevious />
                </button>
                <span className="text-light">
                    {currentPage} of {totalPage}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage == totalPage}
                    className="pagination-button"
                >
                    <MdNavigateNext />
                </button>
                <button
                    onClick={() => handlePageChange(totalPage)}
                    disabled={currentPage == totalPage}
                    className="pagination-button"
                >
                    <MdOutlineSkipNext />
                </button>
            </div>
        );
    };

    return (
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
                <div className="d-flex align-items-center mb-2 flex-wrap">
                    <div className="newest ms-3 d-flex gap-2">
                        <Link
                            to={"/create-email-template"}
                            className="btn btn-primary btn-custom-size"
                        >
                            <i className="fa-solid fa-plus"></i> Add New Template
                        </Link>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <div id="example2_wrapper" className="dataTables_wrapper no-footer">
                    <DataTable
                        columns={table_columns}
                        data={filterValue}
                        sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
                        striped
                        paginationServer
                        highlightOnHover
                        customStyles={table_custom_style}
                        defaultSortFieldId={1}
                        paginationTotalRows={4}
                        defaultSortAsc={false}
                        className="custom-scrollbar"
                    />
                    <CustomPagination />
                </div>
            </div>
        </Tab.Container>

    );
};
export default EmailTemplates;
