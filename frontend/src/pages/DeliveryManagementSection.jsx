import { Sidebar } from "../components/Dashboard_Components/Sidebar";
import  Header  from "../pages/Header";
import { Chip } from "@nextui-org/react";

//New Delivery
import DeliverySystem from "./DeliverySystem";

//On Delivery
import OnDeliveryTable from "../components/Delivery_Components/onDeliveryTable";

//Received
import ReceivedDeliveryTable from "@/components/Delivery_Components/receivedDeliveryTable";

import { Tabs, Tab } from "@nextui-org/react";

export function DeliveryManagement() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <Chip className="ml-8 font-f1 text-2xl p-4" variant="dot" size="lg">Delivery Management</Chip>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Tabs className="font-f1" size="md" variant="bordered" color="danger">
            <Tab key="deliverySystem" title="New Delivery">
              <DeliverySystem />
            </Tab>
            <Tab key="ondelivery" title="On Delivery">
              <OnDeliveryTable />
            </Tab>
            <Tab key="Received" title="Received">
              <ReceivedDeliveryTable />
            </Tab>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
