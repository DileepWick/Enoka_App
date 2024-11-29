import React from "react";
import { MenuItem, FormControl, Select, InputLabel, Box, Typography } from "@mui/material";

const BranchSelector = ({ fromBranch, toBranch, setFromBranch, setToBranch }) => {
  const branches = ["Colombo", "Kandy", "Galle", "Jaffna"];

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        padding: 3,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Select Branches
      </Typography>
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        {/* From Branch */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>From</InputLabel>
          <Select
            value={fromBranch}
            onChange={(e) => setFromBranch(e.target.value)}
          >
            {branches.map((branch) => (
              <MenuItem key={branch} value={branch}>
                {branch}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* To Branch */}
        <FormControl fullWidth>
          <InputLabel>To</InputLabel>
          <Select
            value={toBranch}
            onChange={(e) => setToBranch(e.target.value)}
          >
            {branches.map((branch) => (
              <MenuItem key={branch} value={branch}>
                {branch}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default BranchSelector;
