import React from "react";

//Next UI Components
import { Tabs, Tab } from "@nextui-org/tabs";

// Invoice components
import CashInvoice from "./cash_Invoice";
import CreateCashBillButton from "./Buttons/CreateCashBill";

// Item Tables
import Bearing_CashBillTable from "./Item Tables/bearings_CashBillTable";
import Gasket_CashBillTable from "./Item Tables/gasket_CashBillTable";
import Ring_CashBillTable from "./Item Tables/rings_CashBillTable";


const CashBills = () => {
  return (
    <div className="relative">
      <Tabs
        aria-label="Items"
        className="font-f1 ml-2"
        size="sm"
        variant="bordered"
        color="danger"
      >
        <Tab key="gaskets" title="GASKETS">
          <Gasket_CashBillTable />
        </Tab>
        <Tab key="rings" title="RINGS">
          <Ring_CashBillTable />
        </Tab>
        <Tab key="bearings" title="BEARINGS">
          <Bearing_CashBillTable />
        </Tab>
        <Tab key="sleeve" title="SLEEVE SETS">
          NO DATA
        </Tab>
      </Tabs>

      <CreateCashBillButton />

      <CashInvoice />
    </div>
  );
};

export default CashBills;
