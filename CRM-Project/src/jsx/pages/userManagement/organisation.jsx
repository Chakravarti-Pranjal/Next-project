import React, { useEffect, useRef, useState } from 'react'
import UseTable from '../../../helper/UseTable'
import {  Link, NavLink,useNavigate } from "react-router-dom";
import { axiosOther } from '../../../http/axios_base_url';
import { Dropdown, Tab, Nav, Badge } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { scrollToTop } from "../../../helper/scrollToTop.js";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
const OrganisationList = () => {
    const formRef = useRef(null);
    const [initialList, setInitialList] = useState([]);
    const [filterValue, setFilterValue] = useState([]);
    const [filterInput, setFiterInput] = useState("");
    const [formValue, setFormValue] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const handlePageChange = (page) => setCurrentPage(page - 1);
    const handleRowsPerPageChange = (newRowsPerPage) =>
        setRowsPerPage(newRowsPerPage);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
   
    const getListDataToServer = async () => {
        try {
            const { data } = await axiosOther.post("orglist");
            console.log(data)
            setInitialList(data?.DataList);
            setFilterValue(data?.DataList);
        } catch (error) {
            console.log("user-error", error);
        }
    };

    
    useEffect(() => {
        getListDataToServer();
    }, []);
    useEffect(() => {
        const filteredList = initialList?.filter(
            (data) =>
                data?.COMPANYNAME?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.REGISTEREDEMAIL?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.ISACTIVE?.toLowerCase()?.includes(filterInput?.toLowerCase())
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
            sortable: true,
            width: "4rem",
            style: {
                display: "flex",
                justifyContent: "center",
            },
        },
        
        {
            name: "Name",
            selector: (row) => <span onClick={()=>navigate('/user',{state:{userList:row?.ID}})}>{row?.COMPANYNAME}</span>,
            sortable: true,
            width: "8rem",
        }, 
        {
            name: "Email",
            selector: (row) => <span>{row?.REGISTEREDEMAIL}</span>,
            sortable: true,

        },
        
        {
            name: "Phone",
            selector: (row) => <span>{row?.PHONE}</span>,
            sortable: true,
            width: "6rem",
        }, 
        {
            name: "License Key",
            selector: (row) => <span>{row?.LICENSEKEY}</span>,
            sortable: true,
            width:"10rem"

        },
        {
            name: "Destination",
            selector: (row) => <div>{row?.DESTINATION.map((data,index)=>(
                <span key={index}>
                        {data?.DestinationName}
                        {index < row?.DESTINATION?.length - 1 && ", "}
                    </span>
            ))}</div>,
            sortable: true,
            width: "6rem",
        }, 
        {
            name: "Address",
            selector: (row) => <span>{row?.ADDRESS1}</span>,
            sortable: true,

        },
        
        {
            name: "Status",
            selector: (row) => (
                
                     <span
                    className={`badge ${row.ISACTIVE === "Active"
                            ? "badge-success light badge"
                            : "badge-danger light badge"
                        }`}
                >
                    {row.ISACTIVE}
                    
                </span>
                
                
               
               
            ),
            sortable: true,
            width: "4.5rem",
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="d-flex align-items-center gap-1 sweetalert">
                    <i
                        className="fa-solid fa-pencil cursor-pointer text-success action-icon"
                        onClick={() => handleEdit(row)}
                    //    onChange={scrollToTop()}
                    ></i>
                    <i
                        className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
                        onClick={() => handleDelete(row?.ID)}
                    ></i>
                </div>
            ),
            width: "4.5rem",
        },
    ];
    // const handleStatusEdit=async(status)=>{
    //     console.log(status)
    //     const confirmation = await swal({
    //         title: "Are you sure want to change?",
    //         icon: "warning",
    //         buttons: true,
    //         dangerMode: true,
    //     });
    //     if (confirmation) {
          
    //     }
    // }
    const handleEdit = (value) => {
       navigate("/create-company",{state:value})
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
                const { data } = await axiosOther.post("deletecompany", { id });
                if (data?.Status == 1 || data?.status == 1 || data?.result) {
                    notifySuccess(data?.Message || data?.message || data?.result);
                    getListDataToServer();
                }
            } catch (err) {
                notifyError(err?.message || err?.Message);
            }
        }
    };

    return (
        <div className='row'>
            
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
                                <div className="guest-calendar"></div>
                                <div className="newest ms-3 d-flex gap-2">
                                  <Link
                                    to={"/create-organisation"}
                                    className="btn btn-primary btn-custom-size"
                                    
                                  >
                                   Create Organisation
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
        </div>
    )
}

export default OrganisationList