import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";

const DeliveryList = ({ deliveryList, removeFromDeliveryList, startDelivery }) => {
  return (
    <Box sx={{ padding: 3 }}>
      {/* Title */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        Delivery List
      </Typography>

      {/* Delivery List Table */}
      {deliveryList.length === 0 ? (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            marginTop: 2,
            fontStyle: "italic",
            color: "gray",
          }}
        >
          No items added to the delivery list.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Part Number</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryList.map((item) => (
                <TableRow key={item.gasket_id}>
                  <TableCell>{item.part_number}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => removeFromDeliveryList(item.gasket_id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Start Delivery Button */}
      {deliveryList.length > 0 && (
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={startDelivery}
            sx={{
              fontWeight: "bold",
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "gray",
              },
            }}
          >
            Start Delivery
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DeliveryList;
