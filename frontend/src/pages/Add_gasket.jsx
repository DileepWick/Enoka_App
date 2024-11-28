import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function AddItemForm() {
  const [formData, setFormData] = useState({
    part_number: "",
    description: "",
    stock: "",
    minstock: "",
    year: "",
    material_type: "",
    packing_type: "",
    engine_id: "",
    brand_id: "",
    vendor_id: "",
  });

  const [vendors, setVendors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [engines, setEngines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsResponse, brandsResponse, enginesResponse] = await Promise.all([
          axios.get('http://localhost:8098/api/vendors'),
          axios.get('http://localhost:8098/api/brands'),
          axios.get('http://localhost:8098/api/engines')
        ]);

        setVendors(vendorsResponse.data);
        setBrands(brandsResponse.data);
        setEngines(enginesResponse.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      const response = await axios.post('http://localhost:8098/api/gaskets', {
        ...formData,
        added_by: "User", // You might want to replace this with actual user data
      });

      setSubmitStatus({ type: 'success', message: response.data.message });
      // Reset form after successful submission
      setFormData({
        part_number: "",
        description: "",
        stock: "",
        minstock: "",
        year: "",
        material_type: "",
        packing_type: "",
        engine_id: "",
        brand_id: "",
        vendor_id: "",
      });
    } catch (err) {
      setSubmitStatus({ type: 'error', message: err.response?.data?.error || 'Failed to create gasket' });
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading data...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Gasket</h1>

      {submitStatus && (
        <div className={`p-4 rounded-md ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitStatus.message}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-1/2">
            <label htmlFor="part_number" className="block text-sm font-medium text-gray-700 mb-1">
              Part Number
            </label>
            <input
              id="part_number"
              name="part_number"
              type="text"
              value={formData.part_number}
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
            <label htmlFor="minstock" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Stock
            </label>
            <input
              id="minstock"
              name="minstock"
              type="number"
              value={formData.minstock}
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
            <label htmlFor="material_type" className="block text-sm font-medium text-gray-700 mb-1">
              Material Type
            </label>
            <select
              id="material_type"
              name="material_type"
              value={formData.material_type}
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
            <label htmlFor="packing_type" className="block text-sm font-medium text-gray-700 mb-1">
              Packing Type
            </label>
            <select
              id="packing_type"
              name="packing_type"
              value={formData.packing_type}
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
            <label htmlFor="engine_id" className="block text-sm font-medium text-gray-700 mb-1">
              Engine
            </label>
            <select
              id="engine_id"
              name="engine_id"
              value={formData.engine_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select engine</option>
              {engines.map((engine) => (
                <option key={engine._id} value={engine.engine_id}>
                  {engine.engine_name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/3">
            <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <select
              id="brand_id"
              name="brand_id"
              value={formData.brand_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand.brand_id}>
                  {brand.brand_name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/3">
            <label htmlFor="vendor_id" className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <select
              id="vendor_id"
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor.vendor_id}>
                  {vendor.vendor_name}
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
        Add Gasket
      </button>
    </form>
  );
}

