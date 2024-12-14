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
        <Chip className="ml-8 font-f1 text-2xl p-4" variant="dot" size="lg">
          Inventory Management
        </Chip>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Tabs className="font-f1" size="md" variant="bordered" color="danger">
            <Tab key="Stocks" title="Stocks">
              <label className="font-f1">Select Item Type :</label><br></br>
              <Tabs aria-label="Items" className="font-f1" size="lg">
                <Tab key="gaskets" title="Gaskets">
                  <AllGaskets />
                </Tab>
                <Tab key="pistons" title="Pistons">
                  No Data
                </Tab>
                <Tab key="razors" title="Razors">
                  No Data
                </Tab>
              </Tabs>
            </Tab>
            <Tab key="New Item" title="New Item">
              <AddItemForm />
            </Tab>
            <Tab key="Reports" title="Reports">
              <h1>Reports</h1>
            </Tab>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Inventory;
