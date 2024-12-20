import React, { useState } from "react";
import CreateDeliveryForm from "@/components/Delivery_Components/createDelivery";
import GasketList from "@/components/Delivery_Components/gaskets";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

const DeliverySystem = () => {
  return (
    <div>
      <CreateDeliveryForm />

      <Tabs
        aria-label="Items"
        className="font-f1 ml-2"
        size="sm"
        variant="bordered"
        color="primary"
      >
        <Tab key="gaskets" title="GASKETS">
          <GasketList />
        </Tab>
        <Tab key="pistons" title="PISTONS">
          No Data
        </Tab>
        <Tab key="razors" title="RAZORS">
          No Data
        </Tab>
      </Tabs>
    </div>
  );
};

export default DeliverySystem;
