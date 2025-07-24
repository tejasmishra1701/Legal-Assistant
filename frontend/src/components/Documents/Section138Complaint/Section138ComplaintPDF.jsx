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
    marginBottom: 20,
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
  partyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  footerContainer: {
    marginTop: 40,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  center: {
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  // The 'chequeDetails' style block can be removed if no longer used,
  // but we'll leave it for now in case you want to use it for something else.
  chequeDetails: {
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
});

export const Section138ComplaintPDF = ({ data }) => {
  // Defensive check to prevent crashes if data is incomplete
  if (!data || !data.courtDetails || !data.parties || !data.complaintBody) {
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
        <Text style={styles.header}>
          IN THE COURT OF {data.courtDetails.courtType}, {data.courtDetails.district}, {data.courtDetails.state.toUpperCase()}
        </Text>
        <View style={styles.section}>
          <Text style={[styles.bold, styles.rightAlign]}>
            {data.courtDetails.complaintType} {data.courtDetails.complaintNumber} OF {data.courtDetails.complaintYear}
          </Text>
        </View>
        <Text style={styles.section}>IN THE MATTER OF:</Text>
        <View style={styles.partyContainer}>
          <View>
            <Text>{data.parties.complainant.name}</Text>
            <Text>R/o {data.parties.complainant.address}</Text>
            <Text>Occupation: {data.parties.complainant.occupation}</Text>
          </View>
          <Text style={styles.bold}>.....COMPLAINANT</Text>
        </View>
        <Text style={[styles.bold, styles.center]}>VERSUS</Text>
        <View style={styles.partyContainer}>
          <View>
            <Text>{data.parties.accused.name}</Text>
            <Text>R/o {data.parties.accused.address}</Text>
          </View>
          <Text style={styles.bold}>.....ACCUSED</Text>
        </View>
        <Text style={styles.title}>{data.complaintTitle}</Text>
        <Text style={styles.bold}>{data.complaintBody.introduction}</Text>
        {data.complaintBody.facts.map((fact, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemNumber}>{index + 1}.</Text>
            <Text style={styles.listItemContent}>{fact}</Text>
          </View>
        ))}
        <Text style={[styles.bold, { marginTop: 20 }]}>{data.prayer.heading}</Text>
        <Text>{data.prayer.text}</Text>
        <View style={styles.footerContainer}>
          <View style={styles.footerRow}>
            <Text>Place: {data.footer.place}</Text>
            <Text style={styles.bold}>COMPLAINANT</Text>
          </View>
          <View style={styles.footerRow}>
            <Text>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            <Text>THROUGH</Text>
          </View>
          <View style={[styles.footerRow, styles.rightAlign]}>
            <Text></Text>
            <View>
              <Text>{data.footer.advocateName}</Text>
              <Text style={styles.bold}>ADVOCATE</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.section, { marginTop: 20 }]}>{data.footer.verification}</Text>
        <Text style={styles.center}>* * * * *</Text>
      </Page>
    </Document>
  );
};