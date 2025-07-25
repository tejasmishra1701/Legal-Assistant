import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Styles using standard fonts
const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 60,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 60,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
  },
  courtHeader: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  suitInfo: {
    fontSize: 11,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    textDecoration: 'underline',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    marginTop: 20,
  },
  section: {
    marginBottom: 10,
  },
  rightAlign: {
    textAlign: 'right',
  },
  center: {
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  listItemNumber: {
    width: 20,
  },
  listItemContent: {
    flex: 1,
  },
  partySection: {
    marginBottom: 15,
  },
  partyDetails: {
    marginBottom: 5,
    fontSize: 11,
  },
  partyRole: {
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    marginTop: 10,
  },
  versus: {
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    marginTop: 15,
    marginBottom: 15,
  },
  footerContainer: {
    marginTop: 40,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  verification: {
    marginTop: 20,
    fontSize: 11,
  },
  note: {
    marginTop: 20,
    fontSize: 10,
    fontStyle: 'italic',
  },
  asterisk: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
  },
});

export const OrderXXXVIIComplaintPDF = ({ data }) => {
  // Defensive check to prevent crashes if data is incomplete
  if (!data || !data.courtDetails || !data.parties) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Error: Data is incomplete. Unable to generate PDF.</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <Text style={styles.header}>CIVIL PLEADINGS</Text>
        <Text style={styles.header}>SUIT FOR RECOVERY UNDER ORDER XXXVII OF CPC</Text>
        
        {/* Court Details */}
        <Text style={styles.courtHeader}>
          IN THE COURT OF DISTRICT JUDGE (DISTRICT {data.courtDetails.district.toUpperCase()}), {data.courtDetails.state.toUpperCase()}
        </Text>
        
        {/* Suit Information */}
        <Text style={styles.suitInfo}>
          SUIT NO {data.courtDetails.suitNumber} OF {data.courtDetails.suitYear}
        </Text>
        <Text style={styles.suitInfo}>
          (SUIT UNDER ORDER XXXVII OF THE CODE OF CIVIL PROCEDURE, 1908)
        </Text>
        
        <Text style={[styles.section, styles.bold, { marginTop: 20 }]}>IN THE MATTER OF:</Text>
        
        {/* Plaintiff Details */}
        <View style={styles.partySection}>
          <Text style={styles.partyDetails}>{data.parties.plaintiff.companyName}</Text>
          <Text style={styles.partyDetails}>A Company Incorporated Under the</Text>
          <Text style={styles.partyDetails}>Companies Act, Having Its Registered Office</Text>
          <Text style={styles.partyDetails}>At {data.parties.plaintiff.registeredOffice}</Text>
          <Text style={styles.partyDetails}>Through its Director</Text>
          <Text style={styles.partyDetails}>Shri.{data.parties.plaintiff.directorName}</Text>
          <Text style={[styles.bold, styles.partyRole]}>........... PLAINTIFF</Text>
        </View>
        
        <Text style={styles.versus}>VERSUS</Text>
        
        {/* Defendant Details */}
        <View style={styles.partySection}>
          <Text style={styles.partyDetails}>{data.parties.defendant.companyName}</Text>
          <Text style={styles.partyDetails}>A Company Incorporated Under The</Text>
          <Text style={styles.partyDetails}>Companies Act, Having Its Registered Office</Text>
          <Text style={styles.partyDetails}>At {data.parties.defendant.registeredOffice}</Text>
          <Text style={styles.partyDetails}>Through its Director</Text>
          <Text style={styles.partyDetails}>Shri.{data.parties.defendant.directorName}</Text>
          <Text style={[styles.bold, styles.partyRole]}>........ DEFENDANT</Text>
        </View>
        
        {/* Suit Title */}
        <Text style={styles.title}>
          SUIT FOR RECOVERY OF RS. {data.financialDetails.principalAmount}/-(
          {data.financialDetails.principalAmountWords}) UNDER ORDER XXXVII OF CODE OF CIVIL PROCEDURE, 1908
        </Text>
        
        {/* Main Content */}
        <Text style={[styles.bold, { marginTop: 20, marginBottom: 15 }]}>
          MOST RESPECTFULLY SHOWETH:
        </Text>
        
        {/* Facts */}
        {data.facts && data.facts.map((fact, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemNumber}>{index + 1}.</Text>
            <Text style={styles.listItemContent}>{fact}</Text>
          </View>
        ))}
        
        {/* Prayer */}
        <Text style={[styles.bold, { marginTop: 20, marginBottom: 10 }]}>PRAYER:</Text>
        <Text style={styles.section}>
          It is, therefore most respectfully prayed that this Hon'ble Court may be pleased to :-
        </Text>
        <Text style={styles.section}>{data.prayer?.reliefs || ''}</Text>
        
        {/* Footer */}
        <View style={styles.footerContainer}>
          <View style={styles.footerRow}>
            <Text>Place: {data.footer?.place || ''}</Text>
            <Text style={styles.bold}>Plaintiff</Text>
          </View>
          <View style={styles.footerRow}>
            <Text>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            <Text>Through</Text>
          </View>
          <View style={[styles.footerRow, styles.rightAlign]}>
            <Text></Text>
            <View>
              <Text>{data.footer?.advocateName || ''}</Text>
              <Text style={styles.bold}>Advocate</Text>
            </View>
          </View>
        </View>
        
        {/* Verification */}
        <Text style={[styles.bold, styles.verification]}>VERIFICATION:</Text>
        <Text style={styles.verification}>
          {data.footer?.verification || ''}
        </Text>
        <Text style={[styles.rightAlign, { marginTop: 20 }]}>Plaintiff</Text>
        
        {/* Note */}
        <Text style={styles.note}>
          [NOTE : The above plaint must be supported by an Affidavit]
        </Text>
        
        {/* Closing */}
        <Text style={styles.asterisk}>* * * * *</Text>
      </Page>
    </Document>
  );
};