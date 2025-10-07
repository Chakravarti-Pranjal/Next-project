import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import activeQuotation from "/assets/icons/activeIcons/Quotation.svg";
import inactiveQuotation from "/assets/icons/InactiveIcons/Quotation.svg";
import activeAssignie from "/assets/icons/activeIcons/assignUser.svg";
import inactiveAssignie from "/assets/icons/InactiveIcons/assignUser.svg";
import activeCostSheet from "/assets/icons/activeIcons/Costsheet.svg";
import inactiveCostSheet from "/assets/icons/InactiveIcons/Costsheet.svg";
import activeInvoice from "/assets/icons/activeIcons/Invoice.svg";
import inactiveInvoice from "/assets/icons/InactiveIcons/Invoice.svg";
import activeMail from "/assets/icons/activeIcons/clientCommunication.svg";
import inactiveMail from "/assets/icons/InactiveIcons/clientCommunication.svg";
import activePayment from "/assets/icons/activeIcons/Payments.svg";
import inactivePayment from "/assets/icons/InactiveIcons/Payments.svg";
import activeProposal from "/assets/icons/activeIcons/Proposal.svg";
import inactiveProposal from "/assets/icons/InactiveIcons/Proposal.svg";
import activeQueryIcon from "/assets/icons/activeIcons/Query.svg";
import inactiveQueryIcon from "/assets/icons/InactiveIcons/Query.svg";
import activeSupplier from "/assets/icons/activeIcons/supplierCommunication.svg";
import inactiveSupplier from "/assets/icons/InactiveIcons/supplierCommunication.svg";
import activeTour from "/assets/icons/activeIcons/tourExecution.svg";
import inactiveTour from "/assets/icons/InactiveIcons/tourExecution.svg";
import activeVouchers from "/assets/icons/activeIcons/Voucher.svg";
import inactiveVouchers from "/assets/icons/InactiveIcons/Voucher.svg";
import { useDispatch, useSelector } from "react-redux";
import { setHideSendBtn } from "../../../store/actions/createExcortLocalForeignerAction";

const QueryNavbar = () => {
  const { pathname } = useLocation();
  const selector = useSelector((data) => data?.queryReducer);
  const dispatch = useDispatch();
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const { finalQueryData, finalQueryDataJson } = useSelector(
    (data) => data?.finalQueryDataReducer
  );
  const { queryData } = useSelector((data) => data?.queryReducer);

  // console.log(queryData, "finalQueryData");

  // List of items where navigation should be blocked
  const restrictedNavItems = [
    "Supplier Communication",
    "Payments",
    "Vouchers",
    "Invoices",
    "Tour Execution",
  ];

  const handleNavLink = async (item, e) => {
    const isQueryOrQuatation =
      queryQuotation?.QueryID && queryQuotation?.QoutationNum ? true : false;

    console.log(isQueryOrQuatation, "NAVT67766", finalQueryData);

    if (!isQueryOrQuatation) {
      if (restrictedNavItems.includes(item?.name) && !finalQueryData) {
        e.preventDefault();
        await swal({
          title: "Query is not confirmed",
          icon: "warning",
          buttons: {
            confirm: {
              text: "Ok",
              value: true,
              visible: true,
              className: "btn-custom-size btn btn-primary",
              closeModal: true,
            },
          },
          dangerMode: true,
        });
        return;
      }

      if (restrictedNavItems.includes(item?.name)) {
        localStorage.setItem(
          "Query_Qoutation",
          JSON.stringify({
            TourId: finalQueryDataJson[0]?.TourId,
            QoutationNum: finalQueryDataJson[0]?.QuotationNumber,
            QueryID: queryQuotation?.QueryID,
            Subject: finalQueryDataJson[0]?.Header?.Subject,
            ReferenceId: finalQueryDataJson[0]?.ReferenceId,
            QueryNumId: queryData?.QueryId,
            ClientName: queryData?.QueryAllData?.ClientName,
          })
        );
      }
    }

    if (item?.name === "Query") {
      dispatch(setHideSendBtn(false));
    }

    if (item?.name === "Payments") {
      console.log(queryQuotation, "queryQuotation");
    }
  };

  const queryViewList = [
    {
      name: "Query",
      inactiveIcon: inactiveQueryIcon,
      activeIcon: activeQueryIcon,
      link:
        queryQuotation?.QueryID !== ""
          ? `/query/preview/${selector?.queryData?.QueryId}`
          : "/query",
      matchPaths: ["/query", `/query/preview/${selector?.queryData?.QueryId}`],
      isQuery: true,
      isEnable: true,
    },
    {
      name: "Quotation",
      inactiveIcon: inactiveQuotation,
      activeIcon: activeQuotation,
      link: "/query/quotation-list",
      matchPaths: [
        "/query/quotation",
        "/query/quotation-list",
        ...["policy", "commission", "summary", "quotationList"]
          .map((item) => localStorage.getItem(item))
          .filter(Boolean),
      ],
      isEnable: true,
    },
    {
      name: "Cost Sheet",
      inactiveIcon: inactiveCostSheet,
      activeIcon: activeCostSheet,
      link: "/query/costsheet-list",
      matchPaths: ["/query/costsheet-list"],
    },
    {
      name: "Proposal",
      inactiveIcon: inactiveProposal,
      activeIcon: activeProposal,
      link: "/query/proposal-list",
      matchPaths: ["/query/proposal-list"],
    },
    {
      name: "Client Communication",
      inactiveIcon: inactiveMail,
      activeIcon: activeMail,
      link: "/query/client-communication",
      matchPaths: ["/query/client-communication"],
    },
    {
      name: "Supplier Communication",
      inactiveIcon: inactiveSupplier,
      activeIcon: activeSupplier,
      link: "/query/supplier-communication",
      matchPaths: ["/query/supplier-communication"],
    },
    {
      name: "Payments",
      inactiveIcon: inactivePayment,
      activeIcon: activePayment,
      link: "/query/payments",
      matchPaths: ["/query/payments"],
    },
    {
      name: "Vouchers",
      inactiveIcon: inactiveVouchers,
      activeIcon: activeVouchers,
      link: "/query/vouchers",
      matchPaths: ["/query/vouchers"],
    },
    {
      name: "Invoices",
      inactiveIcon: inactiveInvoice,
      activeIcon: activeInvoice,
      link: "/query/invoices",
      matchPaths: [
        "/query/invoices",
        "/query/invoice-show",
        "/query/generate-invoice",
      ],
    },
    {
      name: "Tour Execution",
      inactiveIcon: inactiveTour,
      activeIcon: activeTour,
      link: "/query/tour-execution",
      matchPaths: ["/query/tour-execution"],
    },
    {
      name: "Assign User",
      inactiveIcon: inactiveAssignie,
      link: "#",
      matchPaths: [],
    },
  ];

  const isActive = (navItem) => {
    if (navItem.isQuery) {
      return pathname === "/query" || pathname.startsWith("/query/preview/");
    }
    return navItem.matchPaths.some(
      (matchPath) => matchPath && pathname.startsWith(matchPath)
    );
  };

  return (
    <ul className="nav nav-pills-toolbar d-flex flex-nowrap align-items-center gap-4 justify-content-between p-1 radius-10 dark-border queryNavbarScroll">
      {queryViewList?.map((item, index) => (
        <li
          className="nav-item view-nav-item queryNavbarli rounded-pill mb-1"
          key={index}
        >
          <NavLink
            className={`rounded-pill d-flex align-items-center gap-2 font-weight-500 ${
              isActive(item) ? "Active" : "text-dark"
            }`}
            to={item.link}
            onClick={(e) => handleNavLink(item, e)} // Pass event to handleNavLink
            end={item.isQuery}
          >
            <img
              src={isActive(item) ? item.activeIcon : item.inactiveIcon}
              alt={`${item.name}-icon`}
              className="icons"
            />
            <p className="nav-name">{item.name}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default QueryNavbar;
