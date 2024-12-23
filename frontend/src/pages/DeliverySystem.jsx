import React, { useState } from "react";
import CreateDeliveryForm from "@/components/Delivery_Components/createDelivery";
import GasketList from "@/components/Delivery_Components/gaskets";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

const DeliverySystem = () => {




  return (
    <div>
      <CreateDeliveryForm />

      <Tabs aria-label="Items" className="font-f1 ml-4" size="lg">
        <Tab key="gaskets" title="Gaskets">
          <GasketList/>
        </Tab>
        <Tab key="pistons" title="Pistons">
          No Data
        </Tab>
        <Tab key="razors" title="Razors">
          No Data
        </Tab>
      </Tabs>
    </div>
  );
};

export default DeliverySystem;
