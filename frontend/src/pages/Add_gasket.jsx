import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Modal from "react-modal";
import { Button ,Input} from "@nextui-org/react";

Modal.setAppElement("#root");

export default function AddItemForm() {
  const [formData, setFormData] = useState({
    part_number: "",
    description: "",
    stock: "",
    minstock: "",
    year: "",
    material_type: "",
    packing_type: "",
    engine: "",
    brand: "",
    vendor: "",
    added_by: "Admin"
  });

  const [vendors, setVendors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [engines, setEngines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [currentModal, setCurrentModal] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsResponse, brandsResponse, enginesResponse] = await Promise.all([
          axios.get("http://localhost:3098/api/vendors"),
          axios.get("http://localhost:3098/api/brands"),
          axios.get("http://localhost:3098/api/engines"),
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (type) => {
    setCurrentModal(type);
    setNewItemName("");
    setIsAddingItem(false);
  };

  const closeModal = () => {
    setCurrentModal(null);
    setNewItemName("");
    setIsAddingItem(false);
  };

  const handleAddNew = async () => {
    setIsAddingItem(true);
    try {
      const endpoints = {
        engine: { url: "engines", key: "engine_name", setter: setEngines },
        brand: { url: "brands", key: "brand_name", setter: setBrands },
        vendor: { url: "vendors", key: "vendor_name", setter: setVendors }
      };

      const { url, key, setter } = endpoints[currentModal];
      const response = await axios.post(`http://localhost:3098/api/${url}`, {
        [key]: newItemName
      });

      setter(prev => [...prev, response.data]);
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      const response = await axios.post("http://localhost:3098/api/gaskets", formData);
      setSubmitStatus({ type: "success", message: response.data.message });
      setFormData({
        part_number: "",
        description: "",
        stock: "",
        minstock: "",
        year: "",
        material_type: "",
        packing_type: "",
        engine: "",
        brand: "",
        vendor: "",
        added_by: "Admin"
      });
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.response?.data?.error || "Failed to create gasket"
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Gasket</h1>

      {submitStatus && (
        <div className={`mb-6 p-4 rounded-md ${submitStatus.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="part_number" className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
            <input
              type="text"
              id="part_number"
              name="part_number"
              value={formData.part_number}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="minstock" className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
            <input
              type="number"
              id="minstock"
              name="minstock"
              value={formData.minstock}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="material_type" className="block text-sm font-medium text-gray-700 mb-1">Material Type</label>
            <select
              id="material_type"
              name="material_type"
              value={formData.material_type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select material type</option>
              <option value="steel">Steel</option>
              <option value="hellite">Hellite</option>
              <option value="wog">WOG</option>
            </select>
          </div>

          <div>
            <label htmlFor="packing_type" className="block text-sm font-medium text-gray-700 mb-1">Packing Type</label>
            <select
              id="packing_type"
              name="packing_type"
              value={formData.packing_type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select packing type</option>
              <option value="fullSet">Full Set</option>
              <option value="headSet">Head Set</option>
              <option value="gasketOnly">Gasket Only</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex-grow">
              <label htmlFor="engine" className="block text-sm font-medium text-gray-700 mb-1">Engine</label>
              <Select
                name="engine"
                value={engines.find(e => e._id === formData.engine)}
                onChange={(selected) => setFormData(prev => ({ ...prev, engine: selected._id }))}
                options={engines}
                getOptionLabel={option => option.engine_name}
                getOptionValue={option => option._id}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <Button 
              type="button" 
              onClick={() => openModal('engine')}
              className="ml-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              +
            </Button>
          </div>

          <div className="flex items-end">
            <div className="flex-grow">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <Select
                name="brand"
                value={brands.find(b => b._id === formData.brand)}
                onChange={(selected) => setFormData(prev => ({ ...prev, brand: selected._id }))}
                options={brands}
                getOptionLabel={option => option.brand_name}
                getOptionValue={option => option.brand_id}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <Button 
              type="button" 
              onClick={() => openModal('brand')}
              className="ml-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              +
            </Button>
          </div>

          <div className="flex items-end">
            <div className="flex-grow">
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <Select
                name="vendor"
                value={vendors.find(v => v._id === formData.vendor)}
                onChange={(selected) => setFormData(prev => ({ ...prev, vendor: selected._id }))}
                options={vendors}
                getOptionLabel={option => option.vendor_name}
                getOptionValue={option => option._id}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <Button 
              type="button" 
              onClick={() => openModal('vendor')}
              className="ml-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              +
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full" variant="ghost" color="primary" size="lg">
          Submit
        </Button>
      </form>

      <Modal
        isOpen={!!currentModal}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Add New {currentModal}</h2>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`Enter new ${currentModal} name`}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button 
              onClick={closeModal} 
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddNew} 
              disabled={isAddingItem}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isAddingItem ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}