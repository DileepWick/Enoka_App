import React from "react";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import converter from "number-to-words";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
    borderBottom: "1px solid #000",
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  logo: {
    width: 50,
    height: "auto",
  },
  companyDetails: {
    textAlign: "right",
  },
  invoiceTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  splitBoxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  box: {
    flex: 1,
    padding: 10,
    border: "1px solid #000",
    borderRadius: 5,
    marginRight: 10,
  },
  lastBox: {
    marginRight: 0, // Remove margin for the last box
  },
  table: {
    marginVertical: 20,
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  tableCellNumber: {
    flex: 0.5, // 0.5/10 of the table width
    padding: 8,
    textAlign: "center",
  },
  tableCellName: {
    flex: 6, // 6/10 of the table width
    padding: 8,
    textAlign: "left",
  },
  tableCellUnits: {
    flex: 0.5, // 0.5/10 of the table width
    padding: 8,
    textAlign: "center",
  },
  tableCellOther: {
    flex: 1, // Remaining columns equal (1/10 each)
    padding: 8,
    textAlign: "center",
  },
  footerContainer: {
    marginTop: 20,
    borderTop: "1px solid #000",
    paddingTop: 10,
    fontSize: 8,
    textAlign: "center",
  },
  noteBox: {
    flex: 3,
    padding: 10,
    border: "1px solid #000",
    borderRadius: 5,
  },
  summaryBox: {
    flex: 2,
    padding: 10,
    border: "1px solid #000",
    borderRadius: 5,
    marginLeft: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    flex: 1,
    textAlign: "left",
    fontWeight: "bold",
  },
  summaryValue: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
  },
});

const calculateGrossPrice = (price, quantity, discount) =>
  (price * quantity - discount).toFixed(2);

const BillPDF = ({
  companyDetails,
  logo,
  billNumber,
  items,
  billType,
  billBranch,
}) => {
  const totalAmount = items.reduce(
    (total, item) =>
      total + parseFloat(calculateGrossPrice(item.price, item.quantity, item.discount)),
    0
  );

  const totalDiscount = items.reduce((total, item) => total + item.discount, 0);

  const toWords = (num) => {
    return converter.toWords(num).toUpperCase();
  };

  const currentYear = new Date().getFullYear();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image src={logo} style={styles.logo} />
            <View style={styles.companyDetails}>
              <Text>{companyDetails.name}</Text>
              <Text>{companyDetails.address}</Text>
              <Text>{companyDetails.contact}</Text>
            </View>
          </View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>

        {/* Split Boxes */}
        <View style={styles.splitBoxes}>
          <View style={styles.box}>
            <Text style={{ fontWeight: "bold" }}>Customer Details</Text>
            <Text>Name: [Customer Name]</Text>
            <Text>Address: [Customer Address]</Text>
          </View>

          <View style={[styles.box, styles.lastBox]}>
            <Text style={{ fontWeight: "bold" }}>Bill Information</Text>
            <Text>Bill Number: {billNumber}</Text>
            <Text>Bill Type: {billType}</Text>
            <Text>Branch: {billBranch}</Text>
            <Text>Date: [Bill Date]</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellNumber}>No.</Text>
            <Text style={styles.tableCellName}>Name</Text>
            <Text style={styles.tableCellUnits}>Units</Text>
            <Text style={styles.tableCellOther}>Price</Text>
            <Text style={styles.tableCellOther}>Discount</Text>
            <Text style={styles.tableCellOther}>Gross P.</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCellNumber}>{index + 1}</Text>
              <Text style={styles.tableCellName}>{item.name}</Text>
              <Text style={styles.tableCellUnits}>{item.quantity}</Text>
              <Text style={styles.tableCellOther}>{item.price}</Text>
              <Text style={styles.tableCellOther}>{item.discount}</Text>
              <Text style={styles.tableCellOther}>
                {calculateGrossPrice(item.price, item.quantity, item.discount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Note and Summary Split Boxes */}
        <View style={styles.splitBoxes}>
          <View style={styles.noteBox}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Note:</Text>
            <Text>[Add your notes here...]</Text>
          </View>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Discount:</Text>
              <Text style={styles.summaryValue}>{totalDiscount.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>{totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>In Words:</Text>
              <Text style={styles.summaryValue}>{toWords(totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text>{companyDetails.name} © {currentYear}</Text>
        </View>
      </Page>
    </Document>
  );
};

const Invoice = () => {
  const companyDetails = {
    name: "Inoka Motors",
    address: "No 09, Cross Street Kandy",
    contact: "077-7386756 / 071-1336262 / 081-2220320",
  };

  const logo = "@@/public/logo.png"; // Replace with your logo URL or path
  const billNumber = "BILL-123456";

  const items = [
    { name: "Item 1", price: 10, quantity: 2, discount: 1 },
    { name: "Item 2", price: 15, quantity: 1, discount: 0 },
    { name: "Item 3", price: 5, quantity: 4, discount: 2 },
  ];

  const billType = "Cash";

  return (
    <div>
      <PDFViewer style={{ width: "100%", height: "90vh" }}>
        <BillPDF
          companyDetails={companyDetails}
          logo={logo}
          billNumber={billNumber}
          items={items}
          billType={billType}
        />
      </PDFViewer>
    </div>
  );
};

export default Invoice;
