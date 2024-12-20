import React from "react";
import { Sidebar } from "../components/Dashboard_Components/Sidebar";
import Header from "./Header";
import { Tabs, Tab } from "@nextui-org/react";

//Cash bills
import CashBills from "@/Sections/Bills/CashBills";



const BillsManagement = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Tabs className="font-f1 mb-8 text-lg" size="lg" variant="underlined">
            <Tab key="CASH BILLS" title="CASH BILLS" className="text-2xl">
              <CashBills />
            </Tab>

            <Tab
              key="New Item"
              title="CREDIT BILLS"
              className="text-2xl font-f1"
            ></Tab>

            <Tab key="RECEIPTS" title="RECEIPTS" className="text-2xl"></Tab>
            <Tab key="REPORTS" title="RETURNS" className="text-2xl"></Tab>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default BillsManagement;
