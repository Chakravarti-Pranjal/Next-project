import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { parse, isValid, format } from "date-fns";

function SupplierByServiceListModal({
  isModalOpen,
  setIsModalOpen,
  listBySupplier,
  selectedListBySupplier,
  setSelectedListBySupplier,
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // dd-MM-yyyy
  const getValidDate = (dateString) => {
    if (!dateString) return "";
    const parsed = parse(dateString, "yyyy-MM-dd", new Date());
    if (!isValid(parsed)) {
      console.error("Invalid date:", dateString);
      return new Date();
    }
    return format(parsed, "dd-MM-yyyy");
  };

  // Initialize selectedRows based on listBySupplier and selectedListBySupplier
  useEffect(() => {
    if (listBySupplier?.length > 0) {
      const newSelectedRows = listBySupplier.map(
        (service) =>
          selectedListBySupplier[service?.SupplierId]?.some(
            (selectedService) =>
              selectedService.ServiceUniqueId === service?.ServiceUniqueId
          ) || false
      );
      setSelectedRows(newSelectedRows);
      setSelectAll(newSelectedRows.every((row) => row));
    } else {
      setSelectedRows([]);
      setSelectAll(false);
    }
  }, [listBySupplier, selectedListBySupplier]);

  // Handle header checkbox toggle
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedRows(new Array(listBySupplier?.length || 0).fill(newSelectAll));

    // Update selectedListBySupplier
    const updatedSelection = { ...selectedListBySupplier };
    if (newSelectAll) {
      listBySupplier.forEach((service) => {
        const supplierId = service?.SupplierId;
        if (!updatedSelection[supplierId]) {
          updatedSelection[supplierId] = [];
        }
        if (
          !updatedSelection[supplierId].some(
            (s) => s.ServiceUniqueId === service.ServiceUniqueId
          )
        ) {
          updatedSelection[supplierId].push(service);
        }
      });
    } else {
      listBySupplier.forEach((service) => {
        const supplierId = service?.SupplierId;
        updatedSelection[supplierId] = [];
      });
    }
    setSelectedListBySupplier(updatedSelection);
  };

  // Handle individual checkbox toggle
  const handleRowCheckbox = (index) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[index] = !newSelectedRows[index];
    setSelectedRows(newSelectedRows);

    // Update selectAll state
    const allSelected = newSelectedRows.every((row) => row);
    setSelectAll(allSelected);

    // Update selectedListBySupplier
    const updatedSelection = { ...selectedListBySupplier };
    const service = listBySupplier[index];
    const supplierId = service?.SupplierId;

    if (!updatedSelection[supplierId]) {
      updatedSelection[supplierId] = [];
    }

    if (newSelectedRows[index]) {
      if (
        !updatedSelection[supplierId].some(
          (s) => s.ServiceUniqueId === service.ServiceUniqueId
        )
      ) {
        updatedSelection[supplierId].push(service);
      }
    } else {
      updatedSelection[supplierId] = updatedSelection[supplierId].filter(
        (s) => s.ServiceUniqueId !== service.ServiceUniqueId
      );
    }

    setSelectedListBySupplier(updatedSelection);
  };

  return (
    <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Services Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-3 py-2">
        <table
          className="table table-bordered itinerary-table mt-2"
          style={{ fontSize: "0.8em" }}
        >
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="form-check-input height-em-1 width-em-1"
                />
              </th>
              <th>S No</th>
              <th>From</th>
              <th>To</th>
              <th>City</th>
              <th>Service</th>
              <th>Service Details</th>
              <th>Pax</th>
              <th>Amount</th>
              <th>Total</th>
            </tr>
          </thead>
          {console.log(listBySupplier, "listBySupplier")}
          <tbody>
            {listBySupplier?.length > 0 &&
              listBySupplier.map((service, index) => (
                <tr key={index} style={{ cursor: "pointer" }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows[index] || false}
                      onChange={() => handleRowCheckbox(index)}
                      className="form-check-input height-em-1 width-em-1"
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{getValidDate(service?.FromDate)}</td>
                  <td>{getValidDate(service?.ToDate)}</td>
                  <td>{service?.DestinationName}</td>
                  <td>{service?.ServiceType}</td>
                  <td>{service?.ServiceDetail}</td>
                  <td>{service?.Pax}</td>
                  <td>{service?.Amount}</td>
                  <td>{service?.Total}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-secondary"
          onClick={() => setIsModalOpen(false)}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default SupplierByServiceListModal;
