import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Modal from "react-modal";

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

  const [isAdding, setIsAdding] = useState(false); // To track the loading state
  const [modalStatus, setModalStatus] = useState(null); // To display server-side status

  const [modalType, setModalType] = useState(null);
  const [newEntry, setNewEntry] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsResponse, brandsResponse, enginesResponse] = await Promise.all([
          axios.get("http://localhost:8098/api/vendors"),
          axios.get("http://localhost:8098/api/brands"),
          axios.get("http://localhost:8098/api/engines"),
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

  const handleSelectChange = (field, selected) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selected.value,
    }));
  };

  const openModal = (type) => {
    setModalType(type);
    setNewEntry(""); // Clear input field
    setModalStatus(null); // Clear status messages
    setIsAdding(false); // Reset loading state
  };

  

  const closeModal = () => {
    setModalType(null);
    setNewEntry(""); // Clear input field
    setModalStatus(null); // Clear status messages
    setIsAdding(false); // Reset loading state
  };
  

  const handleAddNew = async () => {
    setIsAdding(true);
    setModalStatus(null);
    try {
      const endpoint =
        modalType === "engine"
          ? "engines"
          : modalType === "brand"
            ? "brands"
            : "vendors";
      const nameJson =
        modalType === "engine"
          ? "engine_name"
          : modalType === "brand"
            ? "brand_name"
            : "vendor_name";
      const response = await axios.post(`http://localhost:8098/api/${endpoint}`, {
        [nameJson]: newEntry,
      });

      if (modalType === "engine") setEngines((prev) => [...prev, response.data]);
      if (modalType === "brand") setBrands((prev) => [...prev, response.data]);
      if (modalType === "vendor") setVendors((prev) => [...prev, response.data]);

      setModalStatus({ type: "success", message: "Item added successfully!" });
      setNewEntry("");
    } catch (err) {
      setModalStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to add item.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      const response = await axios.post("http://localhost:8098/api/gaskets", {
        ...formData,
        added_by: "User",
      });

      setSubmitStatus({ type: "success", message: response.data.message });
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
      setSubmitStatus({
        type: "error",
        message: err.response?.data?.error || "Failed to create gasket",
      });
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Gasket</h1>

      {submitStatus && (
        <div className={`mb-6 p-4 rounded-md ${submitStatus.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
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

          <div>
            <label htmlFor="engine_id" className="block text-sm font-medium text-gray-700 mb-1">Engine</label>
            <Select
              id="engine_id"
              name="engine_id"
              value={formData.engine_id ? { value: formData.engine_id, label: engines.find(e => e.engine_id === formData.engine_id)?.engine_name } : null}
              onChange={(selected) => selected.value === "add" ? openModal("engine") : handleSelectChange("engine_id", selected)}
              options={[
                ...engines.map((engine) => ({
                  value: engine.engine_id,
                  label: engine.engine_name,
                })),
                { value: "add", label: "Add new engine" },
              ]}
              onMenuOpen={() => {
                if (engines.length === 0) {
                  openModal("engine");
                }
              }}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <Select
              id="brand_id"
              name="brand_id"
              value={formData.brand_id ? { value: formData.brand_id, label: brands.find(b => b.brand_id === formData.brand_id)?.brand_name } : null}
              onChange={(selected) => selected.value === "add" ? openModal("brand") : handleSelectChange("brand_id", selected)}
              options={[
                ...brands.map((brand) => ({
                  value: brand.brand_id,
                  label: brand.brand_name,
                })),
                { value: "add", label: "Add new brand" },
              ]}
              onMenuOpen={() => {
                if (brands.length === 0) {
                  openModal("brand");
                }
              }}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label htmlFor="vendor_id" className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
            <Select
              id="vendor_id"
              name="vendor_id"
              value={formData.vendor_id ? { value: formData.vendor_id, label: vendors.find(v => v.vendor_id === formData.vendor_id)?.vendor_name } : null}
              onChange={(selected) =>
                selected.value === "add" ? openModal("vendor") : handleSelectChange("vendor_id", selected)}
              options={[
                ...vendors.map((vendor) => ({
                  value: vendor.vendor_id,
                  label: vendor.vendor_name,
                })),
                { value: "add", label: "Add new vendor" },
              ]}
              onMenuOpen={() => {
                if (vendors.length === 0) {
                  openModal("vendor");
                }
              }}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Submit
        </button>
      </form>

      <Modal
        isOpen={!!modalType}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
          <h2 className="text-xl font-semibold mb-4">Add New {modalType}</h2>

          {/* Input field */}
          <input
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder={`Enter new ${modalType}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          {/* Status Message */}
          {modalStatus && (
            <div
              className={`mb-4 px-4 py-2 rounded-md text-sm ${modalStatus.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                }`}
            >
              {modalStatus.message}
            </div>
          )}

          {/* Loading Indicator */}
          {isAdding && <div className="text-center text-blue-500 mb-4">Adding...</div>}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={closeModal}
              disabled={isAdding}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNew}
              disabled={isAdding}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>


    </div>
  );
}

