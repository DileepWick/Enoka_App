import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosInstance";
import Modal from "react-modal";
import { Button, Input, Progress } from "@nextui-org/react";
import { toast } from "react-toastify";

// Styles
import StyledSelect from "@/components/Inventory_Components/StyledSelect";

Modal.setAppElement("#root");

export default function AddBearingForm() {
  const [formData, setFormData] = useState({
    part_number: "",
    type: "",
    brand: "",
    sizes: "",  // sizes is now a single value, not an array
    engine: "",
    vendor: "",
    added_by: "Admin",
  });

  const [vendors, setVendors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [engines, setEngines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const Type_options = [
    { value: "MAIN", label: "Main" },
    { value: "CAM", label: "Cam" },
    { value: "THRUST", label: "Thrust" },
    { value: "PIN BUSH", label: "Pin Bush" },
    { value: "OTHER", label: "Other" },
  ];

  const Brand_options = [
    { value: "TAIHO", label: "Taiho" },
    { value: "DAIDO", label: "Daido" },
    { value: "NDC", label: "NDC" },
    { value: "OTHER", label: "Other" },
  ];

  const Sizes_options = [
    { value: "STD", label: "STD" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "75", label: "75" },
    { value: "100", label: "100" },
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/api/bearings", formData);
      toast.success("Bearing added successfully!");

      // Reset form
      setFormData({
        part_number: "",
        type: "",
        brand: "",
        sizes: "",
        engine: "",
        vendor: "",
        added_by: "Admin",
      });
      setFormKey(prevKey => prevKey + 1);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error(`Duplicate entry: ${err.response.data.error}`);
      } else {
        toast.error(err.response?.data?.error || "Failed to add bearing. Try again.");
      }
    }
  };

  if (isLoading)
    return (
      <Progress
        isIndeterminate
        aria-label="Loading..."
        size="sm"
        label="Loading the form..."
      />
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <h1 className="text-2xl font-f1 mb-6 text-center">Add New Bearing</h1>

      <form key={formKey} onSubmit={handleSubmit} className="space-y-6 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="part_number" className="block text-sm font-f1 text-gray-700 mb-1">
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
            <label htmlFor="type" className="block text-sm font-f1 text-gray-700 mb-1">
              Type
            </label>
            <StyledSelect
              id="type"
              name="type"
              value={Type_options.find(option => option.value === formData.type)}
              onChange={selected => setFormData(prev => ({ ...prev, type: selected.value }))}
              options={Type_options}
              required
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-f1 text-gray-700 mb-1">
              Brand
            </label>
            <StyledSelect
              id="brand"
              name="brand"
              value={Brand_options.find(option => option.value === formData.brand)}
              onChange={selected => setFormData(prev => ({ ...prev, brand: selected.value }))}
              options={Brand_options}
              required
            />
          </div>

          <div>
            <label htmlFor="sizes" className="block text-sm font-f1 text-gray-700 mb-1">
              Sizes
            </label>
            <StyledSelect
              id="sizes"
              name="sizes"
              value={Sizes_options.find(option => option.value === formData.sizes)}
              onChange={selected => setFormData(prev => ({ ...prev, sizes: selected.value }))}
              options={Sizes_options}
              required
            />
          </div>

          <div>
            <label htmlFor="engine" className="block text-sm font-f1 text-gray-700 mb-1">
              Engine
            </label>
            <StyledSelect
              id="engine"
              name="engine"
              value={engines.find(e => e._id === formData.engine)}
              onChange={selected => setFormData(prev => ({ ...prev, engine: selected._id }))}
              options={engines}
              getOptionLabel={option => option.engine_name}
              getOptionValue={option => option._id}
              required
            />
          </div>

          <div>
            <label htmlFor="vendor" className="block text-sm font-f1 text-gray-700 mb-1">
              Vendor
            </label>
            <StyledSelect
              id="vendor"
              name="vendor"
              value={vendors.find(v => v._id === formData.vendor)}
              onChange={selected => setFormData(prev => ({ ...prev, vendor: selected._id }))}
              options={vendors}
              getOptionLabel={option => option.vendor_name}
              getOptionValue={option => option._id}
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
