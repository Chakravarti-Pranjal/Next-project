import React, { useEffect, useState } from "react";
import "./voucher.css";
import { axiosOther } from "../../../../http/axios_base_url";
import { useSelector } from "react-redux";
import Voucher from "./Voucher";
import { supplierVoucherInitialValue } from "../../query-dashboard/quotation-second/qoutation_initial_value";

function SupplierVoucher({ selectedService }) {
  const [supplierVoucher, setSupplierVoucher] = useState(null);
  const [loading, setLoading] = useState(false);

  const { queryData } = useSelector((state) => state?.queryReducer);
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
  const companyId = JSON.parse(localStorage.getItem("token"));

  console.log(selectedService, "selectedServicedsjfksd");

  useEffect(() => {
    const fetchData = async () => {
      // Check minimum required fields
      if (
        !queryData?.QueryId ||
        !queryQuotation?.QoutationNum ||
        !selectedService?.SupplierId
      ) {
        console.log("Minimum validation failed:", {
          queryId: queryData?.QueryId,
          quotationNum: queryQuotation?.QoutationNum,
          supplierId: selectedService?.SupplierId,
        });
        setLoading(false);
        return;
      }

      // Log the selected service data for debugging
      console.log("Selected Service Data:", {
        ServiceId: selectedService?.ServiceId,
        ServiceName: selectedService?.ServiceName,
        ServiceUniqueId: selectedService?.ServiceUniqueId,
        SupplierId: selectedService?.SupplierId,
        UniqueId: selectedService?.UniqueId,
      });

      setLoading(true);

      try {
        // Build supplier voucher payload
        const supplierPayload = {
          QueryId: queryQuotation?.QueryID || queryData?.QueryId,
          QuotationNumber: queryQuotation?.QoutationNum,
          Type: "Supplier",
          SupplierId: selectedService.SupplierId.toString(),
          ServiceId: selectedService.ServiceId
            ? selectedService.ServiceId.toString()
            : undefined,
          ServiceUniqueId: selectedService.ServiceUniqueId,
          UniqueId: selectedService?.UniqueId,
          ServiceType: selectedService.ServiceName || "LocalAgent",
        };

        // Add optional fields only for non-LocalAgent services
        if (
          selectedService.ServiceName &&
          selectedService.ServiceName !== "LocalAgent"
        ) {
          if (selectedService.ServiceUniqueId) {
            supplierPayload.ServiceUniqueId = selectedService.ServiceUniqueId;
          }

          if (companyId?.companyKey) {
            supplierPayload.CompanyId = companyId.companyKey.toString();
          }

          // Add HotelId only if it's a Hotel service with ServiceId
          // if (
          //   selectedService.ServiceName === "Hotel" &&
          //   selectedService.ServiceId
          // ) {
          //   supplierPayload.HotelId = selectedService.ServiceId.toString();
          // }
        }

        console.log("Final supplier voucher payload:", supplierPayload);
        console.log(supplierPayload, "supplierPayload");
        const { data: supplierData } = await axiosOther.post(
          "listfinalvoucher",
          supplierPayload
        );
        // Handle both array and single object responses
        const supplierDataToSet = supplierData?.Data;
        if (supplierDataToSet) {
          setSupplierVoucher(supplierDataToSet);
        } else {
          setSupplierVoucher(null);
        }
        console.log(supplierData, "supplierVoucherData");
      } catch (error) {
        console.error("Error fetching supplier voucher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setSupplierVoucher(null);
    };
  }, [queryData, selectedService]);

  // Debug logs to check data
  console.log("SupplierVoucher:", supplierVoucher);

  if (loading) {
    return (
      <div className="bg-white d-flex justify-content-center align-items-center">
        Loading...
      </div>
    );
  }

  if (!supplierVoucher) {
    return (
      <div className="bg-white d-flex justify-content-center align-items-center">
        No voucher found for the selected service
      </div>
    );
  }

  // Convert to array if it's a single object
  const voucherArray = Array.isArray(supplierVoucher)
    ? supplierVoucher
    : [supplierVoucher];

  return (
    <div>
      {(Array.isArray(supplierVoucher)
        ? supplierVoucher
        : [supplierVoucher]
      ).map(
        (voucher, index) =>
          index === 0 && (
            <div key={index}>
              <Voucher
                InitialValue={supplierVoucher || supplierVoucherInitialValue}
                Type={supplierVoucherInitialValue.Type}
                supplieraddress={voucher.SupplierAddress}
                companyid={voucher?.CompanyId}
                companylogo={voucher?.ClientLogo}
                companyname={voucher?.CompanyName}
                arrivaldate={voucher?.ArrivalDate}
                departuredate={voucher?.DepartureDate}
                arrivalDestination={voucher?.ArrivalDestination}
                departureDestination={voucher?.DepartureDestination}
                confirmationno={voucher.ConfirmationNo}
                contactpersonname={voucher.ContactPersonName}
                destinantionname={voucher.ServiceDetails?.[0]?.DestinationName}
                destinationid={voucher.ServiceDetails?.[0]?.DestinationId}
                email={voucher.ContactEmail}
                phone={voucher.ContactPhone}
                queryid={voucher?.QuotationNumber?.split("-")[0]}
                quotationnumber={voucher?.QuotationNumber}
                serviceid={selectedService.ServiceId}
                serviceUniqueId={voucher.ServiceUniqueId}
                servicename={voucher.ServicesName}
                servicetype={voucher.ServiceType}
                supplierid={selectedService.SupplierId}
                suppliername={voucher.SupplierName}
                clientName={voucher?.ClientName}
                totalpax={voucher?.TotalPax}
                tourid={voucher?.TourId}
                totalnights={voucher.ServiceDetails?.[0]?.TotalNights}
                uniqueid={voucher.UniqueId}
                website={voucher?.ClientWebsite}
                mealPlan={voucher.ServiceDetails?.[0]?.MealPlanName}
                roomtype={voucher.ServiceDetails?.[0]?.RoomTypeName}
                ClientAddress={voucher?.ClientAddress}
                ClientMobile={voucher?.ClientMobile}
                ClientEmail={voucher?.ClientEmail}
                date={voucher.ServiceDetails?.[0]?.Date}
                allData={voucher}
                voucherNo={selectedService?.VoucherNo}
                id={selectedService?.id}
              />
            </div>
          )
      )}
    </div>
  );
}

export default SupplierVoucher;
