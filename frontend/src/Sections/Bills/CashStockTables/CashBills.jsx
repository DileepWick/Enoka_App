import React from "react";
import CreateCashBillButton from "./CreateCashBill";
import { Tabs, Tab } from "@nextui-org/tabs";
import Gasket_CashBillTable from "./gasket_CashBillTable";
import CashInvoice from "./cash_Invoice";

const CashBills = () => {
  return (
    <div className="relative">
      
      <Tabs
        aria-label="Items"
        className="font-f1 ml-2 mt-8"
        size="sm"
        variant="bordered"
        color="primary"
      >
        <Tab key="gaskets" title="GASKETS">
          <Gasket_CashBillTable />
        </Tab>
        <Tab key="pistons" title="PISTONS">
          NO DATA
        </Tab>
        <Tab key="bearings" title="BEARINGS">
          NO DATA
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
