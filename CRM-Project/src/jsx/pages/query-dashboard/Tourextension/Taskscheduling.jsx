// @ts-nocheck
import React, { useEffect, useState } from 'react'
import Table from "react-bootstrap/Table";
import { ToastContainer, Modal, Row, Col, Button } from "react-bootstrap";
import icon3 from "../../../../images/quotation/icon3.svg";
import AddTaskModel from './AddTaskModel'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectTaskModel from './SelectTaskModel';
import { axiosOther } from '../../../../http/axios_base_url';
import DestinationsCard from '../../../components/destinationsCard/DestinationsCard';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { notifyError, notifySuccess } from '../../../../helper/notify';

// const Taskschedulinglist = {
//   expenses: [
//     {
//       id: "Aarvi hotel ( Delhi ) | 3 Star",
//       AssignTo: "Nishank Shukla",
//       ActionDateTime: "12-05-2024 / 2:00 pm",
//       CompletedDateTime: "13-05-2024 / 3:00 pm",
//       Remarks: "Nothing",
//       Status: "Pending",
//       Action: "Edit",
//     },
//   ]
// };

const Taskscheduling = ({ setActiveTab }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [showSelectTask, setShowSelectTask] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [taskScheduling, setTaskScheduling] = useState([]);
  const [TodoForm, setTodoForm] = useState([
    {
      ServiceType: '',
      ServiceName: '',
      AssignTo: '',
      StartDateTime: '',
      CompleteDateTime: '',
      Status: '',
      Remark: ''
    }
  ])

  const [editIndex, setEditIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({});

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
    .react-datepicker__time-container {
      background-color: #fff !important;
    }

    .react-datepicker__time-list {
      background-color: #fff !important;
      color: #000 !important;
    }

    .react-datepicker__time-list-item {
      color: #000 !important;
    }

    .react-datepicker__time-list-item--selected {
      background-color: #007bff !important;
      color: #fff !important;
    }
  `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  const handleDateChange = (date, field) => {
    setTodoForm(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setTodoForm(prev => {
      const newForm = [...prev];
      newForm[index] = {
        ...newForm[index],
        [name]: value
      };
      return newForm;
    });
  };

  useEffect(() => {
    const getTodos = async () => {
      try {
        const { data } = await axiosOther.post('todolist');
        console.log(data, 'todosResponse');
        if (data.Status === 1) {
          setTodos(data.DataList);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getTodos();
  }, []);

  // const createTodo = async () => {
  //   try {
  //     const response = await axiosOther.post('create-todaylist', {

  //     })
  //   } catch (error) {

  //   }
  // }

  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const Token = JSON.parse(localStorage.getItem("token"));
  const { queryData, qoutationData } = useSelector(
    (data) => data?.queryReducer
  );

  const { QueryAlphaNumId, QueryAllData } = queryData || {};
  const { QuotationNumber } = qoutationData || {}
  const { ReferenceId, ServiceDetail, CompanyId, TourId } = QueryAllData || {}

  const payload = {
    QueryId: QueryAlphaNumId || queryQuotation?.QueryID,
    QuotationNumber: QuotationNumber || queryQuotation?.QoutationNum,
    RefrenceId: ReferenceId || queryQuotation?.ReferenceId,
    TourId: TourId || queryQuotation?.TourId,
    CompanyId: String(CompanyId) || Token?.companyKey.toString(),
  }

  const handleService2Increment = () => {
    setTodoForm((prev) => [
      ...prev,
      {
        ServiceType: '',
        ServiceName: '',
        AssignTo: '',
        StartDateTime: '',
        CompleteDateTime: '',
        Status: '',
        Remark: ''
      }
    ]);
  };

  const handleService2Decrement = (ind) => {
    if (TodoForm.length > 1) {
      setTodoForm((prev) => prev.filter((_, index) => index !== ind));
    }
  };

  const listTaskSchedulingData = async () => {
    try {
      const { data } = await axiosOther.post('list-task-scheduling-data', payload)
      if (data.Status === 200) {
        const dataList = data?.DataList;
        console.log(dataList, 'task745')
        if (Array.isArray(dataList)) {
          setTaskScheduling(dataList);
        } else if (dataList && typeof dataList === 'object') {
          // If DataList is an object, wrap it in an array
          setTaskScheduling([dataList]);
        } else {
          // If no valid data, set empty array
          setTaskScheduling([]);
        }
      } else {
        setTaskScheduling([]);
      }
    } catch (error) {
      console.log('error in fetching task scheduling data', error);
      // Ensure taskScheduling is always an array even on error
      setTaskScheduling([]);
    }
  }


  // console.log(taskScheduling, 'taskScheduling');

  const handleUpdateTask = async (editRowData, editKey) => {
    try {
      // Parse the editKey to get parent and task indices
      const [parentIndex, taskIndex] = editKey.split('-').map(Number);

      // Get the specific parent item from taskScheduling array
      const parentItem = taskScheduling[parentIndex];
      if (!parentItem || !parentItem.TaskDetails) {
        console.error('Parent item or TaskDetails not found');
        notifyError('Task data not found');
        return;
      }

      // Create updated task details array for this specific parent
      const updatedTaskDetails = [...parentItem.TaskDetails];
      updatedTaskDetails[taskIndex] = editRowData;

      const updatePayload = {
        id: parentItem.id,
        ...payload,
        TaskDetails: updatedTaskDetails,
        Status: 1,
        AddedBy: '',
        UpdatedBy: ''
      };

      console.log('Updatepayload:789', updatePayload);

      const { data } = await axiosOther.post('addupdate-task-scheduling-data', updatePayload);

      if (data.Status === 1 || data.Status === 200) {
        notifySuccess('Task updated successfully');

        // Update the specific parent item in the taskScheduling array
        setTaskScheduling(prev => {
          const newTaskScheduling = [...prev];
          newTaskScheduling[parentIndex] = {
            ...parentItem,
            TaskDetails: updatedTaskDetails
          };
          return newTaskScheduling;
        });

        // Reset edit mode
        setEditIndex(null);
        setEditRowData({});

        // Optionally refresh the data from server
        // listTaskSchedulingData();
      } else {
        notifyError('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      notifyError('Error updating task. Please try again.');
    }
  };

  const handleAddTask = async () => {
    // if (TodoForm === null || TodoForm.length === 0) return;
    if (
      !TodoForm ||
      TodoForm.length === 0 ||
      TodoForm.some(task =>
        !task.ServiceType ||
        !task.ServiceName ||
        !task.AssignTo ||
        !task.StartDateTime ||
        !task.CompleteDateTime ||
        !task.Status
      )
    ) {
      notifyError("All fields are required");
      return;
    }


    const addPayload = {
      ...payload,
      TaskDetails: TodoForm,
      Status: "1",
      AddedBy: '',
      UpdatedBy: ''
    };

    console.log(addPayload, 'addPayload for creating task');

    try {
      const { data } = await axiosOther.post('addupdate-task-scheduling-data', addPayload)
      if (data.Status === 1) {
        notifySuccess('Task created successfully');
        setTodoForm([{
          ServiceType: '',
          ServiceName: '',
          AssignTo: '',
          StartDateTime: '',
          CompleteDateTime: '',
          Status: '',
          Remark: ''
        }])

        listTaskSchedulingData();
      }
    } catch (error) {
      console.error('Error in creating task:', error);
      notifyError(error.message);
    }
  }

  const handleStatusToggle = async (parentIndex, taskIndex) => {
    try {
      // Get the specific parent item and task from taskScheduling array
      const parentItem = taskScheduling[parentIndex];
      if (!parentItem || !parentItem.TaskDetails) {
        console.error('Parent item or TaskDetails not found');
        notifyError('Task data not found');
        return;
      }

      const task = parentItem.TaskDetails[taskIndex];
      const newStatus = task.Status === "Completed" ? "In Progress" : "Completed";

      // Construct the payload for updating task status
      const statusPayload = {
        SavedRecordId: parentItem.id,
        UniqueId: task.UniqueId || payload.QueryId,
        Status: newStatus,
        AssignedTo: task.AssignTo || "",
        ...payload
      };

      console.log('Status update payload:', statusPayload);

      const { data } = await axiosOther.post('updateTaskStatus', statusPayload);

      if (data.Status === 1 || data.Status === 200) {
        // Update the task status in the local state
        const updatedTaskList = [...taskScheduling];
        updatedTaskList[parentIndex].TaskDetails[taskIndex].Status = newStatus;

        setTaskScheduling(updatedTaskList);
        notifySuccess('Task status updated successfully');
      } else {
        notifyError('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      notifyError('Failed to update task status.');
    }
  };

  const handleDeleteData = async (editKey) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (!confirmation) return;

    try {
      // Parse the editKey to get parent and task indices
      const [parentIndex, taskIndex] = editKey.split('-').map(Number);

      // Get the specific parent item from taskScheduling array
      const parentItem = taskScheduling[parentIndex];
      if (!parentItem || !parentItem.TaskDetails) {
        console.error('Parent item or TaskDetails not found');
        notifyError('Task data not found');
        return;
      }

      // Create updated task details array by removing the selected task
      const updatedTaskDetails = parentItem.TaskDetails.filter((_, index) => index !== taskIndex);

      const deletePayload = {
        id: parentItem.id,
        ...payload,
        TaskDetails: updatedTaskDetails, // Send remaining tasks
        Status: "1",
        AddedBy: '',
        UpdatedBy: ''
      };

      console.log('Delete payload:', deletePayload);

      const { data } = await axiosOther.post('addupdate-task-scheduling-data', deletePayload);

      if (data?.Status == 1 || data?.status == 1) {
        notifySuccess("Task deleted successfully");

        // Update the specific parent item in the taskScheduling array
        setTaskScheduling(prev => {
          const newTaskScheduling = [...prev];
          if (updatedTaskDetails.length === 0) {
            // If no tasks left, remove the entire parent item
            return newTaskScheduling.filter((_, index) => index !== parentIndex);
          } else {
            // Update with remaining tasks
            newTaskScheduling[parentIndex] = {
              ...parentItem,
              TaskDetails: updatedTaskDetails
            };
            return newTaskScheduling;
          }
        });

        listTaskSchedulingData();
      } else {
        notifyError('Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      notifyError(err?.message || err?.Message || 'Error deleting task');
    }
  };


  useEffect(() => {
    listTaskSchedulingData();
  }, [QueryAlphaNumId])

  const hadleTaskModel = () => {
    setShowAddTask((prev) => !prev)
  };

  return (
    <>
      <div className="Taskscheduling p-0 m-0 ">
        {/* <div className="row border quotatation-shadows padding-around  py-2 px-2">
          <div className="col-12 col-lg-12 col-md-12 col-sm-12">
            <ToastContainer />
            <div className="row quotationquery me-0">
              <div className="col-2 col-md-2 col-lg-2 p-0 ">
                <p className="m-0 querydetails text-grey">Query Date:</p>
                <p className="m-0 querydetailspara text-grey">1 August 2024 l 12:46 PM
                </p>
              </div>
              <div className="col-2 col-md-2 p-0 text-center">
                <p className="m-0 querydetails text-grey">Status:</p>
                <p
                  className="m-0  font-weight-bold  badge py-1 px-2 text-grey"
                >Query Confirmed
                </p>
              </div>
              <div className="col-2 col-md-2 col-lg-2 p-0">
                <p className="m-0 querydetails text-grey">End Date:</p>
                <p className="m-0 querydetailspara text-grey"> 2 August 2024 l 12:46 PM
                </p>
              </div>
              <div className="col-3 col-md-3 col-lg-3 p-0 d-flex gap-3 align-items-center">
                <div className="d-flex gap-3">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-circle-user fs-4 text-secondary"></i>
                  </div>
                  <div>
                    <p className="m-0 font-size-14 font-weight-bold">
                      <b> Pawan Travel India</b>
                    </p>
                    <p className="m-0 font-weight-bold font-size-10">
                      <b>876636556</b>
                    </p>
                  </div>
                </div>
                <div className="whatsapp-icon">
                  <img src="/assets/icons/whatsapp.svg" alt="" />
                </div>
              </div>
              <div className="col-2 col-md-2  col-lg-3 d-flex justify-content-end align-items-center ">
                <div className="row quotationbuttons ">
                  <div className="col-lg-12 col-4  d">
                    <button className="btn btn-dark btn-custom-size me-2" name="SaveButton"
                      onClick={() => setActiveTab("ContactList")}
                    >
                      <span className="me-1">Back</span>
                      <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                    </button>
                    <button
                      className="btn btn-primary btn-custom-size "
                      name="SaveButton"
                      // onClick={() => navigate("/query/payments")}
                      onClick={() => setActiveTab("TourCard")}
                    >
                      <span className="me-1">Next</span>
                      <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <Modal className="fade quotationList">
          <Modal.Header>
            <ToastContainer />
            <Modal.Title>Make Final/ Select Supplement</Modal.Title>
            <Button
              variant=""
              className="btn-close"
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Table
                responsive
                striped
                bordered
                className="rate-table mt-2"
              >
                <thead>
                  <tr>
                    <th scope="col" className="py-2 align-middle ">
                      Day
                    </th>
                    <th scope="col" className="py-2 align-middle fs-4">
                      Service Type
                    </th>
                    <th scope="col" className="py-2 align-middle fs-4">
                      Select Hotel
                    </th>
                    <th scope="col" className="py-2 align-middle fs-4">
                      Price
                    </th>
                    <th scope="col" className="py-2 align-middle fs-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td className="text-center text-nowrap  py-2 fs-5">
                      Day
                    </td>
                    <td className="text-center text-nowrap  py-2 fs-5">
                    </td>
                    <td className="text-center text-nowrap  py-2 fs-5">
                      <select
                        name="Status"
                        id="status"
                        className="form-control form-control-sm"
                      >
                        <option value="">Select</option>

                      </select>
                    </td>
                    <td className="text-center text-nowrap  py-2 fs-5">
                    </td>
                    <td className="text-center text-nowrap  py-2 fs-5">
                      <button
                        className="btn btn-primary btn-custom-size fs-14"
                      >
                        Select
                      </button>
                    </td>
                  </tr>

                </tbody>
              </Table>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger light"
              className="btn-custom-size"
            >
              Close
            </Button>
            <Button
              variant="primary"
              className="btn-custom-size"
            >
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="row">
          <div className="col-12 d-flex justify-content-end align-items-center ">
            <div className="row quotationbuttons ">
              <div className="col-lg-12 col-4  d">
                <button className="btn btn-dark btn-custom-size me-2" name="SaveButton"
                  onClick={() => setActiveTab("ContactList")}
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
                <button
                  className="btn btn-primary btn-custom-size "
                  name="SaveButton"
                  // onClick={() => navigate("/query/payments")}
                  onClick={() => setActiveTab("TourCard")}
                >
                  <span className="me-1">Next</span>
                  <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row ">

          <div
            className="col-md-12  col-lg-12 col-sm-2 overflow  tablelist "

          >
            {/*<Table responsive className="quotationlist col-md-12" >
              <thead className="w-100">
                <tr className="w-100 light-gray-text ">
                  <th
                    className="p-0 py-2 px-1 border-0 quotationheading"
                    scope="col"
                  >
                    {" "}
                    QUOTATION ID
                  </th>
                  <th
                    className="p-0 py-2 px-1 border-0 quotationheading "
                    scope="col"
                  >
                    From Travel
                  </th>
                  <th
                    className="p-0 py-2 px-1 border-0 quotationheading"
                    scope="col"
                  >
                    {" "}
                    To Travel
                  </th>
                  <th
                    className="p-0 py-2 px-1 border-0 quotationheading "
                    scope="col"
                  >
                    {" "}
                    DURATION
                  </th>
                  <th
                    className="p-0 py-2 px-1 border-0  quotationheading"
                    scope="col"
                  >
                    {" "}
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="w-100 tablepara">

                <tr className="w-100  my-1" >
                  <td className=" quotationtext p-0 py-1 px-1 border-0 ">
                    <span
                      className="text-queryList-primary cursor-pointer"
                    >{QuotationNumber}
                    </span>
                  </td>
                  <td className="quotationtexts p-0 py-2 px-1 border-0  text-light">01-08-2024 | 01:04:10 PM
                  </td>
                  <td className="quotationtexts p-0 py-2 px-1 border-0 text-light ">21-08-2024
                  </td>
                  <td className="quotationtexts p-0 py-2 px-1 border-0 text-light">6N/7D
                  </td>

                  <td className="p-0 py-2 px-1 fs-6">
                    <div className="d-flex gap-3">
                      <button
                        className=" buttons px-1 quotationbuttonss btn btn-primary btn-custom-size"
                        onClick={hadleTaskModel}
                      >
                        Add Task
                      </button>

                    </div>
                  </td>
                </tr>

              </tbody>

            </Table>*/}

            <div className="row  mt-2 border headingsss ms-1 me-0">
              <div className="col border-right py-1" style={{ fontSize: "0.8rem" }}>Type</div>
              <div className="col border-right py-1" style={{ fontSize: "0.8rem" }}>Task Title</div>
              <div className="col border-right py-1" style={{ fontSize: "0.8rem" }}>Action Date / Time</div>
              <div className="col border-right py-1" style={{ fontSize: "0.8rem" }}>Completed Date / Time</div>
              <div className="col border-right py-1" style={{ fontSize: "0.8rem" }}>Remarks</div>
              <div className="col border-right py-1" style={{ fontSize: "0.8rem" }}>Status</div>
              <div className="col border-right py-1" style={{ fontSize: "0.8rem" }}>Assign To</div>
              <div className="col py-1" style={{ fontSize: "0.8rem" }}>Action</div>
            </div>
            {taskScheduling && Array.isArray(taskScheduling) && taskScheduling.length > 0 ?
              taskScheduling?.map((value, index) => (
                value.TaskDetails && value.TaskDetails.length > 0 && (
                  value.TaskDetails.map((task, taskIndex) => (
                    <div className="row border ms-1 content me-0" key={`${index}-${taskIndex}`} style={{ fontSize: "0.8rem" }}>
                      {editIndex === `${index}-${taskIndex}` ? (
                        <>
                          <div className="content p-1 border-right py-2 col">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editRowData.ServiceType}
                              onChange={e => setEditRowData({ ...editRowData, ServiceType: e.target.value })}
                            />
                          </div>
                          <div className="content p-1 border-right py-2 col">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editRowData.ServiceName}
                              onChange={e => setEditRowData({ ...editRowData, ServiceName: e.target.value })}
                            />
                          </div>
                          <div className="content p-1 border-right py-2 col">
                            <DatePicker
                              selected={(() => {
                                const value = editRowData.StartDateTime;
                                if (typeof value === 'string' && value.includes(' / ')) {
                                  try {
                                    const [datePart, timePart] = value.split(' / ');
                                    const [day, month, year] = datePart.split('-');
                                    const dateTimeString = `${month}/${day}/${year} ${timePart}`;
                                    const parsed = new Date(dateTimeString);
                                    return isNaN(parsed.getTime()) ? null : parsed;
                                  } catch {
                                    return null;
                                  }
                                }
                                const parsed = new Date(value);
                                return isNaN(parsed.getTime()) ? null : parsed;
                              })()}
                              onChange={(date) => {
                                if (date) {
                                  // Format the date as "12-07/2025 / 12:00 PM"
                                  const formattedDate = date.toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  }).replace(/\//g, '-') + ' / ' + date.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  });

                                  setEditRowData({
                                    ...editRowData,
                                    StartDateTime: formattedDate
                                  });
                                } else {
                                  setEditRowData({
                                    ...editRowData,
                                    StartDateTime: ''
                                  });
                                }
                              }}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              dateFormat="dd-MM-yyyy / h:mm aa"
                              timeCaption="Time"
                              className="form-control form-control-sm"
                              placeholderText="Select date and time"
                              isClearable
                            />
                          </div>
                          <div className="content p-1 border-right py-2 col">
                            <DatePicker
                              selected={(() => {
                                const value = editRowData.CompleteDateTime;
                                if (typeof value === 'string' && value.includes(' / ')) {
                                  try {
                                    const [datePart, timePart] = value.split(' / ');
                                    const [day, month, year] = datePart.split('-');
                                    const dateTimeString = `${month}/${day}/${year} ${timePart}`;
                                    const parsed = new Date(dateTimeString);
                                    return isNaN(parsed.getTime()) ? null : parsed;
                                  } catch {
                                    return null;
                                  }
                                }
                                const parsed = new Date(value);
                                return isNaN(parsed.getTime()) ? null : parsed;
                              })()}
                              onChange={(date) => {
                                if (date) {
                                  // Format the date as "12-07/2025 / 12:00 PM"
                                  const formattedDate = date.toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  }).replace(/\//g, '-') + ' / ' + date.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  });

                                  setEditRowData({
                                    ...editRowData,
                                    CompleteDateTime: formattedDate
                                  });
                                } else {
                                  setEditRowData({
                                    ...editRowData,
                                    CompleteDateTime: ''
                                  });
                                }
                              }}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              dateFormat="dd-MM-yyyy / h:mm aa"
                              timeCaption="Time"
                              className="form-control form-control-sm"
                              placeholderText="Select date and time"
                              isClearable
                            />
                          </div>
                          <div className="content p-1 border-right py-2 col">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editRowData.Remark}
                              onChange={e => setEditRowData({ ...editRowData, Remark: e.target.value })}
                            />
                          </div>
                          <div className="content p-1 border-right py-2 col">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editRowData.Status}
                              onChange={e => setEditRowData({ ...editRowData, Status: e.target.value })}
                            />
                          </div>
                          <div className="content p-1 border-right py-2 col">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editRowData.AssignTo}
                              onChange={e => setEditRowData({ ...editRowData, AssignTo: e.target.value })}
                            />
                          </div>
                          <div className="p-1 col py-2 d-flex justify-content-center gap-1">
                            <button
                              style={{ backgroundColor: '#1DB954', color: 'white', border: "none", padding: "0 10px", borderRadius: "12px" }}
                              onClick={() => handleUpdateTask(editRowData, `${index}-${taskIndex}`)}
                            >
                              Save
                            </button>
                            <button
                              style={{ backgroundColor: 'red', color: 'white', border: "none", padding: "0 6px", borderRadius: "12px" }}
                              onClick={() => setEditIndex(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="content p-1 border-right py-2 col">{task?.ServiceType}</div>
                          <div className="content p-1 border-right py-2 col">{task?.ServiceName}</div>
                          <div className="content p-1 border-right py-2 col">{task?.StartDateTime}</div>
                          <div className="content p-1 border-right py-2 col">{task?.CompleteDateTime}</div>
                          <div className="content p-1 border-right py-2 col">{task?.Remark}</div>
                          <div className="content p-1 border-right py-2 col">
                            <div className="form-check form-switch d-flex justify-content-center align-items-center">
                              <div
                                className="cursor-pointer d-flex align-items-center"
                                onClick={() => handleStatusToggle(index, taskIndex)}
                              >
                                {task.Status === "Completed" ?
                                  <img src='/assets/icons/complete.png' width="20px" alt="Completed" />
                                  : <img src='/assets/icons/pending.png' width="25px" alt="Pending" />
                                }
                                <label className="form-check-label ms-2 cursor-pointer">
                                  {task.Status === "Completed" ? "Completed" : "In Progress"}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="content p-1 border-right py-2 col">{task?.AssignTo}</div>
                          <div className="p-1 col py-2 d-flex justify-content-center gap-4">
                            <i
                              className="fas fa-edit text-success cursor-pointer"
                              onClick={() => {
                                setEditIndex(`${index}-${taskIndex}`);
                                setEditRowData(task);
                              }}
                            ></i>
                            <i className="fas fa-trash text-primary cursor-pointer" onClick={() => handleDeleteData(`${index}-${taskIndex}`)}></i>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )
              )) : (
                <div className="row border ms-1 content me-0">
                  <div className="col text-center py-3">
                    <p>No tasks available</p>
                  </div>
                </div>
              )}

            {TodoForm.map((form, index) => (
              <div className="row border ms-1 content me-0" key={index} >
                <div className="content p-1 border-right py-2 col">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="ServiceType"
                    value={form.ServiceType}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="content p-1 border-right py-2 col">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="ServiceName"
                    value={form.ServiceName}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="content p-1 border-right py-2 col">
                  <DatePicker
                    selected={form.StartDateTime ? (() => {
                      if (typeof form.StartDateTime === 'string' && form.StartDateTime.includes(' / ')) {
                        const [datePart, timePart] = form.StartDateTime.split(' / ');
                        const [day, month, year] = datePart.split('-');
                        const dateTimeString = `${month}/${day}/${year} ${timePart}`;
                        return new Date(dateTimeString);
                      }
                      return new Date(form.StartDateTime);
                    })() : null}
                    onChange={(date) => {
                      if (date) {
                        // Format the date as "12-07/2025 / 12:00 PM"
                        const formattedDate = date.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }).replace(/\//g, '-') + ' / ' + date.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        });

                        handleChange({
                          target: {
                            name: 'StartDateTime',
                            value: formattedDate
                          }
                        }, index);
                      } else {
                        handleChange({
                          target: {
                            name: 'StartDateTime',
                            value: ''
                          }
                        }, index);
                      }
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd-MM-yyyy / h:mm aa"
                    timeCaption="Time"
                    className="form-control form-control-sm"
                    placeholderText="Select date and time"
                    isClearable
                  />
                </div>
                <div className="content p-1 border-right py-2 col">
                  <DatePicker
                    selected={form.CompleteDateTime ? (() => {
                      if (typeof form.StartDateTime === 'string' && form.CompleteDateTime.includes(' / ')) {
                        const [datePart, timePart] = form.CompleteDateTime.split(' / ');
                        const [day, month, year] = datePart.split('-');
                        const dateTimeString = `${month}/${day}/${year} ${timePart}`;
                        return new Date(dateTimeString);
                      }
                      return new Date(form.CompleteDateTime);
                    })() : null}
                    onChange={(date) => {
                      if (date) {
                        // Format the date as "12-07/2025 / 12:00 PM"
                        const formattedDate = date.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }).replace(/\//g, '-') + ' / ' + date.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        });

                        handleChange({
                          target: {
                            name: 'CompleteDateTime',
                            value: formattedDate
                          }
                        }, index);
                      } else {
                        handleChange({
                          target: {
                            name: 'CompleteDateTime',
                            value: ''
                          }
                        }, index);
                      }
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd-MM-yyyy / h:mm aa"
                    timeCaption="Time"
                    className="form-control form-control-sm"
                    placeholderText="Select date and time"
                    isClearable
                  />
                </div>
                <div className="content p-1 border-right py-2 col">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="Remark"
                    value={form.Remark}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="content p-1 border-right py-2 col">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="Status"
                    value={form.Status}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="content p-1 border-right py-2 col">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="AssignTo"
                    value={form.AssignTo}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="p-1 pb-2 col text-primary d-flex justify-content-center gap-3">
                  <span onClick={() => handleService2Increment()} >
                    <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px" style={{ width: "20px", height: "20px", discplay: "flex", alignContent: 'center', fontSize: '1em' }}></i>
                  </span>
                  <span onClick={() => handleService2Decrement(index)} >
                    <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px" style={{ width: "20px", height: "20px", discplay: "flex", alignContent: 'center', fontSize: '1em' }}></i>
                  </span>
                </div>
              </div>
            ))}

            <button
              className=" buttons px-1 quotationbuttonss btn btn-primary btn-custom-size"
              onClick={handleAddTask}
              style={{ display: "block", marginLeft: "auto", marginTop: "10px" }}
            >
              Add Task
            </button>
          </div>

          {/* <DestinationsCard /> */}
        </div>
      </div>

      <AddTaskModel
        isOpen={showAddTask}
        isClose={() => setShowAddTask(false)}
        onOpenSelectTask={(todo) => {
          setSelectedTodo(todo);
          setShowAddTask(false);
          setShowSelectTask(true);
        }}
      />

      <SelectTaskModel
        isTaskOpen={showSelectTask}
        isTaskClose={() => setShowSelectTask(false)}
        todo={selectedTodo}
      />

    </>
  )
}

export default Taskscheduling;