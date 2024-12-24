import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosInstance";

import Select from "react-select";
import Modal from "react-modal";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Progress } from "@nextui-org/react";

// Styles
import StyledSelect from "@/components/Inventory_Components/StyledSelect";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export default function AddRingForm() {
  // Form state
  const [formData, setFormData] = useState({
    part_number: "",
    sizes: "",
    brand: "",
    engine: "",
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
  const Sizes_options = [
    { value: "STD", label: "STD" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "75", label: "75" },
    { value: "100", label: "100" },
  ];

  const Brand_options = [
    { value: "NPR", label: "NPR" },
    { value: "RIK", label: "RIK" },
    { value: "GENUINE", label: "GENUINE" },
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    const resetForm = () => {
      setFormData({
        part_number: "",
        sizes: "",
        brand: "",
        engine: "",
        vendor: "",
        added_by: "Admin",
      });
      setFormKey((prevKey) => prevKey + 1); // Reset form inputs by changing the key
    };

    try {
      const response = await axiosInstance.post("/api/rings", formData);

      // Success: Show toast and reset the form
      toast.success("Ring added successfully!");
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
        {isLoading && (
          <Progress
            isIndeterminate
            aria-label="Adding Ring..."
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
          aria-label="Adding Ring..."
          size="sm"
          label="Loading The Form..."
        />
      )}
      <h1 className="text-2xl font-f1 mb-6 text-center">Add New Ring</h1>

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
              htmlFor="sizes"
              className="block text-sm font-f1 text-gray-700 mb-1"
            >
              Size
            </label>
            <StyledSelect
              id="sizes"
              name="sizes"
              value={Sizes_options.find(
                (option) => option.value === formData.sizes
              )}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, sizes: selected.value }))
              }
              options={Sizes_options}
              required
            />
          </div>

          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-f1 text-gray-700 mb-1"
            >
              Brand
            </label>
            <StyledSelect
              id="brand"
              name="brand"
              value={Brand_options.find(
                (option) => option.value === formData.brand
              )}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, brand: selected.value }))
              }
              options={Brand_options}
              required
            />
          </div>

          <div>
            <label
              htmlFor="engine"
              className="block text-sm font-f1 text-gray-700 mb-1"
            >
              Engine
            </label>
            <StyledSelect
              id="engine"
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
              required
            />
          </div>

          <div>
            <label
              htmlFor="vendor"
              className="block text-sm font-f1 text-gray-700 mb-1"
            >
              Vendor
            </label>
            <StyledSelect
              id="vendor"
              name="vendor"
              value={vendors.find((v) => v._id === formData.vendor)}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, vendor: selected._id }))
              }
              options={vendors}
              getOptionLabel={(option) => option.vendor_name}
              getOptionValue={(option) => option._id}
              className="react-select-container"
              classNamePrefix="react-select"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-black text-white">
          Submit
        </Button>
      </form>
    </div>
  );
}
