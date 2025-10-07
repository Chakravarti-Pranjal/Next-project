import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { parse, isValid, format } from "date-fns";

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

function SupplierByServiceListModal({
  isModalOpen,
  setIsModalOpen,
  listBySupplier,
  selectedListBySupplier,
  setSelectedListBySupplier,
}) {
  console.log(selectedListBySupplier, "WSTARSRSRS6655", listBySupplier);

  const handleServiceCheckboxChange = (
    serviceUniqueId,
    supplierId,
    service
  ) => {
    setSelectedListBySupplier((prev) => {
      const supplierServices = prev[supplierId] || [];
      if (supplierServices.some((s) => s.ServiceUniqueId === serviceUniqueId)) {
        // Uncheck: Remove service from the array
        const updatedServices = supplierServices.filter(
          (s) => s.ServiceUniqueId !== serviceUniqueId
        );
        return {
          ...prev,
          [supplierId]: updatedServices.length > 0 ? updatedServices : [],
        };
      } else {
        // Check: Add service to the array
        return {
          ...prev,
          [supplierId]: [...supplierServices, service],
        };
      }
    });
  };

  const handleDayCheckboxChange = (day, supplierId) => {
    setSelectedListBySupplier((prev) => {
      const supplierServices = prev[supplierId] || [];
      const dayServiceIds = day.Services.map((s) => s.ServiceUniqueId);
      const allSelected = dayServiceIds.every((id) =>
        supplierServices.some((s) => s.ServiceUniqueId === id)
      );

      if (allSelected) {
        // Uncheck all services for the day
        const updatedServices = supplierServices.filter(
          (s) => !dayServiceIds.includes(s.ServiceUniqueId)
        );
        return {
          ...prev,
          [supplierId]: updatedServices.length > 0 ? updatedServices : [],
        };
      } else {
        // Check all services for the day
        const existingServiceIds = supplierServices.map(
          (s) => s.ServiceUniqueId
        );
        const newServices = day.Services.filter(
          (s) => !existingServiceIds.includes(s.ServiceUniqueId)
        );
        return {
          ...prev,
          [supplierId]: [...supplierServices, ...newServices],
        };
      }
    });
  };

  const isServiceChecked = (serviceUniqueId, supplierId) => {
    return (
      selectedListBySupplier?.[supplierId]?.some(
        (s) => s.ServiceUniqueId === serviceUniqueId
      ) || false
    );
  };

  const isDayChecked = (day, supplierId) => {
    const dayServiceIds = day.Services.map((s) => s.ServiceUniqueId);
    return dayServiceIds?.every((id) =>
      selectedListBySupplier?.[supplierId]?.some(
        (s) => s.ServiceUniqueId === id
      )
    );
  };

  const isAllServicesChecked = () => {
    // Check if every service in listBySupplier is in selectedListBySupplier
    return listBySupplier?.every((day) =>
      day.Services?.every((service) =>
        selectedListBySupplier[day.SupplierId]?.some(
          (s) => s.ServiceUniqueId === service.ServiceUniqueId
        )
      )
    );
  };

  const handleHeaderCheckboxChange = () => {
    setSelectedListBySupplier((prev) => {
      if (isAllServicesChecked()) {
        // If all services are checked, clear all selections
        return {};
      } else {
        // Select all services
        const newSelected = {};
        listBySupplier?.forEach((day) => {
          if (day.Services?.length > 0) {
            newSelected[day.SupplierId] = [
              ...(newSelected[day.SupplierId] || []),
              ...day.Services,
            ];
          }
        });
        return newSelected;
      }
    });
  };

  return (
    <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Services Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-3 py-2">
        <table
          className="table table-bordered itinerary-table mt-2 tableEvenOdd"
          style={{ fontSize: "0.9rem" }}
        >
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="form-check-input height-em-1 width-em-1"
                  checked={isAllServicesChecked()}
                  onChange={handleHeaderCheckboxChange}
                />
              </th>
              <th>Day</th>
              <th>From</th>
              <th>To</th>
              <th>City / Sector</th>
              <th>Service</th>
              <th>Service Details</th>
              <th>Pax</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {listBySupplier?.length > 0 &&
              listBySupplier?.map((day, dayIndex) =>
                day.Services && day.Services.length > 0 ? (
                  <>
                    {day.Services.map((service, serviceIndex) => (
                      <tr key={`${dayIndex}-${serviceIndex}`}>
                        {serviceIndex === 0 && (
                          <>
                            <td rowSpan={day.Services.length}>
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                checked={isDayChecked(day, day.SupplierId)}
                                onChange={() =>
                                  handleDayCheckboxChange(day, day.SupplierId)
                                }
                              />
                            </td>
                            <td rowSpan={day.Services.length}>{day.Day}</td>
                            <td rowSpan={day.Services.length}>
                              {getValidDate(day.FromDate)}
                            </td>
                            <td rowSpan={day.Services.length}>
                              {getValidDate(day.ToDate)}
                            </td>
                            {console.log(service?.Sector, "WATFD^D")}
                            <td rowSpan={day.Services.length}>
                              {service?.Sector
                                ? service?.Sector
                                : day.DestinationName}
                            </td>
                          </>
                        )}
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input height-em-1 width-em-1"
                            checked={isServiceChecked(
                              service.ServiceUniqueId,
                              day.SupplierId
                            )}
                            onChange={() =>
                              handleServiceCheckboxChange(
                                service.ServiceUniqueId,
                                day.SupplierId,
                                service
                              )
                            }
                          />
                          {` ${service.ServiceType}`}
                        </td>
                        <td>{service.ServiceDetail}</td>
                        <td>{service.Pax}</td>
                        <td>{service.Amount}</td>
                      </tr>
                    ))}
                    {dayIndex < listBySupplier.length - 1 && (
                      <tr>
                        <td colSpan={9} style={{ height: '10px' }}>&nbsp;</td>
                      </tr>
                    )}
                  </>
                ) : (
                  <>
                    <tr key={dayIndex}>
                      <td colSpan={9}>No services available for Day {day.Day}</td>
                    </tr>
                    {
                      dayIndex < listBySupplier.length - 1 && (
                        <tr>
                          <td colSpan={9} style={{ height: '10px' }}>&nbsp;</td>
                        </tr>
                      )
                    }
                  </>
                )
              )}
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
