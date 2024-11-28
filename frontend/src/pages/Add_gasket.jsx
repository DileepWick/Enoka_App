import React, { useState } from "react";

// Placeholder data for dropdowns
const engines = [
  { id: 1, name: "Engine 1" },
  { id: 2, name: "Engine 2" },
  { id: 3, name: "Engine 3" },
];

const brands = [
  { id: 1, name: "Brand 1" },
  { id: 2, name: "Brand 2" },
  { id: 3, name: "Brand 3" },
];

const vendors = [
  { id: 1, name: "Vendor 1" },
  { id: 2, name: "Vendor 2" },
  { id: 3, name: "Vendor 3" },
];

export default function AddItemForm() {
  const [formData, setFormData] = useState({
    partNumber: "",
    description: "",
    stock: "",
    minStock: "",
    year: "",
    materialType: "",
    packingType: "",
    engineId: "",
    brandId: "",
    vendorId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Item</h1>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-1/2">
            <label htmlFor="partNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Part Number
            </label>
            <input
              id="partNumber"
              name="partNumber"
              type="text"
              value={formData.partNumber}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="w-full sm:w-1/2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-1/3">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="w-full sm:w-1/3">
            <label htmlFor="minStock" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Stock
            </label>
            <input
              id="minStock"
              name="minStock"
              type="number"
              value={formData.minStock}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="w-full sm:w-1/3">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-1/2">
            <label htmlFor="materialType" className="block text-sm font-medium text-gray-700 mb-1">
              Material Type
            </label>
            <select
              id="materialType"
              name="materialType"
              value={formData.materialType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select material type</option>
              <option value="steel">Steel</option>
              <option value="hellite">Hellite</option>
              <option value="wog">WOG</option>
            </select>
          </div>
          
          <div className="w-full sm:w-1/2">
            <label htmlFor="packingType" className="block text-sm font-medium text-gray-700 mb-1">
              Packing Type
            </label>
            <select
              id="packingType"
              name="packingType"
              value={formData.packingType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select packing type</option>
              <option value="fullSet">Full Set</option>
              <option value="headSet">Head Set</option>
              <option value="gasketOnly">Gasket Only</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-1/3">
            <label htmlFor="engineId" className="block text-sm font-medium text-gray-700 mb-1">
              Engine
            </label>
            <select
              id="engineId"
              name="engineId"
              value={formData.engineId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select engine</option>
              {engines.map((engine) => (
                <option key={engine.id} value={engine.id.toString()}>
                  {engine.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-1/3">
            <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <select
              id="brandId"
              name="brandId"
              value={formData.brandId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-1/3">
            <label htmlFor="vendorId" className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <select
              id="vendorId"
              name="vendorId"
              value={formData.vendorId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id.toString()}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out text-lg font-semibold"
      >
        Add Item
      </button>
    </form>
  );
}

