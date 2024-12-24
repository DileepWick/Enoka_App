import CreateDeliveryForm from "@/components/Delivery_Components/createDelivery";
import { Tabs, Tab } from "@nextui-org/react";

import BearingsList from "@/components/Delivery_Components/bearings";
import RingsList from "@/components/Delivery_Components/rings";
import GasketList from "@/components/Delivery_Components/gaskets";

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
        <Tab key="pistons" title="RINGS">
          <RingsList />
        </Tab>
        <Tab key="bearings" title="BEARINGS">
          <BearingsList />
        </Tab>
      </Tabs>
    </div>
  );
};

export default DeliverySystem;
