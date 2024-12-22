import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Input,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Progress,
} from "@nextui-org/react";
import axiosInstance from "@/config/axiosInstance";
import { User, Link } from "@nextui-org/react";
import { toast } from "react-toastify";

// Buttons
import Adjust_Stock_Button from "@/components/Inventory_Components/Adjust_Stock_Button";
import Delete_Ring from "../../components/Inventory_Components/RingsDeleteButton.jsx";

// Emitter
import emitter from "../../../util/emitter.js";

const AllRings = () => {
  const [rings, setRings] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the list of rings
  useEffect(() => {
    const fetchRings = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/rings");
        setRings(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching rings:", error);
      }
    };

    // Fetch the list of branches
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get("/api/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchRings();
    fetchBranches();

    // Show toast when ring is deleted
    const ringDeletedListener = () => {
      fetchRings();
      toast.success("Ring deleted successfully!");
    };

    // Register the stockUpdated event listener
    emitter.on("stockUpdated", fetchRings);
    emitter.on("ringDeleted", ringDeletedListener);

    // Cleanup the event listener on component unmount
    return () => {
      emitter.off("stockUpdated", fetchRings);
      emitter.off("ringDeleted", ringDeletedListener);
    };
  }, []);

  // Filter rings based on branch and search term
  const filteredRings = rings.filter((ring) => {
    const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);
    const matchesBranch =
      !selectedBranch ||
      ring.stock.some((stock) => stock.branch?.name === selectedBranch);

    // Ensure that all properties are defined before calling toLowerCase
    const matchesSearchTerm = searchWords.every((word) => {
      const partNumber = ring.part_number ? ring.part_number.toLowerCase() : "";
      const size = ring.sizes ? ring.sizes.toLowerCase() : "";
      const engine = ring.engine?.engine_name
        ? ring.engine.engine_name.toLowerCase()
        : "";
      const vendorName = ring.vendor?.vendor_name
        ? ring.vendor.vendor_name.toLowerCase()
        : "";

      return (
        partNumber.includes(word) ||
        engine.includes(word) ||
        vendorName.includes(word) ||
        size.includes(word)
      );
    });

    return matchesBranch && matchesSearchTerm;
  });

  // Render stock details
  const renderStockDetails = (ring) => {
    if (selectedBranch) {
      const selectedStock = ring.stock.find(
        (stock) => stock.branch?.name === selectedBranch
      );
      return (
        <div>
          <p>{selectedStock?.quantity || "N/A"}</p>
        </div>
      );
    }

    if (isLoading)
      return (
        <div>
          {isLoading && (
            <Progress
              isIndeterminate
              aria-label="Loading rings..."
              size="sm"
              label="Loading . . ."
            />
          )}
        </div>
      );
    return (
      <Table aria-label="Stock details" className="min-w-[300px]" isStriped>
        <TableHeader>
          <TableColumn>Branch</TableColumn>
          <TableColumn>Quantity</TableColumn>
          <TableColumn>Last Updated</TableColumn>
        </TableHeader>
        <TableBody>
          {ring.stock.map((stock) => (
            <TableRow key={stock._id}>
              <TableCell>{stock.branch?.name || "N/A"}</TableCell>
              <TableCell>{stock.quantity}</TableCell>
              <TableCell>{stock.updated_by || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="container">
      {isLoading ? (
        <Progress
          isIndeterminate
          aria-label="Loading Rings"
          size="sm"
          label="Loading Rings"
          className="font-f1"
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="mb-6">
              <h2 className="text-sm font-f1 mb-2">Select Branch</h2>
              <Tabs
                aria-label="Branch Filter"
                selectedKey={selectedBranch}
                onSelectionChange={(key) => setSelectedBranch(key)}
                variant="bordered"
                color="primary"
                className="font-f1"
                size="sm"
              >
                {branches.map((branch) => (
                  <Tab key={branch.name} title={`${branch.name} Branch`} />
                ))}
              </Tabs>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-f1 mb-2 w-[300px]">Search Rings</h2>
              <Input
                aria-label="Search Rings"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Part Number, Material Type..."
                variant="bordered"
                className="font-f1"
                fullWidth
                size="md"
              />
            </div>
          </div>

          <Table aria-label="Rings inventory" className="mb-6">
            <TableHeader>
              <TableColumn className="text-sm font-f1">Part Number</TableColumn>
              <TableColumn className="text-sm font-f1">Description</TableColumn>
              <TableColumn className="text-sm font-f1">Brand</TableColumn>
              <TableColumn className="text-sm font-f1">
                {selectedBranch ? `${selectedBranch} Stock` : "Stock"}
              </TableColumn>
              <TableColumn className="text-sm font-f1">
                Last Updated By
              </TableColumn>
              <TableColumn className="text-sm font-f1">
                Stock Adjustment
              </TableColumn>
              <TableColumn className="text-sm font-f1">Deletions</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredRings.map((ring) => (
                <TableRow key={ring._id} className="font-f1">
                  <TableCell>{ring.part_number}</TableCell>
                  <TableCell>
                    {ring.engine?.engine_name} {ring.sizes}
                    <Chip
                      color="primary"
                      size="sm"
                      variant="bordered"
                      className="ml-4"
                    >
                      {ring.vendor?.vendor_name}
                    </Chip>
                  </TableCell>
                  <TableCell>{ring.brand}</TableCell>
                  <TableCell>{renderStockDetails(ring)}</TableCell>
                  <TableCell>
                    <User
                      avatarProps={{
                        src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                      }}
                      description={
                        <Link
                          isExternal
                          href="https://x.com/jrgarciadev"
                          size="sm"
                        >
                          @LoggedUserEmail
                        </Link>
                      }
                      name="Logged User"
                    />
                  </TableCell>
                  <TableCell>
                    {selectedBranch ? (
                      ring.stock.some(
                        (stock) => stock.branch?.name === selectedBranch
                      ) ? (
                        ring.stock
                          .filter(
                            (stock) => stock.branch?.name === selectedBranch
                          )
                          .map((selectedStock) => (
                            <Adjust_Stock_Button
                              key={selectedStock._id}
                              stockid={selectedStock._id}
                              currentStock={selectedStock.quantity || 0}
                            />
                          ))
                      ) : (
                        <p>No stock available for {selectedBranch}</p>
                      )
                    ) : (
                      ring.stock.map((stock) => (
                        <Adjust_Stock_Button
                          key={stock._id}
                          stockid={stock._id}
                          currentStock={stock.quantity || 0}
                        />
                      ))
                    )}
                  </TableCell>
                  <TableCell>
                    <Delete_Ring ringId={ring._id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default AllRings;
