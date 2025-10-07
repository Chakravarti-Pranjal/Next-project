import React, { useEffect, useState } from "react";
import Vouche1 from "./Voucher";
import "./voucher.css";
import VouchersList from "./VouchersList";
import PendingPopup from "./PendingPopup";

function VouchersNavbar() {
  return (
    <>
      <div>
        <VouchersList />
        <PendingPopup />
      </div>
    </>
  );
}

export default VouchersNavbar;
