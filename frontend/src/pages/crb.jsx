import React from "react";
import Invoice from "../components/Bill_Components/Inovoicetest"; // Adjust the path based on your file structure

const InvoicePage = () => {
  const companyDetails = {
    name: "Inoka Motors",
    address: "No 09, Cross Street Kandy",
    contact: "077-7386756 / 071-1336262 / 081-2220320",
  };

  const logo = "/path-to-logo/logo.png"; // Replace with the actual path to the logo
  const billNumber = "BILL-123456";
  const billType = "Cash";

  const customerDetails = {
    name: "John Doe",
    address: "123 Main Street, City, Country",
  };

  const items = [
    { name: "Item 1", price: 10, quantity: 2, discount: 1 },
    { name: "Item 2", price: 15, quantity: 1, discount: 0 },
    { name: "Item 3", price: 5, quantity: 4, discount: 2 },
  ];

  const note = "Thank you for your purchase!";

  return (
    <div>
      <Invoice
        companyDetails={companyDetails}
        logo={logo}
        billNumber={billNumber}
        items={items}
        billType={billType}
        customerDetails={customerDetails}
        note={note}
      />
    </div>
  );
};

export default InvoicePage;
