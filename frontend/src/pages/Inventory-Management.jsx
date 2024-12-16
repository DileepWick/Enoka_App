import React from "react";

import { Sidebar } from "../components/Dashboard_Components/Sidebar";
import Header from "./Header";
import { Chip } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";

import AddItemForm from "./Add_gasket";
import AllGaskets from "@/Sections/Inventory/AllGaskets";

const Inventory = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Tabs className="font-f1 mb-8 text-lg" size="lg" variant="underlined">
            <Tab key="STOCKS" title="STOCKS" className="text-2xl">
              <h1 className="text-sm font-f1 ml-3">Select Item Type </h1>
              <Tabs
                aria-label="Items"
                className="font-f1 ml-2"
                size="sm"
                variant="bordered"
                color="primary"
              >
                <Tab key="gaskets" title="GASKETS">
                  <AllGaskets />
                </Tab>
                <Tab key="pistons" title="PISTONS">
                  No Data
                </Tab>
                <Tab key="razors" title="RAZORS">
                  No Data
                </Tab>
              </Tabs>
            </Tab>

            <Tab key="New Item" title="NEW ITEM" className="text-2xl font-f1">
              <h1 className="text-sm font-f1 ml-3">Select Item Type </h1>
              <Tabs
                aria-label="Items"
                className="font-f1 ml-2"
                size="sm"
                variant="bordered"
                color="primary"
              >
                <Tab key="gaskets" title="GASKET">
                  <AddItemForm />
                </Tab>
                <Tab key="pistons" title="PISTON">
                  No Data
                </Tab>
                <Tab key="razors" title="RAZOR">
                  No Data
                </Tab>
              </Tabs>
            </Tab>

            <Tab key="Reports" title="REPORTS" className="text-2xl">
              <h1>Reports</h1>
            </Tab>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Inventory;
