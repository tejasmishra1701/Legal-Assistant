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
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    textDecoration: 'underline',
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
  propertyDetails: {
    marginBottom: 15,
  },
  verificationSection: {
    marginTop: 30,
    marginBottom: 20,
  },
});

export const PermanentInjunctionApplicationPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        {data.courtDetails.courtType}
      </Text>
      <Text style={styles.header}>
        IN THE COURT OF {data.courtDetails.judgeName} (DISTRICT {data.courtDetails.district}), {data.courtDetails.state}
      </Text>
      <View style={styles.section}>
        <Text style={[styles.bold, styles.rightAlign]}>
          {data.courtDetails.caseType} NO. {data.courtDetails.caseNumber} OF {data.courtDetails.caseYear}
        </Text>
      </View>
      
      <Text style={styles.section}>IN THE MATTER OF:</Text>
      
      <View style={styles.partyContainer}>
        <View>
          <Text>{data.parties.plaintiff.name}</Text>
          <Text>{data.parties.plaintiff.guardianRelation === 'father' ? 'S/o' : 'C/o'} {data.parties.plaintiff.guardianName}</Text>
          <Text>R/o {data.parties.plaintiff.address}</Text>
        </View>
        <Text style={styles.bold}>..... PLAINTIFF</Text>
      </View>
      
      <Text style={[styles.bold, styles.center]}>VERSUS</Text>
      
      <View style={styles.partyContainer}>
        <View>
          {data.parties.defendants.map((defendant, index) => (
            <View key={index} style={{ marginBottom: 5 }}>
              <Text>{index + 1}. {defendant.name}</Text>
              <Text>{defendant.guardianRelation === 'father' ? 'S/o' : 'C/o'} {defendant.guardianName}</Text>
              <Text>R/o {defendant.address}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.bold}>..... DEFENDANTS</Text>
      </View>

      <Text style={styles.title}>{data.applicationTitle}</Text>

      <Text style={[styles.bold, { marginBottom: 10 }]}>MOST RESPECTFULLY SHOWETH:</Text>

      {data.applicationBody.facts.map((fact, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemNumber}>{index + 1}.</Text>
          <Text style={styles.listItemContent}>{fact}</Text>
        </View>
      ))}

      <Text style={[styles.bold, { marginTop: 20, marginBottom: 10 }]}>{data.prayer.heading}</Text>
      <Text>{data.prayer.mainText}</Text>
      {data.prayer.reliefs.map((relief, index) => (
        <Text key={index} style={{ marginLeft: 20, marginBottom: 5 }}>
          ({String.fromCharCode(97 + index)}) {relief}
        </Text>
      ))}

      <View style={styles.footerContainer}>
        <View style={styles.footerRow}>
          <Text></Text>
          <Text style={styles.bold}>Plaintiff</Text>
        </View>
        <View style={styles.footerRow}>
          <Text>Place: {data.footer.place}</Text>
          <Text>Through</Text>
        </View>
        <View style={styles.footerRow}>
          <Text>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          <Text style={styles.bold}>Advocate</Text>
        </View>
      </View>

      <View style={styles.verificationSection}>
        <Text style={styles.bold}>VERIFICATION:</Text>
        <Text style={{ marginTop: 10 }}>
          {data.verification.text}
        </Text>
        <Text style={{ marginTop: 20, textAlign: 'right' }}>
          Plaintiff
        </Text>
      </View>

      <Text style={[styles.section, { marginTop: 20 }]}>{data.footer.note}</Text>
      <Text style={styles.center}>* * * * *</Text>
    </Page>
  </Document>
);