import React, { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Table, Dropdown, Badge } from "react-bootstrap";

const FlightModal = () => {
  const [addNew, setAddNew] = useState(false);
  const [formData, setFormData] = useState({
    Destination: "",
    DepartureFrom: "",
    ArrivalTo: "",
    FlightType: "",
    Search: "",
  });

  const [addFormData, setAddFormData] = useState({
    FlightName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({ ...addFormData, [name]: value });
  };

  return (
    <>
      {!addNew && (
        <div>
          <div className="row px-2">
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ----
              </label>
              <select
                name="Destination"
                value={formData?.Destination}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select Destination</option>
                <option value="1">All Destination</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                DEPARTURE FROM
              </label>
              <select
                name="DepartureFrom"
                value={formData?.DepartureFrom}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">Delhi</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                ARRIVAL TO
              </label>
              <select
                name="ArrivalTo"
                value={formData?.ArrivalTo}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">1 Night</option>
              </select>
            </div>
            <div className="col-2 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                FLIGHT TYPE
              </label>
              <select
                name="FlightType"
                value={formData?.FlightType}
                onChange={handleChange}
                id=""
                className="font-size-10 border py-1 rounded"
              >
                <option value="">Select</option>
                <option value="1">1 Night</option>
              </select>
            </div>
            <div className="col-3 p-0 d-flex flex-column border p-1">
              <label htmlFor="" className="m-0 font-size-9 font-weight-bold">
                SEARCH
              </label>
              <input
                type="text"
                placeholder="Search"
                className="font-size-10 border py-1 rounded outline-0"
                name="Search"
                value={formData?.Search}
                onChange={handleChange}
              />
            </div>
            <div className="col-1 p-0 d-flex justify-content-center align-items-center  border">
              <p className="m-0 font-size-10 px-2 py-1 bg-success rounded cursor-pointer">
                Search
              </p>
            </div>
          </div>
          <div className="row mt-2 justify-content-end px-2">
            <div className="col-2 p-0 d-flex justify-content-end">
              <button
                className="btn btn-success font-size-10"
                onClick={() => setAddNew(true)}
              >
                Add New +
              </button>
            </div>
          </div>
          <div className="row mt-2">
            <PerfectScrollbar className="dlabnav-scroll">
              <form action="">
                <div className="col-12 p-0">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th className="width80">
                          <strong>Flight Name</strong>
                        </th>
                        <th>
                          <strong>Supplier Name</strong>
                        </th>
                        <th>
                          <strong>Flight Number</strong>
                        </th>
                        <th>
                          <strong>Flight Class</strong>
                        </th>
                        <th>
                          <strong>Currecy [ROE]</strong>
                        </th>
                        <th>
                          <strong>Adult Cost</strong>
                        </th>
                        <th>
                          <strong>Child Cost</strong>
                        </th>
                        <th>
                          <strong>Action</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>01</strong>
                        </td>
                        <td>Mr. Bobby</td>
                        <td>Dr. Jackson</td>
                        <td>Dr. Jackson</td>
                        <td>01 August 2022</td>
                        <td>
                          <Badge variant="success light">Successful</Badge>
                        </td>
                        <td>$21.56</td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="success"
                              className="light sharp i-false"
                            >
                              {/* {svg1} */}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>Edit</Dropdown.Item>
                              <Dropdown.Item>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>02</strong>
                        </td>
                        <td>Mr. Bobby</td>
                        <td>Dr. Jackson</td>
                        <td>Dr. Jackson</td>
                        <td>01 August 2022</td>
                        <td>
                          <Badge variant="danger light">Canceled</Badge>
                        </td>
                        <td>$21.56</td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="danger"
                              className="light sharp i-false"
                            >
                              {/* {svg1} */}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>Edit</Dropdown.Item>
                              <Dropdown.Item>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>03</strong>
                        </td>
                        <td>Mr. Bobby</td>
                        <td>Dr. Jackson</td>
                        <td>01 August 2022</td>
                        <td>
                          <Badge variant="warning light">Pending</Badge>
                        </td>
                        <td>$21.56</td>
                        <td>$21.56</td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="warning"
                              className="light sharp i-false"
                            >
                              {/* {svg1} */}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>Edit</Dropdown.Item>
                              <Dropdown.Item>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </form>
            </PerfectScrollbar>
          </div>
        </div>
      )}
      {addNew && (
        <div>
          <div className="row mt-2 position-relative">
            <div className="col-4">
              <label htmlFor="">FLIGHT NAME</label>
              <input
                type="text"
                className="form-input-6"
                placeholder="Flight Name"
                name="FlightName"
                value={addFormData?.FlightName}
                onChange={handleAddChange}
              />
            </div>
            <button
              className=" btn width60px btn-sm btn-dark position-absolute bottom-80px right190px"
              onClick={() => setAddNew(false)}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FlightModal;
