import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { Row, Card, Col } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
const Saleslist = () => {
  const [tasks, setTasks] = useState([
    {
      date: "2025-01-14 debox global",
    },
    {
      date: "2025-01-15 Austrilian office",
    },
    {
      date: "2025-01-15 pawan trevel",
    },
    {
      date: "2025-01-15 HP",
    },
    {
      date: "2025-01-15 Make Travel",
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
    <Row className="border-1 todolistsecond mt-4">
      <Col lg={12}>
        <Card>
          <ToastContainer />
          <Card.Body className="p-0 my-0 ">
            <Table responsive striped bordered>
              <table className="table table-bordered salesdashboradtable">
                <thead>
                  <tr>
                    <th>
                      meeting (20%) <br />0
                    </th>
                    <th>
                      Quotation (5%)
                      <br />0
                    </th>
                    <th>
                      Task (7%)
                      <br />0
                    </th>
                    <th>
                      Created (12%)
                      <br />
                      151
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={index}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{task.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Saleslist;
