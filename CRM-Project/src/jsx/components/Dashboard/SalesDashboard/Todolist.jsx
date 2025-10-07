import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { Row, Card, Col } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
const TodoTable = () => {
  const [tasks, setTasks] = useState([
    {
      subject: "Call Client A",
      assignedTo: "John Doe",
      leadType: "Hot",
      date: "2025-01-14",
      Time: "12-01-14",
      activity: "Call",
    },
    {
      subject: "Email Proposal",
      assignedTo: "Jane Smith",
      leadType: "Warm",
      date: "2025-01-15",
      Time: "12-01-14",
      activity: "Email",
    },
    {
      subject: "Email Proposal",
      assignedTo: "Jane Smith",
      leadType: "Warm",
      date: "2025-01-15",
      Time: "12-01-14",
      activity: "Email",
    },
    {
      subject: "Email Proposal",
      assignedTo: "Jane Smith",
      leadType: "Warm",
      date: "2025-01-15",
      Time: "12-01-14",
      activity: "Email",
    },
  ]);

  const handleEdit = (index) => {
    alert(`Edit task at index: ${index}`);
    // Add your edit logic here
  };

  const handleRemove = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <Row className="border-1 todolistsecond">
      <Col lg={12}>
        <Card>
          <ToastContainer />
          <Card.Body className="p-0 my-0 ">
            <h4 className="m-0 p-2 fs-15">To Do List</h4>
            <Table responsive striped bordered>
              <table className="table table-bordered salesdashboradtable">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Assigned To</th>
                    <th>Lead Type</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <tr key={index}>
                        <td>{task.subject}</td>
                        <td>{task.assignedTo}</td>
                        <td>{task.leadType}</td>
                        <td>{task.date}</td>
                        <td>{task.Time}</td>

                        <td>{task.activity}</td>
                        <td className="Actions align-item-center">
                          <span
                            className="badge text-white py-1 px-2 cursor-pointer"
                            style={{ background: "rgb(44, 161, 204)" }}
                          >
                            <i className="fa-solid fa-plus"></i> Action
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colspan="6" className="text-center">
                        No tasks available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TodoTable;
