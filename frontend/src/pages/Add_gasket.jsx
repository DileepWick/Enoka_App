import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosInstance";

import Select from "react-select";
import Modal from "react-modal";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Progress } from "@nextui-org/react";

//Styles
import StyledSelect from "@/components/Inventory_Components/StyledSelect";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export default function AddItemForm() {
  // Form state
  const [formData, setFormData] = useState({
    part_number: "",
    material_type: "",
    packing_type: "",
    engine: "",
    brand: "",
    vendor: "",
    added_by: "Admin",
  });

  // Fetch data
  const [vendors, setVendors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [engines, setEngines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentModal, setCurrentModal] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [formKey, setFormKey] = useState(0); // Add this to reset the form

  // Options for select dropdowns
  const Packing_options = [
    { value: "FULLSET", label: "Full Set" },
    { value: "HEADSET", label: "Head Set" },
    { value: "GASKET ONLY", label: "Gasket Only" },
  ];

  // Options for select dropdowns
  const Material_options = [
    { value: "STEEL", label: "STEEL" },
    { value: "HELLITE", label: "HELLITE" },
    { value: "WOG", label: "WOG" },
  ];

  // Fetch vendors, brands, and engines
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsResponse, brandsResponse, enginesResponse] =
          await Promise.all([
            axiosInstance.get("/api/vendors"),
            axiosInstance.get("/api/brands"),
            axiosInstance.get("/api/engines"),
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open a modal
  const openModal = (type) => {
    setCurrentModal(type);
    setNewItemName("");
    setIsAddingItem(false);
  };

  // Close the modal
  const closeModal = () => {
    setCurrentModal(null);
    setNewItemName("");
    setIsAddingItem(false);
  };

  // Handle adding a new item
  const handleAddNew = async () => {
    setIsAddingItem(true);
    try {
      const endpoints = {
        engine: { url: "engines", key: "engine_name", setter: setEngines },
        brand: { url: "brands", key: "brand_name", setter: setBrands },
        vendor: { url: "vendors", key: "vendor_name", setter: setVendors },
      };

      const { url, key, setter } = endpoints[currentModal];
      const response = await axiosInstance.post(`/api/${url}`, {
        [key]: newItemName,
      });

      setter((prev) => [...prev, response.data]);
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    } finally {
      setIsAddingItem(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    const resetForm = () => {
      setFormData({
        part_number: "",
        material_type: "",
        packing_type: "",
        engine: "",
        brand: "",
        vendor: "",
      });
      setFormKey((prevKey) => prevKey + 1); // Reset form inputs by changing the key
    };

    try {
      const response = await axiosInstance.post("/api/gaskets", formData);

      // Success: Show toast and reset the form
      toast.success("Gasket added successfully!");
      resetForm();
    } catch (err) {
      // Check if error response is available
      if (err.response) {
        const status = err.response.status;

        if (status === 409) {
          // Specific handling for 409 Conflict
          toast.error(`Part number ${formData.part_number} already exists.`);
        } else {
          // Other server-side errors
          const message =
            err.response.data?.error || "An unexpected error occurred.";
          toast.error(message);
        }
      } else {
        // Handle network or client-side errors
        toast.error("Failed to connect to the server. Please try again.");
      }

      // Reset form regardless of the error
      resetForm();
    }
  };

  if (isLoading)
    return (
      <div>
        {" "}
        {/* Inline Progress Bar for Modal */}
        {isLoading && (
          <Progress
            isIndeterminate
            aria-label="Adding Gasket..."
            size="sm"
            label="Loading The Form..."
          />
        )}
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      {isLoading && (
        <Progress
          isIndeterminate
          aria-label="Adding Gasket..."
          size="sm"
          label="Loading The Form..."
        />
      )}
      <h1 className="text-2xl font-f1 mb-6 text-center">Add New Gasket</h1>

      <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="part_number"
              className="block text-sm font-f1 text-gray-700 mb-1"
            >
              Part Number
            </label>
            <input
              type="text"
              id="part_number"
              name="part_number"
              value={formData.part_number}
              placeholder="Leave blank if unknown"
              onChange={handleInputChange}
              size="sm"
              variant="bordered"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
            />
          </div>

          <div>
            <label
              htmlFor="material_type"
              className="block text-sm font-f1 text-gray-700 mb-1"
            >
              Material Type
            </label>
            <StyledSelect
              id="material_type"
              name="material_type"
              value={Material_options.find(
                (option) => option.value === formData.material_type
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  material_type: selected.value,
                }))
              }
              options={Material_options}
              required
            />
          </div>

          <div>
            <label
              htmlFor="packing_type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Packing Type
            </label>
            <StyledSelect
              id="packing_type"
              name="packing_type"
              value={Packing_options.find(
                (option) => option.value === formData.packing_type
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  packing_type: selected.value,
                }))
              }
              options={Packing_options}
              required
            />
          </div>

          <div className="flex items-end">
            <div className="flex-grow">
              <label
                htmlFor="engine"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Engine
              </label>
              <StyledSelect
                name="engine"
                value={engines.find((e) => e._id === formData.engine)}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, engine: selected._id }))
                }
                options={engines}
                getOptionLabel={(option) => option.engine_name}
                getOptionValue={(option) => option._id}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <div className="flex items-end">
            <div className="flex-grow">
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Brand
              </label>
              <StyledSelect
                name="brand"
                value={brands.find((b) => b._id === formData.brand)}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, brand: selected._id }))
                }
                options={brands}
                getOptionLabel={(option) => option.brand_name}
                getOptionValue={(option) => option.brand_id}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <div className="flex items-end">
            <div className="flex-grow">
              <label
                htmlFor="vendor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vendor
              </label>
              <StyledSelect
                name="vendor"
                value={vendors.find((v) => v._id === formData.vendor)}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, vendor: selected._id }))
                }
                options={vendors}
                getOptionLabel={(option) => option.vendor_name}
                getOptionValue={(option) => option._id}
                className="react-select-container font-f1 text-[px]"
                classNamePrefix="react-select"
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-black text-white" size="lg">
          Add Gasket
        </Button>
      </form>

      <Modal isOpen={!!currentModal} onRequestClose={closeModal}>
        <h2 className="text-lg font-bold mb-4">Add New {currentModal}</h2>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder={`Enter ${currentModal} name`}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddNew}
            disabled={isAddingItem}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          >
            Add
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
