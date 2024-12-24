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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Tabs className="font-f1 mb-8 text-lg" size="lg" variant="underlined">
            <Tab key="deliverySystem" title="NEW DELIVERY" className="text-2xl">
              <DeliverySystem />
            </Tab>
            <Tab key="ondelivery" title="ON GOING" className="text-2xl">
              <OnDeliveryTable />
            </Tab>
            <Tab key="Received" title="RECEIVED" className="text-2xl">
              <ReceivedDeliveryTable />
            </Tab>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
