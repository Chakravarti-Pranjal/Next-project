import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../http/axios_base_url";
import {
  Dropdown,
  Tab,
  Nav,
  Badge,
  Modal,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { scrollToTop } from "../../../helper/scrollToTop.js";
import { notifySuccess } from "../../../helper/notify.jsx";
import { notifyError } from "../../../helper/notify.jsx";
import { useSelector } from "react-redux";

const RecursiveAccordion = ({ data, onDelete }) => {
  const navigate = useNavigate();

  const [visibleIds, setVisibleIds] = useState([]); // Track which items are visible

  useEffect(() => {
    const getAllIds = (items) => {
      let ids = items.map((item) => item.id);
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          ids = ids.concat(getAllIds(item.children));
        }
      });
      return ids;
    };

    setVisibleIds(getAllIds(data)); // Initialize visibleIds with all IDs
  }, [data]);

  const handleToggle = (id) => {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddRole = (id, name) => {
    navigate("/add-role", { state: { ReportId: id, ReportName: name } });
  };
  const handleEdit = (data) => {
    navigate("/add-role", { state: { editData: data } });
  };

  return (
    <div>
      <ul>
        {data?.map((item, index) => (
          <li className="ms-4 my-4">
            <div className="d-flex justify-content-start align-items-center gap-2 icon-roles cursor-pointer ">
              <i
                className={`fa-solid fa-${
                  visibleIds.includes(item.id) ? "minus" : "plus"
                } bg-white p-1 d-block border-2 border-danger`}
                onClick={() => handleToggle(item.id)}
              ></i>
              <p className="m-0">{item?.name}</p>

              <div className="d-flex gap-2 align-items-center   ms-4 ">
                <i
                  class="fa-solid fa-plus cursor-pointer text-secondary "
                  onClick={() => handleAddRole(item?.id, item?.name)}
                ></i>
                <i
                  className="fa-solid fa-pencil cursor-pointer text-success "
                  onClick={() => handleEdit(item)}
                ></i>
                <i
                  className="fa-solid fa-trash-can cursor-pointer text-danger  sweet-confirm"
                  onClick={() => onDelete(item?.id)}
                ></i>
              </div>
            </div>
            {item?.children &&
              item?.children.length > 0 &&
              visibleIds.includes(item.id) && (
                <ul>
                  <li>
                    <RecursiveAccordion
                      data={item?.children}
                      onDelete={(val) => onDelete(val)}
                    />
                  </li>
                </ul>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};
const Roles = () => {
  const formRef = useRef(null);
  const [modalCentered, setModalCentered] = useState(false);
  const [modalReportingManager, setModalReportingManager] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [initialList, setInitialList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
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
  const messageData = useSelector((state) => state?.messageData?.messageData);

  useEffect(() => {
    console.log(messageData, "message");
  }, []);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("listroles");
      setInitialList(data?.Datalist);
      // setFilterValue(data?.Datalist);
    } catch (error) {
      console.log("user-error", error);
    }
  };

  useEffect(() => {
    getListDataToServer();
  }, []);
  const [visibleIds, setVisibleIds] = useState([]);

  const handleShow = (id) => {
    // Toggle visibility based on the id
    setVisibleIds(
      (prevIds) =>
        prevIds.includes(id)
          ? prevIds.filter((visibleId) => visibleId !== id) // Remove id if it's already visible
          : [...prevIds, id] // Add id if it's not visible
    );
  };

  const isVisible = (id) => visibleIds.includes(id);

  const handleSubmit = async () => {
    try {
      const { data } = await axiosOther.post("addroles", formValue);
      if (data?.Status === 1) {
        getListDataToServer();
        setModalCentered(false);
        setIsEditing(false);
        setFormValue({});
        notifySuccess(data?.message || data?.Message);
      } else {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
      }

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
      name: value?.name,
      company_id: value?.company_id,
    });
    setIsEditing(true);
    setModalCentered(true);
  };
  const handleDeleted = async (id) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmation) {
      try {
        const { data } = await axiosOther.post("deleteroles", { id });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        notifyError(err?.message || err?.Message);
      }
    }
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getExpandedNodeIds = (data) => {
    const expandedIds = [];
    const traverse = (nodes) => {
      nodes.forEach((node) => {
        expandedIds.push(node.id);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(data);
    return expandedIds;
  };

  return (
    <div className="row">
      <Tab.Container defaultActiveKey="All">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="col-md-4"></div>
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="newest ms-3 d-flex gap-2">
              <Link className="btn btn-primary btn-custom-size" to="/add-role">
                Create Role
              </Link>
            </div>
          </div>
        </div>
      </Tab.Container>
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Roles</h4>
            {/* <i
                            className="fa-solid fa-arrow-left cursor-pointer text-primary back-icon"
                            style={{ fontSize: "20px" }}
                            onClick={() => navigate(-1)}
                        ></i> */}
          </div>
          <div className="card-body">
            <div style={{ margin: "20px" }}>
              <RecursiveAccordion
                data={initialList}
                onDelete={(val) => handleDeleted(val)}
              />
              {/* {initialList?.length>0 && initialList.map((data,item)=>{
                return (

            <ul>
           
        <li>
            <span class="toggle-icon cursor-pointer" onClick={()=>handleShow(data?.id)}>+</span> {data?.name}
            <ul class="hidden" >
                    {data?.children?.length>0 && data?.children.map((item,innerIndex)=>{
                        return (
                            <li style={{display:visibleIds.includes(data?.id)?'none':'inline-block'}}>
                    <span class="toggle-icon cursor-pointer" onClick={()=>handleShow(data?.id)}>+</span> {item?.name}
                    <ul class="hidden" style={{display:visibleIds.includes(data?.id)?'none':'inline-block'}}>
                    {item?.length>0 && item.map((child,i)=>{
                        return (
                            <li style={{display:visibleIds.includes(data?.id)?'none':'inline-block'}}>
                            <span class="toggle-icon " onClick={()=>handleShow(data?.id)}>+</span> {child?.name}
                            <ul class="hidden" style={{display:visibleIds.includes(data?.id)?'none':'inline-block'}}>
                            {child?.length>0 && child.map((subChild,subIndex)=>{
                                return (
                                    <li style={{display:visibleIds.includes(data?.id)?'none':'inline-block'}}>{subChild?.name}</li>
                                )
                            })}
                                
                            </ul>
                        </li>
                        )
                    })}
                        
                       
                    </ul>
                </li>
                        )
                    })}
              
            </ul>
        </li>
             
      
    </ul>
)
}) } */}

              {/* <RichTreeView items={transformedData} expanded={expandedNodeIds}/> */}

              {/* {initialList.map((data, index) => {
                                    return (
                                        <ul key={index}> 
                                            <li>{data?.name}
                                                {data?.children && data?.children.length > 0 && (
                                                    <ul>
                                                        {data.children.map((item, innerIndex) => {
                                                            return (
                                                                <li key={innerIndex}>{item?.name}</li>  
                  );
                })}
                                                    </ul>
                                                )}
                                            </li>
                                        </ul>
                                    );
                                })} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;
