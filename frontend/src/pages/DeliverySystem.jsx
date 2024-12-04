import React, { useState } from 'react';
import CreateDeliveryForm from '@/components/Delivery_Components/createDelivery';
import GasketList from '@/components/Delivery_Components/gaskets';
import { Spinner } from '@nextui-org/react';

const DeliverySystem = () => {
  // State to trigger re-fetch of gaskets
  const [triggerGasketFetch, setTriggerGasketFetch] = useState(false);
  // State to manage the loading state
  const [loading, setLoading] = useState(false);

  // Function to handle the API call success in CreateDeliveryForm
  const handleDeliveryCreated = () => {
    // Trigger the re-fetch in GasketList
    setTriggerGasketFetch((prev) => !prev);  // Toggle the state to trigger re-fetch
  };

  // Function to simulate loading state (in a real case, you would set loading based on API response)
  const handleGasketFetch = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div>
      <h2>Delivery System</h2>
      <CreateDeliveryForm onDeliveryCreated={handleDeliveryCreated} />
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <GasketList triggerFetch={triggerGasketFetch} setLoading={handleGasketFetch} />
      )}
    </div>
  );
};

export default DeliverySystem;
