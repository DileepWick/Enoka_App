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

// Helper functions
const calculateGrossPrice = (price, quantity, discount) =>
  (price * quantity - discount).toFixed(2);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const toWords = (num) => {
  return converter.toWords(num).toUpperCase();
};

// Styles definition
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: "column",
    marginBottom: 30,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    opacity: 0.04,
    transform: 'rotate(-45deg)',
    fontSize: 100,
    color: '#000',
    top: '40%',
    left: '20%',
    fontFamily: 'Helvetica-Bold',
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  companyDetails: {
    textAlign: "right",
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
  },
  invoiceTitle: {
    fontSize: 28,
    color: '#2563eb',
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  invoiceSubtitle: {
    color: '#64748b',
    fontSize: 12,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoBox: {
    width: '48%',
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  infoTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  infoContent: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.6,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: '#2563eb',
    padding: 8,
  },
  tableHeaderCell: {
    flex: 1,
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    minHeight: 35,
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
    padding: 8,
    color: '#4b5563',
  },
  summary: {
    flexDirection: 'row',
    marginTop: 30,
  },
  notesSection: {
    width: '58%',
    marginRight: '2%',
    backgroundColor: '#f8f8f8',
    padding: 15,
  },
  noteTitle: {
    color: '#2563eb',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  totalSection: {
    width: '40%',
    padding: 15,
    backgroundColor: '#2563eb',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomWidth: 1,
  },
  totalLabel: {
    fontSize: 11,
    color: '#ffffff',
  },
  totalAmount: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  grandTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 2,
  },
  wordsAmount: {
    fontSize: 9,
    marginTop: 10,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: '#e5e7eb',
    borderTopWidth: 2,
    paddingTop: 20,
  },
  footerColumn: {
    width: '30%',
    fontSize: 8,
    color: '#6b7280',
  },
  qrSection: {
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#e5e7eb',
    marginBottom: 5,
  },
});

// Main component
const BillPDF = ({
  companyDetails,
  logo,
  billNumber,
  items,
  billType,
  billBranch,
}) => {
  // Calculations
  const totalAmount = items.reduce(
    (total, item) =>
      total + parseFloat(calculateGrossPrice(item.price, item.quantity, item.discount)),
    0
  );

  const subtotal = items.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const totalDiscount = items.reduce((total, item) => total + item.discount, 0);
  const tax = totalAmount * 0.1; // 10% tax

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.watermark}>
          <Text>PAID</Text>
        </View>
        
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image src={logo} style={styles.logo} />
            <View style={styles.companyDetails}>
              <Text style={styles.invoiceTitle}>{companyDetails.name}</Text>
              <Text style={styles.invoiceSubtitle}>{companyDetails.address}</Text>
              <Text style={styles.invoiceSubtitle}>{companyDetails.contact}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>BILL TO</Text>
            <Text style={styles.infoContent}>Customer Name</Text>
            <Text style={styles.infoContent}>Customer Address Line 1</Text>
            <Text style={styles.infoContent}>City, State, ZIP</Text>
            <Text style={styles.infoContent}>Phone: (555) 123-4567</Text>
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>INVOICE DETAILS</Text>
            <Text style={styles.infoContent}>Invoice #: {billNumber}</Text>
            <Text style={styles.infoContent}>Date: {new Date().toLocaleDateString()}</Text>
            <Text style={styles.infoContent}>Payment Type: {billType}</Text>
            <Text style={styles.infoContent}>Branch: {billBranch}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Item Description</Text>
            <Text style={styles.tableHeaderCell}>Unit Price</Text>
            <Text style={styles.tableHeaderCell}>Quantity</Text>
            <Text style={styles.tableHeaderCell}>Discount</Text>
            <Text style={styles.tableHeaderCell}>Amount</Text>
          </View>
          
          {items.map((item, index) => (
            <View key={index} style={[
              styles.tableRow,
              index % 2 === 1 && styles.tableRowAlt
            ]}>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>{formatCurrency(item.price)}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{formatCurrency(item.discount)}</Text>
              <Text style={styles.tableCell}>
                {formatCurrency(calculateGrossPrice(item.price, item.quantity, item.discount))}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.notesSection}>
            <Text style={styles.noteTitle}>Notes</Text>
            <Text style={styles.infoContent}>
              1. Payment is due within 30 days
              {'\n'}2. Please include invoice number on your payment
              {'\n'}3. Make all checks payable to {companyDetails.name}
            </Text>
          </View>
          
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalAmount}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalAmount}>-{formatCurrency(totalDiscount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax (10%):</Text>
              <Text style={styles.totalAmount}>{formatCurrency(tax)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalAmount}>{formatCurrency(totalAmount + tax)}</Text>
            </View>
            <Text style={styles.wordsAmount}>
              {toWords(totalAmount + tax)} DOLLARS ONLY
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerColumn}>
              <Text>Terms & Conditions</Text>
              <Text>Payment is due within 30 days</Text>
            </View>
            <View style={styles.footerColumn}>
              <Text>Bank Details</Text>
              <Text>Bank: Example Bank</Text>
              <Text>ACC: XXXX-XXXX-XXXX-XXXX</Text>
            </View>
            <View style={[styles.footerColumn, styles.qrSection]}>
              <View style={styles.qrPlaceholder} />
              <Text>Scan to pay</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Page component
const BillPage = () => {
  const companyDetails = {
    name: "Inoka Motors",
    address: "No 09, Cross Street Kandy",
    contact: "077-7386756 / 071-1336262 / 081-2220320",
  };

  const logo = "@@/public/logo.png";
  const billNumber = "INV-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 10000);

  const items = [
    { name: "Premium Oil Change", price: 49.99, quantity: 1, discount: 5 },
    { name: "Brake Pad Replacement", price: 199.99, quantity: 2, discount: 20 },
    { name: "Air Filter", price: 29.99, quantity: 1, discount: 0 },
    { name: "Wheel Alignment", price: 89.99, quantity: 1, discount: 10 },
  ];

  const billType = "Credit Card";
  const billBranch = "Kandy Main Branch";

  return (
    <div>
      <PDFViewer style={{ width: "100%", height: "90vh" }}>
        <BillPDF
          companyDetails={companyDetails}
          logo={logo}
          billNumber={billNumber}
          items={items}
          billType={billType}
          billBranch={billBranch}
        />
      </PDFViewer>
    </div>
  );
};

export default BillPage;